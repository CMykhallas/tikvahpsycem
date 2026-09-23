begin;

-- ============================================================
-- TIKVAH PSYCEM
-- PAYMENT TRANSACTIONS
-- ============================================================
--
-- Responsabilidade:
--   Registar o estado financeiro de cada tentativa de pagamento.
--
-- Fonte de verdade:
--   O valor financeiro é resolvido pelo backend a partir da
--   fonte comercial confiável. O cliente nunca fornece o amount
--   como fonte de verdade.
--
-- Segurança:
--   - RLS activo
--   - Sem INSERT/UPDATE/DELETE directo pelo cliente
--   - Campos financeiros/identitários imutáveis
--   - Estado controlado por máquina de estados
--   - Idempotência através de provider + provider_reference
--
-- ============================================================


-- ============================================================
-- 1. TABELA PRINCIPAL
-- ============================================================

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),

  booking_id uuid not null
    references public.bookings(id)
    on delete restrict,

  provider text not null
    check (
      provider in ('paysuite', 'stripe')
    ),

  provider_payment_id text,

  provider_reference text not null,

  amount numeric(12,2) not null
    check (
      amount > 0
    ),

  currency text not null
    check (
      char_length(currency) = 3
      and currency = upper(currency)
    ),

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'processing',
        'succeeded',
        'failed',
        'cancelled',
        'expired'
      )
    ),

  checkout_url text,

  failure_code text,

  failure_message text,

  provider_payload jsonb,

  reconciliation_required boolean not null default false,

  reconciliation_reason text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  paid_at timestamptz,

  constraint payment_transactions_provider_reference_key
    unique (
      provider,
      provider_reference
    )
);


-- ============================================================
-- 2. VALIDAÇÃO DA PROVIDER REFERENCE
-- ============================================================
--
-- A referência enviada ao provider deve:
--   - existir
--   - não ser vazia
--   - ter no máximo 255 caracteres
--
-- O DROP torna a migration reexecutável.
-- ============================================================

alter table public.payment_transactions
  drop constraint if exists payment_transactions_provider_reference_length_check;

alter table public.payment_transactions
  add constraint payment_transactions_provider_reference_length_check
  check (
    length(trim(provider_reference)) between 1 and 255
  );


-- ============================================================
-- 3. ÍNDICES
-- ============================================================

create index if not exists payment_transactions_booking_id_idx
  on public.payment_transactions(booking_id);

create index if not exists payment_transactions_provider_payment_id_idx
  on public.payment_transactions(provider_payment_id);

create index if not exists payment_transactions_status_idx
  on public.payment_transactions(status);

create index if not exists payment_transactions_created_at_idx
  on public.payment_transactions(created_at);


-- ============================================================
-- 4. RLS
-- ============================================================

alter table public.payment_transactions
  enable row level security;


-- ============================================================
-- 5. TRIGGER: UPDATED_AT
-- ============================================================
--
-- Mantém updated_at sincronizado automaticamente.
--
-- A função set_updated_at() é normalmente criada numa camada
-- comum da base. Criamos aqui apenas se ainda não existir.
-- ============================================================

create or replace function public.set_payment_transaction_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


drop trigger if exists trg_payment_transactions_updated_at
on public.payment_transactions;


create trigger trg_payment_transactions_updated_at
before update on public.payment_transactions
for each row
execute function public.set_payment_transaction_updated_at();


-- ============================================================
-- 6. ÍNDICE PARCIAL:
--    UMA TRANSAÇÃO ACTIVA POR BOOKING + PROVIDER
-- ============================================================
--
-- Estados activos:
--   pending
--   processing
--   succeeded
--
-- Estados terminais:
--   failed
--   cancelled
--   expired
--
-- Isto permite uma nova tentativa depois de uma falha terminal,
-- mas impede duas tentativas activas concorrentes para o mesmo
-- booking/provider.
-- ============================================================

create unique index if not exists
  payment_transactions_one_active_per_booking_provider_idx
on public.payment_transactions (
  booking_id,
  provider
)
where status in (
  'pending',
  'processing',
  'succeeded'
);


-- ============================================================
-- 7. IMUTABILIDADE DA IDENTIDADE FINANCEIRA
-- ============================================================
--
-- Depois de criada uma transação, não permitimos alteração de:
--
--   booking_id
--   provider
--   provider_reference
--   amount
--   currency
--
-- Isto impede adulteração posterior do valor financeiro ou da
-- identidade da transação.
-- ============================================================

create or replace function public.prevent_payment_identity_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin

  if old.booking_id is distinct from new.booking_id then
    raise exception
      'payment_transaction_booking_id_immutable';
  end if;

  if old.provider is distinct from new.provider then
    raise exception
      'payment_transaction_provider_immutable';
  end if;

  if old.provider_reference is distinct from new.provider_reference then
    raise exception
      'payment_transaction_reference_immutable';
  end if;

  if old.amount is distinct from new.amount then
    raise exception
      'payment_transaction_amount_immutable';
  end if;

  if old.currency is distinct from new.currency then
    raise exception
      'payment_transaction_currency_immutable';
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


-- ============================================================
-- 8. MÁQUINA DE ESTADOS DO PAGAMENTO
-- ============================================================
--
-- Estados:
--
-- pending
--    ├── processing
--    ├── succeeded
--    ├── failed
--    ├── cancelled
--    └── expired
--
-- processing
--    ├── succeeded
--    ├── failed
--    ├── cancelled
--    └── expired
--
-- Estados terminais:
--
-- succeeded
-- failed
-- cancelled
-- expired
--
-- Um estado terminal não pode regressar para outro estado.
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


  -- Estados terminais não podem mudar.
  if old.status in (
    'succeeded',
    'failed',
    'cancelled',
    'expired'
  ) then

    raise exception
      'payment_status_terminal: % -> %',
      old.status,
      new.status;

  end if;


  -- pending pode avançar para qualquer estado permitido.
  if old.status = 'pending' then

    if new.status in (
      'processing',
      'succeeded',
      'failed',
      'cancelled',
      'expired'
    ) then
      return new;
    end if;

  end if;


  -- processing só pode avançar para estado final.
  if old.status = 'processing' then

    if new.status in (
      'succeeded',
      'failed',
      'cancelled',
      'expired'
    ) then
      return new;
    end if;

  end if;


  raise exception
    'invalid_payment_status_transition: % -> %',
    old.status,
    new.status;

end;
$$;


drop trigger if exists trg_validate_payment_status_transition
on public.payment_transactions;


create trigger trg_validate_payment_status_transition
before update of status on public.payment_transactions
for each row
execute function public.validate_payment_status_transition();


-- ============================================================
-- 9. GARANTIA DE PAID_AT
-- ============================================================
--
-- Sempre que o pagamento atingir succeeded:
--
--   paid_at = timestamp actual
--
-- Não sobrescrevemos um paid_at já existente.
-- ============================================================

create or replace function public.ensure_payment_paid_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin

  if new.status = 'succeeded'
     and old.status is distinct from 'succeeded'
     and new.paid_at is null then

    new.paid_at := now();

  end if;

  return new;

end;
$$;


drop trigger if exists trg_ensure_payment_paid_at
on public.payment_transactions;


create trigger trg_ensure_payment_paid_at
before update of status on public.payment_transactions
for each row
execute function public.ensure_payment_paid_at();


-- ============================================================
-- 10. GARANTIA PARA INSERT DIRECTO COMO SUCCEEDED
-- ============================================================
--
-- Embora normalmente a transação seja criada como pending,
-- esta protecção garante paid_at caso uma operação interna
-- crie directamente uma transação succeeded.
-- ============================================================

create or replace function public.ensure_payment_paid_at_on_insert()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin

  if new.status = 'succeeded'
     and new.paid_at is null then

    new.paid_at := now();

  end if;

  return new;

end;
$$;


drop trigger if exists trg_ensure_payment_paid_at_on_insert
on public.payment_transactions;


create trigger trg_ensure_payment_paid_at_on_insert
before insert on public.payment_transactions
for each row
execute function public.ensure_payment_paid_at_on_insert();


-- ============================================================
-- 11. POLÍTICA DE SEGURANÇA
-- ============================================================
--
-- Não criamos políticas INSERT/UPDATE/DELETE para anon ou
-- authenticated.
--
-- O acesso de escrita será efectuado pelas Edge Functions
-- utilizando service_role.
--
-- O service_role ignora RLS através do mecanismo administrativo
-- do Supabase.
--
-- Se futuramente o frontend precisar consultar o estado do
-- pagamento, deverá existir uma API/RPC controlada, e não acesso
-- directo à tabela.
-- ============================================================

drop policy if exists payment_transactions_select_authenticated
on public.payment_transactions;

drop policy if exists payment_transactions_insert_authenticated
on public.payment_transactions;

drop policy if exists payment_transactions_update_authenticated
on public.payment_transactions;

drop policy if exists payment_transactions_delete_authenticated
on public.payment_transactions;


-- ============================================================
-- 12. COMENTÁRIOS DE GOVERNANÇA
-- ============================================================

comment on table public.payment_transactions is
'Estado financeiro das transações de pagamento do Tikvah PSYCEM. Escrita controlada pelo backend/Edge Functions.';

comment on column public.payment_transactions.amount is
'Valor monetário confiável da transação, resolvido pelo backend. Não aceitar como fonte de verdade do cliente.';

comment on column public.payment_transactions.provider_payload is
'Payload recebido do provider, armazenado para auditoria/reconciliação. Não utilizar como fonte directa para autorizar operações comerciais sem validação.';

comment on column public.payment_transactions.reconciliation_required is
'Indica que a transação requer reconciliação operacional/manual.';

comment on column public.payment_transactions.reconciliation_reason is
'Motivo técnico ou comercial pelo qual a transação foi marcada para reconciliação.';

comment on column public.payment_transactions.provider_reference is
'Referência única da tentativa de pagamento no provider. Deve permanecer imutável durante o ciclo de vida da transação.';


-- ============================================================
-- 13. VALIDAÇÃO ESTRUTURAL
-- ============================================================

do $$
begin

  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'payment_transactions'
  ) then

    raise exception
      'payment_transactions table was not created';

  end if;


  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.payment_transactions'::regclass
      and conname =
        'payment_transactions_provider_reference_length_check'
  ) then

    raise exception
      'provider_reference length constraint was not created';

  end if;

end;
$$;


commit;