'use client';

import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Film, Users } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/admin/movies', label: 'Кинонууд', icon: Film, tooltip: 'Manage Movies' },
  { href: '/admin/memberships', label: 'Гишүүнчлэл', icon: Users, tooltip: 'Manage Memberships' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.tooltip}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
