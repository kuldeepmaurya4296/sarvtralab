'use client';

import { useState } from 'react';
import {
    Search,
    BookOpen,
    Clock,
    Users,
    Star,
    ChevronRight,
    Filter,
    PlayCircle,
    FileText,
    Award,
    BarChart,
    CheckCircle2,
    Calendar,
    GraduationCap
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools } from '@/data/users';
import { courses } from '@/data/courses'; // Ensure this data structure is compatible or mock it if needed
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Mock data extension for demonstration if needed
const extendedCourses = courses.map(c => ({
    ...c,
    progress: Math.floor(Math.random() * 100),
    lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
    modules: [
        { title: "Introduction to the Course", duration: "10 min", status: "completed" },
        { title: "Core Concepts - Part 1", duration: "45 min", status: "in-progress" },
        { title: "Core Concepts - Part 2", duration: "50 min", status: "locked" },
        { title: "Advanced Topics", duration: "60 min", status: "locked" },
        { title: "Final Assessment", duration: "30 min", status: "locked" },
    ]
}));

export default function SchoolCoursesPage() {
    const school = mockSchools[0];
    // In a real app, you'd filter by school ID, but for now we'll show all or a subset
    const myCourses = extendedCourses;

    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const filteredCourses = myCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = levelFilter === 'all' || course.level === levelFilter; // data/courses usually has 'level'
        return matchesSearch && matchesLevel;
    });

    const openCourseDetails = (course: any) => {
        setSelectedCourse(course);
        setIsSheetOpen(true);
    };

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
                            <Card
                                key={course.id}
                                className="flex flex-col h-full hover:shadow-lg transition-all cursor-pointer group border-transparent hover:border-primary/20"
                                onClick={() => openCourseDetails(course)}
                            >
                                <div className="relative h-48 w-full bg-muted overflow-hidden rounded-t-lg">
                                    {/* Placeholder Image or Real Image */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img
                                        src={`https://source.unsplash.com/random/800x600?education,${course.id}`}
                                        alt={course.title}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <Badge className="absolute top-4 right-4 z-20" variant="secondary">
                                        {course.category}
                                    </Badge>
                                    <div className="absolute bottom-4 left-4 z-20 text-white">
                                        <div className="flex items-center gap-1 text-amber-400 mb-1">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-xs font-bold">{course.rating}</span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight line-clamp-2">{course.title}</h3>
                                    </div>
                                </div>
                                <CardContent className="flex-1 pt-4">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <GraduationCap className="h-4 w-4" />
                                            <span>{course.grade}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BarChart className="h-4 w-4" />
                                            <span>{course.level}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {course.description}
                                    </p>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <span>Progress</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <Progress value={course.progress} className="h-2" />
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 pb-4 border-t bg-muted/5 mt-auto">
                                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {course.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5" />
                                            {course.studentsEnrolled}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {/* Course Details Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="overflow-y-auto sm:max-w-xl p-0">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Course Details</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-full">
                            {selectedCourse && (
                                <div className="pb-8">
                                    {/* Hero */}
                                    <div className="relative h-48 w-full bg-muted">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                                        <img
                                            src={`https://source.unsplash.com/random/800x600?education,${selectedCourse.id}`}
                                            alt={selectedCourse.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-4 right-4 z-20 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white border-none"
                                            onClick={() => setIsSheetOpen(false)}
                                        >
                                            <ChevronRight className="h-6 w-6 rotate-180" /> {/* Close Icon */}
                                        </Button>
                                        <div className="absolute bottom-6 left-6 z-20 text-white max-w-lg">
                                            <Badge className="mb-2 bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                                                {selectedCourse.category}
                                            </Badge>
                                            <h2 className="text-3xl font-bold leading-tight">{selectedCourse.title}</h2>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-8">
                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg text-center">
                                                <Clock className="h-5 w-5 text-primary mb-1" />
                                                <span className="text-xs text-muted-foreground">Duration</span>
                                                <span className="font-semibold text-sm">{selectedCourse.duration}</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg text-center">
                                                <BarChart className="h-5 w-5 text-blue-500 mb-1" />
                                                <span className="text-xs text-muted-foreground">Level</span>
                                                <span className="font-semibold text-sm">{selectedCourse.level}</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg text-center">
                                                <Users className="h-5 w-5 text-green-500 mb-1" />
                                                <span className="text-xs text-muted-foreground">Enrolled</span>
                                                <span className="font-semibold text-sm">{selectedCourse.studentsEnrolled}</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg text-center">
                                                <Star className="h-5 w-5 text-amber-500 mb-1" />
                                                <span className="text-xs text-muted-foreground">Rating</span>
                                                <span className="font-semibold text-sm">{selectedCourse.rating}/5.0</span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                About this Course
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {selectedCourse.description}
                                            </p>
                                        </div>

                                        <Separator />

                                        {/* Curriculum / Modules */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                    <PlayCircle className="h-5 w-5 text-muted-foreground" />
                                                    Curriculum
                                                </h3>
                                                <span className="text-xs text-muted-foreground">5 Modules</span>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedCourse.modules.map((module: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${module.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                    module.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-muted text-muted-foreground'
                                                                }`}>
                                                                {module.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                                                            </div>
                                                            <div>
                                                                <p className={`font-medium text-sm ${module.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                                    {module.title}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">{module.duration}</p>
                                                            </div>
                                                        </div>
                                                        {module.status === 'locked' ? (
                                                            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                                                        ) : (
                                                            <PlayCircle className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Certificates & Achievements */}
                                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Award className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Course Certificate</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Earn a verified certificate upon completion of all modules and the final assessment.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="pt-4 flex gap-3">
                                            <Button className="w-full" size="lg">
                                                Continue Learning
                                            </Button>
                                            <Button variant="outline" size="lg">
                                                Syllabus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </DashboardLayout>
    );
}
