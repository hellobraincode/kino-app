import { Film } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/80">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">Монгол Кино</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mongol Kino. All rights reserved.
        </p>
        <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
