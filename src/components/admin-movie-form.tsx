

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, X } from "lucide-react";
import { db, storage } from '@/lib/firebase';
import { Movie } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import { Label } from './ui/label';

const formSchema = z.object({
  title: z.string().min(1, { message: "Нэр хоосон байж болохгүй." }),
  description: z.string().min(1, { message: "Тайлбар хоосон байж болохгүй." }),
  year: z.coerce.number().min(1900, { message: "Он зөв биш байна." }).max(new Date().getFullYear() + 1),
  duration: z.coerce.number().min(1, { message: "Хугацаа 0-ээс их байх ёстой." }),
  genres: z.string().min(1, { message: "Төрөл хоосон байж болохгүй." }),
  isPublished: z.boolean().default(false),
  thumbnailFile: z.instanceof(File).optional(),
  videoFile: z.instanceof(File).optional(),
});

type MovieFormData = z.infer<typeof formSchema>;

export type MovieFormState = {
  status: 'idle' | 'loading' | 'uploading-thumbnail' | 'uploading-video' | 'saving' | 'success' | 'error';
  message?: string;
  uploadProgress?: number;
};

interface AdminMovieFormProps {
  movie?: Movie | null;
  onFormSuccess: () => void;
  onCancel: () => void;
}

export function AdminMovieForm({ movie, onFormSuccess, onCancel }: AdminMovieFormProps) {
  const { toast } = useToast();
  const [formState, setFormState] = useState<MovieFormState>({ status: 'idle' });

  const form = useForm<MovieFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: movie?.title || '',
      description: movie?.description || '',
      year: movie?.year || new Date().getFullYear(),
      duration: movie?.duration || 0,
      genres: movie?.genres?.join(', ') || '',
      isPublished: movie?.isPublished || false,
    },
  });
  
  useEffect(() => {
    form.reset({
      title: movie?.title || '',
      description: movie?.description || '',
      year: movie?.year || new Date().getFullYear(),
      duration: movie?.duration || 0,
      genres: movie?.genres?.join(', ') || '',
      isPublished: movie?.isPublished || false,
      thumbnailFile: undefined,
      videoFile: undefined,
    });
    setFormState({ status: 'idle' });
  }, [movie, form]);


  const uploadFile = (file: File, path: string, onProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const onSubmit = async (data: MovieFormData) => {
    setFormState({ status: 'loading' });

    if (!data.thumbnailFile && !movie) {
        form.setError("thumbnailFile", { type: "manual", message: "Thumbnail зураг заавал оруулах ёстой." });
        setFormState({ status: 'error', message: "Thumbnail зураг дутуу байна." });
        return;
    }

    try {
      let thumbnailUrl = movie?.thumbnailUrl || '';
      if (data.thumbnailFile) {
        thumbnailUrl = await uploadFile(
          data.thumbnailFile, 
          `movies/thumbnails/${Date.now()}_${data.thumbnailFile.name}`,
          (progress) => setFormState({ status: 'uploading-thumbnail', uploadProgress: progress })
        );
      }

      let videoUrl = movie?.videoUrl || '';
      if (data.videoFile) {
        videoUrl = await uploadFile(
          data.videoFile, 
          `movies/videos/${Date.now()}_${data.videoFile.name}`,
          (progress) => setFormState({ status: 'uploading-video', uploadProgress: progress })
        );
      }
      
      setFormState({ status: 'saving' });

      const movieData = {
        title: data.title,
        description: data.description,
        year: data.year,
        duration: data.duration,
        genres: data.genres.split(',').map(g => g.trim()),
        isPublished: data.isPublished,
        thumbnailUrl,
        videoUrl,
        updatedAt: serverTimestamp(),
      };

      if (movie) {
        const movieRef = doc(db, 'movies', movie.id);
        await updateDoc(movieRef, movieData);
        toast({ title: 'Амжилттай шинэчлэгдлээ' });
      } else {
        await addDoc(collection(db, 'movies'), {
          ...movieData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Амжилттай нэмэгдлээ' });
      }

      setFormState({ status: 'success' });
      form.reset();
      onFormSuccess();

    } catch (error) {
      console.error("Form submission error:", error);
      toast({ title: 'Алдаа гарлаа', description: 'Дахин оролдоно уу.', variant: 'destructive' });
      setFormState({ status: 'error', message: 'Алдаа гарлаа.' });
    }
  };

  const getLoadingMessage = () => {
    switch (formState.status) {
        case 'loading': return 'Бэлдэж байна...';
        case 'uploading-thumbnail': return 'Thumbnail хуулж байна...';
        case 'uploading-video': return 'Видео хуулж байна...';
        case 'saving': return 'Хадгалж байна...';
        default: return 'Хадгалах';
    }
  }

  const isLoading = ['loading', 'uploading-thumbnail', 'uploading-video', 'saving'].includes(formState.status);

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Киноны нэр</FormLabel>
                  <FormControl>
                    <Input placeholder="Зүрхний Хилэн" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тайлбар</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Киноны тухай товч тайлбар..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Он</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Үргэлжлэх хугацаа (минут)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Төрөл (таслалаар тусгаарлана)</FormLabel>
                  <FormControl>
                    <Input placeholder="Дайн, Түүхэн, Драм" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
                control={form.control}
                name="thumbnailFile"
                render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                    <FormLabel>Thumbnail зураг</FormLabel>
                    <FormControl>
                    <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0])} 
                        {...rest} 
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
                control={form.control}
                name="videoFile"
                render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                    <FormLabel>Видео файл (MP4)</FormLabel>
                    <FormControl>
                    <Input 
                        type="file" 
                        accept="video/mp4"
                        onChange={(e) => onChange(e.target.files?.[0])} 
                        {...rest}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel className="font-bold">Нийтлэх</FormLabel>
                    <p className="text-sm text-muted-foreground">Энэ киног хэрэглэгчдэд харагдах эсэхийг тохируулна.</p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            { (formState.status === 'uploading-thumbnail' || formState.status === 'uploading-video') && (
                <div className='space-y-2'>
                    <Label>{getLoadingMessage()}</Label>
                    <Progress value={formState.uploadProgress} />
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              <X className="mr-2 h-4 w-4"/> Цуцлах
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? getLoadingMessage() : <><Save className="mr-2 h-4 w-4" /> Хадгалах</>}
            </Button>
          </CardFooter>
        </form>
      </Form>
  );
}
