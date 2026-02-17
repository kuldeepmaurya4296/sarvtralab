'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { materials, Material } from '@/data/materials';
import { courses } from '@/data/courses';
import { mockStudents } from '@/data/users';
import { format } from 'date-fns';

export default function StudentMaterialsPage() {
    // 1. Identify User (Simulating Auth)
    const student = mockStudents.find(s => s.id === 'std-001'); // Default to Arjun Patel

    if (!student) return <div>Loading...</div>;

    // 2. Get Enrolled Courses
    const enrolledCourseIds = student.enrolledCourses;
    const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));

    // 3. Filter Materials based on Enrolled Courses
    const availableMaterials = materials.filter(m => enrolledCourseIds.includes(m.courseId));

    // 4. Local State for UI Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    // 5. Apply Filters
    const filteredMaterials = availableMaterials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourse = selectedCourse === 'all' || material.courseId === selectedCourse;
        const matchesType = selectedType === 'all' || material.type === selectedType;

        return matchesSearch && matchesCourse && matchesType;
    });

    const getCourseName = (courseId: string) => {
        return courses.find(c => c.id === courseId)?.title || 'Unknown Course';
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pdf': return 'bg-red-100 text-red-700 border-red-200';
            case 'zip': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'video': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'link': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <DashboardLayout role="student" userName={student.name} userEmail={student.email}>
            <div className="space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Learning Materials</h1>
                        <p className="text-muted-foreground">Access resources, guides, and project files for your courses.</p>
                    </div>
                </motion.div>

                {/* Filters & Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center"
                >
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search materials..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by Course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {enrolledCourses.map(course => (
                                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="File Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="pdf">PDF Docs</SelectItem>
                                <SelectItem value="zip">ZIP Files</SelectItem>
                                <SelectItem value="video">Videos</SelectItem>
                                <SelectItem value="link">External Links</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMaterials.length > 0 ? (
                        filteredMaterials.map((material, index) => (
                            <motion.div
                                key={material.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                                className="group bg-card border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(material.type)} bg-opacity-20`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className={`${getTypeColor(material.type)} border bg-opacity-20`}>
                                        {material.type.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="mb-4 flex-1">
                                    <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                        {material.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span className="truncate max-w-[200px]">{getCourseName(material.courseId)}</span>
                                    </div>
                                    {material.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {material.description}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t flex items-center justify-between mt-auto">
                                    <div className="text-xs text-muted-foreground">
                                        {material.size && <span>{material.size} • </span>}
                                        <span>{format(new Date(material.uploadedAt), 'MMM d, yyyy')}</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 gap-1.5" asChild>
                                        <a href={material.downloadUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="w-3.5 h-3.5" />
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">No materials found</h3>
                            <p className="text-muted-foreground mt-1">Try adjusting your search or filters to see more results.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => { setSearchQuery(''); setSelectedCourse('all'); setSelectedType('all'); }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
