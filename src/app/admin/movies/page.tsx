

'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AdminMovieForm, MovieFormState } from "@/components/admin-movie-form";
import { PlusCircle, Edit, ToggleLeft, ToggleRight, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db, storage } from '@/lib/firebase';
import type { Movie } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, "movies"), (snapshot) => {
            const fetchedMovies: Movie[] = [];
            snapshot.forEach((doc) => {
                fetchedMovies.push({ id: doc.id, ...doc.data() } as Movie);
            });
            fetchedMovies.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
            setMovies(fetchedMovies);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching movies: ", error);
            toast({ title: "Алдаа", description: "Кинонуудыг татахад алдаа гарлаа.", variant: "destructive" });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleEdit = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setSelectedMovie(null);
        setIsFormOpen(true);
    };

    const handleTogglePublish = async (movie: Movie) => {
        setTogglingId(movie.id);
        try {
            const movieRef = doc(db, 'movies', movie.id);
            await updateDoc(movieRef, { isPublished: !movie.isPublished });
            toast({ title: "Амжилттай", description: `"${movie.title}" киноны төлөв өөрчлөгдлөө.` });
        } catch (error) {
            console.error("Error toggling publish status:", error);
            toast({ title: "Алдаа", description: "Төлөв өөрчлөхөд алдаа гарлаа.", variant: "destructive" });
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (movie: Movie) => {
        setDeletingId(movie.id);
        try {
            // Delete Firestore document
            await deleteDoc(doc(db, 'movies', movie.id));

            // Delete Thumbnail from Storage
            if (movie.thumbnailUrl) {
                try {
                    const thumbnailRef = ref(storage, movie.thumbnailUrl);
                    await deleteObject(thumbnailRef);
                } catch (e: any) {
                    if (e.code !== 'storage/object-not-found') throw e;
                }
            }

            // Delete Video from Storage
            if (movie.videoUrl) {
                 try {
                    const videoRef = ref(storage, movie.videoUrl);
                    await deleteObject(videoRef);
                } catch (e: any) {
                    if (e.code !== 'storage/object-not-found') throw e;
                }
            }

            toast({ title: "Амжилттай", description: `"${movie.title}" кино устгагдлаа.` });
        } catch (error) {
            console.error("Error deleting movie:", error);
            toast({ title: "Алдаа", description: "Кино устгахад алдаа гарлаа.", variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedMovie(null);
    };


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Кинонууд</h1>
                    <p className="text-muted-foreground">Сайтад байгаа кинонуудыг удирдах хэсэг.</p>
                </div>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Кино нэмэх
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                        <AdminMovieForm movie={selectedMovie} onFormSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Нэр</TableHead>
                            <TableHead>Он</TableHead>
                            <TableHead className="text-center">Төлөв</TableHead>
                            <TableHead className="text-right">Үйлдэл</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : movies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Кино олдсонгүй.
                                </TableCell>
                            </TableRow>
                        ) : (
                            movies.map((movie) => (
                                <TableRow key={movie.id}>
                                    <TableCell className="font-medium">{movie.title}</TableCell>
                                    <TableCell>{movie.year}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={movie.isPublished ? "default" : "secondary"}>
                                            {movie.isPublished ? "Нийтэлсэн" : "Ноорог"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(movie)} disabled={togglingId === movie.id}>
                                            {togglingId === movie.id ? <Loader2 className="h-5 w-5 animate-spin" /> : (movie.isPublished ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />)}
                                            <span className="sr-only">Toggle publish status</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(movie)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={deletingId === movie.id}>
                                                    {deletingId === movie.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Та итгэлтэй байна уу?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        "{movie.title}" киног устгах гэж байна. Энэ үйлдэл буцаагдах боломжгүй.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(movie)} className="bg-destructive hover:bg-destructive/90">Устгах</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
