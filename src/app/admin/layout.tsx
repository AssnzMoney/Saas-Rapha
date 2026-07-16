import { redirect } from 'next/navigation'
import { getCachedProfile } from '@/lib/dal'
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
  // Fetch the user's profile and tenant using the cached DAL
  const { profile } = await getCachedProfile()

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <aside className="bg-white border-r border-neutral-200 flex-col hidden md:flex h-full transition-all duration-300 z-50">
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
