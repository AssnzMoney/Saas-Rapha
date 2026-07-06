import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
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
        {/* Header da Loja */}
        <header className="px-6 py-8 bg-[var(--brand-color)] text-white sticky top-0 z-10 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[var(--brand-color)] font-bold text-2xl">
              {tenant.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{tenant.name}</h1>
              <p className="text-white/80 text-sm mt-0.5 whitespace-pre-line">
                {tenant.opening_hours || 'Aberto agora'}
              </p>
            </div>
          </div>
        </header>

        <main className="p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
