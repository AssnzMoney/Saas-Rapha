import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { tenantId } = await req.json()
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID obrigatório' }, { status: 400 })
    }

    const UAZAPI_URL = (process.env.UAZAPI_URL || process.env.UAZAPI_BASE_URL)?.replace(/\/$/, '') // Remove trailing slash if exists
    const UAZAPI_KEY = process.env.UAZAPI_GLOBAL_API_KEY

    if (!UAZAPI_URL || !UAZAPI_KEY) {
      return NextResponse.json({ error: 'Configurações globais da UAZAPI ausentes no .env' }, { status: 500 })
    }

    const instanceName = tenantId // O nome da instância será o próprio ID do tenant

    // 1. Criar a instância na UAZAPI (Evolution API)
    const createRes = await fetch(`${UAZAPI_URL}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admintoken': UAZAPI_KEY
      },
      body: JSON.stringify({
        instanceName: instanceName,
        Name: instanceName,
        name: instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      })
    })

    console.log('--- RESPOSTA CREATE DA UAZAPI ---')
    const createBody = await createRes.text()
    console.log(createBody)
    
    // Tentar extrair o token da instância caso a UAZAPI retorne
    let instanceToken = UAZAPI_KEY
    try {
      const parsedCreate = JSON.parse(createBody)
      if (parsedCreate.hash?.apikey) instanceToken = parsedCreate.hash.apikey
      if (parsedCreate.token) instanceToken = parsedCreate.token
    } catch(e) {}

    // 2. Configurar o Webhook
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sua-url-railway.up.railway.app'
    
    await fetch(`${UAZAPI_URL}/webhook/set/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admintoken': UAZAPI_KEY,
        'token': instanceToken
      },
      body: JSON.stringify({
        url: `${APP_URL}/api/whatsapp/webhook`,
        webhookByEvents: false,
        webhookBase64: false,
        events: ['MESSAGES_UPSERT']
      })
    })

    // 3. Obter o Base64 do QR Code
    const qrRes = await fetch(`${UAZAPI_URL}/instance/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admintoken': UAZAPI_KEY,
        'token': instanceToken
      },
      body: JSON.stringify({}) // Sem o campo "phone" ele gera QRCode
    })

    const qrText = await qrRes.text()
    console.log('--- RESPOSTA QR CODE DA UAZAPI ---')
    console.log(qrText)

    let qrData: any = {}
    try { qrData = JSON.parse(qrText) } catch (e) {}

    // Atualizar no banco de dados
    const supabase = await createClient()
    await supabase.from('tenants').update({ uazapi_instance_key: instanceName }).eq('id', tenantId)

    const base64Code = qrData.base64 || qrData.qrcode?.base64 || (typeof qrData.qrcode === 'string' ? qrData.qrcode : null) || qrData.instance?.qrcode

    if (base64Code) {
      return NextResponse.json({ qrcode: base64Code })
    } else {
      // Se não retornar base64, a instância pode já estar conectada
      return NextResponse.json({ qrcode: null, message: 'Já conectado ou falha ao pegar QRCode', data: qrData })
    }

  } catch (error: any) {
    console.error('ERRO INTERNO:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
