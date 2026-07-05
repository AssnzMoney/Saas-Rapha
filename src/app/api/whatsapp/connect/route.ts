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

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sua-url-railway.up.railway.app'

    // 0. Deletar instância se ela já existir para evitar lixo de estado e limites excedidos
    try {
      await fetch(`${UAZAPI_URL}/instance/delete/${instanceName}`, {
        method: 'DELETE',
        headers: { 'admintoken': UAZAPI_KEY }
      })
    } catch(e) {}

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
        integration: 'WHATSAPP-BAILEYS',
        webhook_url: `${APP_URL}/api/whatsapp/webhook`,
        webhook: `${APP_URL}/api/whatsapp/webhook`,
        events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE']
      })
    })

    const createBody = await createRes.text()
    
    // Tratamento específico de limite de instâncias da UAZAPI
    if (createRes.status === 429) {
      return NextResponse.json({ error: 'Limite de instâncias atingido na sua conta UAZAPI. Por favor, acesse o painel da UAZAPI e exclua instâncias antigas antes de conectar.' }, { status: 429 })
    }
    
    // Outros erros na criação da instância
    if (!createRes.ok && createRes.status !== 403 && !createBody.includes('already exists')) {
      return NextResponse.json({ error: `Erro da UAZAPI: ${createBody}` }, { status: 400 })
    }
    
    // Tentar extrair o token da instância caso a UAZAPI retorne
    let instanceToken = UAZAPI_KEY
    try {
      const parsedCreate = JSON.parse(createBody)
      if (parsedCreate.hash?.apikey) instanceToken = parsedCreate.hash.apikey
      if (parsedCreate.token) instanceToken = parsedCreate.token
    } catch(e) {}

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

    // Atualizar no banco de dados (salvando o token para polling sem webhook)
    const supabase = await createClient()
    await supabase.from('tenants').update({ 
      uazapi_instance_key: instanceName,
      uazapi_instance_token: instanceToken
    }).eq('id', tenantId)

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
