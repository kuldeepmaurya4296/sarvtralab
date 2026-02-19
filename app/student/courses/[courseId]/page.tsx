'use client';


import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, FileText, CheckCircle, ChevronLeft, ChevronRight, Menu, Maximize2, Minimize2, Sidebar as SidebarIcon } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { getCourseById } from '@/lib/actions/course.actions';
import { Course, Lesson } from '@/data/courses'; // Keeping type imports
import { Student } from '@/data/users';

export default function CoursePlayerPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const { user, isLoading: isAuthLoading } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [cinemaMode, setCinemaMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const playerRef = useRef<HTMLDivElement>(null);

    // Handle Native Fullscreen
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullScreen = () => {
        if (!playerRef.current) return;

        if (!document.fullscreenElement) {
            playerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'student')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const fetchCourse = async () => {
            if (courseId) {
                try {
                    const fetchedCourse = await getCourseById(courseId);
                    if (fetchedCourse) {
                        setCourse(fetchedCourse);
                        if (fetchedCourse.curriculum.length > 0 && fetchedCourse.curriculum[0].lessons.length > 0) {
                            setActiveLesson(fetchedCourse.curriculum[0].lessons[0]);
                        }
                    }
                } catch (error) {
                    console.error("Failed to load course", error);
                } finally {
                    setIsLoadingCourse(false);
                }
            }
        };
        fetchCourse();
    }, [courseId]);

    if (isAuthLoading || isLoadingCourse) return <div className="p-8 text-center text-white">Loading course...</div>;
    if (!user) return null;

    const currentUser = user as Student;
    if (!course) return <div className="p-8 text-center text-white">Course not found</div>;

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

    const CurriculumContent = () => {
        if (!course) return null;
        return (
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
        );
    };

    return (
        <DashboardLayout
            role="student"
            userName={currentUser.name}
            userEmail={currentUser.email}
            hideSidebar={cinemaMode}
        >
            <div className={`flex flex-col ${cinemaMode ? 'h-[calc(100vh-80px)]' : 'h-[calc(100vh-100px)]'} transition-all duration-300`}>
                {/* Header for Player */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className={cinemaMode ? 'hidden sm:flex' : ''}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold leading-tight line-clamp-1">{course.title}</h1>
                            <p className="text-xs text-muted-foreground line-clamp-1">{activeLesson?.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Fullscreen Mode (Native) */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleFullScreen}
                            className="hidden sm:flex gap-2"
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
                        </Button>

                        {/* Cinema Mode Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCinemaMode(!cinemaMode)}
                            className="hidden sm:flex gap-2"
                        >
                            <SidebarIcon className="w-4 h-4" />
                            {cinemaMode ? 'Show Sidebar' : 'Cinema Mode'}
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleFullScreen}
                            className="sm:hidden"
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </Button>

                        {/* Mobile Curriculum Toggle */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                                    <Menu className="w-4 h-4" />
                                    <span className="hidden xs:inline">Content</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle>Course Content</SheetTitle>
                                </SheetHeader>
                                <ScrollArea className="h-[calc(100vh-80px)]">
                                    <CurriculumContent />
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden">
                    {/* Main Content (Video Player) */}
                    <div
                        ref={playerRef}
                        className={`flex-1 flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-[100] rounded-none border-none' : 'relative'}`}
                    >
                        <div className="relative flex-1 bg-black flex items-center justify-center">
                            {activeLesson?.type === 'video' && activeLesson.videoUrl ? (
                                <iframe
                                    src={activeLesson.videoUrl}
                                    title={activeLesson.title}
                                    className="w-full h-full absolute inset-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="text-center p-8 text-white">
                                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{activeLesson?.title}</h3>
                                    <p className="text-sm text-gray-400 max-w-md mx-auto">
                                        This is a {activeLesson?.type} lesson.
                                        {activeLesson?.type === 'project' && " Follow the instructions in the description below."}
                                    </p>
                                </div>
                            )}

                            {/* Overlay Controls for Native Fullscreen */}
                            {isFullscreen && (
                                <div className="absolute top-4 right-4 z-[110]">
                                    <Button size="icon" variant="secondary" className="rounded-full bg-black/50 hover:bg-black/70 text-white border-none" onClick={toggleFullScreen}>
                                        <Minimize2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {!isFullscreen && (
                            <div className="p-3 sm:p-4 border-t flex justify-between items-center bg-background">
                                <Button variant="outline" size="sm" onClick={prevLesson} disabled={!activeLesson}>Previous</Button>
                                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">{activeLesson?.title}</span>
                                </div>
                                <Button size="sm" onClick={nextLesson}>Next Lesson <ChevronRight className="w-4 h-4 ml-1" /></Button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Curriculum) - Desktop */}
                    <motion.div
                        initial={false}
                        animate={{
                            width: (sidebarOpen && !cinemaMode && !isFullscreen) ? 320 : 0,
                            opacity: (sidebarOpen && !cinemaMode && !isFullscreen) ? 1 : 0,
                            marginRight: (sidebarOpen && !cinemaMode && !isFullscreen) ? 0 : -24
                        }}
                        className="hidden lg:block bg-card border rounded-xl overflow-hidden shadow-sm h-full flex-shrink-0"
                    >
                        <div className="p-4 border-b font-semibold bg-muted/30 flex items-center justify-between">
                            <span>Course Content</span>
                        </div>
                        <ScrollArea className="h-full">
                            <CurriculumContent />
                        </ScrollArea>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
