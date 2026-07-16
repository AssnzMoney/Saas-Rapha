import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Menu, Clock, MapPin } from 'lucide-react'
import { SearchTrigger } from './search-trigger'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tenant } = await supabase.from('tenants').select('name, theme_color').eq('slug', slug).single()
  
  if (!tenant) return { title: 'Loja não encontrada' }
  return { title: tenant.name }
}

export default async function PublicMenuLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tenant } = await supabase.from('tenants').select('*').eq('slug', slug).single()

  if (!tenant) notFound()

  return (
    <div className="min-h-screen bg-neutral-50 font-sans" style={{ '--brand-color': tenant.theme_color || '#ef4444' } as React.CSSProperties}>
      {/* Mobile-first max width container for desktop viewing */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative pb-24">
        {/* Dynamic Header based on theme color */}
        <header className="pt-10 pb-4 px-4 text-white relative transition-colors duration-300 sticky top-0 z-20 shadow-md" style={{ backgroundColor: 'var(--brand-color)' }}>
          {/* Subtle pattern for header */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          
          <div className="relative z-10 flex items-center justify-between">
            <Menu className="w-6 h-6 opacity-80" />
            <div className="font-semibold text-xl truncate flex-1 text-center px-2 flex items-center justify-center gap-2">
              {tenant.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tenant.logo_url} alt="Logo" className="w-8 h-8 rounded-full object-cover bg-white" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white text-sm flex items-center justify-center font-bold" style={{ color: 'var(--brand-color)' }}>
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              )}
              {tenant.name}
            </div>
            <div className="w-6 h-6"></div> {/* Spacer for balance */}
          </div>
          
          <SearchTrigger />
        </header>

        {/* Store Info Banner */}
        <div className="bg-white px-4 py-3 border-b border-neutral-100 flex items-center justify-between shadow-sm sticky top-[132px] z-10">
           <div className="flex items-center text-sm text-neutral-500">
              <Clock className={`w-4 h-4 mr-1 ${tenant.is_open ? "text-emerald-500" : "text-neutral-400"}`} />
              <span className={`font-medium ${tenant.is_open ? "text-emerald-600" : "text-neutral-500"}`}>
                {tenant.is_open ? (tenant.opening_hours || "Aberto agora") : "Fechado"}
              </span>
           </div>
           {(tenant.accepts_delivery || tenant.accepts_pickup) && (
             <div className="flex flex-col text-xs text-neutral-500 items-end">
               <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  <span>
                    {tenant.accepts_delivery && tenant.accepts_pickup ? "Retirada e Delivery" : tenant.accepts_delivery ? "Somente Delivery" : "Somente Retirada"}
                  </span>
               </div>
               {tenant.address && (
                 <div className="mt-1 opacity-75 truncate max-w-[140px]">
                   {tenant.address}
                 </div>
               )}
             </div>
           )}
        </div>

        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
