import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { SearchTrigger } from './SearchTrigger'
import { MenuTrigger } from './MenuTrigger'

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
        {/* Modern White Header */}
        <header className="pt-6 pb-4 px-4 bg-white/95 backdrop-blur-md sticky top-0 z-20 border-b border-neutral-100/50 shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <MenuTrigger />
            <div className="font-bold text-lg text-neutral-900 truncate flex-1 text-center px-2 flex items-center justify-center gap-2">
              {tenant.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tenant.logo_url} alt="Logo" className="w-8 h-8 rounded-full object-cover shadow-sm border border-neutral-100" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm" style={{ backgroundColor: 'var(--brand-color)' }}>
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              )}
              {tenant.name}
            </div>
            <div className="w-10 h-10"></div> {/* Spacer for balance */}
          </div>
          
          <SearchTrigger />
        </header>

        {/* Store Info Banner (Integrated) */}
        <div className="bg-white px-5 py-4 border-b border-neutral-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.01)] relative z-10">
           <div className="flex items-center text-sm bg-neutral-50 self-start px-3 py-1.5 rounded-full border border-neutral-100">
              <div className={`w-2 h-2 rounded-full mr-2 ${tenant.is_open ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`}></div>
              <span className={`font-semibold ${tenant.is_open ? "text-emerald-600" : "text-neutral-500"}`}>
                {tenant.is_open ? (tenant.opening_hours || "Aberto agora") : "Fechado no momento"}
              </span>
           </div>
           {(tenant.accepts_delivery || tenant.accepts_pickup) && (
             <div className="flex flex-col text-[13px] text-neutral-500 items-start sm:items-end">
               <div className="flex items-center font-medium text-neutral-600">
                  <MapPin className="w-4 h-4 mr-1.5 text-[var(--brand-color)]" />
                  <span>
                    {tenant.accepts_delivery && tenant.accepts_pickup ? "Retirada e Delivery disponíveis" : tenant.accepts_delivery ? "Somente Delivery" : "Somente Retirada"}
                  </span>
               </div>
               {tenant.address && (
                 <div className="mt-0.5 ml-5 sm:ml-0 text-neutral-400 truncate max-w-[200px]">
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
