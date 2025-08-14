'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Film, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';

const formSchema = z.object({
  email: z.string().email({ message: 'Буруу имэйл хаяг байна.' }),
  password: z.string().min(6, { message: 'Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой.' }),
});

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>>) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Амжилттай нэвтэрлээ." });
        router.push('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        
        const newUser: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'guest', // Default role for new users
          createdAt: serverTimestamp(),
        };

        await setDoc(doc(db, "users", user.uid), newUser);

        toast({ title: "Амжилттай бүртгүүллээ." });
        router.push('/');
      }
    } catch (error: any) {
      console.error(error);
      let message = 'Алдаа гарлаа. Дахин оролдоно уу.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Имэйл эсвэл нууц үг буруу байна.';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'Энэ имэйл хаяг бүртгэлтэй байна.';
      }
      toast({
        title: 'Алдаа',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-2xl bg-secondary border-border/60">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-flex justify-center">
            <Film className="h-10 w-10 text-accent" />
          </Link>
          <CardTitle className="font-headline text-2xl">{isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Бүртгэлтэй хаягаар нэвтэрнэ үү.' : 'Шинэ хаяг үүсгэнэ үү.'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>И-мэйл</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нууц үг</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
              </Button>
              <Button type="button" variant="link" onClick={() => {
                setIsLogin(!isLogin);
                form.reset();
              }} disabled={isLoading}>
                {isLogin ? 'Шинэ хэрэглэгч үү? Бүртгүүлэх' : 'Бүртгэлтэй юу? Нэвтрэх'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
