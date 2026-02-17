
import {
    Award,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentService } from '@/data/services/student.service';

interface StudentCertificatesTabProps {
    studentId: string;
}

export function StudentCertificatesTab({ studentId }: StudentCertificatesTabProps) {
    const certificates = StudentService.getCertificates(studentId);

    return (
        <div className="space-y-6">
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
                                {/* Placeholder for download - In real app this would link to the PDF generation logic */}
                                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                                    <Download className="h-3.5 w-3.5" />
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
        </div>
    );
}
