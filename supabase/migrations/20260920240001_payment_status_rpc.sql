begin;

create or replace function public.get_payment_status(
  p_booking_id uuid
)
returns table (
  id uuid,
  booking_id uuid,
  provider text,
  provider_reference text,
  amount numeric,
  currency text,
  status text,
  checkout_url text,
  failure_code text,
  created_at timestamptz,
  updated_at timestamptz,
  paid_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin

  if p_booking_id is null then
    raise exception
      'booking_id is required';
  end if;

  return query
  select
    pt.id,
    pt.booking_id,
    pt.provider,
    pt.provider_reference,
    pt.amount,
    pt.currency,
    pt.status,
    pt.checkout_url,
    pt.failure_code,
    pt.created_at,
    pt.updated_at,
    pt.paid_at
  from public.payment_transactions pt
  inner join public.bookings b
    on b.id = pt.booking_id
  where pt.booking_id = p_booking_id
    and (
      b.user_id = auth.uid()
      or b.user_id is null
    )
  order by pt.created_at desc
  limit 1;

end;
$$;

revoke all
on function public.get_payment_status(uuid)
from public;

revoke all
on function public.get_payment_status(uuid)
from anon;

grant execute
on function public.get_payment_status(uuid)
to authenticated;

commit;