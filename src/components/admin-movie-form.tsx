'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Upload } from "lucide-react";

export function AdminMovieForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Кино нэмэх / засах</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Киноны нэр</Label>
                        <Input id="title" placeholder="Зүрхний Хилэн" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Тайлбар</Label>
                        <Textarea id="description" placeholder="Киноны тухай товч тайлбар..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="year">Он</Label>
                            <Input id="year" type="number" placeholder="2024" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Үргэлжлэх хугацаа (минут)</Label>
                            <Input id="duration" type="number" placeholder="120" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="genres">Төрөл (таслалаар тусгаарлана)</Label>
                        <Input id="genres" placeholder="Дайн, Түүхэн, Драм" />
                    </div>
                    <div className="space-y-2">
                        <Label>Thumbnail зураг</Label>
                        <div className="flex items-center gap-4">
                            <Input id="thumbnail" type="file" className="flex-1"/>
                            <Button type="button" variant="outline"><Upload className="mr-2 h-4 w-4" /> Хуулах</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Видео файл (MP4)</Label>
                        <div className="flex items-center gap-4">
                            <Input id="video" type="file" accept=".mp4" className="flex-1"/>
                            <Button type="button" variant="outline"><Upload className="mr-2 h-4 w-4" /> Хуулах</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="isPublished" className="font-bold">Нийтлэх</Label>
                            <p className="text-sm text-muted-foreground">Энэ киног хэрэглэгчдэд харагдах эсэхийг тохируулна.</p>
                        </div>
                        <Switch id="isPublished" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline">Цуцлах</Button>
                        <Button><Save className="mr-2 h-4 w-4" /> Хадгалах</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
