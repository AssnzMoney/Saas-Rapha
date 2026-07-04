import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string | null
  notes?: string
}

interface CartStore {
  items: CartItem[]
  tenantId: string | null
  setTenantId: (id: string) => void
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  tenantId: null,
  setTenantId: (id) => set({ tenantId: id }),
  
  addItem: (item) => {
    const currentItems = get().items
    const existingItem = currentItems.find(i => i.id === item.id)
    
    if (existingItem) {
      set({
        items: currentItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      })
    } else {
      set({ items: [...currentItems, item] })
    }
  },
  
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(i => i.id !== itemId)
  })),
  
  updateQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map(i => 
      i.id === itemId ? { ...i, quantity } : i
    )
  })),
  
  clearCart: () => set({ items: [] }),
  
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
  
  totalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
}))
