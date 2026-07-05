'use client'

import { useState } from 'react'
import { updateStoreData } from './actions'
import { Save, Store, Link as LinkIcon, Palette, CreditCard } from 'lucide-react'

export function StoreSettingsForm({ initialData }: { initialData: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateStoreData(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' })
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900">Configurações Gerais da Loja</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Altere as informações públicas do seu restaurante e conecte seu Mercado Pago.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome da Loja */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nome da Loja
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                name="name"
                defaultValue={initialData.name}
                required
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                placeholder="Ex: Pizzaria do João"
              />
            </div>
          </div>

          {/* URL do Cardápio */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              URL do Cardápio (Slug)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                name="slug"
                defaultValue={initialData.slug}
                required
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                placeholder="pizzaria-joao"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Seu site ficará: seusite.com/<strong>{initialData.slug}</strong></p>
          </div>

          {/* Cor Tema */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Cor Tema (Hexadecimal)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Palette className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                name="themeColor"
                defaultValue={initialData.theme_color || '#ff4d4f'}
                className="block w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                placeholder="#ff4d4f"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div 
                  className="w-5 h-5 rounded-full border border-neutral-200" 
                  style={{ backgroundColor: initialData.theme_color || '#ff4d4f' }}
                />
              </div>
            </div>
          </div>

          {/* Mercado Pago */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Access Token (Mercado Pago)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="password"
                name="mpToken"
                defaultValue={initialData.mp_access_token || ''}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                placeholder="APP_USR-..."
              />
            </div>
            <div className="mt-2 text-xs text-neutral-500 space-y-1 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              <p className="font-semibold text-neutral-700">Como obter o seu Access Token de Produção:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Acesse o <a href="https://mercadopago.com.br/developers/panel" target="_blank" rel="noreferrer" className="text-red-600 hover:underline">Painel de Desenvolvedores do Mercado Pago</a>.</li>
                <li>Crie uma nova aplicação (Ou abra uma existente).</li>
                <li>No menu lateral, vá em <strong>Credenciais de Produção</strong>.</li>
                <li>Copie o valor do <strong>Access Token</strong> (Começa com <code>APP_USR-</code>) e cole aqui.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Salvando...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
