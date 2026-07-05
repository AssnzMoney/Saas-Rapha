"use client";

import * as React from "react";
import { useRef, useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Eye, EyeOff, Github, Chrome, Mail, Lock, User, ArrowRight,
} from "lucide-react";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";

interface TabAuthSectionProps {
  serverError?: string;
  onLogin: (formData: FormData) => Promise<void>;
  onSignup: (formData: FormData) => Promise<void>;
}

export function TabAuthSection({ serverError, onLogin, onSignup }: TabAuthSectionProps) {
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [error, setError] = useState(serverError || "");
  const [isLoading, setIsLoading] = useState(false);

  // subtle monochrome particles (optional)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Use parent container dimensions instead of window to stay contained
    const setSize = () => { 
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth; 
            canvas.height = canvas.parentElement.clientHeight; 
        }
    };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;

    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { setSize(); init(); };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);
  
  const handleLoginSubmit = async (formData: FormData) => {
     setIsLoading(true);
     setError("");
     try {
        await onLogin(formData);
     } catch(e: any) {
        setError(e.message || "Erro no login");
     } finally {
        setIsLoading(false);
     }
  }
  
  const handleSignupSubmit = async (formData: FormData) => {
     setIsLoading(true);
     setError("");
     try {
        await onSignup(formData);
     } catch(e: any) {
        setError(e.message || "Erro no cadastro");
     } finally {
        setIsLoading(false);
     }
  }

  return (
    <section className="relative h-full w-full bg-zinc-950 text-zinc-50 overflow-hidden flex flex-col justify-center">
      <style>{`
        /* card fade-up on mount */
        .card-animate { opacity: 0; transform: translateY(12px); animation: fadeUp .6s ease .25s forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        /* accent lines */
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .6s ease forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .7s ease forwards}
        .hline:nth-child(1){top:18%;animation-delay:.08s}
        .hline:nth-child(2){top:50%;animation-delay:.16s}
        .hline:nth-child(3){top:82%;animation-delay:.24s}
        .vline:nth-child(4){left:22%;animation-delay:.20s}
        .vline:nth-child(5){left:50%;animation-delay:.28s}
        .vline:nth-child(6){left:78%;animation-delay:.36s}
        @keyframes drawX{to{transform:scaleX(1)}}
        @keyframes drawY{to{transform:scaleY(1)}}

        /* --- SIMPLE BLUR SWITCH --- */
        /* Обёртка, чтобы высота карточки не прыгала; подстрой по контенту */
        .tab-shell{ position:relative; min-height: 420px; }

        /* Панели держим смонтированными, переключаем состояниями.
           Неактивная: абсолютная, невидимая, блюр + отключены события.
           Активная: обычная, плавное проявление. */
        .tab-panel{
          transition: opacity .22s ease, filter .22s ease;
        }
        .tab-panel[data-state="inactive"]{
          position:absolute; inset:0;
          opacity:0; filter: blur(8px);
          pointer-events:none;
        }
        .tab-panel[data-state="active"]{
          position:relative;
          opacity:1; filter: blur(0px);
        }

        /* tabs UI tweaks */
        .auth-tabs [role="tablist"] {
          background: #0f0f10; border: 1px solid #27272a; border-radius: 10px; padding: 4px;
        }
        .auth-tabs [role="tab"] {
          font-size: 13px; letter-spacing: .02em;
        }
        .auth-tabs [role="tab"][data-state="active"] {
          background: #111113; border-radius: 8px; box-shadow: inset 0 0 0 1px #27272a;
        }
      `}</style>

      {/* particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none z-0" />

      {/* accent lines */}
      <div className="accent-lines z-0">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      {/* header */}
      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 z-10">
        <span className="text-xs tracking-[0.14em] uppercase text-zinc-400">Atendy AI</span>
        <Button variant="outline" className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80">
          <span className="mr-2">Contato</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </header>

      {/* centered card with tabs */}
      <div className="relative z-10 w-full grid place-items-center px-4 py-20 overflow-y-auto">
        <div className="text-center mb-8">
            <AnimatedText 
              text="Bem-vindo de volta!" 
              textClassName="text-3xl font-bold tracking-tight text-zinc-50"
              underlineClassName="text-red-500"
            />
            <p className="text-zinc-400 text-sm mt-6">Acesse o painel do seu restaurante</p>
        </div>
        
        <Card className="card-animate w-full max-w-md border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 shadow-2xl">
          <CardContent className="pt-6">
            <Tabs defaultValue="login" className="auth-tabs w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>

              {/* shell удерживает высоту; панели поверх друг друга */}
              <div className="tab-shell mt-6">
                {/* LOGIN */}
                <TabsContent value="login" forceMount className="tab-panel space-y-5">
                  <form action={handleLoginSubmit} className="space-y-5">
                      <div className="grid gap-2">
                        <Label htmlFor="login-email" className="text-zinc-300">Email da Loja</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="login-email"
                            name="email"
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="seu@restaurante.com.br"
                            required
                            className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-red-500"
                          />
                        </div>
                      </div>
    
                      <div className="grid gap-2">
                        <Label htmlFor="login-password" className="text-zinc-300">Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="login-password"
                            name="password"
                            type={showLoginPw ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-red-500"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                            onClick={() => setShowLoginPw((v) => !v)}
                            aria-label={showLoginPw ? "Ocultar senha" : "Ver senha"}
                          >
                            {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
    
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox id="remember" className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900" />
                          <Label htmlFor="remember" className="text-zinc-400 font-normal cursor-pointer">Lembrar de mim</Label>
                        </div>
                        <a href="#" className="text-sm text-zinc-300 hover:text-zinc-100">Esqueceu a senha?</a>
                      </div>
                      
                      {error && (
                          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                            {error}
                          </div>
                      )}
    
                      <Button type="submit" disabled={isLoading} className="w-full h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white border-0 transition-colors">
                        {isLoading ? "Entrando..." : "Entrar"}
                      </Button>
                  </form>
                </TabsContent>

                {/* SIGN UP */}
                <TabsContent value="signup" forceMount className="tab-panel space-y-5">
                  <form action={handleSignupSubmit} className="space-y-5">
                      <div className="grid gap-2">
                        <Label htmlFor="signup-email" className="text-zinc-300">Email da Loja</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="seu@restaurante.com.br"
                            required
                            className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-red-500"
                          />
                        </div>
                      </div>
    
                      <div className="grid gap-2">
                        <Label htmlFor="signup-password" className="text-zinc-300">Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                          <Input
                            id="signup-password"
                            name="password"
                            type={showSignupPw ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-red-500"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                            onClick={() => setShowSignupPw((v) => !v)}
                            aria-label={showSignupPw ? "Ocultar senha" : "Ver senha"}
                          >
                            {showSignupPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
    
                      <div className="flex items-center gap-2">
                        <Checkbox id="terms" required className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900" />
                        <Label htmlFor="terms" className="text-zinc-400 text-sm font-normal cursor-pointer">Eu concordo com os Termos & Privacidade</Label>
                      </div>
                      
                      {error && (
                          <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                            {error}
                          </div>
                      )}
    
                      <Button type="submit" disabled={isLoading} className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
                        {isLoading ? "Criando conta..." : "Criar Conta"}
                      </Button>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm text-zinc-500 pb-6 pt-0">
            Precisa de ajuda? <a className="ml-1 text-zinc-300 hover:underline" href="#">Fale com o suporte</a>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
