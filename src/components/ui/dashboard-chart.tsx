"use client"

import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useTheme } from 'next-themes';

const data = [
  { name: 'Seg', faturamento: 1250, pedidos: 34 },
  { name: 'Ter', faturamento: 1100, pedidos: 28 },
  { name: 'Qua', faturamento: 1400, pedidos: 42 },
  { name: 'Qui', faturamento: 1350, pedidos: 39 },
  { name: 'Sex', faturamento: 2800, pedidos: 85 },
  { name: 'Sáb', faturamento: 3400, pedidos: 110 },
  { name: 'Dom', faturamento: 2900, pedidos: 92 },
];

export function DashboardChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="w-full h-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#262626' : '#e5e5e5'} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#737373', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#737373', fontSize: 12 }}
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: isDark ? '1px solid #262626' : 'none', 
              backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
              color: isDark ? '#f5f5f5' : '#000000',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value: number) => [`R$ ${value}`, 'Faturamento']}
          />
          <Area 
            type="monotone" 
            dataKey="faturamento" 
            stroke="#dc2626" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorFaturamento)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
