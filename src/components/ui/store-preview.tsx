"use client";

import React from "react";
import { Store, Search, ChevronRight, Menu, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorePreviewProps {
  name: string;
  themeColor: string;
  slug: string;
  isOpen?: boolean;
  acceptsDelivery?: boolean;
  acceptsPickup?: boolean;
  logoUrl?: string;
  address?: string;
  openingHours?: string;
}

export function StorePreview({ name, themeColor, slug, isOpen = true, acceptsDelivery = true, acceptsPickup = true, logoUrl, address, openingHours }: StorePreviewProps) {
  // Use a default name if empty
  const displayName = name || "Nome da Loja";
  // A safe fallback color if invalid
  const safeColor = themeColor || "#ef4444";

  return (
    <div className="flex justify-center items-start w-full">
      {/* Phone Mockup Frame */}
      <div className="relative w-[320px] h-[650px] bg-white rounded-[2.5rem] border-[8px] border-neutral-900 shadow-xl overflow-hidden flex flex-col scale-[0.9] origin-top">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
          <div className="w-32 h-5 bg-neutral-900 rounded-b-2xl"></div>
        </div>

        {/* Dynamic Header based on theme color */}
        <div 
          className="pt-10 pb-4 px-4 text-white relative transition-colors duration-300"
          style={{ backgroundColor: safeColor }}
        >
          {/* Subtle pattern for header */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          
          <div className="relative z-10 flex items-center justify-between">
            <Menu className="w-5 h-5 opacity-80" />
            <div className="font-semibold text-lg truncate flex-1 text-center px-2 flex items-center justify-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded-full object-cover bg-white" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-white text-xs flex items-center justify-center font-bold" style={{ color: safeColor }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              {displayName}
            </div>
            <div className="w-5 h-5"></div> {/* Spacer for balance */}
          </div>
          
          <div className="relative z-10 mt-5 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center text-sm border border-white/20">
            <Search className="w-4 h-4 mr-2 opacity-70" />
            <span className="opacity-70">O que você quer pedir?</span>
          </div>
        </div>

        {/* Main Content Area (Menu) */}
        <div className="flex-1 overflow-y-auto bg-neutral-50 pb-8">
          
          {/* Store Info Banner */}
          <div className="bg-white px-4 py-3 border-b border-neutral-100 flex items-center justify-between shadow-sm">
             <div className="flex items-center text-xs text-neutral-500">
                <Clock className={cn("w-3.5 h-3.5 mr-1", isOpen ? "text-emerald-500" : "text-neutral-400")} />
                <span className={cn("font-medium", isOpen ? "text-emerald-600" : "text-neutral-500")}>
                  {isOpen ? (openingHours || "Aberto agora") : "Fechado"}
                </span>
             </div>
             {(acceptsDelivery || acceptsPickup) && (
               <div className="flex flex-col text-xs text-neutral-500">
                 <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    <span>
                      {acceptsDelivery && acceptsPickup ? "Retirada e Delivery" : acceptsDelivery ? "Somente Delivery" : "Somente Retirada"}
                    </span>
                 </div>
                 {address && (
                   <div className="mt-1 pl-4 opacity-75 truncate max-w-[140px]">
                     {address}
                   </div>
                 )}
               </div>
             )}
          </div>

          <div className="px-4 mt-6">
            <h3 className="font-bold text-neutral-800 mb-3 flex items-center justify-between">
              Destaques
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Novo</span>
            </h3>
            
            {/* Fake Item 1 */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 flex gap-3 mb-3">
              <div className="w-20 h-20 rounded-xl bg-neutral-200 shrink-0 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm leading-tight">Combo Família Especial</h4>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1">Acompanha bebida 2L e borda recheada gratuita. Perfeito para dividir.</p>
                </div>
                <div className="font-bold mt-2" style={{ color: safeColor }}>R$ 79,90</div>
              </div>
            </div>

            {/* Fake Item 2 */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 flex gap-3 mb-3">
              <div className="w-20 h-20 rounded-xl bg-neutral-200 shrink-0 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm leading-tight">Porção de Batata Rústica</h4>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1">Com cheddar, bacon crocante e molho especial da casa.</p>
                </div>
                <div className="font-bold mt-2" style={{ color: safeColor }}>R$ 35,50</div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer Navigation Fake */}
        <div className="h-14 bg-white border-t border-neutral-200 flex items-center justify-around px-4">
           <div className="flex flex-col items-center justify-center opacity-100" style={{ color: safeColor }}>
             <Store className="w-5 h-5 mb-1" />
             <span className="text-[9px] font-medium">Cardápio</span>
           </div>
           <div className="flex flex-col items-center justify-center text-neutral-400">
             <Search className="w-5 h-5 mb-1" />
             <span className="text-[9px] font-medium">Busca</span>
           </div>
           <div className="flex flex-col items-center justify-center text-neutral-400 relative">
             <ShoppingBag className="w-5 h-5 mb-1" />
             <span className="text-[9px] font-medium">Sacola</span>
           </div>
        </div>

      </div>
    </div>
  );
}

// Quick placeholder for ShoppingBag since we missed importing it at the top
import { ShoppingBag } from "lucide-react";
