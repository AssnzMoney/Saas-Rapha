import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const getCachedProfile = cache(async () => {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, tenants(*)')
    .eq('user_id', user.id)
    .not('tenant_id', 'is', null)
    .limit(1)

  const profile = profiles?.[0]

  if (!profile || !profile.tenant_id) {
    redirect('/onboarding')
  }

  return { user, profile, tenant_id: profile.tenant_id }
})
