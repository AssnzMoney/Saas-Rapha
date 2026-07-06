import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import IntegrationsSection from '@/components/ui/integrations-component'

export default async function IntegrationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

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
