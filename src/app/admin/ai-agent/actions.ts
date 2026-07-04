'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveAiSettings(tenantId: string, data: any) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tenants')
      .update({
        ai_prompt: data.aiPrompt
      })
      .eq('id', tenantId)

    if (error) throw error

    revalidatePath('/admin/ai-agent')
    return { success: true }
  } catch (error: any) {
    return { error: 'Erro ao salvar configurações do agente.' }
  }
}
