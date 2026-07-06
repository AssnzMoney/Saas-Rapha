'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Plug, Zap, CheckCircle2, ChevronRight, CreditCard, MessageCircle, ShoppingBag } from 'lucide-react'
import { updateIntegrations } from '@/app/admin/integrations/actions'

import { BannerGuide } from '@/components/ui/banner-guide'

interface IntegrationsSectionProps {
  initialData: any
}

export default function IntegrationsSection({ initialData }: IntegrationsSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [guideFinished, setGuideFinished] = useState(false)

  const steps = [
    {
      title: "Conecte sua Loja ao Mundo",
      description: "As integrações permitem que sua loja Goomer AI converse com outros aplicativos automaticamente.",
      icon: <Plug className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Pagamentos Automáticos",
      description: "Receba via PIX diretamente na sua conta, sem taxas ocultas e com baixa automática de pedidos.",
      icon: <Zap className="w-8 h-8 text-amber-500" />
    },
    {
      title: "Tudo Pronto",
      description: "Comece configurando o Mercado Pago para receber online. Mais integrações chegarão em breve!",
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />
    }
  ]

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await updateIntegrations(formData)
      if (result.error) {
        alert(result.error)
      } else {
        alert('Integração salva com sucesso!')
      }
    } catch (error) {
      alert('Ocorreu um erro ao salvar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Tutorial Header */}
      <BannerGuide 
        steps={steps}
        compactTitle="App Store & Integrações"
        compactDescription="Gerencie os aplicativos conectados à sua loja."
        onFinish={() => setGuideFinished(true)}
      />

      {/* Cards de Integração */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: guideFinished ? 1 : 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        
        {/* Mercado Pago - Ativo */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col relative group transition-all hover:shadow-md">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icone-1024.png" alt="Mercado Pago Logo" className="w-12 h-12 object-contain rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 text-lg">Mercado Pago</h3>
                <p className="text-xs text-neutral-500">Pagamentos PIX</p>
              </div>
            </div>
            {initialData?.mp_access_token && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Conectado
              </span>
            )}
          </div>
          
          <form action={handleSubmit} className="p-6 flex flex-col flex-1 bg-neutral-50/50">
            <div className="flex-1 mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Access Token (Produção)
              </label>
              <input
                type="password"
                name="mpToken"
                defaultValue={initialData?.mp_access_token || ''}
                className="block w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white shadow-sm transition-all mb-4"
                placeholder="APP_USR-..."
              />
              <div className="mt-2 text-xs text-neutral-500 space-y-1 bg-white/50 p-3 rounded-lg border border-neutral-200 shadow-sm">
                <p className="font-semibold text-neutral-700 mb-2">Como obter o seu Token:</p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Acesse o <a href="https://mercadopago.com.br/developers/panel" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">Painel de Desenvolvedores</a> do Mercado Pago.</li>
                  <li>Crie uma nova aplicação (ou abra uma existente).</li>
                  <li>No menu lateral, vá em <strong>Credenciais de Produção</strong>.</li>
                  <li>Copie o valor do <strong>Access Token</strong> (Começa com <code>APP_USR-</code>) e cole acima.</li>
                </ol>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Configuração'}
            </button>
          </form>
        </div>

        {/* WhatsApp - Em Breve (Borrado) */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col relative select-none">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="bg-neutral-900 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              Em Breve
            </span>
          </div>
          <div className="p-6 border-b border-neutral-100 flex items-center gap-3 opacity-60">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-lg">WhatsApp API</h3>
              <p className="text-xs text-neutral-500">Atendimento Automático</p>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1 bg-neutral-50/50 opacity-60">
            <div className="flex-1 mb-6 space-y-4">
              <div className="h-10 bg-neutral-200 rounded-xl w-full animate-pulse" />
              <div className="h-10 bg-neutral-200 rounded-xl w-3/4 animate-pulse" />
            </div>
            <div className="h-12 bg-neutral-200 rounded-xl w-full" />
          </div>
        </div>

        {/* iFood - Em Breve (Borrado) */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col relative select-none">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="bg-neutral-900 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              Em Breve
            </span>
          </div>
          <div className="p-6 border-b border-neutral-100 flex items-center gap-3 opacity-60">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-lg">iFood Sync</h3>
              <p className="text-xs text-neutral-500">Sincronização de Pedidos</p>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1 bg-neutral-50/50 opacity-60">
            <div className="flex-1 mb-6 space-y-4">
              <div className="h-10 bg-neutral-200 rounded-xl w-full animate-pulse" />
              <div className="h-10 bg-neutral-200 rounded-xl w-2/3 animate-pulse" />
            </div>
            <div className="h-12 bg-neutral-200 rounded-xl w-full" />
          </div>
        </div>

      </motion.div>
    </div>
  )
}
