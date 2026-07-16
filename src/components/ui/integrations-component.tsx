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
      description: "As integrações permitem que sua loja Atendy AI converse com outros aplicativos automaticamente.",
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
          <div className="p-6 flex flex-col flex-1 bg-neutral-50/50">
            <div className="flex-1 mb-6">
              <div className="mt-2 text-sm text-neutral-600 space-y-4 bg-white/50 p-4 rounded-xl border border-neutral-200 shadow-sm">
                <p>
                  Conecte sua conta do Mercado Pago para receber pagamentos via PIX automaticamente.
                  A divisão de pagamentos (taxa da plataforma) será feita na hora!
                </p>
                {initialData?.mp_access_token && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium">
                    Sua conta já está conectada. Se desejar, você pode reconectar clicando no botão abaixo.
                  </div>
                )}
              </div>
            </div>
            
            <a
              href={`https://auth.mercadopago.com/authorization?client_id=${process.env.NEXT_PUBLIC_MP_CLIENT_ID}&response_type=code&platform_id=mp&state=${initialData.id}&redirect_uri=${process.env.NEXT_PUBLIC_MP_REDIRECT_URI}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#009EE3] text-white font-bold rounded-xl hover:bg-[#008DD0] transition-colors shadow-sm"
            >
              Conectar com Mercado Pago
            </a>
          </div>
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
