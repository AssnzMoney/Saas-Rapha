import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Clock, TrendingUp, Users, ShoppingBag } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
      <p className="text-neutral-500 mt-1">Bem-vindo de volta! Aqui está o resumo da sua loja hoje.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-500">Pedidos Hoje</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-900">0</p>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium">0%</span>
            <span className="text-neutral-400 ml-2">em relação a ontem</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-500">Faturamento</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-900">R$ 0,00</p>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium">0%</span>
            <span className="text-neutral-400 ml-2">em relação a ontem</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-500">Acessos no Cardápio</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-900">0</p>
          <div className="mt-2 flex items-center text-sm">
             <span className="text-neutral-400">Nenhum dado ainda</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-500">Tempo Médio</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-900">-- min</p>
          <div className="mt-2 flex items-center text-sm">
             <span className="text-neutral-400">Tempo médio de preparo</span>
          </div>
        </div>

      </div>

      <div className="mt-8 bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Configure seu cardápio</h2>
        <p className="text-neutral-500 mb-6 max-w-md mx-auto">
          Para que a Inteligência Artificial comece a trabalhar, você precisa primeiro cadastrar seus produtos e organizar suas categorias.
        </p>
        <button className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-colors">
          Cadastrar primeiro produto
        </button>
      </div>

    </div>
  )
}
