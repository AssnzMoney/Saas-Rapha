import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { tenantId, orderId, total, customerName } = await req.json()

    if (!tenantId || !orderId || !total) {
      return NextResponse.json({ error: 'Dados insuficientes' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Buscar a chave do Mercado Pago do Lojista
    const { data: tenant } = await supabase
      .from('tenants')
      .select('mp_access_token')
      .eq('id', tenantId)
      .single()

    // Se o lojista não tiver configurado sua própria chave, tentamos usar uma global provisória do arquivo .env
    let accessToken = (tenant?.mp_access_token || process.env.MERCADOPAGO_GLOBAL_ACCESS_TOKEN || '').trim()

    if (!accessToken || accessToken === 'APP_USR-sua-chave-aqui') {
      return NextResponse.json({ error: 'Sua chave do Mercado Pago é inválida ou não foi configurada. Acesse a aba Integrações e insira uma chave de produção válida (APP_USR-...).' }, { status: 500 })
    }

    // Verificar se o usuário colocou a "Public Key" por engano (Public Keys costumam ter 41 caracteres com o prefixo)
    // Access Tokens de verdade têm mais de 70 caracteres.
    if (accessToken.length < 60) {
      return NextResponse.json({ error: 'Você inseriu uma Chave Pública em vez do Access Token! O Access Token correto é bem maior (mais de 70 caracteres). Volte ao painel do Mercado Pago e copie o Access Token.' }, { status: 500 })
    }

    // 2. Criar a cobrança PIX direto na API
    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify({
        transaction_amount: Number(total),
        application_fee: 0.50,
        description: `Pedido #${orderId} - Saas`,
        payment_method_id: 'pix',
        payer: {
          email: 'cliente@exemplo.com',
          first_name: customerName || 'Cliente'
        }
      })
    })

    const result = await mpRes.json()

    if (!mpRes.ok) {
      console.error("Erro MP API:", result)
      throw new Error(result.message || 'Erro ao processar pagamento no Mercado Pago')
    }

    const qrCode = result.point_of_interaction?.transaction_data?.qr_code
    const qrCodeBase64 = result.point_of_interaction?.transaction_data?.qr_code_base64
    const mpPaymentId = result.id

    // 4. Salvar o ID do pagamento no Pedido
    if (mpPaymentId) {
      await supabase
        .from('orders')
        .update({ mp_payment_id: mpPaymentId.toString() })
        .eq('id', orderId)
    }

    return NextResponse.json({
      qrCode,
      qrCodeBase64,
      mpPaymentId
    })

  } catch (error: any) {
    console.error('Erro MercadoPago:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
