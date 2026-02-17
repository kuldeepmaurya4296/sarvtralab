'use client';

import { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    Filter,
    MoreVertical,
    Users,
    MapPin,
    School,
    Trash2,
    Edit,
    Eye,
    FileText,
    Phone,
    Calendar,
    User,
    Mail,
    Shield,
    BookOpen,
    Activity,
    Target,
    Clock,
    TrendingUp,
    Award
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockStudents, mockSchools } from '@/data/users';
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
import { Textarea } from "@/components/ui/textarea";
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

export default function AdminStudentsPage() {
    const admin = mockSuperAdmin;
    const allStudents = mockStudents;
    const allSchools = mockSchools;

    const [students, setStudents] = useState(allStudents);
    const [searchQuery, setSearchQuery] = useState('');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');

    // Action states
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Derived performance data
    const performanceData = selectedStudent ? getMockPerformance(selectedStudent.id) : null;

    // Form states for add/edit
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        grade: '',
        schoolId: '',
        status: 'active'
    });

    // Filter logic
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSchool = schoolFilter === 'all' || student.schoolId === schoolFilter;
        const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;

        return matchesSearch && matchesSchool && matchesGrade;
    });

    const getSchoolName = (schoolId: string) => {
        const school = allSchools.find(s => s.id === schoolId);
        return school ? school.name : 'Unknown School';
    };

    // Handlers
    const handleExport = () => {
        const headers = ['ID', 'Name', 'Email', 'School', 'Grade', 'Status', 'Courses Count'];
        const csvContent = [
            headers.join(','),
            ...students.map(s => [
                s.id,
                `"${s.name}"`,
                s.email,
                getSchoolName(s.schoolId),
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
        setStudents(students.filter(s => s.id !== selectedStudent.id));
        setIsDeleteOpen(false);
        toast.success("Student suspended successfully");
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

    const handleAddStudent = () => {
        const newStudent = {
            id: `GEN-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            status: formData.status as 'active' | 'inactive',
            enrolledCourses: [],
            role: 'student' as const,
            // Mock data for new students since form doesn't capture these
            createdAt: new Date().toISOString().split('T')[0],
            city: 'New City',
            state: 'State',
            parentName: 'Parent Name',
            parentPhone: '000-000-0000'
        };
        // @ts-ignore
        setStudents([newStudent, ...students]);
        setIsAddOpen(false);
        setFormData({ name: '', email: '', grade: '', schoolId: '', status: 'active' }); // Reset form
        toast.success("New student added successfully");
    };

    const openEdit = (student: any) => {
        setSelectedStudent(student);
        setFormData({
            name: student.name,
            email: student.email,
            grade: student.grade,
            schoolId: student.schoolId,
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
                            onClick={() => {
                                setFormData({ name: '', email: '', grade: '', schoolId: '', status: 'active' });
                                setIsAddOpen(true);
                            }}
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
                                        {allSchools.map(school => (
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
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>School</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Enrolled Courses</TableHead>
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
                                            <TableRow
                                                key={student.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => {
                                                    // Prevent open details when clicking actions
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
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <School className="h-3 w-3" />
                                                        <span className="text-sm">{getSchoolName(student.schoolId)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{student.grade}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                        {student.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{student.enrolledCourses.length}</span>
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
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>
                                                                Copy ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => openView(student)}>
                                                                <Eye className="mr-2 h-4 w-4" /> View Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEdit(student)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => openDelete(student)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Suspend User
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
                    <SheetContent className="overflow-y-auto sm:max-w-xl p-0">
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
                                                <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {selectedStudent.email}
                                                    </div>
                                                    <span className="hidden sm:inline">•</span>
                                                    <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'} className="capitalize w-fit">
                                                        {selectedStudent.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Tabs defaultValue="profile" className="w-full">
                                        <div className="px-6 pt-4">
                                            <TabsList className="w-full grid grid-cols-2">
                                                <TabsTrigger value="profile">Profile Overview</TabsTrigger>
                                                <TabsTrigger value="performance">Performance Report</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="profile" className="p-6 space-y-8 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Academic Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                                                        <School className="h-4 w-4" />
                                                        Academic Information
                                                    </h4>
                                                    <Card className="border-none shadow-sm bg-muted/20">
                                                        <CardContent className="p-4 space-y-3 text-sm">
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-muted-foreground">School</span>
                                                                <span className="font-medium text-right">{getSchoolName(selectedStudent.schoolId)}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-muted-foreground">Student ID</span>
                                                                <span className="font-mono">{selectedStudent.id}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Grade</span>
                                                                <span className="font-medium">{selectedStudent.grade}</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>

                                                {/* Personal Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                                                        <User className="h-4 w-4" />
                                                        Personal Details
                                                    </h4>
                                                    <Card className="border-none shadow-sm bg-muted/20">
                                                        <CardContent className="p-4 space-y-3 text-sm">
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-muted-foreground">Joined</span>
                                                                <span>{new Date(selectedStudent.createdAt || Date.now()).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Location</span>
                                                                <span className="text-right">
                                                                    {selectedStudent.city || 'N/A'}, {selectedStudent.state || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Parent Info */}
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                                                    <Shield className="h-4 w-4" />
                                                    Guardian Information
                                                </h4>
                                                <div className="bg-muted/30 p-4 rounded-md text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Parent/Guardian Name</span>
                                                        <span className="font-medium block mt-1">{selectedStudent.parentName || 'Not Provided'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Contact Number</span>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                                            <span className="font-medium">{selectedStudent.parentPhone || 'Not Provided'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Enrolled Courses */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                                                        <BookOpen className="h-4 w-4" />
                                                        Enrolled Courses ({selectedStudent.enrolledCourses.length})
                                                    </h4>
                                                </div>

                                                {selectedStudent.enrolledCourses.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {selectedStudent.enrolledCourses.map((courseId: string, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                                        C{idx + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium">Course {courseId}</p>
                                                                        <p className="text-xs text-muted-foreground">Enrolled active student</p>
                                                                    </div>
                                                                </div>
                                                                <Badge variant="outline" className="text-[10px]">Active</Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 border rounded-md border-dashed">
                                                        <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm text-muted-foreground">No courses enrolled yet.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions Footer */}
                                            <div className="pt-4 flex gap-2">
                                                <Button className="flex-1" onClick={() => { setIsViewOpen(false); openEdit(selectedStudent); }}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                                </Button>
                                                <Button variant="destructive" className="flex-1" onClick={() => { setIsViewOpen(false); openDelete(selectedStudent); }}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Suspend
                                                </Button>
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
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit Student</SheetTitle>
                            <SheetDescription>
                                Update student details. Click save when you're done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="grade" className="text-right">Grade</Label>
                                <Select
                                    value={formData.grade}
                                    onValueChange={(val) => setFormData({ ...formData, grade: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(g => (
                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="school" className="text-right">School</Label>
                                <Select
                                    value={formData.schoolId}
                                    onValueChange={(val) => setFormData({ ...formData, schoolId: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select school" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allSchools.map(school => (
                                            <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </SheetClose>
                            <Button onClick={handleEditSave}>Save Changes</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                {/* Add Student Sheet */}
                <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New Student</SheetTitle>
                            <SheetDescription>
                                Create a new student account.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-name" className="text-right">Name</Label>
                                <Input
                                    id="new-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-email" className="text-right">Email</Label>
                                <Input
                                    id="new-email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-grade" className="text-right">Grade</Label>
                                <Select
                                    value={formData.grade}
                                    onValueChange={(val) => setFormData({ ...formData, grade: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(g => (
                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-school" className="text-right">School</Label>
                                <Select
                                    value={formData.schoolId}
                                    onValueChange={(val) => setFormData({ ...formData, schoolId: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select school" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allSchools.map(school => (
                                            <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </SheetClose>
                            <Button onClick={handleAddStudent}>Create Student</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                {/* Delete Confirmation */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the student account
                                and remove their data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Suspend/Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
}
