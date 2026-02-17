'use client';

import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    MapPin,
    User,
    GraduationCap,
    MoreVertical,
    School as SchoolIcon,
    BookOpen
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockGovtOrgs, mockSchools, mockStudents, Student } from '@/data/users';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GovtStudentsPage() {
    // Assuming the first govt org is the logged-in user for now
    const govtOrg = mockGovtOrgs[0];

    // Get schools assigned to this govt org to filter students
    const assignedSchoolIds = govtOrg.assignedSchools || [];

    // Filter students belonging to these schools
    const myStudents = mockStudents.filter(student => assignedSchoolIds.includes(student.schoolId));

    // Get unique grades and school names for filters
    const grades = Array.from(new Set(myStudents.map(s => s.grade))).sort();
    const schoolOptions = mockSchools.filter(s => assignedSchoolIds.includes(s.id));

    const [searchQuery, setSearchQuery] = useState('');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [schoolFilter, setSchoolFilter] = useState('all');

    // Filter logic
    const filteredStudents = myStudents.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
        const matchesSchool = schoolFilter === 'all' || student.schoolId === schoolFilter;

        return matchesSearch && matchesGrade && matchesSchool;
    });

    return (
        <DashboardLayout role="govt" userName={govtOrg.name} userEmail={govtOrg.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Student Enrollment
                        </h1>
                        <p className="text-muted-foreground">
                            Monitor student progress across schools in your jurisdiction
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
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
                                        placeholder="Search by name, parent..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Filter by School" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Schools</SelectItem>
                                        {schoolOptions.map(school => (
                                            <SelectItem key={school.id} value={school.id}>
                                                {school.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Grades</SelectItem>
                                        {grades.map(grade => (
                                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredStudents.length} of {myStudents.length} students across {schoolOptions.length} schools
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>School & Grade</TableHead>
                                        <TableHead>Parent / Contact</TableHead>
                                        <TableHead>Courses Enrolled</TableHead>
                                        <TableHead>Performance</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No students found matching your filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} />
                                                            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground">{student.name}</span>
                                                            <span className="text-xs text-muted-foreground">{student.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1 text-sm font-medium">
                                                            <SchoolIcon className="h-3 w-3 text-muted-foreground" />
                                                            {student.schoolName}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground bg-muted w-fit px-1.5 py-0.5 rounded mt-0.5">
                                                            {student.grade}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{student.parentName}</span>
                                                        <span className="text-xs text-muted-foreground">{student.parentPhone}</span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{student.parentEmail}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="secondary" className="w-fit">
                                                            {student.enrolledCourses.length} Active Courses
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <BookOpen className="h-3 w-3" />
                                                            {student.completedCourses.length} Completed
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {/* Placeholder for performance metric logic if data available, else random mock or N/A */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full bg-secondary rounded-full h-2 w-16">
                                                            <div
                                                                className="bg-primary h-2 rounded-full"
                                                                style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>
                                                                Copy Student ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>View Academic Record</DropdownMenuItem>
                                                            <DropdownMenuItem>Attendance Report</DropdownMenuItem>
                                                            <DropdownMenuItem>Contact Parent</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
