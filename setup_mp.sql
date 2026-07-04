-- Adicionando suporte para Mercado Pago na tabela tenants
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS mp_access_token text;

-- Adicionando status de pagamento na tabela orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS mp_payment_id text;
