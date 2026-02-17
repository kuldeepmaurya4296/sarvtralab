'use client';

import {
    User, Mail, Phone, Shield, BookOpen, Clock, Eye,
} from 'lucide-react';
import {
    Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student } from '@/data/users';
import { StudentPerformanceTab } from '@/components/admin/students/tabs/StudentPerformanceTab';
import { format } from 'date-fns';

interface SchoolStudentViewSheetProps {
    student: Student | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SchoolStudentViewSheet({ student, open, onOpenChange }: SchoolStudentViewSheetProps) {
    if (!student) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-2xl p-0">
                <SheetHeader className="sr-only">
                    <SheetTitle>Student Details</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full">
                    <div className="pb-8">
                        {/* Header */}
                        <div className="bg-muted/30 p-6 border-b">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                    <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 pt-1">
                                    <h2 className="text-2xl font-bold">{student.name}</h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3.5 w-3.5" />
                                            {student.email}
                                        </div>
                                        <span className="hidden sm:inline">•</span>
                                        <Badge variant="outline" className="w-fit">{student.grade}</Badge>
                                        <span className="hidden sm:inline">•</span>
                                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="w-fit capitalize">
                                            {student.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="performance" className="w-full">
                            <div className="px-6 pt-4">
                                <TabsList className="w-full grid grid-cols-2">
                                    <TabsTrigger value="performance">Performance Report</TabsTrigger>
                                    <TabsTrigger value="profile">Profile Overview</TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Profile Tab */}
                            <TabsContent value="profile" className="p-6 space-y-8 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2 text-sm text-primary">
                                            <User className="h-4 w-4" /> Personal Info
                                        </h4>
                                        <Card className="border-none shadow-sm bg-muted/20">
                                            <CardContent className="p-4 space-y-3 text-sm">
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-muted-foreground">Student ID</span>
                                                    <span className="font-mono">{student.id}</span>
                                                </div>
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-muted-foreground">Joined Date</span>
                                                    <span>{student.createdAt ? format(new Date(student.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">City/State</span>
                                                    <span>{student.city || 'N/A'}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2 text-sm text-primary">
                                            <Shield className="h-4 w-4" /> Guardian Info
                                        </h4>
                                        <Card className="border-none shadow-sm bg-muted/20">
                                            <CardContent className="p-4 space-y-3 text-sm">
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-muted-foreground">Parent Name</span>
                                                    <span className="font-medium">{student.parentName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Phone Contact</span>
                                                    <span className="flex items-center gap-1 font-mono">
                                                        <Phone className="h-3 w-3" />
                                                        {student.parentPhone}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2 text-sm text-primary">
                                        <BookOpen className="h-4 w-4" /> Current Enrollment
                                    </h4>
                                    {student.enrolledCourses.length > 0 ? (
                                        <div className="space-y-2">
                                            {student.enrolledCourses.map((course: string, idx: number) => (
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

                            {/* Performance Tab — reuses shared component */}
                            <TabsContent value="performance" className="p-6 space-y-8 mt-0">
                                <StudentPerformanceTab studentId={student.id} showEmailButton />
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
