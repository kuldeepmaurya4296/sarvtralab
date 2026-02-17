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
    Tag,
    Trash2,
    Edit,
    Eye,
    Video,
    Layers,
    DollarSign,
    GraduationCap,
    BarChart,
    Calendar,
    CheckCircle2
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminCoursesPage() {
    const admin = mockSuperAdmin;
    const [courseList, setCourseList] = useState(courses);
    const [searchQuery, setSearchQuery] = useState('');

    // Action States
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        grade: '',
        duration: '',
        sessions: 0,
        price: 0,
        category: 'foundation',
        level: 'Beginner',
        image: '/placeholder.svg'
    });

    const filteredCourses = courseList.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddCourse = () => {
        const newCourse = {
            id: `CRS-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            category: formData.category as 'foundation' | 'intermediate' | 'advanced',
            level: formData.level as 'Beginner' | 'Intermediate' | 'Advanced',
            totalHours: formData.sessions * 1.5, // Approx
            originalPrice: formData.price * 1.5,
            emiAvailable: true,
            tags: ['New', 'Featured'],
            features: ['Live Sessions', 'Projects'],
            curriculum: [],
            rating: 0,
            studentsEnrolled: 0,
            instructor: 'TBD'
        };
        // @ts-ignore
        setCourseList([newCourse, ...courseList]);
        setIsAddOpen(false);
        resetForm();
        toast.success("Course created successfully");
    };

    const handleEditSave = () => {
        if (!selectedCourse) return;
        setCourseList(courseList.map(c =>
            c.id === selectedCourse.id ? {
                ...c,
                ...formData,
                category: formData.category as 'foundation' | 'intermediate' | 'advanced',
                level: formData.level as 'Beginner' | 'Intermediate' | 'Advanced'
            } : c
        ));
        setIsEditOpen(false);
        toast.success("Course details updated");
    };

    const handleDelete = () => {
        if (!selectedCourse) return;
        setCourseList(courseList.filter(c => c.id !== selectedCourse.id));
        setIsDeleteOpen(false);
        toast.success("Course archived");
    };

    const openEdit = (course: any) => {
        setSelectedCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            grade: course.grade,
            duration: course.duration,
            sessions: course.sessions,
            price: course.price,
            category: course.category,
            level: course.level,
            image: course.image
        });
        setIsEditOpen(true);
    };

    const openView = (course: any) => {
        setSelectedCourse(course);
        setIsViewOpen(true);
    };

    const openDelete = (course: any) => {
        setSelectedCourse(course);
        setIsDeleteOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            grade: '',
            duration: '',
            sessions: 0,
            price: 0,
            category: 'foundation',
            level: 'Beginner',
            image: '/placeholder.svg'
        });
    };

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
                    <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <SheetTrigger asChild>
                            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={resetForm}>
                                <Plus className="h-4 w-4" />
                                Create New Course
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto sm:max-w-[500px]">
                            <SheetHeader>
                                <SheetTitle>Create New Course</SheetTitle>
                                <SheetDescription>
                                    Design a new robotic learning track.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Course Title</Label>
                                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea id="desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="grade">Target Grade</Label>
                                        <Input id="grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} placeholder="e.g. Class 4-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration</Label>
                                        <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 3 Months" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessions">No. of Sessions</Label>
                                        <Input id="sessions" type="number" value={formData.sessions} onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) || 0 })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="foundation">Foundation</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Difficulty Level</Label>
                                    <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button onClick={handleAddCourse}>Create Course</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
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
                            <Card
                                key={course.id}
                                className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer group"
                                onClick={(e) => {
                                    if ((e.target as any).closest('.action-btn')) return;
                                    openView(course);
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
                                                <DropdownMenuItem onClick={() => openEdit(course)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Course
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openView(course)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => openDelete(course)} className="text-destructive focus:text-destructive">
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
                                    <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5" onClick={() => openView(course)}>
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-lg">
                    <SheetHeader>
                        <SheetTitle>Edit Course Details</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Course Title</Label>
                            <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-desc">Description</Label>
                            <Textarea id="edit-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-grade">Target Grade</Label>
                                <Input id="edit-grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-duration">Duration</Label>
                                <Input id="edit-duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-sessions">No. of Sessions</Label>
                                <Input id="edit-sessions" type="number" value={formData.sessions} onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price (₹)</Label>
                                <Input id="edit-price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="foundation">Foundation</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-level">Difficulty Level</Label>
                            <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button onClick={handleEditSave}>Save Changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* View Course Sheet */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl p-0">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Course Details</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-full">
                        {selectedCourse && (
                            <div className="pb-8">
                                {/* Hero Section */}
                                <div className="bg-muted/30 p-6 border-b">
                                    <div className="flex gap-2 mb-4">
                                        <Badge variant="outline" className="bg-background">{selectedCourse.category}</Badge>
                                        <Badge variant={selectedCourse.level === 'Advanced' ? 'destructive' : selectedCourse.level === 'Intermediate' ? 'default' : 'secondary'}>
                                            {selectedCourse.level}
                                        </Badge>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {selectedCourse.description}
                                    </p>
                                </div>

                                <div className="p-6 space-y-8">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                            <Clock className="h-5 w-5 text-primary mb-1" />
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Duration</span>
                                            <span className="font-semibold text-sm">{selectedCourse.duration}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                            <FileText className="h-5 w-5 text-primary mb-1" />
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Sessions</span>
                                            <span className="font-semibold text-sm">{selectedCourse.sessions}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                            <GraduationCap className="h-5 w-5 text-primary mb-1" />
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Grade</span>
                                            <span className="font-semibold text-sm">{selectedCourse.grade}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-muted/10 rounded-lg border text-center">
                                            <DollarSign className="h-5 w-5 text-primary mb-1" />
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Price</span>
                                            <span className="font-semibold text-sm">₹{selectedCourse.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold flex items-center gap-2 text-sm">
                                            <BarChart className="h-4 w-4 text-primary" />
                                            Course Highlights
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {selectedCourse.features?.map((feature: string, i: number) => (
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
                                            {(selectedCourse.curriculum && selectedCourse.curriculum.length > 0) ? (
                                                selectedCourse.curriculum.map((module: any, idx: number) => (
                                                    <div key={module.id} className="p-4 hover:bg-muted/20 transition-colors">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-medium text-sm">Module {idx + 1}: {module.title}</span>
                                                            <Badge variant="outline" className="text-[10px]">{module.duration}</Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mb-2">
                                                            {module.lessons.length} Lessons including practical exercises.
                                                        </p>
                                                    </div>
                                                ))) : (
                                                <div className="p-8 text-center bg-muted/5 flex flex-col items-center">
                                                    <Layers className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                                    <p className="text-muted-foreground text-sm">No curriculum modules defined yet.</p>
                                                    <Button variant="outline" size="sm" className="mt-4" onClick={() => { setIsViewOpen(false); openEdit(selectedCourse); }}>
                                                        <Plus className="h-3 w-3 mr-2" /> Add Module
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Action Footer */}
                                    <div className="flex gap-2">
                                        <Button className="flex-1" onClick={() => { setIsViewOpen(false); openEdit(selectedCourse); }}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Course
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => { setIsViewOpen(false); openDelete(selectedCourse); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive this course?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will hide the course from the catalog. Students already enrolled will still have access.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Archive Course
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
