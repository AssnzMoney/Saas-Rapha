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
  
  if (categories && categories.length > 0 && items && items.length > 0) {
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
    menuText += '⚠️ ATENÇÃO: O cardápio está VAZIO no momento. Informe educadamente ao cliente que o restaurante ainda está configurando o sistema e não há produtos disponíveis para venda agora.\n'
  }

  const promptCustom = tenant.ai_prompt ? `\nINSTRUÇÕES DO RESTAURANTE:\n${tenant.ai_prompt}\n` : ''

  // 4. Montar o Prompt Final
  const finalPrompt = `
Você é o atendente virtual do restaurante "${tenant.name}".
${promptCustom}
${menuText}

REGRAS CRÍTICAS:
- Você é estritamente proibido de inventar itens, categorias, produtos ou preços que não estejam explicitamente listados no cardápio acima.
- NUNCA sugira pratos genéricos (ex: pizza, hambúrguer, salada) se eles não estiverem no cardápio fornecido.
- Se o cardápio estiver vazio, não tente vender nada.
- Sempre calcule o valor total corretamente somando o preço exato fornecido na lista.
- Quando o cliente quiser finalizar, chame a ferramenta "fazerPedido" passando a lista de produtos (ID e quantidade), o nome do cliente, endereço e forma de pagamento.
- Se o endereço ou pagamento faltar, PERGUNTE antes de chamar a função.
`

  return finalPrompt
}
