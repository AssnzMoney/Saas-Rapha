-- Setup Phase 1: Tenants, Profiles e Cardápio (Corrigido com IF NOT EXISTS)

-- 1. Tabela de Lojas (Tenants)
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  theme_color text DEFAULT '#ff4d4f',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
-- Políticas
DO $$ BEGIN
    CREATE POLICY "Lojas são públicas para leitura" ON public.tenants FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de Perfis de Usuário (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin', -- 'admin', 'manager', 'staff'
  full_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, tenant_id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY "Usuários podem ver o próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Categorias do Cardápio
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY "Categorias são públicas" ON public.menu_categories FOR SELECT USING (true);
    CREATE POLICY "Apenas donos podem alterar categorias" ON public.menu_categories FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.tenant_id = menu_categories.tenant_id
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 4. Itens do Cardápio
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.menu_categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY "Itens são públicos" ON public.menu_items FOR SELECT USING (true);
    CREATE POLICY "Apenas donos podem alterar itens" ON public.menu_items FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.tenant_id = menu_items.tenant_id
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Agora criamos a política que dependia de profiles
DO $$ BEGIN
    CREATE POLICY "Apenas admin do tenant pode atualizar" ON public.tenants FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.tenant_id = tenants.id
        AND profiles.user_id = auth.uid()
        AND profiles.role = 'admin'
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
