import { login, signup } from './actions'
import { UtensilsCrossed } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="bg-red-500 p-3 rounded-2xl shadow-lg shadow-red-500/30 mb-4">
          <UtensilsCrossed className="w-8 h-8 text-white" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-neutral-900">
          Acesse seu Painel
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Gerencie seu cardápio, pedidos e o Agente de IA.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-neutral-100">
          <form className="space-y-6" action={login}>
            {searchParams?.error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
                {searchParams.message || 'Ocorreu um erro.'}
              </div>
            )}
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-neutral-900"
              >
                E-mail da Loja
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-xl border-0 py-2.5 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="contato@sualoja.com.br"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-neutral-900"
              >
                Senha
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-xl border-0 py-2.5 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-red-600 focus:ring-red-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm leading-6 text-neutral-700"
                >
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm leading-6">
                <a
                  href="#"
                  className="font-medium text-red-600 hover:text-red-500 transition-colors"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-xl bg-red-500 py-2.5 px-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all"
              >
                Entrar
              </button>
            </div>
            
            <div className="mt-4">
               <button
                formAction={signup}
                type="submit"
                className="flex w-full justify-center rounded-xl bg-white border border-neutral-300 py-2.5 px-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 transition-all"
              >
                Criar nova conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
