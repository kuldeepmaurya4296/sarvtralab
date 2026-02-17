'use client';

import { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    School as SchoolIcon,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin } from '@/data/users';
import { SchoolService } from '@/data/services/school.service';
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

// Refactored Components
import { SchoolTable } from '@/components/admin/schools/SchoolTable';
import { SchoolDetailsSheet } from '@/components/admin/schools/SchoolDetailsSheet';
import { SchoolAnalyticsSheet } from '@/components/admin/schools/SchoolAnalyticsSheet';
import { SchoolFormSheet } from '@/components/admin/schools/SchoolFormSheet';
import { SchoolAccessDialog } from '@/components/admin/schools/SchoolAccessDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminSchoolsPage() {
    const admin = mockSuperAdmin;

    const [schools, setSchools] = useState<School[]>(SchoolService.getAll());
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

    // Filter logic
    const filteredSchools = schools.filter(school => {
        const matchesSearch =
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.schoolCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.principalName.toLowerCase().includes(searchQuery.toLowerCase());

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

    const handleAddSchool = (formData: any) => {
        const newSchool = {
            id: `SCH-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            principalName: 'John Doe',
            phone: '123-456-7890',
            email: 'admin@school.com',
            address: '123 School Lane',
            totalStudents: 0,
            totalTeachers: 0,
            subscriptionStatus: 'active',
            subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            logo: '',
            establishedYear: 2024
        };
        SchoolService.create(newSchool as School);
        setSchools([newSchool as School, ...schools]);
        toast.success("School created successfully");
    };

    const handleEditSave = (formData: any) => {
        if (!selectedSchool) return;
        setSchools(schools.map(s =>
            s.id === selectedSchool.id ? {
                ...s,
                ...formData,
                schoolType: formData.schoolType as 'government' | 'private' | 'aided',
                board: formData.board as 'CBSE' | 'ICSE' | 'State Board',
                subscriptionPlan: formData.subscriptionPlan as 'basic' | 'standard' | 'premium'
            } : s
        ));
        SchoolService.update(selectedSchool.id, formData);
        toast.success("School details updated");
    };

    const handleDelete = () => {
        if (!selectedSchool) return;
        SchoolService.delete(selectedSchool.id);
        setSchools(schools.filter(s => s.id !== selectedSchool.id));
        setIsDeleteOpen(false);
        toast.success("School deactivated/deleted");
    };

    const handleSaveAccess = (data: any) => {
        if (!selectedSchool) return;
        SchoolService.updateAccess(selectedSchool.id, data);
        toast.success("Access settings updated");
    };

    // Open handlers
    const openView = (school: School) => { setSelectedSchool(school); setIsDetailsOpen(true); };
    const openEdit = (school: School) => { setSelectedSchool(school); setIsEditOpen(true); };
    const openAccess = (school: School) => { setSelectedSchool(school); setIsAccessOpen(true); };
    const openAnalytics = (school: School) => { setSelectedSchool(school); setIsAnalyticsOpen(true); };
    const openDelete = (school: School) => { setSelectedSchool(school); setIsDeleteOpen(true); };

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
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
                confirmLabel="Deactivate"
            />
        </DashboardLayout>
    );
}
