import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { tenantId } = await req.json()
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID obrigatório' }, { status: 400 })
    }

    const UAZAPI_URL = process.env.UAZAPI_URL?.replace(/\/$/, '') // Remove trailing slash if exists
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
        'apikey': UAZAPI_KEY
      },
      body: JSON.stringify({
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      })
    })

    const createData = await createRes.json()

    // Se já existe a instância, pode retornar erro no create, então ignoramos se for erro de "já existe"
    // Mas geralmente a gente só pega o QR Code depois.

    // 2. Configurar o Webhook (Para a UAZAPI enviar mensagens para nossa API)
    // Precisamos de uma URL pública. Na Railway o cliente terá a URL dele.
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sua-url-railway.up.railway.app'
    
    await fetch(`${UAZAPI_URL}/webhook/set/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': UAZAPI_KEY
      },
      body: JSON.stringify({
        url: `${APP_URL}/api/whatsapp/webhook`,
        webhookByEvents: false,
        webhookBase64: false,
        events: ['MESSAGES_UPSERT']
      })
    })

    // 3. Obter o Base64 do QR Code
    const qrRes = await fetch(`${UAZAPI_URL}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: {
        'apikey': UAZAPI_KEY
      }
    })

    const qrData = await qrRes.json()

    // Atualizar no banco de dados que a instância foi criada
    const supabase = await createClient()
    await supabase.from('tenants').update({ uazapi_instance_key: instanceName }).eq('id', tenantId)

    if (qrData.base64) {
      return NextResponse.json({ qrcode: qrData.base64 })
    } else {
      // Se não retornar base64, a instância pode já estar conectada
      return NextResponse.json({ qrcode: null, message: 'Já conectado ou falha ao pegar QRCode', data: qrData })
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
