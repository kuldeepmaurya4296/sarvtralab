'use client';

import { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    Filter,
    MoreVertical,
    User,
    BookOpen,
    Eye,
    Edit,
    Trash2,
    Mail,
    Phone,
    School,
    Shield,
    Calendar,
    FileText,
    BarChart,
    CheckCircle2,
    Clock,
    TrendingUp,
    Award,
    Activity,
    Target,
    Zap
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools, mockStudents } from '@/data/users';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Helper to generate consistent mock performance data based on student ID
const getMockPerformance = (studentId: string) => {
    // Deterministic random based on ID char codes
    const seed = studentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rand = (min: number, max: number) => min + (seed % (max - min + 1));

    return {
        attendance: Math.min(100, Math.max(70, rand(75, 98))),
        lecturesAttended: rand(40, 58),
        totalLectures: 60,
        timeSpent: `${rand(80, 150)}h ${rand(10, 50)}m`,
        avgScore: Math.min(100, rand(70, 95)),
        assignmentsCompleted: rand(15, 20),
        totalAssignments: 20,
        recentScores: [
            { subject: "Mathematics", score: rand(80, 98), date: "2024-02-15", type: "Quiz" },
            { subject: "Science", score: rand(75, 92), date: "2024-02-12", type: "Lab Report" },
            { subject: "History", score: rand(85, 95), date: "2024-02-10", type: "Essay" },
            { subject: "English", score: rand(78, 90), date: "2024-02-08", type: "Test" },
        ],
        monthlyActivity: [
            rand(40, 60), rand(50, 70), rand(60, 80), rand(70, 90), rand(80, 100), rand(75, 95)
        ] // Activity points for last 6 months
    };
};

export default function SchoolStudentsPage() {
    // Assuming the first school is the logged-in user
    const school = mockSchools[0];

    // Initial data
    const initialStudents = mockStudents.filter(student => student.schoolId === school.id);
    const [students, setStudents] = useState(initialStudents);
    const uniqueGrades = Array.from(new Set(initialStudents.map(s => s.grade))).sort();

    const [searchQuery, setSearchQuery] = useState('');
    const [gradeFilter, setGradeFilter] = useState('all');

    // Action states
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Derived performance data
    const performanceData = selectedStudent ? getMockPerformance(selectedStudent.id) : null;

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        grade: '',
        parentName: '',
        parentPhone: '',
        status: 'active'
    });

    // Filter logic
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;

        return matchesSearch && matchesGrade;
    });

    // Handlers
    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'Grade', 'Parent Name', 'Parent Phone', 'Status'];
        const csvContent = [
            headers.join(','),
            ...students.map(s => [
                s.id,
                `"${s.name}"`,
                s.email,
                s.grade,
                `"${s.parentName}"`,
                s.parentPhone,
                s.status
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

    const handleAddStudent = () => {
        const newStudent = {
            id: `STD-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            schoolId: school.id,
            enrolledCourses: [],
            completedCourses: [],
            status: formData.status as 'active' | 'inactive',
            role: 'student' as const,
            createdAt: new Date().toISOString(),
            city: school.city,
            state: school.state
        };
        // @ts-ignore
        setStudents([newStudent, ...students]);
        setIsAddOpen(false);
        resetForm();
        toast.success("Student enrolled successfully");
    };

    const handleEditSave = () => {
        if (!selectedStudent) return;
        setStudents(students.map(s =>
            s.id === selectedStudent.id
                ? { ...s, ...formData, status: formData.status as 'active' | 'inactive' }
                : s
        ));
        setIsEditOpen(false);
        toast.success("Student details updated");
    };

    const handleDelete = () => {
        if (!selectedStudent) return;
        setStudents(students.filter(s => s.id !== selectedStudent.id));
        setIsDeleteOpen(false);
        toast.success("Student removed from school registry");
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            grade: '',
            parentName: '',
            parentPhone: '',
            status: 'active'
        });
    };

    const openEdit = (student: any) => {
        setSelectedStudent(student);
        setFormData({
            name: student.name,
            email: student.email,
            grade: student.grade,
            parentName: student.parentName,
            parentPhone: student.parentPhone,
            status: student.status
        });
        setIsEditOpen(true);
    };

    const openView = (student: any) => {
        setSelectedStudent(student);
        setIsViewOpen(true);
    };

    const openDelete = (student: any) => {
        setSelectedStudent(student);
        setIsDeleteOpen(true);
    };

    return (
        <DashboardLayout role="school" userName={school.name} userEmail={school.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <User className="h-6 w-6 text-primary" />
                            Manage Students
                        </h1>
                        <p className="text-muted-foreground">
                            View and manage student enrollments and performance reports
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" />
                            Export List
                        </Button>
                        <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <SheetTrigger asChild>
                                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={resetForm}>
                                    <Plus className="h-4 w-4" />
                                    Add Student
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Enroll New Student</SheetTitle>
                                    <SheetDescription>
                                        Add a new student to your school registry.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="grade">Grade/Class</Label>
                                            <Select value={formData.grade} onValueChange={(val) => setFormData({ ...formData, grade: val })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(g => (
                                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="p-name">Parent Name</Label>
                                        <Input id="p-name" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="p-phone">Parent Phone</Label>
                                        <Input id="p-phone" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} />
                                    </div>
                                </div>
                                <SheetFooter>
                                    <Button onClick={handleAddStudent}>Enroll Student</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
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
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Parent Info</TableHead>
                                        <TableHead>Courses</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <TableRow
                                                key={student.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => {
                                                    if ((e.target as any).closest('.action-btn')) return;
                                                    openView(student);
                                                }}
                                            >
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
                                                    <Badge variant="outline">{student.grade}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{student.parentName}</span>
                                                        <span className="text-xs text-muted-foreground">{student.parentPhone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-medium">{student.enrolledCourses.length} Active</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                            {student.completedCourses?.length || 0} Completed
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                        {student.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 action-btn">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => openView(student)}>
                                                                <Eye className="mr-2 h-4 w-4" /> View Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEdit(student)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive" onClick={() => openDelete(student)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Remove Student
                                                            </DropdownMenuItem>
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

                {/* View Student Sheet */}
                <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <SheetContent className="overflow-y-auto sm:max-w-2xl p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Student Details</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-full">
                            {selectedStudent && performanceData && (
                                <div className="pb-8">
                                    <div className="bg-muted/30 p-6 border-b">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} />
                                                <AvatarFallback>{selectedStudent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 pt-1">
                                                <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {selectedStudent.email}
                                                    </div>
                                                    <span className="hidden sm:inline">•</span>
                                                    <Badge variant="outline" className="w-fit">{selectedStudent.grade}</Badge>
                                                    <span className="hidden sm:inline">•</span>
                                                    <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'} className="w-fit capitalized">
                                                        {selectedStudent.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="performance" className="w-full">
                                        <div className="px-6 pt-4">
                                            <TabsList className="w-full grid grid-cols-2">
                                                <TabsTrigger value="performance">Performance Report</TabsTrigger>
                                                <TabsTrigger value="profile">Profile Overview</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="profile" className="p-6 space-y-8 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold flex items-center gap-2 text-sm text-primary">
                                                        <User className="h-4 w-4" />
                                                        Personal Info
                                                    </h4>
                                                    <Card className="border-none shadow-sm bg-muted/20">
                                                        <CardContent className="p-4 space-y-3 text-sm">
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-muted-foreground">Student ID</span>
                                                                <span className="font-mono">{selectedStudent.id}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-muted-foreground">Joined Date</span>
                                                                <span>{new Date(selectedStudent.createdAt || Date.now()).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">City/State</span>
                                                                <span>{selectedStudent.city || 'N/A'}</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="font-semibold flex items-center gap-2 text-sm text-primary">
                                                        <Shield className="h-4 w-4" />
                                                        Guardian Info
                                                    </h4>
                                                    <Card className="border-none shadow-sm bg-muted/20">
                                                        <CardContent className="p-4 space-y-3 text-sm">
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-muted-foreground">Parent Name</span>
                                                                <span className="font-medium">{selectedStudent.parentName}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Phone Contact</span>
                                                                <span className="flex items-center gap-1 font-mono">
                                                                    <Phone className="h-3 w-3" />
                                                                    {selectedStudent.parentPhone}
                                                                </span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center gap-2 text-sm text-primary">
                                                    <BookOpen className="h-4 w-4" />
                                                    Current Enrollment
                                                </h4>
                                                {selectedStudent.enrolledCourses.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {selectedStudent.enrolledCourses.map((course: string, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 rounded-md border text-sm hover:bg-muted/50 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                        {idx + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium">Course Module {course}</p>
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                            <Clock className="h-3 w-3" /> In Progress
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                                        No active courses enrolled.
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="performance" className="p-6 space-y-8 mt-0">
                                            {/* Key Metrics */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attendance</span>
                                                        <Activity className="h-4 w-4 text-green-500" />
                                                    </div>
                                                    <div className="text-2xl font-bold">{performanceData.attendance}%</div>
                                                    <Progress value={performanceData.attendance} className="h-1.5" />
                                                    <div className="text-xs text-muted-foreground">{performanceData.lecturesAttended}/{performanceData.totalLectures} Lectures</div>
                                                </div>
                                                <div className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Score</span>
                                                        <Target className="h-4 w-4 text-blue-500" />
                                                    </div>
                                                    <div className="text-2xl font-bold">{performanceData.avgScore}%</div>
                                                    <Progress value={performanceData.avgScore} className="h-1.5 bg-blue-100" />
                                                    <div className="text-xs text-muted-foreground">Across all subjects</div>
                                                </div>
                                                <div className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Time Spent</span>
                                                        <Clock className="h-4 w-4 text-amber-500" />
                                                    </div>
                                                    <div className="text-2xl font-bold tracking-tight">{performanceData.timeSpent}</div>
                                                    <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-500 w-[70%]" />
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Total learning time</div>
                                                </div>
                                                <div className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Assignments</span>
                                                        <FileText className="h-4 w-4 text-purple-500" />
                                                    </div>
                                                    <div className="text-2xl font-bold">{performanceData.assignmentsCompleted}</div>
                                                    <Progress value={(performanceData.assignmentsCompleted / performanceData.totalAssignments) * 100} className="h-1.5 bg-purple-100" />
                                                    <div className="text-xs text-muted-foreground">of {performanceData.totalAssignments} completed</div>
                                                </div>
                                            </div>

                                            {/* Activity Chart Mockup */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center gap-2 text-sm">
                                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                    Learning Activity (Last 6 Months)
                                                </h4>
                                                <div className="h-48 w-full bg-muted/20 rounded-xl border flex items-end justify-between p-6 gap-2">
                                                    {performanceData.monthlyActivity.map((val, idx) => (
                                                        <div key={idx} className="flex flex-col items-center gap-2 w-full">
                                                            <div
                                                                className="w-full bg-primary/80 hover:bg-primary rounded-t-md transition-all duration-500 ease-in-out"
                                                                style={{ height: `${val}%` }}
                                                            />
                                                            <span className="text-xs text-muted-foreground">
                                                                {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][idx]}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Score Card */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold flex items-center gap-2 text-sm">
                                                        <Award className="h-4 w-4 text-muted-foreground" />
                                                        Recent Assessment Scores
                                                    </h4>
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs">View All</Button>
                                                </div>
                                                <div className="rounded-lg border bg-card">
                                                    {performanceData.recentScores.map((score, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${score.score >= 90 ? 'bg-green-100 text-green-700' :
                                                                        score.score >= 80 ? 'bg-blue-100 text-blue-700' :
                                                                            'bg-amber-100 text-amber-700'
                                                                    }`}>
                                                                    {score.score}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm">{score.subject}</p>
                                                                    <p className="text-xs text-muted-foreground">{score.type} • {score.date}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${score.score >= 90 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {score.score >= 90 ? 'Excellent' : score.score >= 80 ? 'Good' : 'Average'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-4">
                                                <Button className="w-full gap-2">
                                                    <Download className="h-4 w-4" /> Download Report PDF
                                                </Button>
                                                <Button variant="outline" className="w-full gap-2">
                                                    <Mail className="h-4 w-4" /> Email to Guardian
                                                </Button>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                        </ScrollArea>
                    </SheetContent>
                </Sheet>

                {/* Edit Student Sheet */}
                <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Edit Student Details</SheetTitle>
                            <SheetDescription>Update personal or academic information.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email Address</Label>
                                <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-grade">Grade</Label>
                                    <Select value={formData.grade} onValueChange={(val) => setFormData({ ...formData, grade: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(g => (
                                                <SelectItem key={g} value={g}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="edit-pname">Parent Name</Label>
                                <Input id="edit-pname" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-pphone">Parent Phone</Label>
                                <Input id="edit-pphone" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button onClick={handleEditSave}>Save Changes</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                {/* Delete Confirmation */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove student from registry?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will remove the student from your school's dashboard.
                                Their academic records may still be retained in the main system archives.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                Remove Student
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
}
