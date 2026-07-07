'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { ShoppingBag, ChevronLeft, Plus, Minus, X, CheckCircle2, Store, Search, User, Phone, MapPin, Hash, CreditCard, Banknote, QrCode, Truck, PackageOpen, Map, Copy } from 'lucide-react'
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
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [orderType, setOrderType] = useState<'DELIVERY'|'PICKUP'>('DELIVERY')
  const [paymentMethod, setPaymentMethod] = useState('PIX') // PIX, CARD, CASH
  const [copied, setCopied] = useState(false)

  const [pixData, setPixData] = useState<{qrCode: string, qrCodeBase64: string} | null>(null)

  const total = totalPrice()

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const fullAddress = orderType === 'DELIVERY' 
      ? `${street}, ${number} - ${neighborhood} - Contato: ${phone}`
      : `Retirada no Local - Contato: ${phone}`

    // Call server action to save order
    const result = await submitOrder({
      tenantId,
      customerName: name,
      address: fullAddress,
      paymentMethod,
      items,
      total
    })
    
    if (result.success) {
      if (paymentMethod === 'PIX') {
        try {
          const mpRes = await fetch('/api/checkout/pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantId,
              orderId: result.orderId,
              total,
              customerName: name
            })
          })
          const mpData = await mpRes.json()
          if (mpData.qrCodeBase64) {
            setPixData({ qrCode: mpData.qrCode, qrCodeBase64: mpData.qrCodeBase64 })
            setLoading(false)
            return
          } else {
            alert('Erro ao gerar PIX: ' + (mpData.error || 'Tente novamente.'))
          }
        } catch (err) {
          console.error(err)
          alert('Erro ao processar pagamento.')
        }
      }

      setSuccess(true)
      clearCart()
    } else {
      alert(result.error || 'Erro ao processar pedido.')
      setLoading(false)
    }
  }

  if (pixData) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-6 relative flex flex-col items-center text-center shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-8 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-1 text-neutral-900">Pedido Criado!</h2>
          <p className="text-neutral-500 mb-6 text-sm">Escaneie o QR Code ou copie o código abaixo para pagar.</p>
          
          <div className="bg-neutral-50 p-4 rounded-2xl border-2 border-neutral-100 mb-6 shadow-sm w-full max-w-[280px]">
             <img src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-full h-auto rounded-xl" />
          </div>
          
          <div className="w-full bg-neutral-100 p-1 rounded-2xl border border-neutral-200 flex flex-col mb-6">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(pixData.qrCode)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-base transition-all ${copied ? 'bg-emerald-500 text-white shadow-md scale-[0.98]' : 'bg-white text-neutral-700 hover:bg-neutral-50 shadow-sm'}`}
            >
              {copied ? (
                <>Copiado! <CheckCircle2 className="w-5 h-5" /></>
              ) : (
                <>Copiar Código PIX <Copy className="w-5 h-5" /></>
              )}
            </button>
          </div>

          <button 
            onClick={() => { setPixData(null); setSuccess(true); clearCart(); }}
            className="w-full bg-neutral-100 text-neutral-900 rounded-xl py-4 font-bold hover:bg-neutral-200 transition-colors"
          >
            Já Paguei (Fechar)
          </button>
        </div>
      </div>
    )
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

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            
            {/* Tipo de Pedido */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-[var(--brand-color)]" />
                Como deseja receber?
              </h3>
              <div className="flex bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${orderType === 'DELIVERY' ? 'bg-white shadow-sm text-[var(--brand-color)]' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  <Truck className="w-4 h-4" /> Entrega
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${orderType === 'PICKUP' ? 'bg-white shadow-sm text-[var(--brand-color)]' : 'text-neutral-500 hover:text-neutral-700'}`}
                >
                  <PackageOpen className="w-4 h-4" /> Retirada no Local
                </button>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--brand-color)]" />
                Seus Dados
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                  <input required type="text" placeholder="Seu Nome" value={name} onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] transition-all bg-neutral-50 focus:bg-white" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                  <input required type="tel" placeholder="Telefone / WhatsApp" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] transition-all bg-neutral-50 focus:bg-white" />
                </div>
              </div>
            </div>

            {/* Endereço de Entrega */}
            {orderType === 'DELIVERY' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--brand-color)]" />
                  Endereço de Entrega
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <Map className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                    <input required={orderType === 'DELIVERY'} type="text" placeholder="Rua/Avenida" value={street} onChange={e => setStreet(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] transition-all bg-neutral-50 focus:bg-white" />
                  </div>
                  <div className="flex gap-3">
                    <div className="relative w-1/3">
                      <Hash className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                      <input required={orderType === 'DELIVERY'} type="text" placeholder="Nº" value={number} onChange={e => setNumber(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] transition-all bg-neutral-50 focus:bg-white" />
                    </div>
                    <div className="relative w-2/3">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                      <input required={orderType === 'DELIVERY'} type="text" placeholder="Bairro" value={neighborhood} onChange={e => setNeighborhood(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-3 text-sm focus:border-[var(--brand-color)] focus:ring-[var(--brand-color)] transition-all bg-neutral-50 focus:bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pagamento */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[var(--brand-color)]" />
                Forma de Pagamento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'PIX' ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5' : 'border-neutral-100 hover:border-neutral-200'}`}>
                  <input type="radio" name="payment" value="PIX" className="sr-only" checked={paymentMethod === 'PIX'} onChange={e => setPaymentMethod(e.target.value)} />
                  <QrCode className={`w-8 h-8 mb-2 transition-colors ${paymentMethod === 'PIX' ? 'text-[var(--brand-color)]' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-medium transition-colors ${paymentMethod === 'PIX' ? 'text-[var(--brand-color)]' : 'text-neutral-600'}`}>Pix</span>
                  {paymentMethod === 'PIX' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[var(--brand-color)]" />}
                </label>
                
                <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5' : 'border-neutral-100 hover:border-neutral-200'}`}>
                  <input type="radio" name="payment" value="CARD" className="sr-only" checked={paymentMethod === 'CARD'} onChange={e => setPaymentMethod(e.target.value)} />
                  <CreditCard className={`w-8 h-8 mb-2 transition-colors ${paymentMethod === 'CARD' ? 'text-[var(--brand-color)]' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-medium transition-colors ${paymentMethod === 'CARD' ? 'text-[var(--brand-color)]' : 'text-neutral-600'}`}>Cartão</span>
                  {paymentMethod === 'CARD' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[var(--brand-color)]" />}
                </label>

                <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'border-[var(--brand-color)] bg-[var(--brand-color)]/5' : 'border-neutral-100 hover:border-neutral-200'}`}>
                  <input type="radio" name="payment" value="CASH" className="sr-only" checked={paymentMethod === 'CASH'} onChange={e => setPaymentMethod(e.target.value)} />
                  <Banknote className={`w-8 h-8 mb-2 transition-colors ${paymentMethod === 'CASH' ? 'text-[var(--brand-color)]' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-medium transition-colors ${paymentMethod === 'CASH' ? 'text-[var(--brand-color)]' : 'text-neutral-600'}`}>Dinheiro</span>
                  {paymentMethod === 'CASH' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[var(--brand-color)]" />}
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="p-5 bg-white border-t border-neutral-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          {orderType === 'DELIVERY' && (
            <div className="flex justify-between text-neutral-500">
              <span>Taxa de Entrega</span>
              <span className="text-emerald-500 font-medium">A calcular</span>
            </div>
          )}
          <div className="flex justify-between items-center text-neutral-900 pt-3 border-t border-neutral-100 mt-3">
            <span className="font-bold text-base">Total a pagar</span>
            <span className="text-xl font-bold text-[var(--brand-color)]">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <button 
          form="checkout-form"
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-[var(--brand-color)] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 transition-all active:scale-[0.98] shadow-lg shadow-[var(--brand-color)]/20"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <>Fazer Pedido <ChevronLeft className="w-5 h-5 rotate-180" /></>
          )}
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
                      className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex gap-3 cursor-pointer hover:border-[var(--brand-color)] hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      {item.image_url ? (
                        <div className="w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-100">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-100 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <h3 className="font-semibold text-neutral-900 text-sm leading-tight">{item.name}</h3>
                          {item.description && (
                            <p className="text-neutral-500 text-[10px] sm:text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                          )}
                        </div>
                        <div className="font-bold text-[var(--brand-color)] mt-2 text-sm">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {/* Floating Cart Button (Adjusted for Footer) */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-40 max-w-md mx-auto">
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

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 flex items-center justify-around px-4 z-40 max-w-md mx-auto">
         <button className="flex flex-col items-center justify-center text-[var(--brand-color)]">
           <Store className="w-5 h-5 mb-1" />
           <span className="text-[10px] font-medium">Cardápio</span>
         </button>
         <button className="flex flex-col items-center justify-center text-neutral-400">
           <Search className="w-5 h-5 mb-1" />
           <span className="text-[10px] font-medium">Busca</span>
         </button>
         <button onClick={() => setShowCheckout(true)} className="flex flex-col items-center justify-center text-neutral-400 relative">
           <ShoppingBag className="w-5 h-5 mb-1" />
           <span className="text-[10px] font-medium">Sacola</span>
           {cartCount > 0 && (
             <span className="absolute -top-1 -right-2 bg-[var(--brand-color)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
               {cartCount}
             </span>
           )}
         </button>
      </div>

      {/* Modals */}
      {selectedItem && <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showCheckout && <CheckoutModal tenantId={tenant.id} onClose={() => setShowCheckout(false)} />}
    </>
  )
}
