'use client';

import {
    Clock,
    FileText,
    GraduationCap,
    DollarSign,
    BarChart,
    CheckCircle2,
    Layers,
    Plus,
    Edit,
    Trash2,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Course } from '@/data/courses';

interface CourseViewSheetProps {
    course: Course | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
}

export function CourseViewSheet({ course, open, onOpenChange, onEdit, onDelete }: CourseViewSheetProps) {
    if (!course) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-xl p-0">
                <SheetHeader className="sr-only">
                    <SheetTitle>Course Details</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full">
                    <div className="pb-8">
                        {/* Hero Section */}
                        <div className="bg-muted/30 p-6 border-b">
                            <div className="flex gap-2 mb-4">
                                <Badge variant="outline" className="bg-background">{course.category}</Badge>
                                <Badge variant={course.level === 'Advanced' ? 'destructive' : course.level === 'Intermediate' ? 'default' : 'secondary'}>
                                    {course.level}
                                </Badge>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                    <Clock className="h-5 w-5 text-primary mb-1" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Duration</span>
                                    <span className="font-semibold text-sm">{course.duration}</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                    <FileText className="h-5 w-5 text-primary mb-1" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Sessions</span>
                                    <span className="font-semibold text-sm">{course.sessions}</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                    <GraduationCap className="h-5 w-5 text-primary mb-1" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Grade</span>
                                    <span className="font-semibold text-sm">{course.grade}</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                    <DollarSign className="h-5 w-5 text-primary mb-1" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Price</span>
                                    <span className="font-semibold text-sm">₹{course.price.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2 text-sm">
                                    <BarChart className="h-4 w-4 text-primary" />
                                    Course Highlights
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {course.features?.map((feature: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    )) || (
                                            <span className="text-muted-foreground italic">No specific highlights listed.</span>
                                        )}
                                </div>
                            </div>

                            <Separator />

                            {/* Curriculum */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold flex items-center gap-2 text-sm">
                                        <Layers className="h-4 w-4 text-primary" />
                                        Curriculum Preview
                                    </h4>
                                    <Button variant="link" size="sm" className="h-auto p-0">View Full Syllabus</Button>
                                </div>
                                <div className="border rounded-md divide-y overflow-hidden">
                                    {(course.curriculum && course.curriculum.length > 0) ? (
                                        course.curriculum.map((module: any, idx: number) => (
                                            <div key={module.id} className="p-4 hover:bg-muted/20 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-sm">Module {idx + 1}: {module.title}</span>
                                                    <Badge variant="outline" className="text-[10px]">{module.duration}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {module.lessons.length} Lessons including practical exercises.
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center bg-muted/5 flex flex-col items-center">
                                            <Layers className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                            <p className="text-muted-foreground text-sm">No curriculum modules defined yet.</p>
                                            <Button variant="outline" size="sm" className="mt-4" onClick={() => { onOpenChange(false); onEdit(course); }}>
                                                <Plus className="h-3 w-3 mr-2" /> Add Module
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Action Footer */}
                            <div className="flex gap-2">
                                <Button className="flex-1" onClick={() => { onOpenChange(false); onEdit(course); }}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Course
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => { onOpenChange(false); onDelete(course); }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
