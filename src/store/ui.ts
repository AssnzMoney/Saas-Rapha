import { create } from 'zustand'

interface UIStore {
  isSearchOpen: boolean
  setSearchOpen: (isOpen: boolean) => void
  isMenuOpen: boolean
  setMenuOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isSearchOpen: false,
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  isMenuOpen: false,
  setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
}))
