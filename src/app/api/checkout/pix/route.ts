import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
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
    const accessToken = tenant?.mp_access_token || process.env.MERCADOPAGO_GLOBAL_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({ error: 'Loja não possui Mercado Pago configurado.' }, { status: 500 })
    }

    // 2. Configurar o SDK do MP
    const client = new MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 5000 } })
    const payment = new Payment(client)

    // 3. Criar a cobrança PIX
    const result = await payment.create({
      body: {
        transaction_amount: Number(total),
        description: `Pedido #${orderId} - Saas`,
        payment_method_id: 'pix',
        payer: {
          email: 'cliente@exemplo.com', // Obrigatório para a API, mas podemos usar dummy se não capturamos
          first_name: customerName || 'Cliente'
        },
        // Opcional: Para receber notificação de quando foi pago
        // notification_url: 'https://sua-url-railway.app/api/checkout/webhook' 
      }
    })

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
