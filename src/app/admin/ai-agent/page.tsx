import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AiAgentClient } from './components'
import { Bot } from 'lucide-react'

export default async function AiAgentPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .limit(1)
  const profile = profiles?.[0]
    
  if (!profile || !profile.tenant_id) redirect('/admin/onboarding')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', profile.tenant_id)
    .single()

  return <AiAgentClient tenant={tenant} />
}
