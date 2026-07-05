import { LoginPageComponent } from '@/components/ui/animated-characters-login-page'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <LoginPageComponent serverError={searchParams?.error ? (searchParams.message || 'Ocorreu um erro.') : undefined} />
  )
}
