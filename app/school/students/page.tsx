'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";


import { getAllStudents, createStudent, updateStudent, deleteStudent } from '@/lib/actions/student.actions';
import { getSchoolById } from '@/lib/actions/school.actions'; // Ensure this exists
import { SchoolStudentTable } from '@/components/school/students/SchoolStudentTable';
import { SchoolStudentViewSheet } from '@/components/school/students/SchoolStudentViewSheet';
import { SchoolStudentFormSheet } from '@/components/school/students/SchoolStudentFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function SchoolStudentsPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [school, setSchool] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'school')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const loadData = async () => {
            if (user?.role === 'school') {
                try {
                    const [currentSchool, allStudents] = await Promise.all([
                        getSchoolById(user.id),
                        getAllStudents(user.id)
                    ]);

                    if (currentSchool) {
                        setSchool(currentSchool);
                        setStudents(allStudents);
                    } else {
                        toast.error("School profile not found");
                    }
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

    const uniqueGrades = Array.from(new Set(students.map(s => s.grade))).sort();
    const [searchQuery, setSearchQuery] = useState('');
    const [gradeFilter, setGradeFilter] = useState('all');

    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.parentName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
        return matchesSearch && matchesGrade;
    });

    const handleExport = () => {
        if (!students.length) return;
        const headers = ['ID', 'Name', 'Email', 'Grade', 'Parent Name', 'Parent Phone', 'Status'];
        const csvContent = [
            headers.join(','),
            ...students.map(s => [
                s.id, `"${s.name}"`, s.email, s.grade, `"${s.parentName}"`, s.parentPhone, s.status
            ].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students-export.csv';
        a.click();
        toast.success("Exported student list");
    };

    const handleAddStudent = async (formData: any) => {
        if (!school) return;

        try {
            const newStudent = await createStudent({
                ...formData,
                schoolId: school.id,
                schoolName: school.name,
                city: school.city,
                state: school.state,
                role: 'student', // Ensure role is set
                enrolledCourses: [],
                completedCourses: [],
                status: 'active'
            });

            if (newStudent) {
                setStudents(prev => [newStudent, ...prev]);
                toast.success("Student enrolled successfully");
                setIsAddOpen(false);
            }
        } catch (e) {
            toast.error("Failed to enroll student");
        }
    };

    const handleEditSave = async (formData: any) => {
        if (!selectedStudent) return;
        try {
            const updated = await updateStudent(selectedStudent.id, {
                ...formData,
                status: formData.status as 'active' | 'inactive'
            });

            if (updated) {
                setStudents(prev => prev.map(s => s.id === selectedStudent.id ? updated : s));
                toast.success("Student details updated");
                setIsEditOpen(false);
            }
        } catch (e) {
            toast.error("Failed to update student");
        }
    };

    const handleDelete = async () => {
        if (!selectedStudent) return;
        try {
            const success = await deleteStudent(selectedStudent.id);
            if (success) {
                setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
                setIsDeleteOpen(false);
                toast.success("Student removed from school registry");
            }
        } catch (e) {
            toast.error("Failed to remove student");
        }
    };

    const openView = (student: any) => { setSelectedStudent(student); setIsViewOpen(true); };
    const openEdit = (student: any) => { setSelectedStudent(student); setIsEditOpen(true); };
    const openDelete = (student: any) => { setSelectedStudent(student); setIsDeleteOpen(true); };

    if (isAuthLoading || isLoadingData || !school) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <DashboardLayout role="school" userName={school.name} userEmail={school.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <User className="h-6 w-6 text-primary" /> Manage Students
                        </h1>
                        <p className="text-muted-foreground">View and manage student enrollments and performance reports</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" /> Export List
                        </Button>
                        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsAddOpen(true)}>
                            <Plus className="h-4 w-4" /> Add Student
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Enrolled Students</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search students..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Grades</SelectItem>
                                        {uniqueGrades.map(grade => (
                                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredStudents.length} of {students.length} students
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SchoolStudentTable
                            students={filteredStudents}
                            onView={openView}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    </CardContent>
                </Card>
            </div>

            <SchoolStudentViewSheet student={selectedStudent} open={isViewOpen} onOpenChange={setIsViewOpen} />

            <SchoolStudentFormSheet open={isAddOpen} onOpenChange={setIsAddOpen} mode="add" onSubmit={handleAddStudent} />
            <SchoolStudentFormSheet open={isEditOpen} onOpenChange={setIsEditOpen} mode="edit" initialData={selectedStudent} onSubmit={handleEditSave} />

            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDelete}
                title="Remove student from registry?"
                description="This action will remove the student from your school's dashboard. Their academic records may still be retained in the main system archives."
                confirmLabel="Remove Student"
            />
        </DashboardLayout>
    );
}
