begin;

create or replace function public.prevent_payment_identity_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.booking_id is distinct from old.booking_id then
    raise exception
      'payment identity mutation forbidden: booking_id';
  end if;

  if new.provider is distinct from old.provider then
    raise exception
      'payment identity mutation forbidden: provider';
  end if;

  if new.provider_reference is distinct from old.provider_reference then
    raise exception
      'payment identity mutation forbidden: provider_reference';
  end if;

  if new.amount is distinct from old.amount then
    raise exception
      'payment identity mutation forbidden: amount';
  end if;

  if new.currency is distinct from old.currency then
    raise exception
      'payment identity mutation forbidden: currency';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_payment_identity_mutation
on public.payment_transactions;

create trigger trg_prevent_payment_identity_mutation
before update on public.payment_transactions
for each row
execute function public.prevent_payment_identity_mutation();


alter table public.payment_webhook_events
  drop constraint if exists payment_webhook_events_payload_hash_format_check;

alter table public.payment_webhook_events
  add constraint payment_webhook_events_payload_hash_format_check
  check (
    payload_hash is null
    or payload_hash ~ '^[0-9a-fA-F]{64}$'
  );


alter table public.payment_transactions
  drop constraint if exists payment_transactions_provider_reference_length_check;

alter table public.payment_transactions
  add constraint payment_transactions_provider_reference_length_check
  check (
    length(trim(provider_reference)) between 1 and 255
  );

commit;