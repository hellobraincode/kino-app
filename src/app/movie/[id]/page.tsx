import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockMovies } from '@/lib/constants';
import { Calendar, Clock, Lock, Tv } from 'lucide-react';
import Link from 'next/link';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = mockMovies.find(m => m.id === params.id) || mockMovies[0];
  const isMember = false; // Placeholder for user role check

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-8 md:py-12">
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg bg-slate-900 shadow-lg">
            {isMember ? (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-white">Video Player goes here</p>
              </div>
            ) : (
              <>
                <Image
                  src={movie.thumbnailUrl}
                  alt={movie.title}
                  fill
                  className="object-cover opacity-30"
                  data-ai-hint="movie still"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center text-white">
                  <Lock className="h-16 w-16 text-accent" />
                  <h2 className="text-2xl font-bold">Гишүүнчлэл шаардлагатай</h2>
                  <p className="max-w-md text-muted-foreground">Энэ контентыг үзэхийн тулд гишүүн болох шаардлагатай.</p>
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                    <Link href="/membership">
                      Гишүүн болох
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <div>
            <h1 className="font-headline text-4xl font-bold">{movie.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Tv className="h-5 w-5 text-primary" />
                    <span>Кино</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{movie.duration} минут</span>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map(genre => <Badge key={genre} variant="outline">{genre}</Badge>)}
            </div>

            <p className="mt-6 max-w-3xl leading-relaxed text-foreground/80">
                {movie.description}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
