'use client';

import { useState } from 'react';
import {
    Search,
    BookOpen,
    Clock,
    Users,
    Star,
    ChevronRight,
    Filter
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools } from '@/data/users';
import { courses } from '@/data/courses';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';

export default function SchoolCoursesPage() {
    const school = mockSchools[0];
    const assignedCourseIds = school.assignedCourses || [];
    const myCourses = courses.filter(c => assignedCourseIds.includes(c.id));

    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');

    const filteredCourses = myCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    return (
        <DashboardLayout role="school" userName={school.name} userEmail={school.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            My Courses
                        </h1>
                        <p className="text-muted-foreground">
                            Manage courses assigned to your school
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No courses found matching your criteria.
                        </div>
                    ) : (
                        filteredCourses.map(course => (
                            <Card key={course.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="mb-2">
                                            {course.category}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs font-semibold">{course.rating}</span>
                                        </div>
                                    </div>
                                    <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                                    <CardDescription>{course.grade} • {course.level}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {course.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{course.studentsEnrolled} Students</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 border-t bg-muted/20">
                                    <Button className="w-full gap-2" variant="outline">
                                        View Curriculum
                                        <ChevronRight className="h-4 w-4" />
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
