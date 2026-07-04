import { createOpenAI } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { buildSystemPrompt } from '@/lib/ai/agent'
import { submitOrder } from '@/app/[slug]/actions' // Vamos reaproveitar a action do cardápio público!

// Definimos a rota com maxDuration maior caso a IA demore
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, tenantId } = await req.json()
    
    // Configurar OpenAI com a chave global (que você colocou no .env.local)
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })

    // Construir o Prompt com o Cardápio
    const systemPrompt = await buildSystemPrompt(tenantId)

    const result = await streamText({
      model: openai('gpt-4o-mini'), // Usamos um modelo rápido e barato
      system: systemPrompt,
      messages,
      tools: {
        fazerPedido: tool({
          description: 'Envia um pedido finalizado para a cozinha.',
          parameters: z.object({
            nomeCliente: z.string().describe('Nome do cliente'),
            endereco: z.string().describe('Endereço completo de entrega ou "Retirada"'),
            formaPagamento: z.string().describe('Forma de pagamento (PIX, Cartão, Dinheiro)'),
            itens: z.array(z.object({
              id: z.string().describe('O ID do produto no cardápio'),
              quantidade: z.number().describe('Quantidade pedida'),
              preco: z.number().describe('Preço unitário do produto'),
              observacao: z.string().optional().describe('Observações (ex: sem cebola)')
            })).describe('Lista de itens pedidos')
          }),
          execute: async (params) => {
            // Calcular total
            const total = params.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)
            
            // Reutilizar a função que já criamos para o cardápio público!
            const res = await submitOrder({
              tenantId,
              customerName: params.nomeCliente,
              address: params.endereco,
              paymentMethod: params.formaPagamento,
              total: total,
              items: params.itens.map(i => ({
                id: i.id,
                quantity: i.quantidade,
                price: i.preco,
                notes: i.observacao
              }))
            })
            
            if (res.success) {
              return { success: true, message: `Pedido ${res.orderId} enviado para a cozinha com sucesso!` }
            } else {
              return { success: false, message: 'Erro ao enviar pedido.' }
            }
          }
        })
      }
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
