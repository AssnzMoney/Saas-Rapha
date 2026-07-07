-- Adicionando campos para taxa de entrega e configuração de IA
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_prompt text;

-- Certifique-se de que a política permite UPDATE para administradores
-- (Isso já foi criado anteriormente, mas garantimos que as colunas novas são afetadas)

-- Adicionar coluna para guardar o token da instância para consultar status de conexão sem webhook
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS uazapi_instance_token text;

-- Adicionar horário de funcionamento
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS opening_hours text;

-- Adicionar colunas do Mercado Pago
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS mp_access_token text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mp_payment_id text;
