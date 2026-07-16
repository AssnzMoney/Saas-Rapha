import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const getCachedProfile = cache(async () => {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, tenants(*)')
    .eq('user_id', user.id)
    .single()

  if (!profile || !profile.tenant_id) {
    redirect('/onboarding')
  }

  return { user, profile, tenant_id: profile.tenant_id }
})
