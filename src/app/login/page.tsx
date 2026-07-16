import { LoginPageComponent } from '@/components/ui/animated-characters-login-page'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const resolvedSearchParams = await searchParams
  return (
    <LoginPageComponent serverError={resolvedSearchParams?.error ? (resolvedSearchParams.message || 'Ocorreu um erro.') : undefined} />
  )
}
