'use client'

import { useState } from 'react'
import { updateDeliveryData } from './actions'
import { Save, Truck, Info } from 'lucide-react'

export function DeliverySettingsForm({ initialData }: { initialData: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateDeliveryData(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Taxa de entrega atualizada!' })
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Taxa de Entrega</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Configure o valor cobrado para entregas.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center border border-blue-100">
          <Info className="w-4 h-4 mr-1" />
          Fase 1: Taxa Fixa
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {message.text}
          </div>
        )}

        <div className="max-w-md">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Taxa Fixa (R$)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Truck className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              name="deliveryFee"
              defaultValue={initialData.delivery_fee || 0}
              required
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
              placeholder="Ex: 5.00"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Este valor será adicionado automaticamente ao total de todos os pedidos feitos com a opção de Entrega (Delivery). Se o valor for 0, o sistema considerará como "Entrega Grátis".
          </p>
        </div>

        <div className="pt-6 border-t border-neutral-100">
          <h3 className="text-sm font-medium text-neutral-900 mb-4">Formas de Pagamento Aceitas</h3>
          
          <div className="space-y-4 max-w-md">
            <label className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                <span className="block text-sm font-medium text-neutral-900">Pix Online</span>
                <span className="block text-xs text-neutral-500">Pagamento pelo celular, recebe na hora</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="acceptsPix" id="acceptsPix" defaultChecked={initialData.accepts_pix ?? true} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: initialData.accepts_pix === false ? 'auto' : 0, left: initialData.accepts_pix === false ? 0 : 'auto', borderColor: initialData.accepts_pix === false ? '#d1d5db' : '#10b981', backgroundColor: initialData.accepts_pix === false ? '#d1d5db' : '#10b981' }} onChange={(e) => {
                    const el = e.target;
                    if(el.checked){ el.style.right = '0'; el.style.left = 'auto'; el.style.borderColor = '#10b981'; el.style.backgroundColor = '#10b981'; }
                    else { el.style.left = '0'; el.style.right = 'auto'; el.style.borderColor = '#d1d5db'; el.style.backgroundColor = '#d1d5db'; }
                }} />
                <label htmlFor="acceptsPix" className="toggle-label block overflow-hidden h-5 rounded-full bg-neutral-200 cursor-pointer"></label>
              </div>
            </label>

            <label className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                <span className="block text-sm font-medium text-neutral-900">Maquininha (Cartão)</span>
                <span className="block text-xs text-neutral-500">Na entrega ou retirada</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="acceptsCard" id="acceptsCard" defaultChecked={initialData.accepts_card ?? true} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: initialData.accepts_card === false ? 'auto' : 0, left: initialData.accepts_card === false ? 0 : 'auto', borderColor: initialData.accepts_card === false ? '#d1d5db' : '#10b981', backgroundColor: initialData.accepts_card === false ? '#d1d5db' : '#10b981' }} onChange={(e) => {
                    const el = e.target;
                    if(el.checked){ el.style.right = '0'; el.style.left = 'auto'; el.style.borderColor = '#10b981'; el.style.backgroundColor = '#10b981'; }
                    else { el.style.left = '0'; el.style.right = 'auto'; el.style.borderColor = '#d1d5db'; el.style.backgroundColor = '#d1d5db'; }
                }} />
                <label htmlFor="acceptsCard" className="toggle-label block overflow-hidden h-5 rounded-full bg-neutral-200 cursor-pointer"></label>
              </div>
            </label>

            <label className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                <span className="block text-sm font-medium text-neutral-900">Dinheiro</span>
                <span className="block text-xs text-neutral-500">Na entrega ou retirada</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="acceptsCash" id="acceptsCash" defaultChecked={initialData.accepts_cash ?? true} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: initialData.accepts_cash === false ? 'auto' : 0, left: initialData.accepts_cash === false ? 0 : 'auto', borderColor: initialData.accepts_cash === false ? '#d1d5db' : '#10b981', backgroundColor: initialData.accepts_cash === false ? '#d1d5db' : '#10b981' }} onChange={(e) => {
                    const el = e.target;
                    if(el.checked){ el.style.right = '0'; el.style.left = 'auto'; el.style.borderColor = '#10b981'; el.style.backgroundColor = '#10b981'; }
                    else { el.style.left = '0'; el.style.right = 'auto'; el.style.borderColor = '#d1d5db'; el.style.backgroundColor = '#d1d5db'; }
                }} />
                <label htmlFor="acceptsCash" className="toggle-label block overflow-hidden h-5 rounded-full bg-neutral-200 cursor-pointer"></label>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-start">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Salvando...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configuração
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
