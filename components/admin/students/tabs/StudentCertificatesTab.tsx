
import { useState, useRef } from 'react';
import {
    Award,
    Download,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentService } from '@/data/services/student.service';
import { Student } from '@/data/users';
import { CertificateTemplate } from '@/components/admin/CertificateTemplate';
import { toast } from 'sonner';
import { format } from 'date-fns';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface StudentCertificatesTabProps {
    student?: Student | null;
    studentId?: string; // Backwards compatibility if needed
}

export function StudentCertificatesTab({ student, studentId }: StudentCertificatesTabProps) {
    const id = student?.id || studentId || '';
    const certificates = StudentService.getCertificates(id);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [tempCert, setTempCert] = useState<any>(null);
    const hiddenRef = useRef<HTMLDivElement>(null);

    const handleDownload = async (cert: any) => {
        if (isDownloading) return;
        setIsDownloading(cert.id);

        // Prepare data for template
        const certData = {
            ...cert,
            studentName: student?.name || 'Student',
            instructorName: 'Dr. Anil Mehta', // Default or fetch if available
            courseName: cert.courseTitle
        };

        setTempCert(certData);

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            if (hiddenRef.current) {
                const canvas = await html2canvas(hiddenRef.current, {
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
                const showName = (student?.name || 'certificate').replace(/[^a-z0-9]/gi, '_');
                pdf.save(`${showName}_${cert.courseTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`);
                toast.success("Certificate downloaded");
            }
        } catch (e) {
            console.error(e);
            toast.error("Download failed");
        } finally {
            setIsDownloading(null);
            setTempCert(null);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-primary" />
                    Achieved Certificates
                </h4>
            </div>

            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-shadow gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm">{cert.courseTitle}</h5>
                                    <div className="text-xs text-muted-foreground mt-0.5 flex gap-2">
                                        <span>Issued: {cert.issueDate}</span>
                                        <span>•</span>
                                        <span className="font-mono">{cert.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={() => handleDownload(cert)}
                                    disabled={!!isDownloading}
                                >
                                    {isDownloading === cert.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl border-dashed bg-muted/20">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Award className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">No Certificates Yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        This student hasn't earned any certificates yet. Complete courses to earn awards.
                    </p>
                </div>
            )}

            {/* Hidden Render Area */}
            <div style={{ position: 'absolute', top: -10000, left: -10000, opacity: 0, pointerEvents: 'none' }}>
                {tempCert && (
                    <div ref={hiddenRef}>
                        <CertificateTemplate
                            studentName={tempCert.studentName}
                            courseName={tempCert.courseName}
                            date={format(new Date(tempCert.issueDate), 'MMMM d, yyyy')}
                            certificateId={tempCert.id}
                            instructorName={tempCert.instructorName}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
