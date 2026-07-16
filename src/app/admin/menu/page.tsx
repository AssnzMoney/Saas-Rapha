import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MenuManager } from './components'

export default async function MenuPage() {
  const supabase = await createClient()
  
  // Get User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get Tenant ID
  const { data: profiles } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .limit(1)
  const profile = profiles?.[0]
    
  if (!profile || !profile.tenant_id) {
    // If somehow has no tenant, send back to onboarding
    redirect('/admin/onboarding')
  }

  const tenant_id = profile.tenant_id

  // Fetch Categories
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('tenant_id', tenant_id)
    .order('sort_order', { ascending: true })

  // Fetch Items
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('tenant_id', tenant_id)
    .order('created_at', { ascending: true })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <MenuManager categories={categories || []} items={items || []} />
    </div>
  )
}
