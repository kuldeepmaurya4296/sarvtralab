'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Plus, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Teacher, School, SuperAdmin } from '@/data/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { toast } from 'sonner';

// Actions
import { getAllTeachers, createTeacher, updateTeacher, deleteTeacher, assignSchools } from '@/lib/actions/teacher.actions';
import { getAllSchools } from '@/lib/actions/school.actions';

// Components
import { TeacherTable } from '@/components/admin/teachers/TeacherTable';
import { TeacherViewSheet } from '@/components/admin/teachers/TeacherViewSheet';
import { TeacherFormSheet } from '@/components/admin/teachers/TeacherFormSheet';
import { TeacherAssignDialog } from '@/components/admin/teachers/TeacherAssignDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminTeachersPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);

    // UI States
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'superadmin')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const loadData = async () => {
            if (user?.role === 'superadmin') {
                try {
                    const [teachersData, schoolsData] = await Promise.all([
                        getAllTeachers(),
                        getAllSchools()
                    ]);
                    setTeachers(teachersData);
                    setSchools(schoolsData);
                } catch (error) {
                    console.error("Failed to load data", error);
                    toast.error("Failed to load data");
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) loadData();
    }, [user, isAuthLoading]);

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleAddTeacher = async (formData: any) => {
        try {
            const createdTeacher = await createTeacher({
                ...formData,
                password: 'password123', // Default password logic
                role: 'teacher',
                assignedSchools: [],
                assignedCourses: []
            });

            if (createdTeacher) {
                setTeachers(prev => [createdTeacher, ...prev]);
                toast.success("Teacher added successfully");
                setIsAddOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to add teacher");
        }
    };

    const handleEditSave = async (formData: any) => {
        if (!selectedTeacher) return;
        try {
            const updated = await updateTeacher(selectedTeacher.id, formData);
            if (updated) {
                setTeachers(prev => prev.map(t => t.id === selectedTeacher.id ? updated : t));
                toast.success("Teacher details updated");
                setIsEditOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update teacher");
        }
    };

    const handleDelete = async () => {
        if (!selectedTeacher) return;
        try {
            const success = await deleteTeacher(selectedTeacher.id);
            if (success) {
                setTeachers(prev => prev.filter(t => t.id !== selectedTeacher.id));
                setIsDeleteOpen(false);
                toast.success("Teacher account deactivated");
            }
        } catch (error) {
            toast.error("Failed to delete teacher");
        }
    };

    const handleAssignSchools = async (schoolIds: string[]) => {
        if (!selectedTeacher) return;
        try {
            const success = await assignSchools(selectedTeacher.id, schoolIds);
            if (success) {
                setTeachers(prev =>
                    prev.map(t =>
                        t.id === selectedTeacher.id ? { ...t, assignedSchools: schoolIds } : t
                    )
                );
                toast.success("School assignments updated");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to assign schools");
        }
    };

    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'Specialization', 'Experience', 'Status'];
        const csvContent = [
            headers.join(','),
            ...teachers.map(t => [
                t.id, `"${t.name}"`, t.email, `"${t.specialization}"`, t.experience, t.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teachers-export.csv';
        a.click();
        toast.success("Exported teacher list");
    };

    // Open handlers
    const openView = (teacher: Teacher) => { setSelectedTeacher(teacher); setIsViewOpen(true); };
    const openEdit = (teacher: Teacher) => { setSelectedTeacher(teacher); setIsEditOpen(true); };
    const openAssign = (teacher: Teacher) => { setSelectedTeacher(teacher); setIsAssignOpen(true); };
    const openDelete = (teacher: Teacher) => { setSelectedTeacher(teacher); setIsDeleteOpen(true); };

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;

    const admin = user as SuperAdmin;

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Manage Teachers
                        </h1>
                        <p className="text-muted-foreground">
                            Global teacher registry and assignments
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
                            Add Teacher
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Registered Teachers</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search teachers..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredTeachers.length} of {teachers.length} qualified instructors
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TeacherTable
                            teachers={filteredTeachers}
                            onView={openView}
                            onEdit={openEdit}
                            onDelete={openDelete}
                            onAssign={openAssign}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modals and Sheets */}
            <TeacherViewSheet
                teacher={selectedTeacher}
                open={isViewOpen}
                onOpenChange={setIsViewOpen}
                onEdit={openEdit}
                onAssign={openAssign}
                onDelete={openDelete}
            />

            <TeacherFormSheet
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                mode="add"
                onSubmit={handleAddTeacher}
            />

            <TeacherFormSheet
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                mode="edit"
                initialData={selectedTeacher}
                onSubmit={handleEditSave}
            />

            <TeacherAssignDialog
                teacher={selectedTeacher}
                open={isAssignOpen}
                onOpenChange={setIsAssignOpen}
                onSave={handleAssignSchools}
                schools={schools}
            />

            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDelete}
                title="Are you absolutely sure?"
                description={<>This will deactivate <strong>{selectedTeacher?.name}&apos;s</strong> account and revoke their access to the platform.</>}
                confirmLabel="Deactivate"
            />
        </DashboardLayout>
    );
}
