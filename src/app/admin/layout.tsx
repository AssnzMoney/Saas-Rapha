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
import { SidebarNav } from '@/components/ui/dashboard-sidebar'

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

  // Fetch the user's profile and tenant (limit 1 to avoid errors if multiple exist)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, tenants(*)')
    .eq('user_id', user.id)
    .not('tenant_id', 'is', null)
    .limit(1)

  const profile = profiles?.[0]

  // Se o perfil do usuário não tiver um tenant_id (ou nem existir o perfil ainda), 
  // bloqueia o acesso à dashboard e força o redirecionamento.
  if (!profile || !profile.tenant_id) {
    redirect('/onboarding')
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <aside className="bg-white border-r border-neutral-200 flex-col hidden md:flex h-full transition-all duration-300 z-10">
         <SidebarNav 
           className="w-full h-full border-none"
           activeWorkspace={profile?.tenants?.name || 'Sua Loja'}
         />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-50/50 relative">
        <div className="dot-pattern" />
        <header className="relative z-10 h-16 bg-white/80 backdrop-blur-sm border-b border-neutral-200 flex items-center justify-between px-8 md:hidden">
            <span className="font-bold text-lg text-neutral-900">Atendy AI</span>
            {/* Mobile menu button would go here */}
        </header>
        <div className="relative z-10 p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
