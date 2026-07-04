'use client'

import { useState } from 'react'
import { updateOrderStatus } from './actions'
import { Clock, CheckCircle, Package, Truck, XCircle, ShoppingBag } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string, color: string, icon: any }> = {
  pending: { label: 'Novo', color: 'bg-red-100 text-red-600', icon: Clock },
  preparing: { label: 'Preparando', color: 'bg-amber-100 text-amber-600', icon: Package },
  ready: { label: 'Pronto p/ Entrega', color: 'bg-blue-100 text-blue-600', icon: ShoppingBag },
  out_for_delivery: { label: 'Saiu p/ Entrega', color: 'bg-purple-100 text-purple-600', icon: Truck },
  delivered: { label: 'Entregue', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-neutral-100 text-neutral-600', icon: XCircle },
}

export function OrderManager({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId)
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Gestor de Pedidos</h1>
          <p className="text-neutral-500 mt-1">Acompanhe e gerencie os pedidos da sua loja em tempo real.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 border-dashed rounded-2xl">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900">Nenhum pedido ainda</h3>
          <p className="text-neutral-500 mt-1">Os pedidos feitos pelo seu link público aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => {
            const StatusIcon = STATUS_MAP[order.status]?.icon || Clock
            const itemsText = order.order_items.map((i: any) => `${i.quantity}x ${i.menu_items?.name}`).join(', ')
            
            return (
              <div key={order.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between animate-in fade-in slide-in-from-bottom-2">
                
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <h3 className="font-bold text-lg text-neutral-900">{order.customer_name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${STATUS_MAP[order.status]?.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {STATUS_MAP[order.status]?.label}
                    </div>
                  </div>
                  
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p><span className="font-medium text-neutral-900">Endereço:</span> {order.customer_address}</p>
                    <p><span className="font-medium text-neutral-900">Pagamento:</span> {order.payment_method === 'PIX' ? 'PIX' : order.payment_method === 'CARD' ? 'Cartão' : 'Dinheiro'}</p>
                    <p><span className="font-medium text-neutral-900">Itens:</span> {itemsText}</p>
                    
                    {order.order_items.some((i: any) => i.notes) && (
                      <div className="mt-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-xs font-medium border border-amber-100">
                        <strong className="block mb-1">Observações:</strong>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {order.order_items.filter((i: any) => i.notes).map((i: any) => (
                            <li key={i.id}>{i.menu_items?.name}: {i.notes}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                  <div className="text-xl font-bold text-neutral-900 mb-4 md:mb-0">
                    R$ {order.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  
                  <div className="w-full space-y-2">
                    {order.status === 'pending' && (
                      <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'preparing')} className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                        Aceitar Pedido
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'ready')} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                        Marcar como Pronto
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'out_for_delivery')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                        Saiu para Entrega
                      </button>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'delivered')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                        Confirmar Entrega
                      </button>
                    )}
                    
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                       <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'cancelled')} className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-medium py-2 px-4 rounded-xl transition-colors text-sm">
                        Cancelar Pedido
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
