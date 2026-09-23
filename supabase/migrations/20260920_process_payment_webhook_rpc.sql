begin;

create or replace function public.process_payment_webhook(
  p_provider text,
  p_provider_event_id text,
  p_payment_transaction_id uuid,
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
  v_payment public.payment_transactions%rowtype;
  v_existing_event public.payment_webhook_events%rowtype;
  v_booking_status text;
  v_booking_confirmed boolean := false;
begin

  -- ==========================================================
  -- 1. VALIDAR ARGUMENTOS
  -- ==========================================================

  if p_provider not in ('paysuite', 'stripe') then
    raise exception 'PAYMENT_PROVIDER_NOT_ALLOWED'
      using errcode = 'P0001';
  end if;

  if p_status not in (
    'pending',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
    'expired'
  ) then
    raise exception 'PAYMENT_STATUS_NOT_ALLOWED'
      using errcode = 'P0001';
  end if;

  if p_amount <= 0 then
    raise exception 'PAYMENT_AMOUNT_INVALID'
      using errcode = 'P0001';
  end if;

  if char_length(p_currency) <> 3
     or p_currency <> upper(p_currency)
  then
    raise exception 'PAYMENT_CURRENCY_INVALID'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 2. IDEMPOTÊNCIA DO EVENTO
  -- ==========================================================

  select *
  into v_existing_event
  from public.payment_webhook_events
  where provider = p_provider
    and provider_event_id = p_provider_event_id
  for update;

  if found then

    -- Mesmo event_id + payload diferente = possível replay/
    -- adulteração.
    if v_existing_event.payload_hash is distinct from p_payload_hash then

      update public.payment_webhook_events
      set
        status = 'failed',
        failure_code = 'PAYLOAD_HASH_MISMATCH'
      where id = v_existing_event.id;

      raise exception 'PAYMENT_WEBHOOK_PAYLOAD_MISMATCH'
        using errcode = 'P0001';
    end if;

    if v_existing_event.status = 'processed' then
      return jsonb_build_object(
        'ok', true,
        'duplicate', true,
        'status', 'processed'
      );
    end if;

  else

    insert into public.payment_webhook_events (
      provider,
      provider_event_id,
      payment_transaction_id,
      event_type,
      status,
      payload_hash
    )
    values (
      p_provider,
      p_provider_event_id,
      p_payment_transaction_id,
      p_event_type,
      'received',
      p_payload_hash
    );

  end if;


  -- ==========================================================
  -- 3. BLOQUEAR A TRANSAÇÃO DE PAGAMENTO
  -- ==========================================================

  select *
  into v_payment
  from public.payment_transactions
  where id = p_payment_transaction_id
  for update;

  if not found then
    raise exception 'PAYMENT_TRANSACTION_NOT_FOUND'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 4. VALIDAR PROVIDER
  -- ==========================================================

  if v_payment.provider <> p_provider then
    raise exception 'PAYMENT_PROVIDER_MISMATCH'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 5. VALIDAR VALOR
  -- ==========================================================

  if v_payment.amount <> p_amount then
    raise exception 'PAYMENT_AMOUNT_MISMATCH'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 6. VALIDAR MOEDA
  -- ==========================================================

  if v_payment.currency <> p_currency then
    raise exception 'PAYMENT_CURRENCY_MISMATCH'
      using errcode = 'P0001';
  end if;


  -- ==========================================================
  -- 7. VALIDAR PROVIDER PAYMENT ID
  -- ==========================================================

  if p_provider_payment_id is not null then

    if v_payment.provider_payment_id is null then

      update public.payment_transactions
      set provider_payment_id = p_provider_payment_id
      where id = v_payment.id;

    elsif v_payment.provider_payment_id <> p_provider_payment_id then

      raise exception 'PAYMENT_PROVIDER_ID_MISMATCH'
        using errcode = 'P0001';

    end if;

  end if;


  -- ==========================================================
  -- 8. TRANSIÇÃO DO PAGAMENTO
  -- ==========================================================

  update public.payment_transactions
  set
    status = p_status,
    updated_at = now(),
    paid_at = case
      when p_status = 'succeeded'
        then coalesce(paid_at, now())
      else paid_at
    end
  where id = v_payment.id;


  -- ==========================================================
  -- 9. CONFIRMAR BOOKING
  -- ==========================================================

  if p_status = 'succeeded' then

    select status
    into v_booking_status
    from public.bookings
    where id = v_payment.booking_id
    for update;

    if not found then

      update public.payment_transactions
      set
        reconciliation_required = true,
        reconciliation_reason = 'BOOKING_NOT_FOUND'
      where id = v_payment.id;

    elsif v_booking_status = 'pending' then

      update public.bookings
      set status = 'confirmed'
      where id = v_payment.booking_id
        and status = 'pending';

      v_booking_confirmed := true;

    elsif v_booking_status = 'confirmed' then

      v_booking_confirmed := true;

    else

      update public.payment_transactions
      set
        reconciliation_required = true,
        reconciliation_reason =
          'BOOKING_NOT_CONFIRMABLE_STATUS_' || v_booking_status
      where id = v_payment.id;

    end if;

  end if;


  -- ==========================================================
  -- 10. FECHAR EVENTO
  -- ==========================================================

  update public.payment_webhook_events
  set
    status = case
      when p_status in (
        'succeeded',
        'failed',
        'cancelled',
        'expired'
      )
      then 'processed'
      else 'processed'
    end,
    processed_at = now(),
    failure_code = null
  where provider = p_provider
    and provider_event_id = p_provider_event_id;


  -- ==========================================================
  -- 11. RESULTADO
  -- ==========================================================

  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'payment_transaction_id', v_payment.id,
    'payment_status', p_status,
    'booking_confirmed', v_booking_confirmed
  );

end;
$$;


-- ============================================================
-- SECURITY: SOMENTE SERVICE ROLE
-- ============================================================

revoke all
on function public.process_payment_webhook(
  text,
  text,
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text
)
from public;

revoke all
on function public.process_payment_webhook(
  text,
  text,
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text
)
from anon;

revoke all
on function public.process_payment_webhook(
  text,
  text,
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text
)
from authenticated;

grant execute
on function public.process_payment_webhook(
  text,
  text,
  uuid,
  text,
  text,
  text,
  numeric,
  text,
  text
)
to service_role;

commit;