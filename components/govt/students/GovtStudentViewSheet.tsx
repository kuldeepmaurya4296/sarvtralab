'use client';

import { FileText } from 'lucide-react';
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Student } from '@/data/users';

interface GovtStudentViewSheetProps {
    student: Student | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GovtStudentViewSheet({ student, open, onOpenChange }: GovtStudentViewSheetProps) {
    if (!student) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Student Academic Record</SheetTitle>
                    <SheetDescription>Detailed performance and enrollment information.</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.schoolName} • {student.grade}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">Student ID</label>
                                <p className="text-sm font-medium">{student.id}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">Attendance</label>
                                <p className="text-sm font-medium text-green-600">92% (Excellent)</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">Enrolled Courses</label>
                                <p className="text-sm font-medium">{student.enrolledCourses.length}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">Completed</label>
                                <p className="text-sm font-medium">{student.completedCourses.length}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Recent Performance
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Mathematics</span>
                                    <span className="font-bold text-green-600">A</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Science</span>
                                    <span className="font-bold text-blue-600">B+</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>English</span>
                                    <span className="font-bold text-green-600">A-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
