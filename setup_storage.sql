-- Criar o bucket de armazenamento se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir leitura pública (qualquer um pode ver as fotos do cardápio)
DO $$ BEGIN
    CREATE POLICY "Imagens publicas" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Permitir que usuários autenticados façam upload de imagens
DO $$ BEGIN
    CREATE POLICY "Upload autenticado" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'menu-images');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
