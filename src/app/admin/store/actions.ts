'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStoreData(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  if (!profile || !profile.tenant_id) return { error: 'Loja não encontrada' }

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const mpToken = formData.get('mpToken') as string
  const themeColor = formData.get('themeColor') as string

  if (!name || !slug) return { error: 'Nome e URL são obrigatórios' }

  // Atualizar a loja
  const { error: updateError } = await supabase
    .from('tenants')
    .update({
      name,
      slug,
      mp_access_token: mpToken || null,
      theme_color: themeColor || '#ff4d4f'
    })
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
