import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MovieCard } from '@/components/movie-card';
import { Button } from '@/components/ui/button';
import { mockMovies } from '@/lib/constants';
import { PlayCircle } from 'lucide-react';

export default function Home() {
  const featuredMovie = mockMovies[0];
  const otherMovies = mockMovies.slice(1, 5);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative h-[70vh] w-full text-white">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src={featuredMovie.thumbnailUrl}
            alt={featuredMovie.title}
            fill
            className="object-cover"
            priority
            data-ai-hint="movie scene"
          />
          <div className="container relative z-20 flex h-full flex-col items-start justify-center text-left">
            <h1 className="font-headline text-4xl font-bold drop-shadow-lg md:text-6xl">
              {featuredMovie.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-200 drop-shadow-md">
              {featuredMovie.description}
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
                <Link href={`/movie/${featuredMovie.id}`}>
                  <PlayCircle className="mr-2 h-6 w-6" /> Үзэх
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="font-headline mb-8 text-3xl font-bold">Онцлох кинонууд</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {otherMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
