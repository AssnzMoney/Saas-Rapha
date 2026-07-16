'use client'

import { Search } from 'lucide-react'
import { useUIStore } from '@/store/ui'

export function SearchTrigger() {
  const setSearchOpen = useUIStore((state) => state.setSearchOpen)

  return (
    <div 
      onClick={() => setSearchOpen(true)}
      className="mt-4 bg-neutral-50 rounded-2xl px-4 py-3.5 flex items-center text-sm border border-neutral-100 shadow-inner group transition-all hover:bg-neutral-100 cursor-pointer"
    >
      <Search className="w-5 h-5 mr-3 text-neutral-400 group-hover:text-[var(--brand-color)] transition-colors" />
      <span className="text-neutral-400 font-medium">O que você quer pedir hoje?</span>
    </div>
  )
}
