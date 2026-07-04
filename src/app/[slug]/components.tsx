'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { ShoppingBag, ChevronLeft, Plus, Minus, X, CheckCircle2 } from 'lucide-react'
import { submitOrder } from './actions'

// --- 1. Product Modal ---
function ProductModal({ item, onClose }: { item: any, onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const { addItem } = useCartStore()

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image_url: item.image_url,
      notes
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-900/60 p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-4 duration-300">
        
        {/* Header Image if exists */}
        {item.image_url && (
          <div className="relative w-full h-48 bg-neutral-100">
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-900 shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {!item.image_url && (
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-neutral-900">{item.name}</h2>
              <button onClick={onClose} className="p-1 text-neutral-400"><X className="w-6 h-6" /></button>
            </div>
          )}
          {item.image_url && (
             <h2 className="text-xl font-bold text-neutral-900 mb-2">{item.name}</h2>
          )}
          
          {item.description && <p className="text-neutral-500 text-sm mb-4">{item.description}</p>}
          
          <div className="text-lg font-medium text-[var(--brand-color)] mb-6">
            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Alguma observação?</label>
              <textarea 
                rows={3} 
                placeholder="Ex: Tirar cebola, maionese à parte..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 p-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] bg-neutral-50"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 bg-neutral-100 rounded-xl px-2 h-12">
            <button 
              onClick={() => quantity > 1 && setQuantity(q => q - 1)}
              className="w-8 h-8 flex items-center justify-center text-neutral-600 disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium text-neutral-900 w-4 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-[var(--brand-color)]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={handleAdd}
            className="flex-1 h-12 bg-[var(--brand-color)] text-white font-medium rounded-xl flex items-center justify-between px-4 hover:opacity-90 transition-opacity"
          >
            <span>Adicionar</span>
            <span>R$ {(item.price * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// --- 2. Checkout Modal ---
function CheckoutModal({ tenantId, onClose }: { tenantId: string, onClose: () => void }) {
  const { items, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Checkout Form State
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('PIX') // PIX, CARD, CASH

  const total = totalPrice()

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    // Call server action to save order
    const result = await submitOrder({
      tenantId,
      customerName: name,
      address,
      paymentMethod,
      items,
      total
    })
    
    if (result.success) {
      setSuccess(true)
      clearCart()
    } else {
      alert(result.error || 'Erro ao processar pedido.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-right duration-300">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Pedido Realizado!</h2>
          <p className="text-neutral-500 mb-8">A cozinha já recebeu o seu pedido. O tempo estimado é de 40 a 50 minutos.</p>
          <button onClick={onClose} className="bg-neutral-100 text-neutral-900 font-medium px-6 py-3 rounded-xl w-full">
            Voltar ao Cardápio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 sm:max-w-md sm:right-0 sm:left-auto sm:border-l sm:border-neutral-200">
      <header className="h-16 flex items-center px-4 border-b border-neutral-100 bg-white sticky top-0">
        <button onClick={onClose} className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold ml-2">Sacola</h2>
      </header>
      
      <div className="flex-1 overflow-y-auto bg-neutral-50">
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-4">Seus itens</h3>
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-start text-sm">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-neutral-900"><span className="text-neutral-500 mr-2">{item.quantity}x</span> {item.name}</p>
                    {item.notes && <p className="text-neutral-500 text-xs mt-1">Obs: {item.notes}</p>}
                  </div>
                  <div className="font-medium text-neutral-900">
                    R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-4">Dados de Entrega</h3>
              <div className="space-y-3">
                <input required type="text" placeholder="Seu Nome" value={name} onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]" />
                <textarea required placeholder="Endereço Completo (Rua, Número, Bairro, Complemento)" rows={2} value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)]" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-4">Pagamento na Entrega</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-50">
                  <input type="radio" name="payment" value="PIX" checked={paymentMethod === 'PIX'} onChange={e => setPaymentMethod(e.target.value)} className="text-[var(--brand-color)] focus:ring-[var(--brand-color)]" />
                  <span className="text-sm font-medium text-neutral-900">Pix (Código QR na entrega)</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-50">
                  <input type="radio" name="payment" value="CARD" checked={paymentMethod === 'CARD'} onChange={e => setPaymentMethod(e.target.value)} className="text-[var(--brand-color)] focus:ring-[var(--brand-color)]" />
                  <span className="text-sm font-medium text-neutral-900">Cartão de Crédito/Débito</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-neutral-100 rounded-xl cursor-pointer hover:bg-neutral-50">
                  <input type="radio" name="payment" value="CASH" checked={paymentMethod === 'CASH'} onChange={e => setPaymentMethod(e.target.value)} className="text-[var(--brand-color)] focus:ring-[var(--brand-color)]" />
                  <span className="text-sm font-medium text-neutral-900">Dinheiro</span>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t border-neutral-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-4 text-neutral-900">
          <span className="text-sm font-medium">Total a pagar</span>
          <span className="text-xl font-bold">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <button 
          form="checkout-form"
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-[var(--brand-color)] text-white font-medium rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Fazer Pedido'}
        </button>
      </div>
    </div>
  )
}

// --- 3. Main Public Menu Client Component ---
export function PublicMenuClient({ tenant, categories, items }: { tenant: any, categories: any[], items: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const { totalItems, totalPrice, setTenantId } = useCartStore()

  useEffect(() => {
    setTenantId(tenant.id)
  }, [tenant.id, setTenantId])

  const cartCount = totalItems()
  const cartTotal = totalPrice()

  return (
    <>
      <div className="pb-8">
        {/* Horizontal Category Scroller */}
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-4 py-3 flex space-x-4 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <a 
              key={cat.id} 
              href={`#cat-${cat.id}`}
              className="flex-shrink-0 px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm hover:bg-neutral-200 transition-colors"
            >
              {cat.name}
            </a>
          ))}
        </div>

        {/* Menu Sections */}
        <div className="px-4 py-6 space-y-8">
          {categories.map((cat) => {
            const catItems = items.filter(i => i.category_id === cat.id)
            if (catItems.length === 0) return null

            return (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">{cat.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catItems.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedItem(item)}
                      className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex space-x-4 cursor-pointer hover:border-[var(--brand-color)] hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-neutral-900 text-sm">{item.name}</h3>
                          {item.description && (
                            <p className="text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <div className="font-medium text-[var(--brand-color)] mt-3 text-sm">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      {item.image_url && (
                        <div className="w-24 h-24 flex-shrink-0 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-40 max-w-md mx-auto">
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full h-14 bg-[var(--brand-color)] text-white rounded-2xl shadow-lg flex items-center justify-between px-6 active:scale-95 transition-transform"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                {cartCount}
              </div>
              <span className="font-semibold">Ver sacola</span>
            </div>
            <div className="font-bold">
              R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedItem && <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showCheckout && <CheckoutModal tenantId={tenant.id} onClose={() => setShowCheckout(false)} />}
    </>
  )
}
