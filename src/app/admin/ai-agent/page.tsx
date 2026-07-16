import { createClient } from '@/lib/supabase/server'
import { getCachedProfile } from '@/lib/dal'
import { AiAgentClient } from './components'
import { Bot } from 'lucide-react'

export default async function AiAgentPage() {
  const supabase = await createClient()
  
  const { profile } = await getCachedProfile()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', profile.tenant_id)
    .single()

  return <AiAgentClient tenant={tenant} />
}
