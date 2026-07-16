import { createClient } from '@/lib/supabase/server'
import { getCachedProfile } from '@/lib/dal'
import { DeliverySettingsForm } from './components'

export default async function DeliveryPage() {
  const supabase = await createClient()
  
  const { profile } = await getCachedProfile()
    
  if (!profile || !profile.tenant_id) redirect('/admin/onboarding')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', profile.tenant_id)
    .single()

  if (!tenant) redirect('/admin/onboarding')

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Áreas de Entrega</h1>
        <p className="text-neutral-500 mt-2">
          Defina como você cobrará pelas entregas dos seus pedidos.
        </p>
      </div>

      <DeliverySettingsForm initialData={tenant} />
    </div>
  )
}
