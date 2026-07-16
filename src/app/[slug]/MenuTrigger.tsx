'use client'

import { Menu } from 'lucide-react'
import { useUIStore } from '@/store/ui'

export function MenuTrigger() {
  const setMenuOpen = useUIStore((state) => state.setMenuOpen)

  return (
    <button 
      onClick={() => setMenuOpen(true)}
      className="p-2 -ml-2 rounded-full hover:bg-neutral-50 text-neutral-600 transition-colors"
    >
      <Menu className="w-6 h-6" />
    </button>
  )
}
