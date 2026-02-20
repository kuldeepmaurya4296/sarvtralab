'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Plus, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { GovtOrg } from '@/data/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Server Actions
import { getAllGovtOrgs, createGovtOrg, updateGovtOrg, deleteGovtOrg } from '@/lib/actions/govt.actions';

// Refactored Components
import { GovtTable } from '@/components/admin/govt/GovtTable';
import { GovtViewSheet } from '@/components/admin/govt/GovtViewSheet';
import { GovtFormSheet } from '@/components/admin/govt/GovtFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminGovtOrgsPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [orgs, setOrgs] = useState<GovtOrg[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);

    // UI States
    const [selectedOrg, setSelectedOrg] = useState<GovtOrg | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'superadmin')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const loadData = async () => {
            if (user?.role === 'superadmin') {
                try {
                    const data = await getAllGovtOrgs();
                    setOrgs(data || []);
                } catch (error) {
                    toast.error("Failed to load organizations");
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) loadData();
    }, [user, isAuthLoading]);

    const filteredOrgs = orgs.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleAddOrg = async (formData: any) => {
        try {
            const newOrg = await createGovtOrg({
                ...formData,
                role: 'govt',
                assignedSchools: [],
                status: 'active'
            });

            if (newOrg) {
                setOrgs(prev => [newOrg, ...prev]);
                toast.success("Organization added successfully");
                setIsAddOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create organization");
        }
    };

    const handleEditSave = async (formData: any) => {
        if (!selectedOrg) return;
        try {
            const updated = await updateGovtOrg(selectedOrg.id, {
                ...formData,
                status: formData.status as 'active' | 'inactive'
            });

            if (updated) {
                setOrgs(prev => prev.map(o => o.id === selectedOrg.id ? updated : o));
                toast.success("Organization details updated");
                setIsEditOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update organization");
        }
    };

    const handleDelete = async () => {
        if (!selectedOrg) return;
        try {
            const success = await deleteGovtOrg(selectedOrg.id);
            if (success) {
                setOrgs(prev => prev.filter(o => o.id !== selectedOrg.id));
                setIsDeleteOpen(false);
                toast.success("Organization account deactivated");
            }
        } catch (error) {
            toast.error("Failed to delete organization");
        }
    };

    const handleExport = () => {
        if (!orgs.length) return;
        const headers = ['ID', 'Organization', 'Contact Person', 'Email', 'State', 'Department', 'Status'];
        const csvContent = [
            headers.join(','),
            ...orgs.map(o => [
                o.id, `"${o.organizationName}"`, `"${o.name}"`, o.email, o.state || 'N/A', o.department, o.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'govt-orgs-export.csv';
        a.click();
        toast.success("Exported organization list");
    };

    // Open handlers
    const openView = (org: GovtOrg) => { setSelectedOrg(org); setIsViewOpen(true); };
    const openEdit = (org: GovtOrg) => { setSelectedOrg(org); setIsEditOpen(true); };
    const openDelete = (org: GovtOrg) => { setSelectedOrg(org); setIsDeleteOpen(true); };

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;

    const admin = user as any;

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            Government Organizations
                        </h1>
                        <p className="text-muted-foreground">
                            Manage partnerships and government accounts
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" />
                            Export List
                        </Button>
                        <Button
                            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setIsAddOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Add Organization
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Registered Organizations</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orgs..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <GovtTable
                            orgs={filteredOrgs}
                            onView={openView}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modals and Sheets */}
            <GovtViewSheet
                org={selectedOrg}
                open={isViewOpen}
                onOpenChange={setIsViewOpen}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            <GovtFormSheet
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                mode="add"
                onSubmit={handleAddOrg}
            />

            <GovtFormSheet
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                mode="edit"
                initialData={selectedOrg}
                onSubmit={handleEditSave}
            />

            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDelete}
                title="Are you absolutely sure?"
                description={<>This will deactivate <strong>{selectedOrg?.organizationName}&apos;s</strong> account. This action cannot be undone.</>}
                confirmLabel="Deactivate"
            />
        </DashboardLayout>
    );
}
