import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MovieCard } from '@/components/movie-card';
import { mockMovies } from '@/lib/constants';

export default function BrowsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="font-headline mb-8 text-4xl font-bold">Бүх кино</h1>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {mockMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
