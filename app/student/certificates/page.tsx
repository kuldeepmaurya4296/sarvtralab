'use client';
import { useState, useRef, useEffect } from 'react';
import {
    Award,
    Search,
    Download,
    Eye,
    Clock,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from 'date-fns';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Student } from '@/data/users';
import { CertificateTemplate } from '@/components/admin/CertificateTemplate';

// Server actions
import { getStudentById } from '@/lib/actions/student.actions';
import { getStudentCertificates } from '@/lib/actions/certificate.actions';
import { getAllCourses } from '@/lib/actions/course.actions';

export default function StudentCertificatesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [eligibleCourses, setEligibleCourses] = useState<any[]>([]);
    const [selectedCert, setSelectedCert] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Ref for the certificate to download
    const downloadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'student')) {
            router.push('/login');
        } else if (user && user.role === 'student') {
            loadData();
        }
    }, [user, authLoading, router]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const userId = (user as any)?.id;
            if (!userId) return;

            // Fetch full student data from DB
            const student = await getStudentById(userId);
            if (!student) {
                toast.error("Student data not found");
                setIsLoading(false);
                return;
            }

            // Fetch certificates for this student
            const studentCerts = await getStudentCertificates(userId);

            // Fetch all courses to look up names
            const allCourses = await getAllCourses();

            const enrichedCerts = (studentCerts || []).map(cert => {
                const course = allCourses.find((c: any) => c.id === cert.courseId);
                return {
                    ...cert,
                    courseName: course?.title || 'Unknown Course',
                    instructor: course?.instructor || 'Sarvtra Instructor',
                    studentName: student.name
                };
            });
            setCertificates(enrichedCerts);

            // Build eligibility from enrolled courses
            const enrolledCourses = student.enrolledCourses || [];
            const courses = enrolledCourses.map((courseId: string) => {
                const course = allCourses.find((c: any) => c.id === courseId);
                const status = enrichedCerts.find((c: any) => c.courseId === courseId)
                    ? 'earned'
                    : Math.random() > 0.5 ? 'eligible' : 'in_progress';

                return {
                    courseId,
                    title: course?.title || courseId,
                    progress: status === 'earned' ? 100 : Math.floor(Math.random() * 90) + 10,
                    status
                };
            }).filter((c: any) => c.status !== 'earned');

            setEligibleCourses(courses);
        } catch (error) {
            console.error("Load data error:", error);
            toast.error("Failed to load certificate data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = (courseId: string) => {
        setEligibleCourses(eligibleCourses.map(c =>
            c.courseId === courseId ? { ...c, status: 'pending_request' } : c
        ));
        toast.success("Certificate request submitted successfully!");
    };

    const handleDownload = async (cert: any) => {
        setIsGenerating(true);
        toast.info("Generating PDF...");

        setSelectedCert(cert);

        setTimeout(async () => {
            if (downloadRef.current) {
                try {
                    const canvas = await html2canvas(downloadRef.current, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff'
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({
                        orientation: 'landscape',
                        unit: 'px',
                        format: [canvas.width, canvas.height]
                    });

                    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                    pdf.save(`${cert.courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
                    toast.success("Download complete");
                } catch (error) {
                    console.error("PDF Generation Error:", error);
                    toast.error("Failed to generate PDF");
                } finally {
                    setIsGenerating(false);
                    setSelectedCert(null);
                }
            } else {
                setIsGenerating(false);
                toast.error("Template not found");
            }
        }, 500);
    };

    if (authLoading || isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'student') return null;

    return (
        <DashboardLayout role="student" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Award className="h-6 w-6 text-primary" />
                            My Certificates
                        </h1>
                        <p className="text-muted-foreground">
                            View earned certificates and track eligibility
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Total Earned</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{certificates.length}</div>
                            <p className="text-xs text-muted-foreground">Validated Certificates</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {eligibleCourses.filter(c => c.status === 'pending_request').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Applications in review</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Eligible to Apply</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {eligibleCourses.filter(c => c.status === 'eligible').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Courses &gt; 90% complete</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="earned" className="w-full">
                    <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
                        <TabsTrigger value="earned">Earned Certificates</TabsTrigger>
                        <TabsTrigger value="eligible">Course Progress & Eligibility</TabsTrigger>
                    </TabsList>

                    <TabsContent value="earned" className="space-y-4 mt-6">
                        {certificates.length === 0 ? (
                            <div className="text-center py-12 border rounded-lg border-dashed">
                                <Award className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <h3 className="text-lg font-medium">No certificates yet</h3>
                                <p className="text-muted-foreground">Complete courses to earn your first certificate!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {certificates.map((cert) => (
                                    <Dialog key={cert.id}>
                                        <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                                            {/* Preview Area - Scaled Down Template */}
                                            <div className="h-48 bg-muted relative overflow-hidden flex items-center justify-center">
                                                <div className="transform scale-[0.25] origin-center shadow-sm select-none pointer-events-none">
                                                    <CertificateTemplate
                                                        studentName={cert.studentName}
                                                        courseName={cert.courseName}
                                                        date={format(new Date(cert.issueDate), 'MMMM d, yyyy')}
                                                        certificateId={cert.id}
                                                        instructorName={cert.instructor}
                                                    />
                                                </div>

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleDownload(cert); }} disabled={isGenerating}>
                                                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-1" />} PDF
                                                    </Button>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="secondary">
                                                            <Eye className="h-4 w-4 mr-1" /> View
                                                        </Button>
                                                    </DialogTrigger>
                                                </div>
                                            </div>

                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="outline" className="font-mono text-xs">{cert.id}</Badge>
                                                    <span className="text-xs text-muted-foreground">{format(new Date(cert.issueDate), 'MMM d, yyyy')}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold line-clamp-1" title={cert.courseName}>{cert.courseName}</h3>
                                                    <p className="text-xs text-muted-foreground">Instructor: {cert.instructor}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Full Size View Modal */}
                                        <DialogContent className="max-w-[1200px] w-full overflow-auto max-h-[90vh] bg-muted/50 p-6 flex flex-col items-center">
                                            <DialogTitle className="sr-only">Certificate Preview</DialogTitle>
                                            <div className="bg-white shadow-2xl scale-[0.8] md:scale-100 origin-top">
                                                <CertificateTemplate
                                                    studentName={cert.studentName}
                                                    courseName={cert.courseName}
                                                    date={format(new Date(cert.issueDate), 'MMMM d, yyyy')}
                                                    certificateId={cert.id}
                                                    instructorName={cert.instructor}
                                                />
                                            </div>
                                            <div className="mt-4 flex gap-4">
                                                <Button onClick={() => handleDownload(cert)} disabled={isGenerating}>
                                                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                                                    Download PDF
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="eligible" className="space-y-4 mt-6">
                        <div className="rounded-md border bg-card">
                            {eligibleCourses.length > 0 ? eligibleCourses.map((course, idx) => (
                                <div key={course.courseId} className={`flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 ${idx !== eligibleCourses.length - 1 ? 'border-b' : ''}`}>
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{course.title}</h4>
                                            <p className="text-sm text-muted-foreground">Course ID: {course.courseId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 flex-1 md:justify-end">
                                        <div className="w-full md:w-48 space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Progress</span>
                                                <span className="font-medium">{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} className="h-2" />
                                            <span className="text-[10px] text-muted-foreground">90% required for certificate</span>
                                        </div>

                                        <div className="w-32 flex justify-end">
                                            {course.status === 'eligible' && (
                                                <Button size="sm" onClick={() => handleApply(course.courseId)}>
                                                    Apply Now
                                                </Button>
                                            )}
                                            {course.status === 'pending_request' && (
                                                <Button size="sm" variant="secondary" disabled className="cursor-not-allowed opacity-80">
                                                    <Clock className="h-3 w-3 mr-1" /> Pending
                                                </Button>
                                            )}
                                            {course.status === 'in_progress' && (
                                                <Button size="sm" variant="ghost" disabled className="text-muted-foreground">
                                                    <Clock className="h-3 w-3 mr-1" /> In Progress
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="p-8 text-center text-muted-foreground">No pending or eligible courses found.</div>}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Hidden Container for Downloading */}
                <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none opacity-0">
                    {selectedCert && (
                        <div ref={downloadRef}>
                            <CertificateTemplate
                                studentName={selectedCert.studentName}
                                courseName={selectedCert.courseName}
                                date={format(new Date(selectedCert.issueDate), 'MMMM d, yyyy')}
                                certificateId={selectedCert.id}
                                instructorName={selectedCert.instructor}
                            />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
