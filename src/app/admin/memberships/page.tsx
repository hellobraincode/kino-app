import { AdminMembershipTable } from "@/components/admin-membership-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminMembershipsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Гишүүнчлэлийн хүсэлтүүд</h1>
                <p className="text-muted-foreground">Хэрэглэгчдийн гишүүн болох хүсэлтийг удирдах хэсэг.</p>
            </div>
            <Tabs defaultValue="pending" className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">Хүлээгдэж буй</TabsTrigger>
                    <TabsTrigger value="approved">Зөвшөөрсөн</TabsTrigger>
                    <TabsTrigger value="rejected">Татгалзсан</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <AdminMembershipTable />
                </TabsContent>
                <TabsContent value="approved">
                    <AdminMembershipTable />
                </TabsContent>
                <TabsContent value="rejected">
                    <AdminMembershipTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
