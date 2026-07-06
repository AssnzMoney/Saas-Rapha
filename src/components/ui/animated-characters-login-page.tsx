"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
import { Typewriter } from "@/components/ui/typewriter";
import { Eye, EyeOff, Mail, Lock, Sparkles, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { login } from "@/app/login/actions";

export function LoginPageComponent({ serverError }: { serverError?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(serverError || "");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [metricValue, setMetricValue] = useState(1250);
  const [barsHeight, setBarsHeight] = useState([40, 70, 45, 90, 65, 80, 100, 60, 85]);
  const [activeOrders, setActiveOrders] = useState(14);

  useEffect(() => {
    const chatInterval = setInterval(() => {
      setVisibleMessages(v => (v < 4 ? v + 1 : 0));
    }, 2000);

    const metricInterval = setInterval(() => {
      setMetricValue(v => v + Math.floor(Math.random() * 8));
      setActiveOrders(v => v + (Math.random() > 0.5 ? 1 : 0));
      setBarsHeight(prev => prev.map(h => Math.min(100, Math.max(20, h + (Math.random() * 30 - 15)))));
    }, 3000);

    return () => {
      clearInterval(chatInterval);
      clearInterval(metricInterval);
    };
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-red-600/90 via-red-600 to-red-500/80 p-12 text-white overflow-hidden">
        <div className="dot-pattern-light z-0" />
        <div className="relative z-20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/20 shadow-inner border border-white/10 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="size-5 text-white drop-shadow-md" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white drop-shadow-sm">Atendy<span className="text-red-200">.ai</span></span>
          </div>
        </div>

        <div className="relative z-20 flex items-center justify-center h-full pb-20 w-full max-w-lg mx-auto">
          {/* Right Side - Product Mockups from HeroSection */}
          <div className="relative w-full">
            {/* Desktop Application Window */}
            <div className="relative bg-background text-neutral-900 rounded-2xl shadow-2xl border overflow-hidden transform rotate-2 hover:rotate-1 transition-transform duration-300">
              {/* Application Header */}
              <div className="bg-muted/50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                        <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                        <path d="m14 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 max-w-md mx-6">
                    <div className="bg-background rounded-full px-4 py-2 text-sm text-muted-foreground border">
                      <Search size={14} className="inline" /> Search
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground font-bold text-xs">⭐</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Content */}
              <div className="p-6 bg-background min-h-[320px] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-primary-foreground font-bold text-sm">A</span>
                    </div>
                    <span className="font-semibold text-foreground">Dashboard Geral</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted rounded-full"></div>
                    <div className="h-6 w-6 bg-muted rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Vendas hoje", value: `R$ ${metricValue.toLocaleString('pt-BR')}`, color: "text-emerald-500" },
                    { label: "Pedidos ativos", value: activeOrders.toString(), color: "text-blue-500" },
                    { label: "Conversas IA", value: "132", color: "text-purple-500" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-muted/20 rounded-xl border border-muted/30 space-y-2 hover:bg-muted/30 transition-colors cursor-default">
                      <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                      <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex-1 bg-muted/10 rounded-xl border border-muted/30 p-4 flex flex-col gap-3">
                  <div className="h-4 w-32 bg-muted/40 rounded-full mb-2"></div>
                  <div className="flex-1 flex items-end gap-2 px-2">
                    {barsHeight.map((height, i) => (
                      <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-all duration-700 ease-in-out" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked Windows Behind */}
            <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-xl transform rotate-6 -z-10"></div>
            <div className="absolute -top-8 -left-8 w-full h-full bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl shadow-xl transform rotate-12 -z-20"></div>

            {/* Mobile App Mockup */}
            <div className="absolute -bottom-4 -right-16 md:-bottom-12 md:-right-12 w-56 h-[28rem] md:w-44 md:h-80 bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl transform -rotate-12 hover:-rotate-6 transition-transform duration-300 z-10">
              <div className="w-full h-full bg-background text-neutral-900 rounded-[2rem] overflow-hidden border flex flex-col">
                {/* Phone Header */}
                <div className="bg-muted/30 px-6 py-3 flex justify-between items-center text-xs border-b">
                  <span className="font-semibold text-foreground">9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                    <span className="text-muted-foreground font-medium">100%</span>
                  </div>
                </div>

                {/* Phone Content */}
                <div className="p-3 flex flex-col gap-3 flex-1 bg-muted/10 relative overflow-hidden">
                  <div className="flex items-center space-x-2 bg-background p-2 rounded-xl shadow-sm border mb-1">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-primary-foreground font-bold text-[10px]">A</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground leading-tight">Atendy IA</span>
                      <span className="text-[9px] text-green-500 font-medium leading-tight">Online agora</span>
                    </div>
                  </div>

                  {/* Chat Bubbles */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    {visibleMessages > 0 && (
                      <div className="self-end bg-primary text-primary-foreground text-[10px] p-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                        Queria pedir um combo de hambúrguer artesanal! 🍔
                      </div>
                    )}
                    {(visibleMessages === 1) && (
                      <div className="self-start bg-background text-foreground text-[10px] px-3 py-2.5 rounded-2xl rounded-tl-sm shadow-sm border flex gap-1 items-center h-8">
                        <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce delay-150"></div>
                      </div>
                    )}
                    {visibleMessages > 1 && (
                      <div className="self-start bg-background text-foreground text-[10px] p-2.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm border animate-in fade-in slide-in-from-bottom-2 duration-300">
                        Claro! Deseja adicionar batata frita e refrigerante por mais R$ 10?
                      </div>
                    )}
                    {visibleMessages > 2 && (
                      <div className="self-end bg-primary text-primary-foreground text-[10px] p-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                        Sim, por favor!
                      </div>
                    )}
                    {(visibleMessages === 3) && (
                      <div className="self-start bg-background text-foreground text-[10px] px-3 py-2.5 rounded-2xl rounded-tl-sm shadow-sm border flex gap-1 items-center h-8">
                        <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce delay-150"></div>
                      </div>
                    )}
                    {visibleMessages > 3 && (
                      <div className="self-start bg-background text-foreground text-[10px] p-2.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm border animate-in fade-in slide-in-from-bottom-2 duration-300">
                        Perfeito! Pedido #1459 confirmado. Fica pronto em 20 min. 🛵
                      </div>
                    )}
                  </div>
                  
                  {/* Fake input */}
                  <div className="mt-auto bg-background rounded-full p-2.5 border flex items-center gap-2 shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-muted/70"></div>
                    <div className="flex-1 h-2 bg-muted/40 rounded-full"></div>
                    <div className="w-4 h-4 rounded-full bg-primary/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-white/60">
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos</a>
          <a href="#" className="hover:text-white transition-colors">Contato</a>
        </div>

        <div className="absolute top-1/4 right-1/4 size-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-8 bg-neutral-50 relative overflow-hidden">
        <style>{`
          .card-animate { opacity: 0; transform: translateY(12px); animation: fadeUp .6s ease .25s forwards; }
          @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
          
          /* animated dot pattern */
          .dot-pattern {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-image: radial-gradient(rgba(239, 68, 68, 0.4) 1.5px, transparent 1.5px);
            background-size: 24px 24px;
            opacity: 0.6;
            animation: moveDots 30s linear infinite;
          }
          .dot-pattern-light {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-image: radial-gradient(rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px);
            background-size: 24px 24px;
            opacity: 0.8;
            animation: moveDots 30s linear infinite;
          }
          @keyframes moveDots {
            0% { background-position: 0 0; }
            100% { background-position: 24px 24px; }
          }
        `}</style>
        
        <div className="dot-pattern z-0" />

        <div className="relative z-10 w-full max-w-[420px]">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="size-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
              <Sparkles className="size-5 text-red-600" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-neutral-900">Atendy<span className="text-red-500">.ai</span></span>
          </div>

          <div className="text-center mb-10">
            <AnimatedText 
              text="Bem-vindo de volta!" 
              textClassName="text-3xl font-bold tracking-tight text-neutral-900"
              underlineClassName="text-red-500"
            />
            <p className="text-neutral-500 text-sm mt-6 flex items-center justify-center gap-1 whitespace-pre-wrap">
              <span>Acesse o painel do seu </span>
              <Typewriter
                text={[
                  "restaurante 🍔",
                  "delivery 🛵",
                  "café ☕",
                  "barzinho 🍻",
                  "food truck 🌭",
                ]}
                speed={70}
                className="text-red-600 font-medium"
                waitTime={2000}
                deleteSpeed={40}
                cursorChar={"|"}
              />
            </p>
          </div>

          <div className="card-animate bg-white border border-neutral-200 shadow-2xl shadow-black/5 rounded-xl p-6 backdrop-blur">
            <form action={async (formData) => {
               setIsLoading(true);
               setError("");
               try {
                  const res = await login(formData);
                  if (res?.error) {
                     setError(res.error);
                     setIsLoading(false);
                  }
               } catch(e: any) {
                  if (e?.message === 'NEXT_REDIRECT' || e?.digest?.includes('NEXT_REDIRECT')) {
                     throw e; // Passa o erro para o router do Next.js finalizar o redirect
                  }
                  setError(e?.message || "Erro no login")
                  setIsLoading(false);
               }
            }} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-neutral-700">E-mail da Loja</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@restaurante.com.br"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => {}}
                    onBlur={() => {}}
                    required
                    className="pl-10 h-12 bg-white border-neutral-200 focus:border-red-500 focus-visible:ring-red-500 text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-neutral-700">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-12 bg-white border-neutral-200 focus:border-red-500 focus-visible:ring-red-500 text-neutral-900 placeholder:text-neutral-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-neutral-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer text-neutral-600"
                  >
                    Lembrar de mim
                  </Label>
                </div>
                <a
                  href="#"
                  className="text-sm text-red-600 hover:text-red-500 hover:underline font-medium"
                >
                  Esqueceu a senha?
                </a>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-red-600 hover:bg-red-700 text-white mt-4 transition-all" 
                size="lg" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
