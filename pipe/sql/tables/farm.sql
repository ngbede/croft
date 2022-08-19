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


ALTER TABLE public.farms
ALTER COLUMN id set DEFAULT gen_random_uuid();