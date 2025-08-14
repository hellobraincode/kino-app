
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MovieCard } from '@/components/movie-card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import type { Movie } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';


async function getMovies() {
  try {
    const moviesQuery = query(
      collection(db, "movies"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(moviesQuery);
    const movies = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Movie))
      .filter(movie => movie.isPublished)
    return movies;
  } catch (error) {
    console.error("Error fetching movies: ", error);
    if ((error as any).code === 'failed-precondition') {
        console.warn("Query failed due to missing index. Falling back to fetching published movies without specific order.");
        const fallbackQuery = query(collection(db, "movies"), where("isPublished", "==", true), limit(10));
        const fallbackSnapshot = await getDocs(fallbackQuery);
        return fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
    }
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
        <section className="relative h-[80vh] w-full text-white">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <Image
            src={featuredMovie.thumbnailUrl}
            alt={featuredMovie.title}
            fill
            className="object-cover object-top"
            priority
            data-ai-hint="movie scene"
          />
          <div className="container relative z-20 flex h-full flex-col items-start justify-end pb-20 text-left">
            <h1 className="font-headline text-5xl font-extrabold drop-shadow-lg md:text-7xl">
              {featuredMovie.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-foreground/80 drop-shadow-md line-clamp-3">
              {featuredMovie.description}
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-bold">
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
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {otherMovies.map((movie) => (
                  <CarouselItem key={movie.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <MovieCard movie={movie} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12"/>
            </Carousel>
            </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
