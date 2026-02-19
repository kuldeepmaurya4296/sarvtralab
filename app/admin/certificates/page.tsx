'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Award,
    Search,
    Download,
    CheckCircle2,
    XCircle,
    User,
    Eye,
    Mail,
    Phone,
    Printer,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { CertificateTemplate } from '@/components/admin/CertificateTemplate';
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
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { format } from 'date-fns';
// @ts-ignore
import JSZip from 'jszip';
// @ts-ignore
import { saveAs } from 'file-saver';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

// Actions
import { getAllCertificates, issueCertificate } from '@/lib/actions/certificate.actions';
import { getAllStudents } from '@/lib/actions/student.actions';
import { getAllCourses } from '@/lib/actions/course.actions';
import { getAllSchools } from '@/lib/actions/school.actions';
import { Student, School, SuperAdmin } from '@/data/users';
import { Course } from '@/data/courses';
import { Certificate } from '@/data/certificates';

export default function AdminCertificatesPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState<any[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [schools, setSchools] = useState<School[]>([]);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Detailed View State
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Preview Certificate State
    const [previewCertificate, setPreviewCertificate] = useState<any | null>(null);
    const certificateRef = useRef<HTMLDivElement>(null);

    // Bulk Download State
    const [isGeneratingZip, setIsGeneratingZip] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [currentGeneratingCert, setCurrentGeneratingCert] = useState<any | null>(null);
    const hiddenCertRef = useRef<HTMLDivElement>(null);
    const [selectedSchool, setSelectedSchool] = useState<string>('all');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');
    const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);

    // Auto-approve generic logic
    const [autoApproveEnabled, setAutoApproveEnabled] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'superadmin')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const loadData = async () => {
            if (user?.role === 'superadmin') {
                try {
                    const [certsData, studentsData, coursesData, schoolsData] = await Promise.all([
                        getAllCertificates(),
                        getAllStudents(),
                        getAllCourses(),
                        getAllSchools()
                    ]);

                    setCertificates(certsData);
                    setStudents(studentsData);
                    setCourses(coursesData);
                    setSchools(schoolsData);

                    // Derive requests logic
                    const pending: any[] = [];
                    studentsData.forEach((s: Student) => {
                        s.completedCourses?.forEach((cId: string) => {
                            const hasCert = certsData.some(cert => cert.studentId === s.id && cert.courseId === cId);
                            if (!hasCert) {
                                pending.push({
                                    id: `req-${s.id}-${cId}`,
                                    studentId: s.id,
                                    courseId: cId,
                                    requestDate: new Date().toISOString(),
                                    progress: 100,
                                    status: 'pending'
                                });
                            }
                        });
                    });
                    setRequests(pending);

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

    // Helpers
    const getStudent = (id: string) => students.find(s => s.id === id);
    const getCourse = (id: string) => courses.find(c => c.id === id);

    const getStudentCertificates = (studentId: string) => {
        return certificates.filter(c => c.studentId === studentId);
    };

    // Filters
    const filteredRequests = requests.filter(req => {
        const student = getStudent(req.studentId);
        const searchMatch = student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.id.toLowerCase().includes(searchQuery.toLowerCase());
        return searchMatch && req.status === 'pending';
    });

    const filteredIssued = certificates.filter(cert => {
        const student = getStudent(cert.studentId);
        const matchesSearch = student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSchool = selectedSchool === 'all' || student?.schoolId === selectedSchool;
        const matchesCourse = selectedCourse === 'all' || cert.courseId === selectedCourse;

        return matchesSearch && matchesSchool && matchesCourse;
    });

    // Handlers
    const handleApprove = async (reqId: string) => {
        const req = requests.find(r => r.id === reqId);
        if (!req) return;

        try {
            const newCert = await issueCertificate({
                studentId: req.studentId,
                courseId: req.courseId,
                issueDate: new Date().toISOString().split('T')[0]
            });

            if (newCert) {
                setCertificates(prev => [newCert, ...prev]);
                setRequests(prev => prev.filter(r => r.id !== reqId));
                toast.success(`Certificate issued for ${getStudent(req.studentId)?.name}`);
            }
        } catch (error) {
            toast.error("Failed to issue certificate");
        }
    };

    const handleReject = (reqId: string) => {
        setRequests(prev => prev.filter(r => r.id !== reqId));
        toast.info("Certificate request rejected");
    };

    const handleBulkApprove = async () => {
        if (selectedRequests.length === 0) return;

        toast.loading("Issuing certificates...");
        let successCount = 0;

        for (const id of selectedRequests) {
            await handleApprove(id);
            successCount++; // Naive count, actual success depends on handleApprove result but simpler for now
        }

        setSelectedRequests([]);
        toast.dismiss();
        toast.success(`Processed requests`);
    };

    const toggleSelect = (id: string) => {
        setSelectedRequests(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRequests.length === filteredRequests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(filteredRequests.map(r => r.id));
        }
    };

    const openStudentDetails = (studentId: string) => {
        setSelectedStudentId(studentId);
        setIsSheetOpen(true);
    };

    const handlePreviewCertificate = (cert: any) => {
        setPreviewCertificate(cert);
    };

    const handleDownloadCertificate = async (cert: any) => {
        if (isDownloadingSingle || isGeneratingZip) return;

        setIsDownloadingSingle(true);
        toast.info("Preparing certificate download...");
        setCurrentGeneratingCert(cert);

        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            if (hiddenCertRef.current) {
                const canvas = await html2canvas(hiddenCertRef.current, {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                const width = pdf.internal.pageSize.getWidth();
                const height = pdf.internal.pageSize.getHeight();

                pdf.addImage(imgData, 'PNG', 0, 0, width, height);

                const studentName = getStudent(cert.studentId)?.name || 'Student';
                const safeName = studentName.replace(/[^a-z0-9]/gi, '_');
                pdf.save(`${safeName}_Certificate_${cert.id}.pdf`);
                toast.success("Certificate downloaded successfully");
            } else {
                toast.error("Template render failed");
            }
        } catch (error) {
            console.error("Certificate generation error:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsDownloadingSingle(false);
            setCurrentGeneratingCert(null);
        }
    };

    const handleBulkDownload = async () => {
        if (filteredIssued.length === 0) {
            toast.error("No certificates to download");
            return;
        }

        setIsGeneratingZip(true);
        setDownloadProgress(0);
        const zip = new JSZip();

        try {
            for (let i = 0; i < filteredIssued.length; i++) {
                const cert = filteredIssued[i];
                setCurrentGeneratingCert(cert);
                await new Promise(resolve => setTimeout(resolve, 100));

                if (hiddenCertRef.current) {
                    const canvas = await html2canvas(hiddenCertRef.current, {
                        scale: 2,
                        logging: false,
                        useCORS: true,
                        backgroundColor: '#ffffff'
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('l', 'mm', 'a4');
                    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
                    const pdfBlob = pdf.output('blob');

                    const student = getStudent(cert.studentId);
                    const safeName = (student?.name || 'Student').replace(/[^a-z0-9]/gi, '_');
                    const fileName = `${safeName}_${cert.courseId}_${cert.id}.pdf`;
                    zip.file(fileName, pdfBlob);
                }
                setDownloadProgress(i + 1);
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "certificates_bundle.zip");
            toast.success("Bulk download complete!");
        } catch (error) {
            console.error("Bulk download failed:", error);
            toast.error("Failed to generate zip file");
        } finally {
            setIsGeneratingZip(false);
            setCurrentGeneratingCert(null);
            setDownloadProgress(0);
        }
    };

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;

    const admin = user as SuperAdmin;
    const selectedStudent = selectedStudentId ? getStudent(selectedStudentId) : null;
    const selectedStudentCerts = selectedStudentId ? getStudentCertificates(selectedStudentId) : [];

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Award className="h-6 w-6 text-primary" />
                            Certificate Management
                        </h1>
                        <p className="text-muted-foreground">
                            Issue and manage professional course completion certificates
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={autoApproveEnabled ? "default" : "outline"}
                            onClick={() => {
                                setAutoApproveEnabled(!autoApproveEnabled);
                                toast.message(autoApproveEnabled ? "Auto-approval disabled" : "Auto-approval enabled for >75% progress");
                            }}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${autoApproveEnabled ? 'animate-spin' : ''}`} />
                            {autoApproveEnabled ? 'Auto-Issue Active' : 'Enable Auto-Issue'}
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{filteredRequests.length}</div>
                            <p className="text-xs text-muted-foreground">awaiting validation</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Issued</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{certificates.length}</div>
                            <p className="text-xs text-muted-foreground">lifetime certificates generated</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Certificate Template</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary flex items-center gap-2">
                                Professional
                                <Badge variant="secondary" className="text-xs font-normal">Active</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Standard A4 / Letter PDF layout</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <TabsList>
                            <TabsTrigger value="requests">Requests ({filteredRequests.length})</TabsTrigger>
                            <TabsTrigger value="issued">Issued History</TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search student or ID..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <TabsContent value="requests" className="space-y-4">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                                                    onCheckedChange={toggleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Requested</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRequests.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No pending requests found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRequests.map((req) => {
                                                const student = getStudent(req.studentId);
                                                const course = getCourse(req.courseId);
                                                return (
                                                    <TableRow key={req.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedRequests.includes(req.id)}
                                                                onCheckedChange={() => toggleSelect(req.id)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div
                                                                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                                                onClick={() => openStudentDetails(req.studentId)}
                                                            >
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.name}`} />
                                                                    <AvatarFallback>ST</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium underline decoration-dotted underline-offset-2">{student?.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{student?.email}</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-medium text-sm">
                                                            {course?.title || 'Unknown Course'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`font-bold ${req.progress >= 75 ? 'text-green-600' : 'text-amber-600'}`}>
                                                                    {req.progress}%
                                                                </span>
                                                                {req.progress < 75 && <Badge variant="destructive" className="text-[10px]">Low</Badge>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm text-muted-foreground">
                                                                {new Date(req.requestDate).toISOString().split('T')[0]}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" variant="outline" className="h-8" onClick={() => handleReject(req.id)}>
                                                                    <XCircle className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                                <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => handleApprove(req.id)}>
                                                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            {selectedRequests.length > 0 && (
                                <div className="p-4 bg-muted/50 border-t flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{selectedRequests.length} selected</span>
                                    <Button onClick={handleBulkApprove}>Issue Selected</Button>
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="issued" className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end md:items-center">
                            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by School" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Schools</SelectItem>
                                    {schools.map(school => (
                                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                onClick={handleBulkDownload}
                                disabled={isGeneratingZip || filteredIssued.length === 0 || isDownloadingSingle}
                                className="ml-auto min-w-[200px]"
                            >
                                {isGeneratingZip ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating... ({downloadProgress}/{filteredIssued.length})
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Bulk ZIP ({filteredIssued.length})
                                    </>
                                )}
                            </Button>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Certificate ID</TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Issued Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredIssued.map((cert) => {
                                            const student = getStudent(cert.studentId);
                                            const course = getCourse(cert.courseId);
                                            return (
                                                <TableRow
                                                    key={cert.id}
                                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={(e) => {
                                                        if ((e.target as HTMLElement).closest('button')) return;
                                                        if (cert.studentId) openStudentDetails(cert.studentId);
                                                    }}
                                                >
                                                    <TableCell className="font-mono text-xs">{cert.id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.name}`} />
                                                                <AvatarFallback>ST</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium text-sm underline decoration-dotted underline-offset-2">{student?.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm max-w-[200px] truncate" title={course?.title}>{course?.title}</TableCell>
                                                    <TableCell className="text-sm">{new Date(cert.issueDate).toISOString().split('T')[0]}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePreviewCertificate(cert);
                                                            }}>
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDownloadCertificate(cert);
                                                            }} disabled={isGeneratingZip || isDownloadingSingle}>
                                                                {isDownloadingSingle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Student Details & Certificates Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Student Profile
                        </SheetTitle>
                        <SheetDescription>
                            Certificate history and student details
                        </SheetDescription>
                    </SheetHeader>

                    {selectedStudent && (
                        <div className="mt-6 space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50">
                                <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} />
                                    <AvatarFallback className="text-lg">ST</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span>{selectedStudent.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5" />
                                        <span>{selectedStudent.parentPhone || '+91 98765 43210'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline">Grade {selectedStudent.grade}</Badge>
                                        <Badge variant="secondary">{selectedStudent.city}</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Certificates Section */}
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold mb-3">
                                    <Award className="h-4 w-4 text-primary" />
                                    Issued Certificates ({selectedStudentCerts.length})
                                </h4>

                                {selectedStudentCerts.length === 0 ? (
                                    <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground bg-muted/20">
                                        <Award className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">No certificates issued yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedStudentCerts.map((cert) => {
                                            const course = getCourse(cert.courseId);
                                            return (
                                                <div key={cert.id} className="border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h5 className="font-semibold text-sm">{course?.title}</h5>
                                                            <p className="text-xs text-muted-foreground">Issued: {new Date(cert.issueDate).toISOString().split('T')[0]}</p>
                                                        </div>
                                                        <Badge variant="outline" className="font-mono text-[10px]">{cert.id}</Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t">
                                                        <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => handlePreviewCertificate(cert)}>
                                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                            Preview
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={() => handleDownloadCertificate(cert)}>
                                                            <Download className="h-3.5 w-3.5 mr-1.5" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Hidden Container for Bulk PDF Generation */}
            <div style={{ position: 'absolute', top: -10000, left: -10000, pointerEvents: 'none' }}>
                {currentGeneratingCert && (
                    <div ref={hiddenCertRef} className="w-[1123px] h-[794px] bg-[#ffffff] text-[#0f172a] overflow-hidden relative">
                        <CertificateTemplate
                            studentName={getStudent(currentGeneratingCert.studentId)?.name || ''}
                            courseName={getCourse(currentGeneratingCert.courseId)?.title || ''}
                            date={format(new Date(currentGeneratingCert.issueDate), 'MMMM d, yyyy')}
                            certificateId={currentGeneratingCert.id}
                        />
                    </div>
                )}
            </div>

            {/* Preview Dialog */}
            <Dialog open={!!previewCertificate} onOpenChange={(open) => !open && setPreviewCertificate(null)}>
                <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-transparent border-0 shadow-none">
                    <DialogTitle className="sr-only">Certificate Preview</DialogTitle>
                    <div className="relative w-full overflow-auto flex justify-center bg-muted/20 p-8">
                        <div className="scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 origin-top shadow-xl">
                            <CertificateTemplate
                                ref={certificateRef}
                                studentName={previewCertificate ? getStudent(previewCertificate.studentId)?.name || '' : ''}
                                courseName={previewCertificate ? getCourse(previewCertificate.courseId)?.title || '' : ''}
                                date={previewCertificate ? format(new Date(previewCertificate.issueDate), 'MMMM d, yyyy') : ''}
                                certificateId={previewCertificate ? previewCertificate.id : ''}
                            />
                        </div>
                        <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
                            <Button onClick={() => setPreviewCertificate(null)} variant="secondary">Close Preview</Button>
                            <Button onClick={() => previewCertificate && handleDownloadCertificate(previewCertificate)} disabled={isDownloadingSingle}>
                                {isDownloadingSingle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
                                Print / Save PDF
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
