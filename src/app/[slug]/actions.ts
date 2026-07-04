'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitOrder(data: {
  tenantId: string
  customerName: string
  address: string
  paymentMethod: string
  items: any[]
  total: number
}) {
  try {
    const supabase = await createClient()

    // 1. Criar o pedido (Order)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        tenant_id: data.tenantId,
        customer_name: data.customerName,
        customer_address: data.address,
        payment_method: data.paymentMethod,
        total_amount: data.total,
        status: 'pending' // pending, preparing, ready, out_for_delivery, delivered, cancelled
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Inserir os itens do pedido (Order Items)
    const orderItems = data.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      notes: item.notes || null
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return { success: true, orderId: order.id }
  } catch (err: any) {
    console.error('Order submission failed', err)
    return { success: false, error: err.message || 'Erro ao processar pedido' }
  }
}
