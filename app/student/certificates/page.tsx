'use client';
import { useState } from 'react';
import {
    Award,
    Search,
    Download,
    Eye,
    Clock,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    BookOpen
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockStudents } from '@/data/users';
import { courses as mockCourses } from '@/data/courses';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

import { mockIssuedCertificates } from '@/data/certificates';

// Mock Data
// Assuming logged in student is mockStudents[0]
const currentStudent = mockStudents[0];

const myCertificates = mockIssuedCertificates
    .filter(cert => cert.studentId === currentStudent.id)
    .map(cert => {
        const course = mockCourses.find(c => c.id === cert.courseId);
        return {
            id: cert.id,
            courseId: cert.courseId,
            issueDate: cert.issueDate,
            title: course?.title || 'Unknown Course',
            instructor: course?.instructor || 'LMS Instructor',
            grade: 'A', // Mock grade as it's not in the certificate data model yet
            downloadUrl: '#'
        };
    });

const eligibleCourses = [
    {
        courseId: 'course-1',
        title: 'Introduction to R',
        progress: 100,
        status: 'pending_request' // Assume user already requested
    },
    {
        courseId: 'course-2',
        title: 'Advanced Machine Learning',
        progress: 82,
        status: 'eligible' // User can apply
    },
    {
        courseId: 'course-4',
        title: 'Web Development Bootcamp',
        progress: 45,
        status: 'in_progress' // Not eligible
    }
];

export default function StudentCertificatesPage() {
    const student = currentStudent;
    const [certificates, setCertificates] = useState(myCertificates);
    const [courses, setCourses] = useState(eligibleCourses);

    const handleApply = (courseId: string) => {
        // Simulate application
        setCourses(courses.map(c =>
            c.courseId === courseId ? { ...c, status: 'pending_request' } : c
        ));
        toast.success("Certificate request submitted successfully!");
    };

    const handleDownload = (certId: string) => {
        toast.info("Downloading certificate...");
        // Mock download logic
    };

    return (
        <DashboardLayout role="student" userName={student.name} userEmail={student.email}>
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
                                {courses.filter(c => c.status === 'pending_request').length}
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
                                {courses.filter(c => c.status === 'eligible').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Courses &gt; 75% complete</p>
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
                                    <Card key={cert.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="h-40 bg-muted flex items-center justify-center relative group">
                                            {/* Mock Certificate Preview */}
                                            <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center p-4 border-b">
                                                <Award className="h-12 w-12 text-primary mb-2" />
                                                <span className="font-serif font-bold text-lg text-center tracking-wide">{cert.title}</span>
                                                <span className="text-xs mt-1 text-muted-foreground uppercase tracking-wider">Certificate of Completion</span>
                                            </div>

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button size="sm" variant="secondary" onClick={() => handleDownload(cert.id)}>
                                                    <Download className="h-4 w-4 mr-1" /> PDF
                                                </Button>
                                                <Button size="sm" variant="secondary">
                                                    <Eye className="h-4 w-4 mr-1" /> View
                                                </Button>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className="font-mono text-xs">{cert.id}</Badge>
                                                <span className="text-xs text-muted-foreground">{format(new Date(cert.issueDate), 'MMM d, yyyy')}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Instructor: {cert.instructor}</p>
                                                <p className="text-xs text-muted-foreground">Grade Achieved: <span className="font-bold text-primary">{cert.grade}</span></p>
                                            </div>
                                            <Button className="w-full mt-4" variant="outline" size="sm" onClick={() => handleDownload(cert.id)}>
                                                <Download className="h-4 w-4 mr-2" /> Download Certificate
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="eligible" className="space-y-4 mt-6">
                        <div className="rounded-md border bg-card">
                            {courses.map((course, idx) => (
                                <div key={course.courseId} className={`flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 ${idx !== courses.length - 1 ? 'border-b' : ''}`}>
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
                                            <span className="text-[10px] text-muted-foreground">75% required for certificate</span>
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
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
