create table farms (
    id UUID PRIMARY KEY,
    owner_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(20) NOT NULL,
    lga VARCHAR(30) NOT NULL,
    phone_number_1 VARCHAR(18) NOT NULL,
    phone_number_2 VARCHAR(18),
    coordinate JSON,
    land_measurement JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farm_setting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    crate_price JSONB[] NOT NULL,
    chicken_price JSONB NOT NULL,
    eggs_per_crate INTEGER NOT NULL DEFAULT 30,
    created_by VARCHAR(70),
    updated_by VARCHAR(70),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.farm_setting
ADD CONSTRAINT one_setting_per_farm UNIQUE (farm_id)

ALTER TABLE public.farms
ALTER COLUMN id set DEFAULT gen_random_uuid();