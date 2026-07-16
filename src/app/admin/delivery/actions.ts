'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateDeliveryData(formData: FormData) {
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

  const deliveryFee = parseFloat(formData.get('deliveryFee') as string) || 0
  const acceptsPix = formData.get('acceptsPix') === 'on'
  const acceptsCard = formData.get('acceptsCard') === 'on'
  const acceptsCash = formData.get('acceptsCash') === 'on'

  const { error: updateError } = await supabase
    .from('tenants')
    .update({
      delivery_fee: deliveryFee,
      accepts_pix: acceptsPix,
      accepts_card: acceptsCard,
      accepts_cash: acceptsCash
    })
    .eq('id', profile.tenant_id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/delivery')
  
  return { success: true }
}
