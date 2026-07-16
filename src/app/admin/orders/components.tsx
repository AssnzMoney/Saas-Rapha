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
  const [showCompleted, setShowCompleted] = useState(false)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId)
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    }
    setLoadingId(null)
  }

  const columns = [
    { id: 'pending', title: 'Novos', icon: Clock, color: 'text-red-600 bg-red-100', dot: 'bg-red-500' },
    { id: 'preparing', title: 'Preparando', icon: Package, color: 'text-amber-600 bg-amber-100', dot: 'bg-amber-500' },
    { id: 'ready', title: 'Pronto p/ Entrega', icon: ShoppingBag, color: 'text-blue-600 bg-blue-100', dot: 'bg-blue-500' },
    { id: 'out_for_delivery', title: 'Em Rota', icon: Truck, color: 'text-purple-600 bg-purple-100', dot: 'bg-purple-500' },
  ]

  if (showCompleted) {
    columns.push({ id: 'delivered', title: 'Entregues', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100', dot: 'bg-emerald-500' })
    columns.push({ id: 'cancelled', title: 'Cancelados', icon: XCircle, color: 'text-neutral-600 bg-neutral-200', dot: 'bg-neutral-500' })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Gestor de Pedidos</h1>
          <p className="text-neutral-500 mt-1">Acompanhe e gerencie os pedidos no formato Kanban.</p>
        </div>
        <button 
          onClick={() => setShowCompleted(!showCompleted)}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-neutral-200 text-neutral-600 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors shadow-sm"
        >
          {showCompleted ? 'Ocultar Finalizados' : 'Mostrar Finalizados'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 border-dashed rounded-2xl">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900">Nenhum pedido ainda</h3>
          <p className="text-neutral-500 mt-1">Os pedidos feitos pelo seu link público aparecerão aqui.</p>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
          {columns.map(col => {
            const colOrders = orders.filter(o => o.status === col.id)
            const ColIcon = col.icon
            
            return (
              <div key={col.id} className="min-w-[320px] max-w-[320px] shrink-0 snap-start flex flex-col bg-neutral-100/70 rounded-3xl p-4 border border-neutral-200/50 shadow-inner">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></div>
                    <h2 className="font-bold text-neutral-800">{col.title}</h2>
                  </div>
                  <div className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-neutral-500 border border-neutral-200 shadow-sm">
                    {colOrders.length}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colOrders.length === 0 ? (
                    <div className="h-24 border-2 border-dashed border-neutral-200 rounded-2xl flex items-center justify-center">
                      <span className="text-neutral-400 text-sm font-medium">Vazio</span>
                    </div>
                  ) : (
                    colOrders.map(order => {
                      const itemsText = order.order_items.map((i: any) => `${i.quantity}x ${i.menu_items?.name}`).join(', ')
                      
                      return (
                        <div key={order.id} className="bg-white p-4 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md transition-shadow animate-in fade-in zoom-in-95 duration-200 cursor-default">
                          
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-neutral-900 leading-tight">{order.customer_name}</h3>
                            <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-2 py-1 rounded-lg">
                              R$ {order.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          
                          {/* Details */}
                          <div className="text-xs text-neutral-600 space-y-2 mb-4">
                            <div className="flex gap-1.5 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                              <span className="font-semibold text-neutral-900 shrink-0">Pagamento:</span>
                              <span className="truncate">{order.payment_method === 'PIX' ? 'PIX' : order.payment_method === 'CARD' ? 'Cartão' : 'Dinheiro'}</span>
                            </div>
                            <div className="flex gap-1.5">
                              <span className="font-semibold text-neutral-900 shrink-0">Endereço:</span>
                              <span className="line-clamp-2 leading-relaxed">{order.customer_address}</span>
                            </div>
                            <div className="flex gap-1.5">
                              <span className="font-semibold text-neutral-900 shrink-0">Itens:</span>
                              <span className="line-clamp-2 leading-relaxed text-neutral-500">{itemsText}</span>
                            </div>
                            
                            {order.order_items.some((i: any) => i.notes) && (
                              <div className="p-2 bg-amber-50 text-amber-800 rounded-xl text-xs font-medium border border-amber-100">
                                <strong className="block mb-0.5">Observações:</strong>
                                <ul className="list-disc pl-4 space-y-0.5">
                                  {order.order_items.filter((i: any) => i.notes).map((i: any) => (
                                    <li key={i.id} className="line-clamp-1">{i.menu_items?.name}: {i.notes}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-neutral-100 space-y-2">
                            {order.status === 'pending' && (
                              <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'preparing')} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm active:scale-[0.98]">
                                Aceitar (Preparar)
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'ready')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm active:scale-[0.98]">
                                Pronto p/ Entrega
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'out_for_delivery')} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm active:scale-[0.98]">
                                Enviar (Em Rota)
                              </button>
                            )}
                            {order.status === 'out_for_delivery' && (
                              <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'delivered')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm active:scale-[0.98]">
                                Entregue!
                              </button>
                            )}
                            
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                               <button disabled={loadingId === order.id} onClick={() => handleStatusChange(order.id, 'cancelled')} className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 font-semibold py-2 px-4 rounded-xl transition-colors text-xs active:scale-[0.98]">
                                Cancelar
                              </button>
                            )}
                          </div>

                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
