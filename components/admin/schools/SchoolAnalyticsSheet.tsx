'use client';

import { Users, BookOpen, Shield, BarChart3 } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from '@/components/ui/card';
import { School } from '@/data/users';
import { SchoolService } from '@/data/services/school.service';

interface SchoolAnalyticsSheetProps {
    school: School | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SchoolAnalyticsSheet({ school, open, onOpenChange }: SchoolAnalyticsSheetProps) {
    if (!school) return null;

    const stats = SchoolService.getStats(school.id);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>School Analytics</SheetTitle>
                    <SheetDescription>
                        Performance overview for {school.name}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Users className="h-8 w-8 text-blue-500 mb-2" />
                                <h3 className="text-2xl font-bold">{stats.studentCount}</h3>
                                <p className="text-xs text-muted-foreground">Total Students</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <BookOpen className="h-8 w-8 text-green-500 mb-2" />
                                <h3 className="text-2xl font-bold">{stats.activeCourses}</h3>
                                <p className="text-xs text-muted-foreground">Active Courses</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Shield className="h-8 w-8 text-purple-500 mb-2" />
                                <h3 className="text-2xl font-bold">{stats.teacherCount}</h3>
                                <p className="text-xs text-muted-foreground">Teachers</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <BarChart3 className="h-8 w-8 text-orange-500 mb-2" />
                                <h3 className="text-2xl font-bold">{stats.attendanceRate}%</h3>
                                <p className="text-xs text-muted-foreground">Attendance Rate</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Storage Usage</h3>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[65%]"></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>65 GB Used</span>
                            <span>100 GB Total</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Recent Activity</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3 text-sm">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                                    <div>
                                        <p className="font-medium">New student registration batch</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago • Admin Panel</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
