'use client';

import {
    Clock,
    FileText,
    Users,
    Tag,
    MoreVertical,
    Edit,
    Eye,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from '@/data/courses';

interface CourseCardGridProps {
    courses: Course[];
    onView: (course: Course) => void;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
}

export function CourseCardGrid({ courses, onView, onEdit, onDelete }: CourseCardGridProps) {
    if (courses.length === 0) {
        return (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                No courses found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
                <Card
                    key={course.id}
                    className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={(e) => {
                        if ((e.target as any).closest('.action-btn')) return;
                        onView(course);
                    }}
                >
                    <CardHeader className="relative">
                        <div className="absolute top-4 right-4 z-10">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 bg-background/80 hover:bg-background action-btn rounded-full">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onEdit(course)}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit Course
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onView(course)}>
                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onDelete(course)} className="text-destructive focus:text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Archive Course
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="mb-2">
                            <Badge variant="outline" className="capitalize">
                                {course.category}
                            </Badge>
                        </div>
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{course.title}</CardTitle>
                        <CardDescription>{course.grade} • {course.level}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.duration}
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {course.sessions} Sessions
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {course.studentsEnrolled} Enrolled
                            </div>
                            <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                ₹{course.price.toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {course.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] bg-secondary/50 px-2 py-1 rounded-full text-secondary-foreground">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t bg-muted/10 action-btn">
                        <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5" onClick={() => onView(course)}>
                            View Details
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
