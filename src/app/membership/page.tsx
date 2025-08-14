
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function MembershipPage() {
  const YOUR_FB_PAGE_NAME = "MongolKino"; 
  const { user } = useAuth();


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container flex min-h-[calc(100vh-12rem)] items-center justify-center py-12 md:py-20">
          <Card className="w-full max-w-lg shadow-lg">
             <CardHeader>
                <CardTitle className="text-center text-3xl font-headline">Гишүүн болох</CardTitle>
                <CardDescription className="text-center">
                    Манай вэб сайтын гишүүн болж, бүх киног хязгааргүй үзэх боломжийг нээгээрэй.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4 text-center'>
                 <p className="text-muted-foreground">
                    Гишүүнчлэлийн төлбөр болон бусад мэдээллийг авахын тулд манай Facebook хуудсанд мессеж бичнэ үү.
                    Таны хүсэлтийг бид шалгаж баталгаажуулсны дараа таны гишүүнчлэлийн эрх идэвхжих болно.
                </p>
                <p className='text-sm text-foreground'>
                    Таны имэйл: <span className='font-bold'>{user?.email || "Нэвтэрнэ үү"}</span>
                </p>
                <Button asChild className='w-full' size="lg">
                    <a href={`https://m.me/${YOUR_FB_PAGE_NAME}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Facebook-ээр мессеж бичих
                    </a>
                </Button>
              </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
