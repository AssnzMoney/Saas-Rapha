"use client"

import React from 'react'
import { ArrowUpRight } from 'lucide-react'

const recentCustomers = [
  {
    id: 1,
    name: 'Carlos Oliveira',
    email: '+55 (11) 98765-4321',
    amount: 'R$ 84,50',
    status: 'Finalizado',
    items: '2x X-Burguer, 1x Coca',
    time: 'agora mesmo',
    initials: 'CO',
    color: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 2,
    name: 'Ana Silva',
    email: '+55 (11) 91234-5678',
    amount: 'R$ 132,00',
    status: 'Preparando',
    items: 'Combo Família + Sobremesa',
    time: 'há 5 min',
    initials: 'AS',
    color: 'bg-amber-100 text-amber-700'
  },
  {
    id: 3,
    name: 'Marcos Paulo',
    email: '+55 (21) 99999-1111',
    amount: 'R$ 45,90',
    status: 'Finalizado',
    items: '1x Pizza Calabresa P',
    time: 'há 12 min',
    initials: 'MP',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 4,
    name: 'Juliana Costa',
    email: '+55 (11) 97777-2222',
    amount: 'R$ 210,00',
    status: 'Entregue',
    items: '4x Hambúrgueres Artesanais...',
    time: 'há 28 min',
    initials: 'JC',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 5,
    name: 'Roberto Dias',
    email: '+55 (31) 98888-3333',
    amount: 'R$ 67,20',
    status: 'Entregue',
    items: '1x Yakisoba Misto, 1x Suco',
    time: 'há 1 hora',
    initials: 'RD',
    color: 'bg-red-100 text-red-700'
  }
];

export function RecentCustomers() {
  return (
    <div className="flex flex-col gap-5">
      {recentCustomers.map((customer) => (
        <div key={customer.id} className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 font-bold text-sm shrink-0">
              {customer.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{customer.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{customer.items}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 justify-end">
              {customer.amount}
              <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-red-500 transition-colors" />
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {customer.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
