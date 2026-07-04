import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Store } from 'lucide-react'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  async function createTenant(formData: FormData) {
    'use server'
    const name = formData.get('storeName') as string
    
    // In a real scenario, you'd generate a safe slug, check for uniqueness, etc.
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

    const supabaseServer = await createClient()
    
    // Create the tenant
    const { data: tenant, error: tenantError } = await supabaseServer
      .from('tenants')
      .insert({ name, slug })
      .select()
      .single()

    if (!tenantError && tenant) {
      // Create the user profile linked to this tenant
      await supabaseServer
        .from('profiles')
        .insert({
          user_id: user?.id,
          tenant_id: tenant.id,
          role: 'admin'
        })
      
      redirect('/admin')
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 flex-col justify-center py-12 sm:px-6 lg:px-8 -m-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="bg-red-500 p-3 rounded-2xl shadow-lg mb-4">
          <Store className="w-8 h-8 text-white" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-neutral-900">
          Bem-vindo!
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Para começarmos, qual é o nome do seu estabelecimento?
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-neutral-100">
          <form className="space-y-6" action={createTenant}>
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium leading-6 text-neutral-900">
                Nome da Loja / Restaurante
              </label>
              <div className="mt-2">
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  required
                  className="block w-full rounded-xl border-0 py-2.5 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="Ex: Pizzaria da Nonna"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-xl bg-red-500 py-2.5 px-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all"
              >
                Criar minha loja
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
