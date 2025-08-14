import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block overflow-hidden rounded-lg">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out border-0 bg-transparent">
        <div className="relative aspect-[2/3] w-full">
           <Image
            src={movie.thumbnailUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            data-ai-hint="movie poster"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
             <div className="flex items-center gap-2">
                <PlayCircle className="h-8 w-8 text-white" />
             </div>
           </div>
        </div>
      </Card>
       <div className="mt-2">
        <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
        <p className="text-sm text-muted-foreground">{movie.year}</p>
      </div>
    </Link>
  );
}
