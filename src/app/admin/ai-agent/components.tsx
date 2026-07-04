'use client'

import { useState } from 'react'
import { saveAiSettings } from './actions'
import { Bot, Save, MessageSquare, Smartphone, PlayCircle, QrCode, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { useChat } from '@ai-sdk/react'

export function AiAgentClient({ tenant }: { tenant: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [aiPrompt, setAiPrompt] = useState(tenant.ai_prompt || '')
  
  const [wpStatus, setWpStatus] = useState(tenant.whatsapp_status || 'disconnected')
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Vercel AI SDK - Gerencia o chat todo automaticamente!
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    body: {
      tenantId: tenant.id
    },
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Olá! Sou o seu robô simulado. Diga um "oi" para testar minha conexão com seu cardápio.' }
    ]
  })

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    const res = await saveAiSettings(tenant.id, { aiPrompt })
    setLoading(false)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert(res.error)
    }
  }

  const handleConnectWhatsApp = () => {
    setWpStatus('connecting')
    // Simular chamada a UAZAPI para pegar QRCode
    setTimeout(() => {
      // Mock de QR Code
      setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MockQRCodeDataParaWhatsApp')
    }, 1500)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: chatInput }])
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Em breve o cérebro da OpenAI estará plugado aqui para responder isso usando seu cardápio! 🧠' }])
    }, 1000)
    
    setChatInput('')
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Configurações do Robô (IA)</h1>
        <p className="text-neutral-500 mt-1">Conecte o WhatsApp e configure o comportamento do seu atendente virtual.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo: Configurações */}
        <div className="space-y-6">
          
          {/* Conexão WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Smartphone className="w-5 h-5" /></div>
                <h3 className="font-bold text-lg">Conexão WhatsApp</h3>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium px-3 py-1 rounded-full ${wpStatus === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {wpStatus === 'connected' ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
                {wpStatus === 'connected' ? 'Conectado' : 'Desconectado'}
              </div>
            </div>

            {wpStatus === 'disconnected' && !qrCodeUrl && (
              <div className="text-center py-6">
                <p className="text-neutral-500 text-sm mb-4">Seu robô ainda não está no WhatsApp. Clique abaixo para gerar o QR Code e escanear com seu celular.</p>
                <button onClick={handleConnectWhatsApp} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors inline-flex items-center">
                  <QrCode className="w-5 h-5 mr-2" /> Gerar QR Code
                </button>
              </div>
            )}

            {wpStatus === 'connecting' && qrCodeUrl && (
              <div className="text-center py-4 flex flex-col items-center">
                <div className="p-2 bg-white border border-neutral-200 shadow-sm rounded-xl inline-block mb-4">
                  <img src={qrCodeUrl} alt="QR Code WhatsApp" className="w-48 h-48" />
                </div>
                <p className="text-sm font-medium text-neutral-900 animate-pulse">Aguardando leitura do QR Code...</p>
                <p className="text-xs text-neutral-500 mt-1">Abra o WhatsApp {'>'} Aparelhos Conectados {'>'} Conectar um aparelho</p>
                <button onClick={() => { setQrCodeUrl(null); setWpStatus('disconnected') }} className="mt-4 text-sm text-red-500 font-medium">Cancelar</button>
              </div>
            )}
            
            {wpStatus === 'connected' && (
              <div className="text-center py-6">
                <p className="text-neutral-900 font-medium mb-1">WhatsApp Operacional 🚀</p>
                <p className="text-sm text-neutral-500 mb-4">O robô já está pronto para receber mensagens.</p>
                <button onClick={() => setWpStatus('disconnected')} className="text-red-500 text-sm font-medium hover:underline">Desconectar Aparelho</button>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">

            <div className="pt-6 border-t border-neutral-100 flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Bot className="w-5 h-5" /></div>
              <h3 className="font-bold text-lg">Comportamento (Prompt)</h3>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500 mb-2">Diga como o robô deve se comportar. Ele usará isso junto com o seu cardápio do banco de dados.</p>
              <textarea 
                required 
                rows={10} 
                value={aiPrompt} 
                onChange={e => setAiPrompt(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-red-500 focus:ring-red-500" 
              />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-neutral-900 text-white px-4 py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Salvando...' : success ? 'Salvo com Sucesso!' : 'Salvar Configurações'}</span>
            </button>
          </form>
        </div>

        {/* Lado Direito: Simulador de Chat */}
        <div>
          <div className="bg-neutral-100 rounded-3xl p-4 shadow-inner border border-neutral-200 h-[600px] flex flex-col relative overflow-hidden">
            {/* Header do Celular */}
            <div className="bg-emerald-500 text-white rounded-2xl p-4 flex items-center space-x-3 shadow-md mb-4 z-10">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Robô Teste</h4>
                <p className="text-xs text-emerald-100">Simulador de WhatsApp</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 mb-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-900' : 'bg-white text-neutral-900 shadow-sm border border-neutral-100'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    
                    {/* Exibir quando o robô chama uma função (fazerPedido) */}
                    {msg.toolInvocations?.map((toolCall: any) => (
                      <div key={toolCall.toolCallId} className="mt-2 text-xs bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-200">
                        <span className="font-bold flex items-center"><Bot className="w-3 h-3 mr-1"/> Ferramenta: {toolCall.toolName}</span>
                        {toolCall.state === 'result' ? (
                          <span className="text-emerald-600 block mt-1">✓ {toolCall.result?.message || 'Sucesso'}</span>
                        ) : (
                          <span className="text-emerald-500 animate-pulse block mt-1">Executando...</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-neutral-900 shadow-sm border border-neutral-100 rounded-2xl px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-2 flex items-center space-x-2 shadow-sm z-10 border border-neutral-200">
              <input 
                type="text" 
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Mande uma mensagem..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2" 
              />
              <button type="submit" disabled={isLoading} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50">
                <PlayCircle className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
