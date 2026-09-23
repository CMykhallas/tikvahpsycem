begin;

create or replace function public.prevent_payment_identity_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.booking_id is distinct from new.booking_id then
    raise exception 'payment_transaction_booking_id_immutable';
  end if;

  if old.provider is distinct from new.provider then
    raise exception 'payment_transaction_provider_immutable';
  end if;

  if old.provider_reference is distinct from new.provider_reference then
    raise exception 'payment_transaction_reference_immutable';
  end if;

  if old.amount is distinct from new.amount then
    raise exception 'payment_transaction_amount_immutable';
  end if;

  if old.currency is distinct from new.currency then
    raise exception 'payment_transaction_currency_immutable';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_payment_identity_immutable
on public.payment_transactions;

create trigger trg_payment_identity_immutable
before update on public.payment_transactions
for each row
execute function public.prevent_payment_identity_mutation();

commit;

-- ============================================================
-- 1. UPDATED_AT
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists trg_payment_transactions_updated_at
on public.payment_transactions;

create trigger trg_payment_transactions_updated_at
before update on public.payment_transactions
for each row
execute function public.set_updated_at();


-- ============================================================
-- 2. CONSTRAINTS DE INTEGRIDADE
-- ============================================================

alter table public.payment_transactions
  drop constraint if exists payment_transactions_currency_check;

alter table public.payment_transactions
  add constraint payment_transactions_currency_check
  check (
    char_length(currency) = 3
    and currency = upper(currency)
  );


alter table public.payment_transactions
  drop constraint if exists payment_transactions_provider_reference_nonempty;

alter table public.payment_transactions
  add constraint payment_transactions_provider_reference_nonempty
  check (length(trim(provider_reference)) > 0);


alter table public.payment_transactions
  drop constraint if exists payment_transactions_amount_positive;

alter table public.payment_transactions
  add constraint payment_transactions_amount_positive
  check (amount > 0);


-- ============================================================
-- 3. ÍNDICES
-- ============================================================

create index if not exists
payment_transactions_booking_status_idx
on public.payment_transactions (booking_id, status);


create index if not exists
payment_transactions_provider_payment_id_idx
on public.payment_transactions (provider_payment_id)
where provider_payment_id is not null;


create index if not exists
payment_transactions_created_at_idx
on public.payment_transactions (created_at);


create index if not exists
payment_webhook_events_transaction_idx
on public.payment_webhook_events (payment_transaction_id);


create index if not exists
payment_webhook_events_received_at_idx
on public.payment_webhook_events (received_at);


-- ============================================================
-- 4. UMA ÚNICA TRANSAÇÃO ACTIVA POR RESERVA/PROVEDOR
-- ============================================================

create unique index if not exists
payment_transactions_one_active_per_booking_provider_idx
on public.payment_transactions (booking_id, provider)
where status in ('pending', 'processing', 'succeeded');


-- ============================================================
-- 5. CAMPOS DE RECONCILIAÇÃO
-- ============================================================

alter table public.payment_transactions
  add column if not exists reconciliation_required boolean
  not null default false;

alter table public.payment_transactions
  add column if not exists reconciliation_reason text;


-- ============================================================
-- 6. PROTECÇÃO CONTRA REGRESSÃO DE ESTADO
-- ============================================================

create or replace function public.validate_payment_status_transition()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin

  -- Nenhuma alteração de estado.
  if old.status = new.status then
    return new;
  end if;

  -- Estados terminais não podem regredir.
  if old.status in ('succeeded', 'failed', 'cancelled', 'expired') then
    raise exception
      'PAYMENT_TERMINAL_STATE: cannot transition from % to %',
      old.status,
      new.status
      using errcode = 'P0001';
  end if;

  -- pending
  if old.status = 'pending'
     and new.status not in (
       'processing',
       'succeeded',
       'failed',
       'cancelled',
       'expired'
     )
  then
    raise exception
      'PAYMENT_INVALID_TRANSITION: % -> %',
      old.status,
      new.status
      using errcode = 'P0001';
  end if;

  -- processing
  if old.status = 'processing'
     and new.status not in (
       'succeeded',
       'failed',
       'cancelled',
       'expired'
     )
  then
    raise exception
      'PAYMENT_INVALID_TRANSITION: % -> %',
      old.status,
      new.status
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;


drop trigger if exists trg_validate_payment_status_transition
on public.payment_transactions;

create trigger trg_validate_payment_status_transition
before update of status
on public.payment_transactions
for each row
execute function public.validate_payment_status_transition();


-- ============================================================
-- 7. CONSISTÊNCIA DE PAID_AT
-- ============================================================

create or replace function public.ensure_payment_paid_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin

  if new.status = 'succeeded' and new.paid_at is null then
    new.paid_at = now();
  end if;

  return new;
end;
$$;


drop trigger if exists trg_ensure_payment_paid_at
on public.payment_transactions;

create trigger trg_ensure_payment_paid_at
before insert or update
on public.payment_transactions
for each row
execute function public.ensure_payment_paid_at();


-- ============================================================
-- 8. RLS
-- ============================================================

alter table public.payment_transactions enable row level security;
alter table public.payment_webhook_events enable row level security;


-- Remover políticas antigas conhecidas.
drop policy if exists
"payment_transactions_select_own"
on public.payment_transactions;


drop policy if exists
"payment_transactions_insert_own"
on public.payment_transactions;


drop policy if exists
"payment_transactions_update_own"
on public.payment_transactions;


drop policy if exists
"payment_transactions_delete_own"
on public.payment_transactions;


-- O cliente autenticado NÃO escreve pagamentos directamente.
-- A criação/modificação ocorre através das Edge Functions
-- usando service_role.

-- Leitura directa também fica bloqueada nesta camada.
-- O frontend deverá utilizar uma RPC de leitura controlada.


-- ============================================================
-- 9. WEBHOOK EVENTS: NUNCA EXPOR AO CLIENTE
-- ============================================================

drop policy if exists
"payment_webhook_events_select"
on public.payment_webhook_events;

drop policy if exists
"payment_webhook_events_insert"
on public.payment_webhook_events;

drop policy if exists
"payment_webhook_events_update"
on public.payment_webhook_events;

drop policy if exists
"payment_webhook_events_delete"
on public.payment_webhook_events;


commit;