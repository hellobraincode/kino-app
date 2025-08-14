'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { db } from '@/lib/firebase';
import type { MembershipRequest } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface AdminMembershipTableProps {
    status: 'pending' | 'approved' | 'rejected';
}

export function AdminMembershipTable({ status }: AdminMembershipTableProps) {
    const [requests, setRequests] = useState<MembershipRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, "membership_requests"), where("status", "==", status));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedRequests: MembershipRequest[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedRequests.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate(),
                    reviewedAt: data.reviewedAt?.toDate(),
                } as MembershipRequest);
            });
            // Sort by creation date, newest first
            fetchedRequests.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
            setRequests(fetchedRequests);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching membership requests:", error);
            setLoading(false);
            toast({ title: "Алдаа", description: "Хүсэлтүүдийг татахад алдаа гарлаа.", variant: 'destructive' });
        });

        return () => unsubscribe();
    }, [status, toast]);

    const handleUpdateRequest = async (id: string, newStatus: 'approved' | 'rejected', uid: string) => {
        if (!user) {
            toast({ title: "Алдаа", description: "Та нэвтэрсэн байх шаардлагатай.", variant: 'destructive' });
            return;
        }

        setUpdatingId(id);
        try {
            const requestRef = doc(db, 'membership_requests', id);
            await updateDoc(requestRef, {
                status: newStatus,
                reviewedAt: serverTimestamp(),
                reviewedBy: user.uid,
            });

            if (newStatus === 'approved') {
                const userRef = doc(db, 'users', uid);
                await updateDoc(userRef, {
                    role: 'member'
                });
            }
            toast({ title: "Амжилттай", description: `Хүсэлтийг ${newStatus === 'approved' ? 'зөвшөөрлөө' : 'татгалзлаа'}.` });
        } catch (error) {
            console.error("Error updating request:", error);
            toast({ title: "Алдаа", description: "Хүсэлтийг шинэчлэхэд алдаа гарлаа.", variant: 'destructive' });
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusVariant = (status: 'pending' | 'approved' | 'rejected') => {
        switch (status) {
            case 'approved': return 'default';
            case 'pending': return 'secondary';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    }

    const getStatusLabel = (status: 'pending' | 'approved' | 'rejected') => {
        switch (status) {
            case 'approved': return 'Зөвшөөрсөн';
            case 'pending': return 'Хүлээгдэж буй';
            case 'rejected': return 'Татгалзсан';
        }
    }
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (requests.length === 0) {
        return <p className="text-muted-foreground text-center py-10">Илэрц олдсонгүй.</p>
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Хэрэглэгчийн имэйл</TableHead>
                        <TableHead>Огноо</TableHead>
                        <TableHead className="text-center">Төлөв</TableHead>
                        {status === 'pending' && <TableHead className="text-right">Үйлдэл</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell className="font-medium">{req.email}</TableCell>
                            <TableCell>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={getStatusVariant(req.status)}>
                                    {getStatusLabel(req.status)}
                                </Badge>
                            </TableCell>
                            {status === 'pending' && (
                                <TableCell className="text-right space-x-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-green-600 hover:border-green-600/50 hover:text-green-600"
                                        onClick={() => handleUpdateRequest(req.id, 'approved', req.uid)}
                                        disabled={updatingId === req.id}
                                    >
                                        {updatingId === req.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-1 h-4 w-4" />}
                                        Зөвшөөрөх
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-destructive hover:border-destructive/50 hover:text-destructive"
                                        onClick={() => handleUpdateRequest(req.id, 'rejected', req.uid)}
                                        disabled={updatingId === req.id}
                                    >
                                        {updatingId === req.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <XCircle className="mr-1 h-4 w-4" />}
                                        Татгалзах
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
