create table orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) NOT NULL, -- can be seen as tracking number also
    farm_id UUID REFERENCES public.farms(id) ON DELETE NO ACTION,
    status VARCHAR(15) NOT NULL, -- request, accepted, rejected
    shipping_address JSONB NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    delivery_method VARCHAR(30) NOT NULL,
    pickup_address JSONB,
    phone_number_1 VARCHAR(20) NOT NULL,
    phone_number_2 VARCHAR(20),
    coordinate POINT,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    note TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE NO ACTION,
    updated_by UUID REFERENCES auth.users(id) ON DELETE NO ACTION,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

alter table public.orders
ADD column parent_snapshot uuid references public.orders(id)

-- only 1 unique status to an order snapshot list
alter table public.orders
add constraint chk_unique_status_per_order unique(order_id,status)

alter table public.orders
add constraint chk_order_status_types check (
  LOWER(status) IN ('request','rejected', 'accepted', 'packed', 'in-transit', 'received')
)
