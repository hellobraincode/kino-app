
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MovieCard } from '@/components/movie-card';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Movie } from '@/lib/types';

async function getMovies() {
  try {
    const moviesQuery = query(
      collection(db, "movies"), 
      where("isPublished", "==", true), 
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(moviesQuery);
    const movies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
    return movies;
  } catch (error) {
    console.error("Error fetching movies: ", error);
    return [];
  }
}

export default async function BrowsePage() {
  const movies = await getMovies();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="font-headline mb-8 text-4xl font-bold">Бүх кино</h1>
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Кино олдсонгүй</h2>
                <p className="text-muted-foreground">Одоогоор нийтлэгдсэн кино байхгүй байна.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
