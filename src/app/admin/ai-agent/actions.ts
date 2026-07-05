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

export async function checkInstanceConnection(tenantId: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('tenants').select('whatsapp_status, uazapi_instance_token').eq('id', tenantId).single()
    
    if (data?.whatsapp_status === 'connected') {
      return { connected: true }
    }

    if (data?.uazapi_instance_token) {
      const UAZAPI_URL = (process.env.UAZAPI_URL || process.env.UAZAPI_BASE_URL)?.replace(/\/$/, '')
      const res = await fetch(`${UAZAPI_URL}/instance/status`, {
        headers: { 'token': data.uazapi_instance_token }
      })
      const body = await res.json()
      
      if (body?.data?.state === 'open' || body?.data?.status === 'connected') {
        await supabase.from('tenants').update({ whatsapp_status: 'connected' }).eq('id', tenantId)
        return { connected: true }
      }
    }

    return { connected: false }
  } catch(e) {
    return { connected: false }
  }
}

export async function setWhatsAppStatus(tenantId: string, status: 'connected' | 'disconnected') {
  try {
    const supabase = await createClient()
    await supabase.from('tenants').update({ whatsapp_status: status }).eq('id', tenantId)
    revalidatePath('/admin/ai-agent')
    return { success: true }
  } catch(e) {
    return { success: false }
  }
}
