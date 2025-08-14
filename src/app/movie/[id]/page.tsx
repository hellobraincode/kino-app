
'use client';

import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Lock, Tv, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import type { Movie } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

export default function MovieDetailPage({ params: { id } }: { params: { id: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "movies", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() } as Movie);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchMovie();
    }
  }, [id]);

  const isMember = user?.role === 'member' || user?.role === 'admin';

  if (loading || authLoading) {
    return (
       <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
       <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Кино олдсонгүй</h2>
                <p className="text-muted-foreground">Таны хайсан кино олдсонгүй.</p>
                <Button asChild className="mt-4">
                    <Link href="/browse">Бүх киног үзэх</Link>
                </Button>
            </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const canWatch = isMember && movie.videoUrl;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container py-8 md:py-12">
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg bg-slate-900 shadow-lg">
            {canWatch ? (
               <video controls className="w-full h-full" src={movie.videoUrl} autoPlay>
                Таны хөтөч видеог дэмжихгүй байна.
               </video>
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
                  <p className="max-w-md text-muted-foreground">
                    {movie.videoUrl ? 'Энэ киног үзэхийн тулд гишүүн болох шаардлагатай.' : 'Энэ киноны видео одоогоор байхгүй байна.'}
                  </p>
                  {movie.videoUrl && (
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                        <Link href="/membership">
                        Гишүүн болох
                        </Link>
                    </Button>
                  )}
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
                {movie.genres?.map(genre => <Badge key={genre} variant="outline">{genre}</Badge>)}
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
