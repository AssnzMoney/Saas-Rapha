import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  MessageSquareCode, 
  Settings, 
  LogOut,
  Store,
  ShoppingBag,
  Truck,
  Bot
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Protect the /admin route
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // Fetch the user's profile and tenant
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, tenants(*)')
    .eq('user_id', user.id)
    .single()

  // Note: if a user logs in but doesn't have a profile/tenant yet, 
  // they should be redirected to an onboarding flow.
  // We will handle that logic later or assume the tenant is created.

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <Store className="w-6 h-6 text-red-500 mr-2" />
          <span className="font-bold text-lg text-neutral-900 tracking-tight">
            Atendy AI
          </span>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-1">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 mt-4 px-3">
            Gestão
          </div>
          
          <Link href="/admin" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-red-600 bg-red-50 transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>

          <Link href="/admin/orders" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
            <ShoppingBag className="w-5 h-5 mr-3" />
            Gestor de Pedidos
          </Link>
          
          <Link href="/admin/menu" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
            <UtensilsCrossed className="w-5 h-5 mr-3" />
            Cardápio
          </Link>

          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 mt-8 px-3">
            Inteligência Artificial
          </div>

          <Link href="/admin/ai-agent" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
            <MessageSquareCode className="w-5 h-5 mr-3" />
            Agente WhatsApp
          </Link>

          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 mt-8 px-3">
            Configurações
          </div>

          <Link href="/admin/store" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
            <Store className="w-5 h-5 mr-3" />
            Dados da Loja
          </Link>

          <Link href="/admin/delivery" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
            <Truck className="w-5 h-5 mr-3" />
            Áreas de Entrega
          </Link>

          <Link href="/admin/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Ajustes do Sistema
          </Link>
        </div>

        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-neutral-900 truncate">{profile?.tenants?.name || 'Sua Loja'}</p>
                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          
          <Link target="_blank" href={`/${profile?.tenants?.slug || ''}`} className="mt-2 flex w-full justify-center items-center px-3 py-2 text-sm font-bold rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors">
            Ver Meu Cardápio
          </Link>

          <form action="/auth/signout" method="post">
            <button className="mt-2 flex w-full items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Sair da conta
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-50/50">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 md:hidden">
            <span className="font-bold text-lg text-neutral-900">Atendy AI</span>
            {/* Mobile menu button would go here */}
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
