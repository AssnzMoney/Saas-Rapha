'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const supabase = await createClient()
    
    // As políticas do banco de dados (RLS) já garantem que só o dono da loja consegue atualizar
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      
    if (error) throw error
    
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (err: any) {
    return { error: 'Erro ao atualizar status do pedido' }
  }
}
