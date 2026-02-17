'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Tag
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Labels', href: '/labels', icon: Tag },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-white border-r border-gray-200 hidden md:block">
      <div className="flex flex-col h-full py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 text-sm font-medium transition-colors border-l-2",
                isActive 
                  ? "bg-blue-50 text-blue-700 border-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 border-transparent"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
