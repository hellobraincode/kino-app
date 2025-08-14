import Link from 'next/link';
import { Film, LogIn, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/browse', label: 'Бүх кино' },
  { href: '/membership', label: 'Гишүүнчлэл' },
];

export function Header() {
  const isAdmin = true; // Placeholder for auth state
  const isLoggedIn = false; // Placeholder for auth state

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Film className="h-7 w-7 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline text-xl">Монгол Кино</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
             <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Админ
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
           {isLoggedIn ? (
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
           ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Нэвтрэх
              </Link>
            </Button>
           )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="mb-4 flex items-center gap-2">
                    <Film className="h-7 w-7 text-primary" />
                    <span className="font-bold font-headline text-xl">Монгол Кино</span>
                </Link>
                {navLinks.map(link => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                    {link.label}
                    </Link>
                ))}
                {isAdmin && (
                    <Link
                    href="/admin"
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                    Админ
                    </Link>
                )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
