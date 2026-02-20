
'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Plus,
    Users,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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
import { toast } from "sonner";

// Actions
import { getAllStudents, createStudent, updateStudent, deleteStudent } from '@/lib/actions/student.actions';
import { getAllSchools, createSchool } from '@/lib/actions/school.actions';

// Refactored Components
import { StudentTable } from '@/components/admin/students/StudentTable';
import { StudentViewSheet } from '@/components/admin/students/StudentViewSheet';
import { StudentFormSheet } from '@/components/admin/students/StudentFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Student, School, SuperAdmin } from '@/data/users';

export default function AdminStudentsPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // Data States
    const [students, setStudents] = useState<Student[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');

    // UI States
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
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
                    const [studentsData, schoolsData] = await Promise.all([
                        getAllStudents(),
                        getAllSchools()
                    ]);
                    setStudents(studentsData);
                    setSchools(schoolsData);
                } catch (error) {
                    toast.error("Failed to load data");
                    console.error(error);
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) loadData();
    }, [user, isAuthLoading]);

    // Filter logic
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSchool = schoolFilter === 'all' || student.schoolId === schoolFilter;
        const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;

        return matchesSearch && matchesSchool && matchesGrade;
    });

    // Handlers
    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'School', 'Grade', 'Status', 'Courses Count'];
        const csvContent = [
            headers.join(','),
            ...students.map(s => [
                s.id,
                `"${s.name}"`,
                s.email,
                s.schoolName,
                s.grade,
                s.status,
                s.enrolledCourses?.length || 0
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students-export.csv';
        a.click();

        toast.success("Exported student data to CSV");
    };

    const handleDelete = async () => {
        if (!selectedStudent) return;
        try {
            await deleteStudent(selectedStudent.id);
            setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
            setIsDeleteOpen(false);
            toast.success("Student suspended successfully");
        } catch (error) {
            toast.error("Failed to suspend student");
        }
    };

    const handleEditSave = async (formData: any) => {
        if (!selectedStudent) return;

        try {
            const schoolName = schools.find(s => s.id === formData.schoolId)?.name || 'Unknown School';
            const updated = await updateStudent(selectedStudent.id, {
                ...formData,
                schoolName,
            });

            if (updated) {
                setStudents(prev => prev.map(s => s.id === selectedStudent.id ? updated : s));
                toast.success("Student details updated");
                setIsEditOpen(false);
            }
        } catch (error) {
            toast.error("Failed to update student");
        }
    };

    const handleAddStudent = async (formData: any) => {
        try {
            let schoolId = formData.schoolId;
            let schoolName = '';

            // 1. Handle New School Creation
            if (schoolId === 'new_school') {
                if (!formData.newSchoolName || !formData.newSchoolEmail) {
                    toast.error("Please enter new school name and email");
                    return;
                }

                toast.loading("Creating new school...");
                const newSchool = await createSchool({
                    name: formData.newSchoolName,
                    email: formData.newSchoolEmail
                });

                if (newSchool) {
                    schoolId = newSchool.id;
                    schoolName = newSchool.name;
                    setSchools(prev => [...prev, newSchool]);
                    toast.success(`School "${schoolName}" created!`);
                } else {
                    throw new Error("Failed to create school");
                }
            } else {
                schoolName = schools.find(s => s.id === schoolId)?.name || 'Unknown School';
            }

            // 2. Proceed with Student Creation
            const newStudent = await createStudent({
                ...formData,
                schoolId,
                schoolName,
                enrolledCourses: [],
                role: 'student',
                city: 'New City',
                state: 'State',
                parentName: 'Parent Name',
                parentPhone: '000-000-0000',
                completedCourses: [],
                parentEmail: '',
                dateOfBirth: '',
                address: '',
                pincode: '',
                status: 'active'
            });

            if (newStudent) {
                setStudents(prev => [newStudent, ...prev]);
                toast.success("New student added successfully");
                setIsAddOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to add student");
        }
    };

    const openView = (student: Student) => {
        setSelectedStudent(student);
        setIsViewOpen(true);
    };

    const openEdit = (student: Student) => {
        setSelectedStudent(student);
        setIsEditOpen(true);
    };

    const openDelete = (student: Student) => {
        setSelectedStudent(student);
        setIsDeleteOpen(true);
    };

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;

    const admin = user as SuperAdmin;

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Users className="h-6 w-6 text-primary" />
                            Manage Students
                        </h1>
                        <p className="text-muted-foreground">
                            Global student registry and management
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
                            Add Student
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>All Students</CardTitle>
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
                                <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by School" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Schools</SelectItem>
                                        {schools.map(school => (
                                            <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px]">
                                        <SelectValue placeholder="Filter by Grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Grades</SelectItem>
                                        <SelectItem value="Class 4">Class 4</SelectItem>
                                        <SelectItem value="Class 5">Class 5</SelectItem>
                                        <SelectItem value="Class 6">Class 6</SelectItem>
                                        <SelectItem value="Class 7">Class 7</SelectItem>
                                        <SelectItem value="Class 8">Class 8</SelectItem>
                                        <SelectItem value="Class 9">Class 9</SelectItem>
                                        <SelectItem value="Class 10">Class 10</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredStudents.length} of {students.length} registered students
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StudentTable
                            students={filteredStudents}
                            onView={openView}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    </CardContent>
                </Card>

                {/* Modals and Sheets */}
                <StudentViewSheet
                    student={selectedStudent}
                    open={isViewOpen}
                    onOpenChange={setIsViewOpen}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />

                {/* Add Student Sheet */}
                <StudentFormSheet
                    open={isAddOpen}
                    onOpenChange={setIsAddOpen}
                    mode="add"
                    onSubmit={handleAddStudent}
                    schools={schools} // Pass schools prop if supported? Check component later.
                // Wait, StudentFormSheet might need schools to populate dropdown.
                />

                {/* Edit Student Sheet */}
                <StudentFormSheet
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    mode="edit"
                    initialData={selectedStudent}
                    onSubmit={handleEditSave}
                    schools={schools}
                />

                {/* Delete Confirmation */}
                <ConfirmDialog
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    onConfirm={handleDelete}
                    title="Are you absolutely sure?"
                    description={<>This will suspend the student account for <strong>{selectedStudent?.name}</strong>. They will no longer be able to access the platform.</>}
                    confirmLabel="Suspend Student"
                />
            </div>
        </DashboardLayout>
    );
}
