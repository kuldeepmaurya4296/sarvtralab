'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Course } from '@/data/courses';
import { useAuth } from '@/context/AuthContext';
import { SuperAdmin } from '@/data/users';

// Actions
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '@/lib/actions/course.actions';

// Refactored Components
import { CourseCardGrid } from '@/components/admin/courses/CourseCardGrid';
import { CourseViewSheet } from '@/components/admin/courses/CourseViewSheet';
import { CourseFormSheet } from '@/components/admin/courses/CourseFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminCoursesPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [courseList, setCourseList] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);

    // UI States
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'superadmin')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (user?.role === 'superadmin') {
                try {
                    const courses = await getAllCourses();
                    setCourseList(courses);
                } catch (error) {
                    toast.error("Failed to load courses");
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        if (user && !isAuthLoading) fetchCourses();
    }, [user, isAuthLoading]);

    const filteredCourses = courseList.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleAddCourse = async (formData: any) => {
        try {
            const createdCourse = await createCourse({
                ...formData,
                category: formData.category as 'foundation' | 'intermediate' | 'advanced',
                level: formData.level as 'Beginner' | 'Intermediate' | 'Advanced',
                totalHours: formData.sessions * 1.5,
                originalPrice: formData.price * 1.5,
                emiAvailable: true,
                tags: ['New', 'Featured'],
                features: ['Live Sessions', 'Projects'],
                curriculum: [],
                rating: 0,
                studentsEnrolled: 0,
                instructor: 'TBD'
            });

            if (createdCourse) {
                setCourseList([createdCourse, ...courseList]);
                toast.success("Course created successfully");
                setIsAddOpen(false);
            }
        } catch (error) {
            toast.error("Failed to create course");
        }
    };

    const handleEditSave = async (formData: any) => {
        if (!selectedCourse) return;
        try {
            const updated = await updateCourse(selectedCourse.id, {
                ...formData,
                category: formData.category as 'foundation' | 'intermediate' | 'advanced',
                level: formData.level as 'Beginner' | 'Intermediate' | 'Advanced'
            });

            if (updated) {
                setCourseList(courseList.map(c => c.id === selectedCourse.id ? updated : c));
                toast.success("Course details updated");
                setIsEditOpen(false);
            }
        } catch (error) {
            toast.error("Failed to update course");
        }
    };

    const handleDelete = async () => {
        if (!selectedCourse) return;
        try {
            await deleteCourse(selectedCourse.id);
            setCourseList(courseList.filter(c => c.id !== selectedCourse.id));
            setIsDeleteOpen(false);
            toast.success("Course archived");
        } catch (error) {
            toast.error("Failed to archive course");
        }
    };

    // Open handlers
    const openView = (course: Course) => { setSelectedCourse(course); setIsViewOpen(true); };
    const openEdit = (course: Course) => { setSelectedCourse(course); setIsEditOpen(true); };
    const openDelete = (course: Course) => { setSelectedCourse(course); setIsDeleteOpen(true); };

    if (isAuthLoading || isLoadingData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'superadmin') return null;

    const admin = user as SuperAdmin;

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
                    <Button
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setIsAddOpen(true)}
                    >
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

                <CourseCardGrid
                    courses={filteredCourses}
                    onView={openView}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />
            </div>

            {/* Modals and Sheets */}
            <CourseViewSheet
                course={selectedCourse}
                open={isViewOpen}
                onOpenChange={setIsViewOpen}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            <CourseFormSheet
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                mode="add"
                onSubmit={handleAddCourse}
            />

            <CourseFormSheet
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                mode="edit"
                initialData={selectedCourse}
                onSubmit={handleEditSave}
            />

            <ConfirmDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onConfirm={handleDelete}
                title="Archive this course?"
                description={<>This will hide <strong>{selectedCourse?.title}</strong> from the catalog. Students already enrolled will still have access.</>}
                confirmLabel="Archive Course"
            />
        </DashboardLayout>
    );
}
