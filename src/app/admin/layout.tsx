import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminNav } from '@/components/admin-nav';
import Link from 'next/link';
import { Tv } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
              <Tv className="text-accent"/>
              <span>Монгол Кино</span>
            </Link>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <AdminNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <main className="min-h-screen p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
  );
}
