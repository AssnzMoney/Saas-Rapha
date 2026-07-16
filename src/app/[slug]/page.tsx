import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PublicMenuClient } from './components'

export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  // Buscar a loja
  const { data: tenant } = await supabase.from('tenants').select('id, name, accepts_pix, accepts_card, accepts_cash').eq('slug', slug).single()
  if (!tenant) notFound()

  // Buscar categorias da loja
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('sort_order', { ascending: true })

  // Buscar produtos da loja
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('is_available', true)
    .order('created_at', { ascending: true })

  return (
    <PublicMenuClient 
      tenant={tenant}
      categories={categories || []}
      items={items || []}
    />
  )
}
