'use client'

import { useState } from 'react'
import { updateStoreData } from './actions'
import { Save, Store, Link as LinkIcon, Palette, Image as ImageIcon, MapPin, Power, Clock } from 'lucide-react'
import { StorePreview } from '@/components/ui/store-preview'
import { BannerGuide } from '@/components/ui/banner-guide'
import { MousePointerClick, Palette as PaletteIcon, Globe } from 'lucide-react'

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

  // Real-time states for preview
  const [storeName, setStoreName] = useState(initialData.name || '')
  const [storeSlug, setStoreSlug] = useState(initialData.slug || '')
  const [themeColor, setThemeColor] = useState(initialData.theme_color || '#ff4d4f')
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || '')
  const [address, setAddress] = useState(initialData.address || '')
  const [isOpen, setIsOpen] = useState(initialData.is_open ?? true)
  const [acceptsDelivery, setAcceptsDelivery] = useState(initialData.accepts_delivery ?? true)
  const [acceptsPickup, setAcceptsPickup] = useState(initialData.accepts_pickup ?? true)
  const [openingHours, setOpeningHours] = useState(initialData.opening_hours || '')

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const objectUrl = URL.createObjectURL(file)
      setLogoUrl(objectUrl)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <BannerGuide 
        steps={[
          {
            title: "URL da sua Loja",
            description: "Escolha um link curto para compartilhar com seus clientes. É através dele que acessarão o cardápio.",
            icon: <Globe className="w-8 h-8 text-blue-500" />
          },
          {
            title: "Cores e Personalização",
            description: "Deixe o site com a cara da sua marca ajustando a cor principal e adicionando a sua logo.",
            icon: <PaletteIcon className="w-8 h-8 text-pink-500" />
          },
          {
            title: "Interatividade",
            description: "Lembre-se de salvar suas alterações e testar seu link online!",
            icon: <MousePointerClick className="w-8 h-8 text-emerald-500" />
          }
        ]}
        compactTitle="Configurações Gerais da Loja"
        compactDescription="Altere as informações públicas do seu restaurante."
      />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Form */}
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
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                placeholder="Ex: Pizzaria do João"
              />
            </div>
          </div>

          {/* URL da Loja */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              URL da Loja
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                name="slug"
                value={storeSlug}
                onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                placeholder="nome-da-loja"
                required
              />
            </div>
            <p className="mt-1.5 text-xs text-neutral-500 flex items-center">
              Sua loja ficará acessível em: <span className="font-semibold text-neutral-700 ml-1 bg-neutral-100 px-1.5 py-0.5 rounded">atendy.ai/{storeSlug || 'nome-da-loja'}</span>
            </p>
          </div>

          {/* Cor Tema */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Cor Tema
            </label>
            <div className="relative flex items-center gap-3">
              <div className="relative rounded-lg overflow-hidden w-10 h-10 shrink-0 border border-neutral-300 shadow-sm cursor-pointer">
                <input
                  type="color"
                  name="themeColor"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="absolute -inset-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow uppercase"
                placeholder="#ff4d4f"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Logo da Loja
            </label>
            <div className="relative">
              <input
                type="file"
                name="logoFile"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full py-2 border border-neutral-300 rounded-lg text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-2 border-t border-neutral-100 pt-6 mt-2">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Funcionamento e Entregas</h3>
            
            <div className="space-y-4">
              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Endereço Físico (Retirada)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <textarea
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow resize-none"
                    placeholder="Ex: Rua das Flores, 123 - Centro"
                  />
                </div>
              </div>

              {/* Horário de Funcionamento */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Horário de Funcionamento
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <Clock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <textarea
                    name="openingHours"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    rows={2}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow resize-none"
                    placeholder="Ex: Terça a Domingo, das 18h às 23h30"
                  />
                </div>
              </div>

              {/* Loja Aberta/Fechada */}
              <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Loja Aberta</div>
                    <div className="text-xs text-neutral-500">Permitir que clientes façam pedidos agora.</div>
                  </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="hidden" name="isOpen" value={isOpen.toString()} />
                  <input type="checkbox" className="sr-only peer" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
              </label>

              {/* Delivery e Retirada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input type="hidden" name="acceptsDelivery" value={acceptsDelivery.toString()} />
                  <input type="checkbox" className="w-4 h-4 text-red-600 border-neutral-300 rounded focus:ring-red-500" checked={acceptsDelivery} onChange={(e) => setAcceptsDelivery(e.target.checked)} />
                  <div className="ml-3">
                    <div className="font-medium text-neutral-900 text-sm">Aceita Delivery</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input type="hidden" name="acceptsPickup" value={acceptsPickup.toString()} />
                  <input type="checkbox" className="w-4 h-4 text-red-600 border-neutral-300 rounded focus:ring-red-500" checked={acceptsPickup} onChange={(e) => setAcceptsPickup(e.target.checked)} />
                  <div className="ml-3">
                    <div className="font-medium text-neutral-900 text-sm">Aceita Retirada (Balcão)</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-neutral-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 transition-colors"
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

      {/* Right Column: Live Preview */}
      <div className="hidden lg:flex flex-col sticky top-8 items-center pt-4">
        <h3 className="text-sm font-semibold text-neutral-500 mb-6 uppercase tracking-wider">Preview em Tempo Real</h3>
        <StorePreview 
          name={storeName} 
          themeColor={themeColor} 
          slug={storeSlug} 
          logoUrl={logoUrl}
          address={address}
          openingHours={openingHours}
          isOpen={isOpen}
          acceptsDelivery={acceptsDelivery}
          acceptsPickup={acceptsPickup}
        />
      </div>
    </div>
    </div>
  )
}
