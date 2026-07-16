'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateIntegrations(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .limit(1)
  const profile = profiles?.[0]

  if (!profile || !profile.tenant_id) return { error: 'Loja não encontrada' }

  const mpToken = formData.get('mpToken') as string

  // Atualizar a integração
  const { error: updateError } = await supabase
    .from('tenants')
    .update({
      mp_access_token: mpToken || null,
    })
    .eq('id', profile.tenant_id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/integrations')
  
  return { success: true }
}
