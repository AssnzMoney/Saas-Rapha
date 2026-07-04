-- Permite que usuários recém-cadastrados (autenticados) possam criar sua loja inicial
CREATE POLICY "Permitir criacao de lojas" ON public.tenants
FOR INSERT TO authenticated WITH CHECK (true);

-- Permite que o usuário crie o seu próprio perfil vinculando à loja
CREATE POLICY "Permitir criacao do proprio perfil" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
