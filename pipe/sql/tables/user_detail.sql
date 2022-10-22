create table user_detail (
	uuid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE NO ACTION,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	phone_number1 VARCHAR(17) NOT NULL,
	phone_number2 VARCHAR(17),
	role VARCHAR(25) NOT NULL, -- owner, distributor, staff, normal
	state VARCHAR(30),
	lga VARCHAR(30),
	address1 VARCHAR(120),
	address2 VARCHAR(120),
	coordinate POINT,
	farm_id UUID REFERENCES public.farms(id) ON DELETE NO ACTION,
	created_at TIMESTAMP DEFAULT now(),
	updated_at TIMESTAMP DEFAULT now()	
);

alter table public.user_detail
add column gender VARCHAR(10),
add column active BOOLEAN DEFAULT TRUE
