import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OrderManager } from './components'

// Adicionar flag para Next.js revalidar a página a cada 5 segundos
// Em produção, usaríamos Supabase Realtime (WebSockets) para ser instantâneo
export const revalidate = 5

export default async function OrdersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()
    
  if (!profile || !profile.tenant_id) redirect('/admin/onboarding')

  // Buscar pedidos com os itens detalhados
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id, quantity, unit_price, notes,
        menu_items (name)
      )
    `)
    .eq('tenant_id', profile.tenant_id)
    .order('created_at', { ascending: false })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <OrderManager initialOrders={orders || []} />
    </div>
  )
}
