"use client";

import React, { useState, useTransition } from "react";
import { Store, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingFlowProps {
  createTenantAction: (formData: FormData) => Promise<void>;
  userName?: string;
}

export function OnboardingFlow({ createTenantAction, userName }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handleNext = () => setStep(2);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      createTenantAction(formData);
    });
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-40 mix-blend-multiply" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={cn("flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors", step === 1 ? "bg-red-500 text-white" : "bg-red-100 text-red-500")}>1</div>
          <div className="w-12 h-px bg-neutral-200"></div>
          <div className={cn("flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors", step === 2 ? "bg-red-500 text-white" : "bg-neutral-200 text-neutral-500")}>2</div>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-neutral-100 relative overflow-hidden min-h-[400px] flex flex-col">
          
          {/* STEP 1: Welcome */}
          <div className={cn("transition-all duration-500 absolute inset-0 p-8 flex flex-col items-center text-center", step === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none")}>
            <div className="bg-red-50 p-4 rounded-full mb-6">
              <Store className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
              Bem-vindo(a){userName ? `, ${userName}` : ''}!
            </h2>
            <p className="text-neutral-500 mb-8 leading-relaxed">
              Estamos muito felizes em ter você aqui. A Atendy AI vai revolucionar a forma como o seu negócio atende os clientes. Vamos configurar seu espaço?
            </p>
            
            <div className="mt-auto w-full">
              <button
                onClick={handleNext}
                className="group flex w-full items-center justify-center rounded-xl bg-neutral-900 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all"
              >
                Começar agora
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* STEP 2: Create Store */}
          <div className={cn("transition-all duration-500 absolute inset-0 p-8 flex flex-col", step === 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none")}>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
              Sua Loja
            </h2>
            <p className="text-neutral-500 mb-8 text-sm">
              Qual é o nome do seu estabelecimento? Isso será usado na sua URL e no painel.
            </p>
            
            <form className="space-y-6 flex-1 flex flex-col" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium leading-6 text-neutral-900">
                  Nome da Loja / Restaurante
                </label>
                <div className="mt-2 relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="storeName"
                    name="storeName"
                    type="text"
                    required
                    className="block w-full rounded-xl border-0 py-3 pl-10 pr-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 transition-all"
                    placeholder="Ex: Pizzaria da Nonna"
                  />
                </div>
              </div>

              <div className="mt-auto space-y-3">
                {/* Visual feedback of what they get */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-start space-x-3 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-neutral-600">
                    <span className="font-medium text-neutral-900">Painel exclusivo</span> com inteligência artificial para automatizar seus pedidos.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center rounded-xl bg-red-500 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all disabled:opacity-70"
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Criar minha loja"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm font-medium text-neutral-500 hover:text-neutral-700 py-2"
                >
                  Voltar
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
