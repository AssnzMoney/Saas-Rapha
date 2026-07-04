'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to get the current tenant for the logged in user
async function getCurrentTenantId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()
    
  if (!profile || !profile.tenant_id) throw new Error('Loja não encontrada')
  return profile.tenant_id
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { error: 'O nome é obrigatório' }

  try {
    const tenant_id = await getCurrentTenantId()
    const supabase = await createClient()
    
    // Pega a última ordem para colocar no final
    const { data: lastCategory } = await supabase
      .from('menu_categories')
      .select('sort_order')
      .eq('tenant_id', tenant_id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()
      
    const sort_order = lastCategory ? (lastCategory.sort_order || 0) + 1 : 0

    const { error } = await supabase
      .from('menu_categories')
      .insert({ tenant_id, name, sort_order })

    if (error) throw error
    
    revalidatePath('/admin/menu')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erro ao criar categoria' }
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const tenant_id = await getCurrentTenantId()
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', categoryId)
      .eq('tenant_id', tenant_id) // Segurança extra
      
    if (error) throw error
    
    revalidatePath('/admin/menu')
    return { success: true }
  } catch (err: any) {
    return { error: 'Erro ao excluir categoria' }
  }
}

export async function createMenuItem(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category_id = formData.get('category_id') as string
  const image = formData.get('image') as File | null

  if (!name || isNaN(price) || !category_id) {
    return { error: 'Preencha os campos obrigatórios corretamente' }
  }

  try {
    const tenant_id = await getCurrentTenantId()
    const supabase = await createClient()

    let image_url = null
    
    // Fazer upload da imagem se ela foi enviada
    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${tenant_id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, image)

      if (uploadError) throw new Error('Erro ao fazer upload da imagem')

      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('menu-images')
          .getPublicUrl(fileName)
        image_url = publicUrl
      }
    }

    const { error } = await supabase
      .from('menu_items')
      .insert({
        tenant_id,
        category_id,
        name,
        description,
        price,
        image_url,
        is_available: true
      })

    if (error) throw error
    
    revalidatePath('/admin/menu')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erro ao criar item' }
  }
}

export async function deleteMenuItem(itemId: string) {
  try {
    const tenant_id = await getCurrentTenantId()
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId)
      .eq('tenant_id', tenant_id)
      
    if (error) throw error
    
    revalidatePath('/admin/menu')
    return { success: true }
  } catch (err: any) {
    return { error: 'Erro ao excluir item' }
  }
}
