import { createClient } from '@/lib/supabase/server'
import { getCachedProfile } from '@/lib/dal'
import IntegrationsSection from '@/components/ui/integrations-component'
import { redirect } from 'next/navigation'

export default async function IntegrationsPage() {
  const supabase = await createClient()

  const { profile } = await getCachedProfile()

  if (!profile || !profile.tenant_id) {
    redirect('/onboarding')
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('mp_access_token')
    .eq('id', profile.tenant_id)
    .single()

  if (!tenant) {
    redirect('/onboarding')
  }

  return (
    <div className="w-full">
      <IntegrationsSection initialData={tenant} />
    </div>
  )
}
