'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateDeliveryData(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  if (!profile || !profile.tenant_id) return { error: 'Loja não encontrada' }

  const deliveryFee = parseFloat(formData.get('deliveryFee') as string) || 0

  const { error: updateError } = await supabase
    .from('tenants')
    .update({
      delivery_fee: deliveryFee
    })
    .eq('id', profile.tenant_id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/delivery')
  
  return { success: true }
}
