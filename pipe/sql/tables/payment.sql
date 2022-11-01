-- create the payment table 

create table public.payment_debit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_uuid UUID REFERENCES public.orders(id) NOT NULL,
  data JSONB NOT NULL, -- the raw transaction data from payment provider
  amount NUMERIC NOT NULL,
  payment_provider VARCHAR(15) NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

alter table public.payment_debit
add column is_paid boolean DEFAULT false,
add column access_code VARCHAR(30) NOT NULL,
add column reference VARCHAR(20) NOT NULL,
add column status VARCHAR(15) NOT NULL,
add column error VARCHAR(100),
add column order_id VARCHAR(18) NOT NULL

-- add some data quality realationship checks to the is_paid & status columns
ALTER TABLE public.payment_debit
drop constraint chk_compare_status_to_paid,
add constraint chk_compare_status_to_paid check(
  CASE
    WHEN is_paid = true then status = 'success'
    WHEN LOWER(status) = 'success' then is_paid = true
    WHEN LOWER(status) IN ('pending', 'abandoned', 'failed') then is_paid = false
  END
)
