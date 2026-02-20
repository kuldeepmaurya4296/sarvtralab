'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Plus,
    School as SchoolIcon,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { School } from '@/data/users';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Server Actions
import { getAllSchools, createSchool, updateSchool, deleteSchool } from '@/lib/actions/school.actions';

// Refactored Components
import { SchoolTable } from '@/components/admin/schools/SchoolTable';
import { SchoolDetailsSheet } from '@/components/admin/schools/SchoolDetailsSheet';
import { SchoolAnalyticsSheet } from '@/components/admin/schools/SchoolAnalyticsSheet';
import { SchoolFormSheet } from '@/components/admin/schools/SchoolFormSheet';
import { SchoolAccessDialog } from '@/components/admin/schools/SchoolAccessDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminSchoolsPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [schools, setSchools] = useState<School[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');

    // UI States
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAccessOpen, setIsAccessOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'superadmin')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const loadData = async () => {
            if (user?.role === 'superadmin') {
                try {
                    const data = await getAllSchools();
                    setSchools(data || []);
                } catch (error) {
                    console.error("Failed to load schools", error);
                    toast.error("Failed to load schools");
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) loadData();
    }, [user, isAuthLoading]);

    // Filter logic
    const filteredSchools = schools.filter(school => {
        const matchesSearch =
            school.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.schoolCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.principalName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'all' || school.schoolType === typeFilter;
        const matchesBoard = boardFilter === 'all' || school.board === boardFilter;
        const matchesPlan = planFilter === 'all' || school.subscriptionPlan === planFilter;

        return matchesSearch && matchesType && matchesBoard && matchesPlan;
    });

    // Handlers
    const handleExport = () => {
        const headers = ['ID', 'Name', 'Code', 'City', 'Type', 'Board', 'Students', 'Plan'];
        const csvContent = [
            headers.join(','),
            ...schools.map(s => [
                s.id, `"${s.name}"`, s.schoolCode, `"${s.city}"`,
                s.schoolType, s.board, s.totalStudents, s.subscriptionPlan
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schools-export.csv';
        a.click();
        toast.success("Exported school data");
    };

    const handleAddSchool = async (formData: any) => {
        try {
            const newSchool = await createSchool({
                ...formData,
                principalName: formData.principalName || 'Principal',
                phone: formData.phone || '',
                email: formData.email,
                address: formData.address || '',
                totalStudents: 0,
                subscriptionStatus: 'active',
                subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                assignedCourses: []
            });

            if (newSchool) {
                setSchools(prev => [newSchool, ...prev]);
                setIsAddOpen(false);
                toast.success("School created successfully");
            }
        } catch (error: any) {
            console.error("Failed to create school", error);
            toast.error(error.message || "Failed to create school");
        }
    };

    const handleEditSave = async (formData: any) => {
        if (!selectedSchool) return;
        try {
            const updated = await updateSchool(selectedSchool.id, formData);
            if (updated) {
                setSchools(schools.map(s => s.id === selectedSchool.id ? updated : s));
                setIsEditOpen(false);
                toast.success("School details updated");
            }
        } catch (error: any) {
            console.error("Failed to update school", error);
            toast.error(error.message || "Failed to update school");
        }
    };

    const handleDelete = async () => {
        if (!selectedSchool) return;
        try {
            await deleteSchool(selectedSchool.id);
            setSchools(schools.filter(s => s.id !== selectedSchool.id));
            setIsDeleteOpen(false);
            toast.success("School deleted successfully");
        } catch (error) {
            console.error("Failed to delete school", error);
            toast.error("Failed to delete school");
        }
    };

    const handleSaveAccess = async (data: any) => {
        if (!selectedSchool) return;
        // Assuming updateSchool handles password/email updates as part of its partial update if passed
        // Or if specific logic is needed, we might need a dedicated action.
        // For now, we'll try using updateSchool if the data contains email/password.
        try {
            const updated = await updateSchool(selectedSchool.id, data);
            if (updated) {
                setSchools(schools.map(s => s.id === selectedSchool.id ? updated : s));
                setIsAccessOpen(false);
                toast.success("Access settings updated");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update access settings");
        }
    };

    const openView = (school: School) => { setSelectedSchool(school); setIsDetailsOpen(true); };
    const openEdit = (school: School) => { setSelectedSchool(school); setIsEditOpen(true); };
    const openAccess = (school: School) => { setSelectedSchool(school); setIsAccessOpen(true); };
    const openAnalytics = (school: School) => { setSelectedSchool(school); setIsAnalyticsOpen(true); };
    const openDelete = (school: School) => { setSelectedSchool(school); setIsDeleteOpen(true); };

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;

    const admin = user as any;

    return (
        <DashboardLayout role="admin" userName={admin.name || 'Admin'} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <SchoolIcon className="h-6 w-6 text-primary" />
                            Manage Schools
                        </h1>
                        <p className="text-muted-foreground">
                            Overview and management of all registered schools
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                        <Button
                            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setIsAddOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Add New School
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>School Directory</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="government">Government</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="aided">Aided</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={boardFilter} onValueChange={setBoardFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Board" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Boards</SelectItem>
                                        <SelectItem value="CBSE">CBSE</SelectItem>
                                        <SelectItem value="ICSE">ICSE</SelectItem>
                                        <SelectItem value="State Board">State Board</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={planFilter} onValueChange={setPlanFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Plans</SelectItem>
                                        <SelectItem value="basic">Basic</SelectItem>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>
                            Displaying {filteredSchools.length} of {schools.length} registered schools
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SchoolTable
                            schools={filteredSchools}
                            onView={openView}
                            onEdit={openEdit}
                            onDelete={openDelete}
                            onAccess={openAccess}
                            onAnalytics={openAnalytics}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modals and Sheets */}
            <SchoolDetailsSheet
                school={selectedSchool}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onEdit={openEdit}
                onAccess={openAccess}
                onAnalytics={openAnalytics}
                onDelete={openDelete}
            />

            <SchoolAnalyticsSheet
                school={selectedSchool}
                open={isAnalyticsOpen}
                onOpenChange={setIsAnalyticsOpen}
            />

            <SchoolFormSheet
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                mode="add"
                onSubmit={handleAddSchool}
            />

            {/* Need to verify if SchoolFormSheet supports initialData and onSubmit for edit */}
            <SchoolFormSheet
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                mode="edit"
                initialData={selectedSchool}
                onSubmit={handleEditSave}
            />

            <SchoolAccessDialog
                school={selectedSchool}
                open={isAccessOpen}
                onOpenChange={setIsAccessOpen}
                onSave={handleSaveAccess}
            />

            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDelete}
                title="Are you absolutely sure?"
                description={<>This will deactivate <strong>{selectedSchool?.name}</strong>. All associated student and teacher accounts will lose access.</>}
                confirmLabel="Delete School"
            />
        </DashboardLayout>
    );
}
