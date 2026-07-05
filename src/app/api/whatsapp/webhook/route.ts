import { NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import { z } from 'zod'
import { buildSystemPrompt } from '@/lib/ai/agent'
import { submitOrder } from '@/app/[slug]/actions'
import { createClient } from '@/lib/supabase/server'

// Permitir tempo maior de execução caso a IA demore
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // A UAZAPI (Evolution API) manda os eventos no formato MESSAGES_UPSERT
    if (body.event === 'messages.upsert' || body.event === 'MESSAGES_UPSERT') {
      const messageData = body.data?.messages?.[0]
      const instanceName = body.instance // Este é o nosso tenantId
      
      if (!messageData || !instanceName) return NextResponse.json({ ok: true })

      // Evitar responder mensagens enviadas por nós mesmos
      if (messageData.key.fromMe) return NextResponse.json({ ok: true })

      // Evitar responder grupos
      if (messageData.key.remoteJid.includes('@g.us')) return NextResponse.json({ ok: true })

      const customerPhone = messageData.key.remoteJid
      const textMessage = messageData.message?.conversation || messageData.message?.extendedTextMessage?.text

      if (!textMessage) return NextResponse.json({ ok: true })

      // Inicializar OpenAI
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
      })

      // Buscar contexto do Tenant e Prompt
      const tenantId = instanceName
      const systemPrompt = await buildSystemPrompt(tenantId)

      // ==========================================
      // ATENÇÃO: Num cenário real em produção, você salvaria
      // o histórico de mensagens do cliente (customerPhone)
      // no Supabase para enviar o contexto completo aqui!
      // Por simplicidade no MVP, estamos enviando só a mensagem atual.
      // ==========================================
      const messages: any[] = [
        { role: 'user', content: textMessage }
      ]

      // Chamar a IA (dessa vez generateText em vez de streamText, pois não dá pra fazer streaming pro zap)
      const { text, toolResults } = await generateText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages: messages,
        tools: {
          fazerPedido: tool({
            description: 'Envia um pedido finalizado para a cozinha.',
            parameters: z.object({
              nomeCliente: z.string(),
              endereco: z.string(),
              formaPagamento: z.string(),
              itens: z.array(z.object({
                id: z.string(),
                quantidade: z.number(),
                preco: z.number(),
                observacao: z.string().optional()
              }))
            }),
            execute: async (params) => {
              const total = params.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)
              const res = await submitOrder({
                tenantId,
                customerName: params.nomeCliente,
                address: params.endereco,
                paymentMethod: params.formaPagamento,
                total: total,
                items: params.itens.map(i => ({ id: i.id, quantity: i.quantidade, price: i.preco, notes: i.observacao }))
              })
              if (res.success) return `Pedido ${res.orderId} enviado com sucesso!`
              return 'Erro ao enviar pedido.'
            }
          })
        }
      })

      // Analisar se houve tool call
      let finalReply = text
      if (toolResults && toolResults.length > 0) {
         // Se a IA chamou a tool e a tool retornou algo, talvez a IA já tenha gerado o text de agradecimento junto
         // ou podemos usar o resultado da tool se o text for vazio
         if (!finalReply) {
           finalReply = toolResults[0].result
         }
      }

      // Enviar Resposta de volta pro WhatsApp
      const UAZAPI_URL = (process.env.UAZAPI_URL || process.env.UAZAPI_BASE_URL)?.replace(/\/$/, '')
      const UAZAPI_KEY = process.env.UAZAPI_GLOBAL_API_KEY

      if (UAZAPI_URL && UAZAPI_KEY && finalReply) {
        await fetch(`${UAZAPI_URL}/message/sendText/${instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'admintoken': UAZAPI_KEY,
            'token': UAZAPI_KEY
          },
          body: JSON.stringify({
            number: customerPhone.replace('@s.whatsapp.net', ''),
            text: finalReply
          })
        })
      }
    }

    if (body.event === 'connection.update' || body.event === 'CONNECTION_UPDATE') {
      const instanceName = body.instance
      const state = body.data?.state || body.data?.instance?.state

      if (instanceName && state) {
        const status = state === 'open' ? 'connected' : 'disconnected'
        const supabase = await createClient()
        await supabase.from('tenants').update({ whatsapp_status: status }).eq('id', instanceName)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Webhook erro:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
