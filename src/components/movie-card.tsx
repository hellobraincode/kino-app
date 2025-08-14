import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="relative aspect-[2/3]">
          <Image
            src={movie.thumbnailUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            data-ai-hint="movie poster"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-headline truncate text-lg font-bold leading-tight">{movie.title}</h3>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{movie.duration} мин</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
          {movie.genres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary">{genre}</Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
