CREATE TABLE batch (
    id UUID PRIMARY KEY,
    created_by UUID REFERENCES auth.users(id),
    farm_id UUID REFERENCES public.farms(id),
    name VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    bird_category VARCHAR(10) NOT NULL,
    initial_population INTEGER NOT NULL,
    total_cost NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CHECK(initial_population > 0) 
);

ALTER TABLE public.batch
ALTER COLUMN id set DEFAULT gen_random_uuid();