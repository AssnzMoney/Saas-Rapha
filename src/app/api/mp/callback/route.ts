import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state') // Esperamos que seja o tenantId
  
  if (!code || !state) {
    return NextResponse.redirect(new URL('/admin/integrations?error=missing_params', req.url))
  }

  const tenantId = state

  try {
    const clientId = process.env.NEXT_PUBLIC_MP_CLIENT_ID
    const clientSecret = process.env.MP_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_MP_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Credenciais do Mercado Pago OAuth não configuradas no .env')
      return NextResponse.redirect(new URL('/admin/integrations?error=server_config', req.url))
    }

    // Trocar o 'code' pelo 'access_token' oficial
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    })

    const data = await response.json()

    if (data.access_token) {
      // Salvar no Supabase
      const supabase = await createClient()
      
      const { error } = await supabase
        .from('tenants')
        .update({ 
          mp_access_token: data.access_token 
        })
        .eq('id', tenantId)

      if (error) {
        console.error('Erro ao salvar no Supabase:', error)
        return NextResponse.redirect(new URL('/admin/integrations?error=db_error', req.url))
      }

      // Sucesso! Redireciona de volta com mensagem de sucesso
      return NextResponse.redirect(new URL('/admin/integrations?success=mp_connected', req.url))
    } else {
      console.error('Erro do Mercado Pago ao trocar token:', data)
      return NextResponse.redirect(new URL('/admin/integrations?error=mp_auth_failed', req.url))
    }

  } catch (err) {
    console.error('Erro geral no callback do MP:', err)
    return NextResponse.redirect(new URL('/admin/integrations?error=server_error', req.url))
  }
}
