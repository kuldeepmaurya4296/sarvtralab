'use client';

import { useState } from 'react';
import { Search, Download, Plus, GraduationCap } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, Teacher } from '@/data/users';
import { TeacherService } from '@/data/services/teacher.service';
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

// Refactored Components
import { TeacherTable } from '@/components/admin/teachers/TeacherTable';
import { TeacherViewSheet } from '@/components/admin/teachers/TeacherViewSheet';
import { TeacherFormSheet } from '@/components/admin/teachers/TeacherFormSheet';
import { TeacherAssignDialog } from '@/components/admin/teachers/TeacherAssignDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminTeachersPage() {
    const admin = mockSuperAdmin;
    const [teachers, setTeachers] = useState<Teacher[]>(TeacherService.getAll());
    const [searchQuery, setSearchQuery] = useState('');

    // UI States
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleAddTeacher = (formData: any) => {
        const createdTeacher = TeacherService.create({
            ...formData,
            password: 'password123',
            status: formData.status as 'active' | 'inactive',
            role: 'teacher',
            assignedSchools: [],
            assignedCourses: []
        });

        if (createdTeacher) {
            setTeachers([createdTeacher, ...teachers]);
            toast.success("Teacher added successfully");
        }
    };

    const handleEditSave = (formData: any) => {
        if (!selectedTeacher) return;
        const updated = TeacherService.update(selectedTeacher.id, formData);
        if (updated) {
            setTeachers(teachers.map(t => t.id === selectedTeacher.id ? updated : t));
            toast.success("Teacher details updated");
        }
    };

    const handleDelete = () => {
        if (!selectedTeacher) return;
        TeacherService.delete(selectedTeacher.id);
        setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
        setIsDeleteOpen(false);
        toast.success("Teacher account deactivated");
    };

    const handleAssignSchools = (schoolIds: string[]) => {
        if (!selectedTeacher) return;
        TeacherService.assignSchools(selectedTeacher.id, schoolIds);
        setTeachers(teachers.map(t =>
            t.id === selectedTeacher.id ? { ...t, assignedSchools: schoolIds } : t
        ));
        toast.success("School assignments updated");
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
