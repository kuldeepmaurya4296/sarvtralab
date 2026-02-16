'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, FileText, CheckCircle, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { courses, Course, Lesson } from '@/data/courses';
import { mockStudents } from '@/data/users';

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;

    // Simulate user
    const currentUser = mockStudents.find(u => u.id === 'std-001');

    const [course, setCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // "Fetch" course
        const foundCourse = courses.find(c => c.id === courseId);
        if (foundCourse) {
            setCourse(foundCourse);
            // specific logic to find first lesson or last accessed
            if (foundCourse.curriculum.length > 0 && foundCourse.curriculum[0].lessons.length > 0) {
                setActiveLesson(foundCourse.curriculum[0].lessons[0]);
            }
        }
    }, [courseId]);

    if (!currentUser) return <div>User not found</div>;
    if (!course) return <div className="p-8 text-center">Loading course...</div>;

    const handleLessonSelect = (lesson: Lesson) => {
        setActiveLesson(lesson);
        // In a real app, we would update the "last accessed" and "progress" here
    };

    const nextLesson = () => {
        // Logic to find next lesson
        if (!activeLesson) return;
        let foundCurrent = false;
        for (const module of course.curriculum) {
            for (const lesson of module.lessons) {
                if (foundCurrent) {
                    setActiveLesson(lesson);
                    return;
                }
                if (lesson.id === activeLesson.id) {
                    foundCurrent = true;
                }
            }
        }
    };

    const prevLesson = () => {
        // Logic to find prev lesson
        if (!activeLesson) return;
        let prev: Lesson | null = null;
        for (const module of course.curriculum) {
            for (const lesson of module.lessons) {
                if (lesson.id === activeLesson.id) {
                    if (prev) setActiveLesson(prev);
                    return;
                }
                prev = lesson;
            }
        }
    };

    return (
        <DashboardLayout role="student" userName={currentUser.name} userEmail={currentUser.email}>
            <div className="flex flex-col h-[calc(100vh-100px)]">
                {/* Header for Player */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-bold leading-tight">{course.title}</h1>
                            <p className="text-xs text-muted-foreground">{activeLesson?.title}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                        <Menu className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden">
                    {/* Main Content (Video Player) */}
                    <div className="flex-1 flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="relative flex-1 bg-black flex items-center justify-center">
                            {activeLesson?.type === 'video' && activeLesson.videoUrl ? (
                                <iframe
                                    src={activeLesson.videoUrl}
                                    title={activeLesson.title}
                                    className="w-full h-full absolute inset-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="text-center p-8 text-white">
                                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-semibold mb-2">{activeLesson?.title}</h3>
                                    <p className="text-gray-400">
                                        This is a {activeLesson?.type} lesson.
                                        {activeLesson?.type === 'project' && " Follow the instructions in the description below."}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t flex justify-between items-center bg-background">
                            <Button variant="outline" onClick={prevLesson} disabled={!activeLesson}>Previous</Button>
                            <Button onClick={nextLesson}>Next Lesson <ChevronRight className="w-4 h-4 ml-2" /></Button>
                        </div>
                    </div>

                    {/* Sidebar (Curriculum) */}
                    <motion.div
                        initial={false}
                        animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
                        className="hidden lg:block bg-card border rounded-xl overflow-hidden shadow-sm h-full flex-shrink-0"
                    >
                        <div className="p-4 border-b font-semibold bg-muted/30">
                            Course Content
                        </div>
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4 pb-20">
                                <Accordion type="single" collapsible defaultValue={course.curriculum[0]?.id} className="w-full">
                                    {course.curriculum.map((module) => (
                                        <AccordionItem key={module.id} value={module.id} className="border-b-0 mb-2">
                                            <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-lg hover:bg-muted/50 data-[state=open]:bg-muted/50">
                                                <div className="text-left text-sm">
                                                    <div className="font-semibold">{module.title}</div>
                                                    <div className="text-xs text-muted-foreground font-normal">{module.duration}</div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-1 pb-2">
                                                <div className="space-y-1 mt-1 pl-2">
                                                    {module.lessons.map((lesson) => (
                                                        <button
                                                            key={lesson.id}
                                                            onClick={() => handleLessonSelect(lesson)}
                                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors text-left
                                                                ${activeLesson?.id === lesson.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}
                                                            `}
                                                        >
                                                            {lesson.isCompleted ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                            ) : (
                                                                lesson.type === 'video' ? <Play className="w-4 h-4 shrink-0" /> : <FileText className="w-4 h-4 shrink-0" />
                                                            )}
                                                            <span className="line-clamp-1">{lesson.title}</span>
                                                            <span className="ml-auto text-xs opacity-70 whitespace-nowrap">{lesson.duration}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </ScrollArea>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
