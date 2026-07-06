'use client'

import { useState, useEffect } from 'react'
import { saveAiSettings, checkInstanceConnection } from './actions'
import { Bot, Save, Smartphone, QrCode, Wifi, WifiOff, Loader2, CheckCircle2, Send, Paperclip, MoreVertical, Search, Check, CheckCheck, Brain, MessageSquare } from 'lucide-react'
import { BannerGuide } from '@/components/ui/banner-guide'

export function AiAgentClient({ tenant }: { tenant: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [aiPrompt, setAiPrompt] = useState(tenant.ai_prompt || '')
  
  const [wpStatus, setWpStatus] = useState(tenant.whatsapp_status || 'disconnected')
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Efeito de Polling: Fica checando de 3 em 3 segundos se conectou!
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (wpStatus === 'connecting' && qrCodeUrl) {
      interval = setInterval(async () => {
        const status = await checkInstanceConnection(tenant.id)
        if (status.connected) {
          setWpStatus('connected')
          setQrCodeUrl(null)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [wpStatus, qrCodeUrl, tenant.id])

  const [localInput, setLocalInput] = useState('')
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'assistant', content: 'Olá! Sou o seu robô simulado.\n\nDiga um "oi" para testar minha conexão com seu cardápio.' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    const userMessage = { id: Date.now().toString(), role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setLocalInput('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          tenantId: tenant.id
        })
      });

      if (!response.ok) throw new Error('Erro na API');
      if (!response.body) throw new Error('Sem corpo na resposta');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      
      const assistantMessageId = (Date.now() + 1).toString();
      
      // Adiciona mensagem vazia do assistente
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        assistantContent += decoder.decode(value, { stream: true });
        
        // Atualiza a mensagem do assistente conforme o streaming chega
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: assistantContent }
            : msg
        ));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Ocorreu um erro ao comunicar com a inteligência artificial.' }]);
    } finally {
      setIsLoading(false);
    }
  }

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

  const handleConnectWhatsApp = async () => {
    setWpStatus('connecting')
    try {
      const res = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: tenant.id })
      })
      const data = await res.json()
      
      if (data.qrcode && typeof data.qrcode === 'string') {
        const qrImage = data.qrcode.startsWith('data:image') ? data.qrcode : `data:image/png;base64,${data.qrcode}`
        setQrCodeUrl(qrImage)
      } else {
        alert(data.message || data.error || 'Erro ao gerar QR Code: ' + JSON.stringify(data))
        setWpStatus('disconnected')
      }
    } catch (error) {
      console.error(error)
      alert('Erro na conexão com UAZAPI.')
      setWpStatus('disconnected')
    }
  }

  const steps = [
    {
      title: "Seu Atendente Inteligente",
      description: "O Robô (IA) lê automaticamente o seu cardápio e conversa com seus clientes como se fosse um garçom humano.",
      icon: <Brain className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Comportamento (Prompt)",
      description: "Diga como o robô deve se comportar. Se ele deve ser amigável, se aceita apenas PIX, e como finalizar os pedidos.",
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Conexão WhatsApp",
      description: "Conecte o número do seu restaurante lendo o QR Code para que o robô assuma o atendimento 24 horas por dia.",
      icon: <Smartphone className="w-8 h-8 text-emerald-500" />
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <BannerGuide 
        steps={steps}
        compactTitle="Configurações do Robô (IA)"
        compactDescription="Conecte o WhatsApp e configure o comportamento do seu atendente virtual."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo: Configurações */}
        <div className="space-y-6">
          
          {/* Conexão WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Smartphone className="w-5 h-5" /></div>
                <h3 className="font-bold text-lg">Conexão WhatsApp</h3>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium px-3 py-1 rounded-full transition-colors duration-500 ${wpStatus === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {wpStatus === 'connected' ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
                {wpStatus === 'connected' ? 'Conectado' : 'Desconectado'}
              </div>
            </div>

            {wpStatus === 'disconnected' && !qrCodeUrl && (
              <div className="text-center py-4 animate-in fade-in duration-500">
                <p className="text-neutral-500 text-sm mb-4">Seu robô ainda não está no WhatsApp.</p>
                
                <div className="text-left mt-2 mb-6 text-sm text-neutral-500 space-y-2 bg-neutral-50 p-4 rounded-xl border border-neutral-100 transition-all hover:border-emerald-200">
                  <p className="font-semibold text-neutral-800">Siga os passos para conectar:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Clique no botão verde <strong>"Gerar QR Code"</strong> abaixo.</li>
                    <li>Abra o WhatsApp no celular do restaurante.</li>
                    <li>Vá em <strong>Aparelhos Conectados</strong> e aponte a câmera.</li>
                  </ol>
                </div>

                <button onClick={handleConnectWhatsApp} className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all inline-flex items-center shadow-sm">
                  <QrCode className="w-5 h-5 mr-2" /> Gerar QR Code
                </button>
              </div>
            )}

            {wpStatus === 'connecting' && qrCodeUrl && (
              <div className="text-center py-8 flex flex-col items-center animate-in fade-in duration-500">
                <div className="p-4 bg-white/60 backdrop-blur-2xl border border-neutral-200/50 shadow-[0_8px_40px_rgb(0,0,0,0.04)] rounded-3xl inline-block mb-6 transition-all duration-700 ease-out">
                  <img src={qrCodeUrl} alt="QR Code WhatsApp" className="w-48 h-48 opacity-90 mix-blend-multiply" />
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium text-neutral-600 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                  <span>Aguardando conexão...</span>
                </div>
                <p className="text-xs text-neutral-400 mb-6">Aponte o WhatsApp do celular para a tela.</p>

                <button onClick={() => { setQrCodeUrl(null); setWpStatus('disconnected') }} className="px-5 py-2 text-xs rounded-full bg-neutral-100 text-neutral-500 font-medium hover:bg-neutral-200 transition-colors">
                  Cancelar Operação
                </button>
              </div>
            )}
            
            {wpStatus === 'connected' && (
              <div className="text-center py-8 animate-in zoom-in duration-500">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
                <p className="text-neutral-900 font-bold text-lg mb-1">WhatsApp Operacional 🚀</p>
                <p className="text-sm text-neutral-500 mb-6">O robô está online e pronto para vender 24 horas por dia.</p>
                <button 
                  onClick={async () => {
                    setWpStatus('disconnected')
                    await import('./actions').then(m => m.setWhatsAppStatus(tenant.id, 'disconnected'))
                  }} 
                  className="px-4 py-2 bg-neutral-100 text-neutral-500 text-xs rounded-lg font-medium hover:bg-neutral-200 transition-colors"
                >
                  Desconectar Aparelho
                </button>
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

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors">
              <Save className="w-5 h-5" />
              <span>{loading ? 'Salvando...' : success ? 'Salvo com Sucesso!' : 'Salvar Configurações'}</span>
            </button>
          </form>
        </div>

        {/* Lado Direito: Simulador de Chat WhatsApp Style */}
        <div>
          <div className="bg-[#EFEAE2] rounded-3xl shadow-lg border border-neutral-200 h-[650px] flex flex-col relative overflow-hidden ring-4 ring-neutral-100">
            {/* Header do WhatsApp */}
            <div className="bg-[#00A884] text-white px-4 py-3 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold leading-tight">Seu Restaurante</h4>
                  <p className="text-[11px] text-white/80">Atendente Virtual (bot)</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-white/90">
                <Search className="w-5 h-5" />
                <MoreVertical className="w-5 h-5" />
              </div>
            </div>

            {/* Fundo com pattern sutil */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/az-subtle.png")' }}></div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10 scrollbar-hide">
              <div className="flex justify-center mb-6">
                <span className="bg-neutral-200/60 text-neutral-600 text-[11px] px-3 py-1 rounded-lg uppercase tracking-wider font-medium">Hoje</span>
              </div>
              
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user'
                return (
                  <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isUser ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-none' : 'bg-white text-[#111B21] rounded-tl-none'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      
                      {/* Exibir quando o robô chama uma função (fazerPedido) */}
                      {msg.toolInvocations?.map((toolCall: any) => (
                        <div key={toolCall.toolCallId} className="mt-2 text-[11px] bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-100 flex items-start gap-2">
                          <Bot className="w-4 h-4 shrink-0 mt-0.5"/>
                          <div>
                            <strong className="block mb-0.5">Enviando pedido à cozinha...</strong>
                            {toolCall.state === 'result' ? (
                              <span className="text-emerald-600">✓ Concluído</span>
                            ) : (
                              <span className="text-emerald-500 animate-pulse">Processando...</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Footer da mensagem (hora e check) */}
                      <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                        <span className="text-[10px]">agora</span>
                        {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area WhatsApp Style */}
            <form onSubmit={(e) => {
               e.preventDefault();
               sendMessage(localInput);
            }} className="bg-[#F0F2F5] px-4 py-3 flex items-end space-x-2 z-10">
              <button type="button" className="p-2 text-neutral-500 hover:text-neutral-700 shrink-0 mb-1">
                <Paperclip className="w-6 h-6" />
              </button>
              
              <div className="flex-1 bg-white rounded-2xl flex items-center px-4 py-1.5 min-h-[44px] shadow-sm">
                <input 
                  type="text" 
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="Mensagem" 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] p-0 text-neutral-800 placeholder-neutral-400 h-auto" 
                  autoComplete="off"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading || !localInput.trim()} 
                className={`w-12 h-12 flex items-center justify-center rounded-full shrink-0 transition-colors ${localInput.trim() ? 'bg-[#00A884] text-white hover:bg-[#008f6f]' : 'bg-transparent text-neutral-500'}`}
              >
                {localInput.trim() ? <Send className="w-5 h-5 ml-1" /> : <Bot className="w-6 h-6" />}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
