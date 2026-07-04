import { createClient } from '@/lib/supabase/server'

export async function buildSystemPrompt(tenantId: string) {
  const supabase = await createClient()

  // 1. Buscar configurações do tenant (incluindo o prompt customizado)
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, ai_prompt')
    .eq('id', tenantId)
    .single()

  if (!tenant) throw new Error('Loja não encontrada')

  // 2. Buscar cardápio
  const { data: items } = await supabase
    .from('menu_items')
    .select('id, name, description, price, is_available, category_id')
    .eq('tenant_id', tenantId)
    .eq('is_available', true)

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('id, name')
    .eq('tenant_id', tenantId)

  // 3. Montar o texto do cardápio para a IA entender
  let menuText = '=== CARDÁPIO ===\n\n'
  
  if (categories && items) {
    categories.forEach(cat => {
      menuText += `Categoria: ${cat.name}\n`
      const catItems = items.filter(i => i.category_id === cat.id)
      catItems.forEach(item => {
        menuText += `- ID: ${item.id} | Nome: ${item.name} | Preço: R$ ${item.price.toFixed(2)}\n`
        if (item.description) menuText += `  Descrição: ${item.description}\n`
      })
      menuText += '\n'
    })
  } else {
    menuText += 'Cardápio vazio no momento.\n'
  }

  // 4. Montar o Prompt Final
  const finalPrompt = `
Você é o atendente virtual do restaurante "${tenant.name}".

INSTRUÇÕES DO RESTAURANTE:
${tenant.ai_prompt}

${menuText}

REGRAS CRÍTICAS:
- NUNCA invente itens ou preços que não estão no cardápio acima.
- Sempre calcule o valor total corretamente.
- Quando o cliente quiser finalizar, chame a ferramenta "fazerPedido" passando a lista de produtos (ID e quantidade), o nome do cliente, endereço e forma de pagamento.
- Se o endereço ou pagamento faltar, PERGUNTE antes de chamar a função.
`

  return finalPrompt
}
