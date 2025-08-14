import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Send } from 'lucide-react';
import Link from 'next/link';

export default function MembershipPage() {
  const YOUR_FB_PAGE_NAME = "your-page-name-here"; // Replace with actual page name

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container py-12 md:py-20">
          <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-bold">Гишүүн болох</h1>
              <p className="text-muted-foreground">
                Манай вэб сайтын гишүүн болж, бүх киног хязгааргүй үзэх боломжийг нээгээрэй. Гишүүн болохын тулд доорх зааврыг дагана уу.
              </p>
              <Card>
                <CardHeader>
                  <CardTitle>Алхам 1: Мессеж илгээх</CardTitle>
                  <CardDescription>
                    Гишүүнчлэлийн төлбөр болон бусад мэдээллийг авахын тулд манай Facebook хуудсанд мессеж бичнэ үү.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className='w-full'>
                    <a href={`https://m.me/${YOUR_FB_PAGE_NAME}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Facebook-ээр мессеж бичих
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Алхам 2: Хүсэлт илгээх</CardTitle>
                <CardDescription>
                  Төлбөрөө төлсний дараа өөрийн Facebook Messenger хаягийн холбоос болон бусад мэдээллийг доорх формд бөглөж илгээнэ үү.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="messengerUrl">Messenger Profile URL</Label>
                  <Input id="messengerUrl" placeholder="https://m.me/your.username" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Тэмдэглэл (заавал биш)</Label>
                  <Textarea id="note" placeholder="Нэмэлт мэдээлэл..." />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Хүсэлт илгээх
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
