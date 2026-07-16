'use client'

import { Search } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export function SearchTrigger() {
  const { openSearch } = useCartStore()
  return (
    <div 
      onClick={openSearch} 
      className="cursor-pointer relative z-10 mt-5 bg-white/10 backdrop-blur-md rounded-full px-4 py-3 flex items-center text-sm border border-white/20 hover:bg-white/20 transition-colors"
    >
      <Search className="w-5 h-5 mr-3 opacity-70" />
      <span className="opacity-70">O que você quer pedir?</span>
    </div>
  )
}
