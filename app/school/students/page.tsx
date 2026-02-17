'use client';

import { useState } from 'react';
import { Search, Download, Plus, User } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools, mockStudents } from '@/data/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { StudentService } from '@/data/services/student.service';
import { SchoolService } from '@/data/services/school.service';
import { SchoolStudentTable } from '@/components/school/students/SchoolStudentTable';
import { SchoolStudentViewSheet } from '@/components/school/students/SchoolStudentViewSheet';
import { SchoolStudentFormSheet } from '@/components/school/students/SchoolStudentFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function SchoolStudentsPage() {
    const school = SchoolService.getAll()[0];
    const [students, setStudents] = useState(StudentService.getAll().filter(s => s.schoolId === school.id));
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
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
        return matchesSearch && matchesGrade;
    });

    const handleExport = () => {
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

    const handleAddStudent = (formData: any) => {
        const newStudent = StudentService.create({
            ...formData,
            schoolId: school.id,
            schoolName: school.name,
            enrolledCourses: [],
            completedCourses: [],
            city: school.city,
            state: school.state,
            role: 'student'
        });

        if (newStudent) {
            setStudents([newStudent, ...students]);
            toast.success("Student enrolled successfully");
        }
    };

    const handleEditSave = (formData: any) => {
        if (!selectedStudent) return;
        const updated = StudentService.update(selectedStudent.id, {
            ...formData,
            status: formData.status as 'active' | 'inactive'
        });

        if (updated) {
            setStudents(students.map(s => s.id === selectedStudent.id ? updated : s));
            toast.success("Student details updated");
        }
    };

    const handleDelete = () => {
        if (!selectedStudent) return;
        const success = StudentService.delete(selectedStudent.id);
        if (success) {
            setStudents(students.filter(s => s.id !== selectedStudent.id));
            setIsDeleteOpen(false);
            toast.success("Student removed from school registry");
        }
    };

    const openView = (student: any) => { setSelectedStudent(student); setIsViewOpen(true); };
    const openEdit = (student: any) => { setSelectedStudent(student); setIsEditOpen(true); };
    const openDelete = (student: any) => { setSelectedStudent(student); setIsDeleteOpen(true); };

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
