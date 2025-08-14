import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
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
      <div className="bg-background">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
              <Tv />
              <span>Монгол Кино</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <AdminNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="min-h-screen p-4 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
