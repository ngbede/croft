CREATE TABLE employee (
    id UUID REFERENCES auth.users(id),
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    farm_id UUID REFERENCES public.farms(id) NOT NULL,
    gender VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.employee
ADD COLUMN role VARCHAR(25)[];