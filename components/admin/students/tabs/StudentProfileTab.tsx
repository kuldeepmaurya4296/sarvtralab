
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    School,
    User,
    Shield,
    Phone,
    BookOpen,
    Edit,
    Trash2,
    Mail
} from 'lucide-react';
import { Student } from '@/data/users';
import { StudentService } from '@/data/services/student.service';
import { format } from 'date-fns';

interface StudentProfileTabProps {
    student: Student;
    onEdit: () => void;
    onDelete: () => void;
}

export function StudentProfileTab({ student, onEdit, onDelete }: StudentProfileTabProps) {
    return (
        <div className="space-y-8">
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
                                <span className="font-medium text-right">{StudentService.getSchoolName(student.schoolId)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Student ID</span>
                                <span className="font-mono">{student.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Grade</span>
                                <span className="font-medium">{student.grade}</span>
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
                                <span className="text-right">
                                    {student.createdAt ? format(new Date(student.createdAt), 'MMM d, yyyy') : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Location</span>
                                <span className="text-right">
                                    {student.city || 'N/A'}, {student.state || 'N/A'}
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
                        <span className="font-medium block mt-1">{student.parentName || 'Not Provided'}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-xs">Contact Number</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{student.parentPhone || 'Not Provided'}</span>
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
                        Enrolled Courses ({student.enrolledCourses.length})
                    </h4>
                </div>

                {student.enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {student.enrolledCourses.map((courseId: string, idx: number) => (
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
                <Button className="flex-1" onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="destructive" className="flex-1" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Suspend
                </Button>
            </div>
        </div>
    );
}
