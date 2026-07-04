import { redirect } from 'next/navigation'

export default function Home() {
  // A raiz do projeto por enquanto vai redirecionar para o painel de administração (login).
  // No futuro, se for um subdomínio de loja, redirecionaremos para o cardápio público.
  redirect('/login')
}
