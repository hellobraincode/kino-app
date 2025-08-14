'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockMembershipRequests } from "@/lib/constants";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export function AdminMembershipTable() {
    
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
    
    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Хэрэглэгч</TableHead>
                        <TableHead>Messenger</TableHead>
                        <TableHead>Огноо</TableHead>
                        <TableHead className="text-center">Төлөв</TableHead>
                        <TableHead className="text-right">Үйлдэл</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockMembershipRequests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell className="font-medium">{req.uid}</TableCell>
                            <TableCell>
                                <a href={req.messengerProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                    Профайл
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </TableCell>
                            <TableCell>{new Date(req.createdAt as Date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={getStatusVariant(req.status)}>
                                    {getStatusLabel(req.status)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                {req.status === 'pending' && (
                                    <>
                                        <Button size="sm" variant="outline" className="text-green-600 hover:border-green-600/50 hover:text-green-600">
                                            <CheckCircle2 className="mr-1 h-4 w-4" /> Зөвшөөрөх
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-destructive hover:border-destructive/50 hover:text-destructive">
                                            <XCircle className="mr-1 h-4 w-4" /> Татгалзах
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
