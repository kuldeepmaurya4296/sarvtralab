'use client';

import { useState } from 'react';
import { Search, Download, GraduationCap } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockGovtOrgs, mockSchools, mockStudents } from '@/data/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { GovtStudentTable } from '@/components/govt/students/GovtStudentTable';
import { GovtStudentViewSheet } from '@/components/govt/students/GovtStudentViewSheet';
import { GovtStudentContactDialog } from '@/components/govt/students/GovtStudentContactDialog';

export default function GovtStudentsPage() {
    const govtOrg = mockGovtOrgs[0];
    const assignedSchoolIds = govtOrg.assignedSchools || [];
    const myStudents = mockStudents.filter(student => assignedSchoolIds.includes(student.schoolId));
    const grades = Array.from(new Set(myStudents.map(s => s.grade))).sort();
    const schoolOptions = mockSchools.filter(s => assignedSchoolIds.includes(s.id));

    const [searchQuery, setSearchQuery] = useState('');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const filteredStudents = myStudents.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
        const matchesSchool = schoolFilter === 'all' || student.schoolId === schoolFilter;
        return matchesSearch && matchesGrade && matchesSchool;
    });

    const handleExport = () => {
        const headers = ['ID', 'Name', 'School', 'Grade', 'Parent Name', 'Parent Phone', 'Courses'];
        const csvContent = [
            headers.join(','),
            ...myStudents.map(s => [s.id, `"${s.name}"`, `"${s.schoolName}"`, s.grade, `"${s.parentName}"`, s.parentPhone, s.enrolledCourses.length].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'govt-students-export.csv';
        a.click();
        toast.success("Exported student data");
    };

    const openView = (student: any) => { setSelectedStudent(student); setIsViewOpen(true); };
    const openContact = (student: any) => { setSelectedStudent(student); setIsContactOpen(true); };

    return (
        <DashboardLayout role="govt" userName={govtOrg.name} userEmail={govtOrg.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" /> Student Enrollment
                        </h1>
                        <p className="text-muted-foreground">Monitor student progress across schools in your jurisdiction</p>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" /> Export Data
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>All Students</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search by name, parent..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                                <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                                    <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by School" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Schools</SelectItem>
                                        {schoolOptions.map(school => (<SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Grade" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Grades</SelectItem>
                                        {grades.map(grade => (<SelectItem key={grade} value={grade}>{grade}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredStudents.length} of {myStudents.length} students across {schoolOptions.length} schools
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GovtStudentTable students={filteredStudents} onView={openView} onContact={openContact} />
                    </CardContent>
                </Card>
            </div>

            <GovtStudentViewSheet student={selectedStudent} open={isViewOpen} onOpenChange={setIsViewOpen} />
            <GovtStudentContactDialog student={selectedStudent} open={isContactOpen} onOpenChange={setIsContactOpen} />
        </DashboardLayout>
    );
}
