'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStoreData(formData: FormData) {
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

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const themeColor = formData.get('themeColor') as string
  const isOpen = formData.get('isOpen') === 'true'
  const acceptsDelivery = formData.get('acceptsDelivery') === 'true'
  const acceptsPickup = formData.get('acceptsPickup') === 'true'
  const address = formData.get('address') as string
  const openingHours = formData.get('openingHours') as string
  const logoFile = formData.get('logoFile') as File | null

  if (!name || !slug) return { error: 'Nome e URL são obrigatórios' }

  // Fazer o upload do logo se ele foi enviado
  let finalLogoUrl = undefined;
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop()
    const fileName = `${profile.tenant_id}-logo-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(`logos/${fileName}`, logoFile, {
        upsert: true
      })

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(`logos/${fileName}`)
        
      finalLogoUrl = publicUrlData.publicUrl
    }
  }

  // Objeto de atualização
  const updatePayload: any = {
      name,
      slug,
      theme_color: themeColor || '#ff4d4f',
      is_open: isOpen,
      accepts_delivery: acceptsDelivery,
      accepts_pickup: acceptsPickup,
      address: address || null,
      opening_hours: openingHours
  };

  if (finalLogoUrl) {
    updatePayload.logo_url = finalLogoUrl;
  }

  // Atualizar a loja
  const { error: updateError } = await supabase
    .from('tenants')
    .update(updatePayload)
    .eq('id', profile.tenant_id)

  if (updateError) {
    if (updateError.code === '23505') {
      return { error: 'Essa URL já está em uso por outra loja.' }
    }
    return { error: updateError.message }
  }

  revalidatePath('/admin/store')
  revalidatePath('/admin')
  
  return { success: true }
}
