-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_name text NOT NULL,
    customer_address text,
    payment_method text,
    total_amount decimal(10,2) NOT NULL,
    status text DEFAULT 'pending', -- pending, preparing, ready, out_for_delivery, delivered, cancelled
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
    quantity integer NOT NULL,
    unit_price decimal(10,2) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir inserção pública (qualquer um pode fazer pedido)
DO $$ BEGIN
    CREATE POLICY "Permitir criacao de pedidos publicos" ON public.orders FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Permitir insercao de itens no pedido" ON public.order_items FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Políticas para administradores lerem os pedidos
DO $$ BEGIN
    CREATE POLICY "Admins leem pedidos de sua loja" ON public.orders FOR SELECT USING (
        tenant_id IN (SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins leem itens de seus pedidos" ON public.order_items FOR SELECT USING (
        order_id IN (
            SELECT id FROM public.orders WHERE tenant_id IN (
                SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
            )
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;
