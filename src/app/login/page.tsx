'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-flex justify-center">
            <Film className="h-10 w-10 text-primary" />
          </Link>
          <CardTitle className="font-headline text-2xl">{isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Бүртгэлтэй хаягаар нэвтэрнэ үү.' : 'Шинэ хаяг үүсгэнэ үү.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">И-мэйл</Label>
            <Input id="email" type="email" placeholder="name@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Нууц үг</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">
            {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
          </Button>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Шинэ хэрэглэгч үү? Бүртгүүлэх' : 'Бүртгэлтэй юу? Нэвтрэх'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
