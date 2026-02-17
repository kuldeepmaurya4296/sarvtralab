'use client';

import { useState } from 'react';
import { BookOpen, Search, Plus } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin } from '@/data/users';
import { CourseService } from '@/data/services/course.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Course } from '@/data/courses';

// Refactored Components
import { CourseCardGrid } from '@/components/admin/courses/CourseCardGrid';
import { CourseViewSheet } from '@/components/admin/courses/CourseViewSheet';
import { CourseFormSheet } from '@/components/admin/courses/CourseFormSheet';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function AdminCoursesPage() {
    const admin = mockSuperAdmin;
    const [courseList, setCourseList] = useState<Course[]>(CourseService.getAll());
    const [searchQuery, setSearchQuery] = useState('');

    // UI States
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const filteredCourses = courseList.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleAddCourse = (formData: any) => {
        const createdCourse = CourseService.create({
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
        }
    };

    const handleEditSave = (formData: any) => {
        if (!selectedCourse) return;
        const updated = CourseService.update(selectedCourse.id, {
            ...formData,
            category: formData.category as 'foundation' | 'intermediate' | 'advanced',
            level: formData.level as 'Beginner' | 'Intermediate' | 'Advanced'
        });

        if (updated) {
            setCourseList(courseList.map(c => c.id === selectedCourse.id ? updated : c));
            toast.success("Course details updated");
        }
    };

    const handleDelete = () => {
        if (!selectedCourse) return;
        CourseService.delete(selectedCourse.id);
        setCourseList(courseList.filter(c => c.id !== selectedCourse.id));
        setIsDeleteOpen(false);
        toast.success("Course archived");
    };

    // Open handlers
    const openView = (course: Course) => { setSelectedCourse(course); setIsViewOpen(true); };
    const openEdit = (course: Course) => { setSelectedCourse(course); setIsEditOpen(true); };
    const openDelete = (course: Course) => { setSelectedCourse(course); setIsDeleteOpen(true); };

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
