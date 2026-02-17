'use client';

import { useState } from 'react';
import {
    BookOpen,
    Search,
    Plus,
    MoreVertical,
    FileText,
    Users,
    Clock,
    Tag
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin } from '@/data/users';
import { courses } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function AdminCoursesPage() {
    const admin = mockSuperAdmin;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            Course Management
                        </h1>
                        <p className="text-muted-foreground">
                            Create, update, and manage course curriculum
                        </p>
                    </div>
                    <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                        Create New Course
                    </Button>
                </div>

                <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Showing {filteredCourses.length} courses
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No courses found.
                        </div>
                    ) : (
                        filteredCourses.map(course => (
                            <Card key={course.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="capitalize">
                                            {course.category}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit Course</DropdownMenuItem>
                                                <DropdownMenuItem>Manage Content</DropdownMenuItem>
                                                <DropdownMenuItem>View Students</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    Archive Course
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
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
                                            <span key={tag} className="text-[10px] bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                        {course.tags.length > 3 && (
                                            <span className="text-[10px] bg-secondary px-2 py-1 rounded-full text-secondary-foreground">
                                                +{course.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 border-t bg-muted/20">
                                    <Button variant="outline" className="w-full">
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
