import { createClient } from '@/lib/supabase/server'
import { getCachedProfile } from '@/lib/dal'
import { Clock, TrendingUp, Users, ShoppingBag, ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react'
import { DashboardChart } from '@/components/ui/dashboard-chart'
import { RecentCustomers } from '@/components/ui/recent-customers'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { profile } = await getCachedProfile()
  const userName = profile?.full_name?.split(' ')[0] || 'Lojista'
  const storeName = profile?.tenants?.name || 'sua loja'

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
        Bem-vindo, {userName}
        <Sparkles className="w-5 h-5 text-red-500" />
      </h1>
      <p className="text-neutral-500 mt-1">Aqui está o resumo da {storeName} hoje.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        
        {/* Card 1 */}
        <SpotlightCard>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pedidos Hoje</h3>
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">26</p>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">12%</span>
              <span className="text-neutral-400 ml-2">em relação a ontem</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2 */}
        <SpotlightCard>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Faturamento</h3>
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">R$ 1.250,00</p>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">8%</span>
              <span className="text-neutral-400 ml-2">em relação a ontem</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3 */}
        <SpotlightCard>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Conversas da IA</h3>
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">142</p>
            <div className="mt-2 flex items-center text-sm">
               <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
               <span className="text-emerald-500 font-medium">24%</span>
               <span className="text-neutral-400 ml-2">engajamento</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 4 */}
        <SpotlightCard>
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Taxa de Conversão</h3>
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">18.3%</p>
            <div className="mt-2 flex items-center text-sm">
               <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
               <span className="text-emerald-500 font-medium">2%</span>
               <span className="text-neutral-400 ml-2">acima da média</span>
            </div>
          </div>
        </SpotlightCard>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Chart Section */}
        <SpotlightCard className="lg:col-span-2">
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Faturamento e Pedidos</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Acompanhamento dos últimos 7 dias</p>
              </div>
              <select className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-red-500">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
            </div>
            
            <DashboardChart />
          </div>
        </SpotlightCard>

        {/* Recent Customers Section */}
        <SpotlightCard className="lg:col-span-1">
          <div className="flex flex-col h-full p-6">
             <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Vendas Recentes</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Pedidos fechados pela IA</p>
              </div>
            </div>
            
            <RecentCustomers />
            
            <button className="w-full mt-6 py-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium text-sm rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700">
              Ver todos os pedidos
            </button>
          </div>
        </SpotlightCard>

      </div>

    </div>
  )
}
