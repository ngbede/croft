-- CREATE TABLE stock_report (
--     id UUID PRIMARY KEY,
--     farm_id UUID REFERENCES public.farms(id) NOT NULL,
--     batch_id UUID REFERENCES public.batch(id) NOT NULL,
--     created_by UUID REFERENCES auth.users(id) NOT NULL,
--     type VARCHAR(10) NOT NULL,
--     chicken_count JSONB,
--     egg_count JSONB[],
--     comment JSONB[] DEFAULT '',
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );

ALTER TABLE public.stock_report
DROP COLUMN chicken_count;

ALTER TABLE public.stock_report
ADD COLUMN chicken_count JSONB[];

-- ALTER TABLE public.stock_report
-- DROP COLUMN type;

-- ALTER TABLE stock_report
-- ADD COLUMN type VARCHAR(20) NOT NULL;

-- ALTER TABLE public.stock_report
-- ALTER COLUMN id set DEFAULT gen_random_uuid();