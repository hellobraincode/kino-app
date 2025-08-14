'use client';

import Link from 'next/link';
import { Film, LogIn, LogOut, User, Menu, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const navLinks = [
  { href: '/browse', label: 'Бүх кино' },
  { href: '/membership', label: 'Гишүүнчлэл' },
];

export function Header() {
  const { user, loading, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user;

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }

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
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {!loading && (
            <>
              {isLoggedIn ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || undefined} alt={user.email || ''} />
                          <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName || 'Хэрэглэгч'}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                       {isAdmin && (
                        <DropdownMenuItem asChild>
                           <Link href="/admin">
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Админ</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Гарах</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Нэвтрэх
                  </Link>
                </Button>
              )}
            </>
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
                 {isLoggedIn ? (
                  <div className="flex flex-col gap-4">
                    {isAdmin && (
                        <Link
                        href="/admin"
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                        Админ
                        </Link>
                    )}
                    <Button onClick={signOut} variant="ghost" className="justify-start p-0 text-lg font-medium text-muted-foreground">
                        Гарах
                    </Button>
                  </div>
                ) : (
                    <Link
                    href="/login"
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                    Нэвтрэх
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
