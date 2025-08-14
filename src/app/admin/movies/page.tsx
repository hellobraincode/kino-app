import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AdminMovieForm } from "@/components/admin-movie-form";
import { PlusCircle, Edit, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockMovies } from "@/lib/constants";

export default function AdminMoviesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Кинонууд</h1>
                    <p className="text-muted-foreground">Сайтад байгаа кинонуудыг удирдах хэсэг.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Кино нэмэх
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                        <AdminMovieForm />
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
                        {mockMovies.map((movie) => (
                            <TableRow key={movie.id}>
                                <TableCell className="font-medium">{movie.title}</TableCell>
                                <TableCell>{movie.year}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={movie.isPublished ? "default" : "secondary"}>
                                        {movie.isPublished ? "Нийтэлсэн" : "Ноорог"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon">
                                        {movie.isPublished ? <ToggleRight className="h-5 w-5"/> : <ToggleLeft className="h-5 w-5"/>}
                                        <span className="sr-only">Toggle publish status</span>
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                     <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
