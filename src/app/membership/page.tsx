
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, DocumentData } from 'firebase/firestore';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ExternalLink, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import Link from 'next/link';

const formSchema = z.object({});

type MembershipFormData = z.infer<typeof formSchema>;

export default function MembershipPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState<DocumentData | null>(null);
  const [checkingRequest, setCheckingRequest] = useState(true);

  const YOUR_FB_PAGE_NAME = "MongolKino"; 

  const form = useForm<MembershipFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (user) {
      setCheckingRequest(true);
      const q = query(collection(db, "membership_requests"), where("uid", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
            const request = querySnapshot.docs[0].data();
            request.id = querySnapshot.docs[0].id;
            setExistingRequest(request);
        } else {
            setExistingRequest(null);
        }
        setCheckingRequest(false);
      });
      return () => unsubscribe();
    } else {
       setCheckingRequest(false);
    }
  }, [user]);

  const onSubmit = async (values: MembershipFormData) => {
    if (!user) {
      toast({ title: "Нэвтэрнэ үү", description: "Хүсэлт илгээхийн тулд та эхлээд нэвтрэх ёстой.", variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, "membership_requests"), {
        uid: user.uid,
        email: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Амжилттай', description: 'Таны гишүүнчлэлийн хүсэлтийг илгээлээ. Бид удахгүй шалгаад хариу мэдэгдэх болно.' });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({ title: "Алдаа", description: "Хүсэлт илгээхэд алдаа гарлаа. Дахин оролдоно уу.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusMessage = () => {
    if (!existingRequest) return null;

    switch (existingRequest.status) {
      case 'pending':
        return (
            <div className="text-center p-6 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-bold text-lg text-primary">Таны хүсэлт хүлээгдэж байна</h3>
                <p className="text-muted-foreground mt-2">Бид таны хүсэлтийг шалгаж байна. Баталгаажуулсны дараа таны эрх идэвхжих болно.</p>
            </div>
        );
      case 'approved':
        return (
            <div className="text-center p-6 bg-green-100/50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-bold text-lg text-green-700 dark:text-green-400">Та гишүүн боллоо!</h3>
                <p className="text-muted-foreground mt-2">Манай бүх киног хязгааргүй үзэх боломжтой боллоо.</p>
                <Button asChild className='mt-4'>
                    <Link href="/browse">Кинонууд үзэх</Link>
                </Button>
            </div>
        );
       case 'rejected':
         return (
            <div className="text-center p-6 bg-red-100/50 dark:bg-red-900/20 rounded-lg">
                <h3 className="font-bold text-lg text-destructive">Таны хүсэлт татгалзсан</h3>
                <p className="text-muted-foreground mt-2">Харамсалтай нь таны хүсэлт татгалзсан байна. Дэлгэрэнгүй мэдээллийг манай Facebook хуудсаар холбогдож авна уу.</p>
            </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container flex items-center justify-center py-12 md:py-20">
          <Card className="w-full max-w-2xl shadow-lg">
             <CardHeader>
                <CardTitle className="text-center text-3xl font-headline">Гишүүн болох</CardTitle>
                <CardDescription className="text-center">
                    Манай вэб сайтын гишүүн болж, бүх киног хязгааргүй үзэх боломжийг нээгээрэй.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-8'>
                <div className='space-y-4 p-6 border rounded-lg bg-background'>
                    <h3 className='font-bold text-lg text-primary text-center'>Алхам 1: Хүсэлт илгээх</h3>
                    <p className="text-muted-foreground text-center">
                        Эхлээд доорх товчийг дарж гишүүн болох хүсэлтээ илгээнэ үү.
                    </p>
                    
                    { authLoading || checkingRequest ? (
                         <div className="flex justify-center items-center h-24">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : !user ? (
                        <div className="text-center text-muted-foreground p-8">
                            Хүсэлт илгээхийн тулд <Link href="/login" className="text-primary underline">нэвтэрнэ</Link> үү.
                        </div>
                    ) : existingRequest ? (
                        renderStatusMessage()
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Send className="mr-2 h-4 w-4" /> Хүсэлт илгээх
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>
                <div className='space-y-4 text-center p-6 border rounded-lg bg-background'>
                    <h3 className='font-bold text-lg text-primary'>Алхам 2: Төлбөр төлөх</h3>
                    <p className="text-muted-foreground">
                        Хүсэлтээ илгээсний дараа гишүүнчлэлийн төлбөр болон бусад мэдээллийг авахын тулд манай Facebook хуудсанд мессеж бичнэ үү.
                    </p>
                    <Button asChild size="lg">
                        <a href={`https://m.me/${YOUR_FB_PAGE_NAME}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Facebook-ээр холбогдох
                        </a>
                    </Button>
                </div>
              </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
