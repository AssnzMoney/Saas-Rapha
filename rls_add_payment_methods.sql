ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS accepts_pix boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS accepts_card boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS accepts_cash boolean DEFAULT true;
