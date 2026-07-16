"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  Hash,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Inbox,
  Calendar,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Terminal,
  Blocks,
  Command,
  X
} from 'lucide-react';

export type NavItemData = {
  id: string;
  href: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

const mockNavGroups: NavGroupData[] = [
  {
    items: [
      { id: 'search', href: '#', title: 'Search', icon: Search, shortcut: '⌘K' },
      { id: 'home', href: '/admin', title: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    heading: 'Gestão',
    items: [
      { id: 'orders', href: '/admin/orders', title: 'Gestor de Pedidos', icon: Inbox, badge: 12 },
      { id: 'menu', href: '/admin/menu', title: 'Cardápio', icon: LayoutDashboard },
    ]
  },
  {
    heading: 'Inteligência Artificial',
    items: [
      { id: 'ai', href: '/admin/ai-agent', title: 'Agente WhatsApp', icon: Users },
    ]
  },
  {
    heading: 'Configurações',
    items: [
      { id: 'store', href: '/admin/store', title: 'Dados da Loja', icon: Settings },
      { id: 'delivery', href: '/admin/delivery', title: 'Áreas de Entrega', icon: Settings },
      { id: 'settings', href: '/admin/settings', title: 'Ajustes do Sistema', icon: Settings },
      { id: 'integrations', href: '/admin/integrations', title: 'Integrações', icon: Blocks },
    ]
  }
];

const mockBottomItems: NavItemData[] = [
  { id: 'logout', href: '/auth/signout', title: 'Sair da conta', icon: LogOut },
];

function WorkspaceSwitcher({ selected, onSelect }: { selected?: string, onSelect?: (ws: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState('Atendy.ai');
  
  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between px-2 py-2 mb-4 rounded-lg select-none group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-red-600 text-white flex items-center justify-center font-semibold text-[13px] shadow-sm">
            {current.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsed=true]/sidebar:hidden">
            <span className="text-[13px] font-medium leading-none mb-1 text-foreground truncate max-w-[120px]">{current}</span>
            <span className="text-[11px] text-muted-foreground leading-none">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ 
  item, 
  activeId, 
  onSelect,
  level = 0
}: { 
  item: NavItemData; 
  activeId: string; 
  onSelect: (id: string) => void;
  level?: number;
}) {
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Link 
        href={item.href}
        prefetch={true}
        className={`group flex items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none
          ${isActive 
            ? 'bg-red-50 text-red-600 font-medium' 
            : 'text-neutral-600 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 font-medium'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <item.icon 
            className={`w-[16px] h-[16px] transition-colors
              ${isActive ? 'text-red-600' : 'text-neutral-500 group-hover:text-neutral-800'}
            `} 
            strokeWidth={1.5} 
          />
          <span className="text-[13px] tracking-wide truncate group-data-[collapsed=true]/sidebar:hidden">
            {item.title}
          </span>
        </div>
        
        <div className="flex items-center gap-2 group-data-[collapsed=true]/sidebar:hidden">
          {item.shortcut && (
             <kbd className="hidden group-hover:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium font-mono text-muted-foreground/60 bg-background/50 border border-border/50 rounded-[4px] shadow-xs">
               {item.shortcut}
             </kbd>
          )}
          {item.badge && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-red-100 text-red-600">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight 
              className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
              strokeWidth={2}
            />
          )}
        </div>
      </Link>

      {hasChildren && (
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div 
              className="absolute top-0 bottom-0 border-l border-black/5 dark:border-white/5"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children!.map(child => (
              <NavItem 
                key={child.id} 
                item={child} 
                activeId={activeId} 
                onSelect={onSelect} 
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({ 
  className = '',
  activeId,
  onSelect,
  activeWorkspace,
  onWorkspaceSelect
}: { 
  className?: string,
  activeId?: string,
  onSelect?: (id: string) => void,
  activeWorkspace?: string,
  onWorkspaceSelect?: (ws: string) => void
}) {
  const pathname = usePathname();
  const [internalId, setInternalId] = useState('home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  useEffect(() => {
    // Find the item that matches the current pathname
    const allItems = [...mockNavGroups.flatMap(g => g.items), ...mockBottomItems];
    const flattenItems = (items: NavItemData[]): NavItemData[] => {
      return items.reduce((acc, item) => {
        acc.push(item);
        if (item.children) acc.push(...flattenItems(item.children));
        return acc;
      }, [] as NavItemData[]);
    };
    const flatData = flattenItems(allItems);
    const matchedItem = flatData.find(i => i.href === pathname);
    
    if (matchedItem) {
      setInternalId(matchedItem.id);
    }
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = (id: string) => {
    if (id === 'search') {
      setIsSearchOpen(true);
      return;
    }
    if (onSelect) onSelect(id);
    else setInternalId(id);
  };

  return (
    <>
      <div 
        data-collapsed={isCollapsed}
        className={`group/sidebar flex flex-col h-full bg-white border-r border-neutral-200 font-sans transition-all duration-300 relative ${isCollapsed ? 'w-[70px] p-2' : 'w-[260px] p-3'} ${className}`}
      >
        <WorkspaceSwitcher selected={activeWorkspace} onSelect={onWorkspaceSelect} />

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
          {mockNavGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-0.5">
              {group.heading && (
                <span className="px-2.5 mb-1 text-[11px] font-bold tracking-wider text-neutral-500 uppercase group-data-[collapsed=true]/sidebar:hidden">
                  {group.heading}
                </span>
              )}
              {group.items.map(item => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  activeId={currentId} 
                  onSelect={handleSelect} 
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-0.5">
          {mockBottomItems.map(item => (
            <NavItem 
              key={item.id} 
              item={item} 
              activeId={currentId} 
              onSelect={handleSelect} 
            />
          ))}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group flex items-center px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 font-medium"
          >
            <div className="flex items-center gap-2.5">
              {isCollapsed ? (
                 <PanelLeftOpen size={16} strokeWidth={1.5} className="text-neutral-500 group-hover:text-neutral-800" />
              ) : (
                 <PanelLeftClose size={16} strokeWidth={1.5} className="text-neutral-500 group-hover:text-neutral-800" />
              )}
              <span className="text-[13px] tracking-wide truncate group-data-[collapsed=true]/sidebar:hidden">
                Recolher
              </span>
            </div>
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" 
            onClick={() => setIsSearchOpen(false)} 
          />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 border-b border-neutral-100">
              <Search className="w-5 h-5 text-neutral-400" />
              <input 
                autoFocus
                placeholder="Pesquise por páginas ou configurações..." 
                className="w-full bg-transparent border-0 focus:ring-0 text-[15px] px-3 py-4 text-neutral-800 placeholder:text-neutral-400 outline-none"
              />
              <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-md text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 bg-neutral-50/50">
              {mockNavGroups.flatMap(g => g.items).filter(i => i.id !== 'search').map(item => (
                <Link 
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-neutral-100 text-neutral-500">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-[14px]">{item.title}</span>
                </Link>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-500 flex items-center justify-between">
              <span>Use as setas para navegar</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-200 bg-white font-sans">esc</kbd> para fechar
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
