import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingFlow } from '@/components/ui/onboarding-flow'
import { createTenant } from './actions'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Pega o metadata do auth ou tenta usar algo para saudar
  const userName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]

  return (
    <OnboardingFlow 
      createTenantAction={createTenant} 
      userName={userName} 
    />
  )
}
