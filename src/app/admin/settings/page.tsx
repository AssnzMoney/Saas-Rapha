import { Settings, CreditCard, Users, Shield, Lock } from 'lucide-react'
import { BannerGuide } from '@/components/ui/banner-guide'

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <BannerGuide 
        steps={[
          {
            title: "Segurança Avançada",
            description: "Proteja o acesso ao seu restaurante ativando autenticação de dois fatores e monitorando os acessos.",
            icon: <Lock className="w-8 h-8 text-blue-500" />
          },
          {
            title: "Gerencie sua Equipe",
            description: "Dê acesso a garçons, gerentes e cozinheiros com permissões exclusivas para cada um (em breve).",
            icon: <Users className="w-8 h-8 text-emerald-500" />
          },
          {
            title: "Planos e Assinaturas",
            description: "Faça o upgrade do seu plano para liberar mensagens ilimitadas no WhatsApp e mais recursos da IA.",
            icon: <CreditCard className="w-8 h-8 text-amber-500" />
          }
        ]}
        compactTitle="Ajustes do Sistema"
        compactDescription="Gerencie sua assinatura, faturamento e permissões da equipe."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Placeholder: Assinatura */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="bg-white text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">Em breve</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Meu Plano</h3>
          </div>
          <p className="text-sm text-neutral-500">
            Você está no plano Gratuito. Faça upgrade para desbloquear recursos avançados da Inteligência Artificial.
          </p>
          <button disabled className="mt-4 w-full py-2 bg-neutral-100 text-neutral-400 font-medium rounded-lg text-sm">
            Gerenciar Assinatura
          </button>
        </div>

        {/* Placeholder: Equipe */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="bg-white text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">Em breve</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Membros da Equipe</h3>
          </div>
          <p className="text-sm text-neutral-500">
            Adicione garçons, gerentes ou cozinheiros para terem acesso ao gestor de pedidos.
          </p>
          <button disabled className="mt-4 w-full py-2 bg-neutral-100 text-neutral-400 font-medium rounded-lg text-sm">
            Convidar Membro
          </button>
        </div>

        {/* Placeholder: Segurança */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="bg-white text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">Em breve</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-4">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-neutral-900">Segurança</h3>
          </div>
          <p className="text-sm text-neutral-500">
            Altere sua senha, configure autenticação de dois fatores e veja os logs de acesso.
          </p>
          <button disabled className="mt-4 w-full py-2 bg-neutral-100 text-neutral-400 font-medium rounded-lg text-sm">
            Configurar Segurança
          </button>
        </div>

      </div>
    </div>
  )
}
