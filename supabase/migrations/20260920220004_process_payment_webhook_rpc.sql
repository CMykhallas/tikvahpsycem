-- ============================================================
-- TIKVAH PSYCEM
-- ATOMIC PAYMENT WEBHOOK PROCESSOR
-- ============================================================

begin;

alter table public.payment_webhook_events
  drop constraint if exists payment_webhook_events_provider_event_id_length_check;

alter table public.payment_webhook_events
  add constraint payment_webhook_events_provider_event_id_length_check
  check (length(trim(provider_event_id)) between 1 and 255);
  
create or replace function
public.process_payment_webhook(
  p_provider text,
  p_provider_event_id text,
  p_provider_reference text,
  p_event_type text,
  p_provider_payment_id text,
  p_status text,
  p_amount numeric,
  p_currency text,
  p_payload_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare

  v_payment
    public.payment_transactions%rowtype;

  v_existing_event
    public.payment_webhook_events%rowtype;

  v_booking_status text;

  v_booking_confirmed boolean :=
    false;

begin

  -- ==========================================================
  -- 1. VALIDAR PROVIDER
  -- ==========================================================

  if p_provider not in (
    'paysuite',
    'stripe'
  ) then

    raise exception
      'PAYMENT_PROVIDER_NOT_ALLOWED'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 2. VALIDAR STATUS
  -- ==========================================================

  if p_status not in (
    'pending',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
    'expired'
  ) then

    raise exception
      'PAYMENT_STATUS_NOT_ALLOWED'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 3. VALIDAR AMOUNT
  -- ==========================================================

  if p_amount is null
     or p_amount <= 0
  then

    raise exception
      'PAYMENT_AMOUNT_INVALID'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 4. VALIDAR CURRENCY
  -- ==========================================================

  if p_currency is null
     or char_length(p_currency) <> 3
     or p_currency <> upper(p_currency)
  then

    raise exception
      'PAYMENT_CURRENCY_INVALID'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 5. IDEMPOTÊNCIA DO EVENTO
  -- ==========================================================

  select *
  into v_existing_event
  from public.payment_webhook_events
  where provider =
    p_provider
    and provider_event_id =
      p_provider_event_id
  for update;


  if found then

    /*
     * O mesmo event_id com outro hash
     * representa uma inconsistência grave.
     */

    if v_existing_event.payload_hash
       is distinct from
       p_payload_hash
    then

      update public.payment_webhook_events
      set
        status = 'failed',
        failure_code =
          'PAYLOAD_HASH_MISMATCH'
      where id =
        v_existing_event.id;


      raise exception
        'PAYMENT_WEBHOOK_PAYLOAD_MISMATCH'
        using errcode = 'P0001';

    end if;


    /*
     * Evento já processado:
     * não voltar a executar a operação.
     */

    if v_existing_event.status =
       'processed'
    then

      return jsonb_build_object(
        'ok', true,
        'duplicate', true,
        'status', 'processed'
      );

    end if;

  else

    insert into
      public.payment_webhook_events (
        provider,
        provider_event_id,
        event_type,
        status,
        payload_hash
      )
    values (
      p_provider,
      p_provider_event_id,
      p_event_type,
      'received',
      p_payload_hash
    );

  end if;


  -- ==========================================================
  -- 6. RESOLVER + BLOQUEAR PAYMENT TRANSACTION
  -- ==========================================================

  select *
  into v_payment
  from public.payment_transactions
  where provider =
    p_provider
    and provider_reference =
      p_provider_reference
  for update;


  if not found then

    raise exception
      'PAYMENT_TRANSACTION_NOT_FOUND'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 7. VALIDAR AMOUNT
  -- ==========================================================

  if v_payment.amount <>
     p_amount
  then

    raise exception
      'PAYMENT_AMOUNT_MISMATCH'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 8. VALIDAR CURRENCY
  -- ==========================================================

  if v_payment.currency <>
     p_currency
  then

    raise exception
      'PAYMENT_CURRENCY_MISMATCH'
      using errcode = 'P0001';

  end if;


  -- ==========================================================
  -- 9. VALIDAR PROVIDER PAYMENT ID
  -- ==========================================================

  if p_provider_payment_id
     is not null
  then

    if v_payment.provider_payment_id
       is null
    then

      update public.payment_transactions
      set
        provider_payment_id =
          p_provider_payment_id
      where id =
        v_payment.id;

    elsif
      v_payment.provider_payment_id <>
      p_provider_payment_id
    then

      raise exception
        'PAYMENT_PROVIDER_ID_MISMATCH'
        using errcode = 'P0001';

    end if;

  end if;


  -- ==========================================================
  -- 10. ASSOCIAR EVENTO À TRANSAÇÃO
  -- ==========================================================

  update public.payment_webhook_events
  set
    payment_transaction_id =
      v_payment.id
  where provider =
    p_provider
    and provider_event_id =
      p_provider_event_id;


  -- ==========================================================
  -- 11. ACTUALIZAR PAYMENT
  -- ==========================================================

  update public.payment_transactions
  set
    status = p_status,
    paid_at =
      case
        when p_status = 'succeeded'
          then coalesce(
            paid_at,
            now()
          )
        else paid_at
      end,
    updated_at = now()
  where id =
    v_payment.id;


  -- ==========================================================
  -- 12. CONFIRMAR BOOKING
  -- ==========================================================

  if p_status = 'succeeded'
  then

    select status
    into v_booking_status
    from public.bookings
    where id =
      v_payment.booking_id
    for update;


    if not found then

      update public.payment_transactions
      set
        reconciliation_required =
          true,
        reconciliation_reason =
          'BOOKING_NOT_FOUND'
      where id =
        v_payment.id;


    elsif v_booking_status =
      'pending'
    then

      update public.bookings
      set status =
        'confirmed'
      where id =
        v_payment.booking_id
        and status =
          'pending';


      v_booking_confirmed :=
        true;


    elsif v_booking_status =
      'confirmed'
    then

      v_booking_confirmed :=
        true;


    else

      update public.payment_transactions
      set
        reconciliation_required =
          true,
        reconciliation_reason =
          'BOOKING_NOT_CONFIRMABLE_STATUS_' ||
          v_booking_status
      where id =
        v_payment.id;

    end if;

  end if;


  -- ==========================================================
  -- 13. FECHAR WEBHOOK EVENT
  -- ==========================================================

  update public.payment_webhook_events
  set
    status = 'processed',
    processed_at = now(),
    failure_code = null
  where provider =
    p_provider
    and provider_event_id =
      p_provider_event_id;


  -- ==========================================================
  -- 14. RESULTADO
  -- ==========================================================

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'payment_transaction_id',
      v_payment.id,
    'payment_status',
      p_status,
    'booking_confirmed',
      v_booking_confirmed
  );

end;
$$;


-- ============================================================
-- SECURITY
-- ============================================================

revoke all
on function
public.process_payment_webhook(
  text,
  text,
  text,
  text,
  text,
  text,
  numeric,
  text,
  text
)
from public;


revoke all
on function
public.process_payment_webhook(
  text,
  text,
  text,
  text,
  text,
  text,
  numeric,
  text,
  text
)
from anon;


revoke all
on function
public.process_payment_webhook(
  text,
  text,
  text,
  text,
  text,
  text,
  numeric,
  text,
  text
)
from authenticated;


grant execute
on function
public.process_payment_webhook(
  text,
  text,
  text,
  text,
  text,
  text,
  numeric,
  text,
  text
)
to service_role;


commit;