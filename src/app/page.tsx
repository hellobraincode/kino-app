
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MovieCard } from '@/components/movie-card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import type { Movie } from '@/lib/types';


async function getMovies() {
  try {
    const moviesQuery = query(
      collection(db, "movies"), 
      where("isPublished", "==", true), 
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(moviesQuery);
    const movies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
    return movies;
  } catch (error) {
    console.error("Error fetching movies: ", error);
    return [];
  }
}


export default async function Home() {
  const movies = await getMovies();
  const featuredMovie = movies[0];
  const otherMovies = movies.slice(1);

  if (!featuredMovie) {
    return (
       <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Кино олдсонгүй</h2>
                <p className="text-muted-foreground">Одоогоор нийтлэгдсэн кино байхгүй байна.</p>
            </div>
        </main>
        <Footer />
      </div>
    )
  }

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
            <p className="mt-4 max-w-xl text-lg text-gray-200 drop-shadow-md line-clamp-3">
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

        {otherMovies.length > 0 && (
            <section className="container py-16">
            <h2 className="font-headline mb-8 text-3xl font-bold">Шинэ кинонууд</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
            </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
