'use client'

import { useState } from 'react'
import { createCategory, createMenuItem, deleteCategory, deleteMenuItem } from './actions'
import { Plus, Trash2, Tag, X } from 'lucide-react'

export function CategoryModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createCategory(formData)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-bold text-neutral-900">Nova Categoria</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nome da Categoria</label>
            <input name="name" type="text" required placeholder="Ex: Bebidas, Pizzas, Sobremesas" 
                   className="w-full rounded-xl bg-white text-neutral-900 border-neutral-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-2.5 px-3 border" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading} 
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ItemModal({ categoryId, onClose }: { categoryId: string, onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('category_id', categoryId)
    await createMenuItem(formData)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-bold text-neutral-900">Novo Produto</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nome do Produto</label>
            <input name="name" type="text" required placeholder="Ex: Pizza Margherita" 
                   className="w-full rounded-xl bg-white text-neutral-900 border-neutral-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-2.5 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
            <textarea name="description" rows={3} placeholder="Ingredientes e detalhes..." 
                   className="w-full rounded-xl bg-white text-neutral-900 border-neutral-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-2.5 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Foto do Produto (Opcional)</label>
            <input name="image" type="file" accept="image/*" 
                   className="w-full rounded-xl bg-white text-neutral-900 border-neutral-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-2 px-3 border file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Preço (R$)</label>
            <input name="price" type="number" step="0.01" required placeholder="0.00" 
                   className="w-full rounded-xl bg-white text-neutral-900 border-neutral-300 shadow-sm focus:border-red-500 focus:ring-red-500 py-2.5 px-3 border" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading} 
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl disabled:opacity-50">
              {loading ? 'Salvando...' : 'Adicionar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Client wrapper to manage state
export function MenuManager({ categories, items }: { categories: any[], items: any[] }) {
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [itemModalCategory, setItemModalCategory] = useState<string | null>(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Cardápio</h1>
          <p className="text-neutral-500 mt-1">Gerencie os produtos que serão mostrados no WhatsApp e no Site.</p>
        </div>
        <button 
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Categoria
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 border-dashed rounded-2xl">
          <Tag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900">Seu cardápio está vazio</h3>
          <p className="text-neutral-500 mt-1 mb-6">Comece criando categorias como "Pizzas", "Bebidas".</p>
          <button onClick={() => setShowCategoryModal(true)} className="text-red-600 font-medium hover:text-red-700">
            + Adicionar primeira categoria
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catItems = items.filter(i => i.category_id === cat.id)
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between border-b border-neutral-200">
                  <h2 className="font-bold text-lg text-neutral-900">{cat.name}</h2>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setItemModalCategory(cat.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Produto
                    </button>
                    <button onClick={async () => await deleteCategory(cat.id)} className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-0">
                  {catItems.length === 0 ? (
                    <div className="px-6 py-8 text-center text-sm text-neutral-400">
                      Nenhum produto nesta categoria.
                    </div>
                  ) : (
                    <ul className="divide-y divide-neutral-100">
                      {catItems.map((item) => (
                        <li key={item.id} className="px-6 py-4 hover:bg-neutral-50/50 flex items-start justify-between group">
                          <div className="flex items-start">
                            {item.image_url && (
                              <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover mr-4 border border-neutral-100 shadow-sm" />
                            )}
                            <div>
                              <h4 className="font-medium text-neutral-900">{item.name}</h4>
                              {item.description && <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{item.description}</p>}
                              <p className="text-red-600 font-medium mt-2">
                                R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={async () => await deleteMenuItem(item.id)}
                            className="text-neutral-300 hover:text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCategoryModal && <CategoryModal onClose={() => setShowCategoryModal(false)} />}
      {itemModalCategory && <ItemModal categoryId={itemModalCategory} onClose={() => setItemModalCategory(null)} />}
    </div>
  )
}
