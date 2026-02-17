
'use client';

import { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    Users,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin } from '@/data/users';
import { StudentService } from '@/data/services/student.service';
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

// Refactored Components
import { StudentTable } from '@/components/admin/students/StudentTable';
import { StudentViewSheet } from '@/components/admin/students/StudentViewSheet';
import { StudentFormSheet } from '@/components/admin/students/StudentFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Student } from '@/data/users';

export default function AdminStudentsPage() {
    const admin = mockSuperAdmin;

    // Initial data load
    const [students, setStudents] = useState<Student[]>(StudentService.getAll());
    const schools = StudentService.getSchools();

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
                StudentService.getSchoolName(s.schoolId),
                s.grade,
                s.status,
                s.enrolledCourses.length
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

    const handleDelete = () => {
        if (!selectedStudent) return;
        StudentService.delete(selectedStudent.id);
        setStudents(students.filter(s => s.id !== selectedStudent.id));
        setIsDeleteOpen(false);
        toast.success("Student suspended successfully");
    };

    const handleEditSave = (formData: any) => {
        if (!selectedStudent) return;

        const updated = StudentService.update(selectedStudent.id, {
            ...formData,
            schoolName: StudentService.getSchoolName(formData.schoolId),
        });

        if (updated) {
            setStudents(students.map(s => s.id === selectedStudent.id ? updated : s));
            toast.success("Student details updated");
        }
    };

    const handleAddStudent = (formData: any) => {
        const newStudent = StudentService.create({
            ...formData,
            schoolName: StudentService.getSchoolName(formData.schoolId),
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
            setStudents([newStudent, ...students]);
            toast.success("New student added successfully");
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
                />

                {/* Edit Student Sheet */}
                <StudentFormSheet
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    mode="edit"
                    initialData={selectedStudent}
                    onSubmit={handleEditSave}
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
