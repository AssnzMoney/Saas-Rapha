import { createClient } from '@/lib/supabase/server'
import { getCachedProfile } from '@/lib/dal'
import { redirect } from 'next/navigation'
import { StoreSettingsForm } from './components'

export default async function StorePage() {
  const supabase = await createClient()
  
  const { profile } = await getCachedProfile()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', profile.tenant_id)
    .single()

  if (!tenant) redirect('/admin/onboarding')

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Dados da Loja</h1>
        <p className="text-neutral-500 mt-2">
          Gerencie o nome, cores e as chaves de integração financeira do seu restaurante.
        </p>
      </div>

      <StoreSettingsForm initialData={tenant} />
    </div>
  )
}
