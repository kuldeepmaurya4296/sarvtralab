'use client';

import {
    School as SchoolIcon,
    MapPin,
    Building,
    Users,
    BookOpen,
    Shield,
    Calendar,
    CreditCard,
    Edit,
    Lock,
    BarChart3,
    Trash2,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { School } from '@/data/users';
import { format } from 'date-fns';

interface SchoolDetailsSheetProps {
    school: School | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (school: School) => void;
    onAccess: (school: School) => void;
    onAnalytics: (school: School) => void;
    onDelete: (school: School) => void;
}

function getStatusColor(expiryDate: string) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return "destructive";
    if (daysLeft < 30) return "warning";
    return "success";
}

function getStatusLabel(expiryDate: string) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) return "Expired";
    return "Active";
}

export function SchoolDetailsSheet({ school, open, onOpenChange, onEdit, onAccess, onAnalytics, onDelete }: SchoolDetailsSheetProps) {
    if (!school) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-xl">
                <SheetHeader>
                    <SheetTitle>School Details</SheetTitle>
                    <SheetDescription>
                        Comprehensive information for {school.name}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                    {/* Header Info */}
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <SchoolIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{school.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline">{school.schoolCode}</Badge>
                                <Badge variant="secondary" className="capitalize">{school.schoolType}</Badge>
                                <Badge variant="outline">{school.board}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Info */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                Contact Information
                            </h4>
                            <div className="text-sm space-y-2 pl-6">
                                <div className="grid grid-cols-[80px_1fr] gap-1">
                                    <span className="text-muted-foreground">Principal:</span>
                                    <span className="font-medium">{school.principalName}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] gap-1">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{school.phone}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] gap-1">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium break-all">{school.email}</span>
                                </div>
                                {school.websiteUrl && (
                                    <div className="grid grid-cols-[80px_1fr] gap-1">
                                        <span className="text-muted-foreground">Website:</span>
                                        <a href={school.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate">
                                            {school.websiteUrl}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Info */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                Location
                            </h4>
                            <div className="text-sm space-y-2 pl-6">
                                <div className="grid grid-cols-[80px_1fr] gap-1">
                                    <span className="text-muted-foreground">Address:</span>
                                    <span className="font-medium">{school.address}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] gap-1">
                                    <span className="text-muted-foreground">City:</span>
                                    <span className="font-medium">{school.city}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] gap-1">
                                    <span className="text-muted-foreground">State:</span>
                                    <span className="font-medium">{school.state}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr] gap-1">
                                    <span className="text-muted-foreground">Pincode:</span>
                                    <span className="font-medium">{school.pincode}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Users className="h-6 w-6 text-blue-500 mb-1" />
                                <span className="text-lg font-bold">{school.totalStudents}</span>
                                <span className="text-[10px] text-muted-foreground">Students</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Shield className="h-6 w-6 text-purple-500 mb-1" />
                                <span className="text-lg font-bold">{Math.floor(school.totalStudents / 30)}</span>
                                <span className="text-[10px] text-muted-foreground">Teachers</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <BookOpen className="h-6 w-6 text-green-500 mb-1" />
                                <span className="text-lg font-bold">{school.assignedCourses?.length || 0}</span>
                                <span className="text-[10px] text-muted-foreground">Courses</span>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Calendar className="h-6 w-6 text-orange-500 mb-1" />
                                <span className="text-lg font-bold">{new Date().getFullYear() - ((school as any).establishedYear || 2020)}</span>
                                <span className="text-[10px] text-muted-foreground">Years Active</span>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator />

                    {/* Subscription Info */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            Subscription & Billing
                        </h4>
                        <div className="bg-muted/30 p-4 rounded-md text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-muted-foreground block text-xs">Current Plan</span>
                                <Badge variant="default" className="mt-1 capitalize">{school.subscriptionPlan}</Badge>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs">Status</span>
                                <span className={`font-medium mt-1 inline-flex items-center gap-1 ${getStatusColor(school.subscriptionExpiry) === 'destructive' ? 'text-red-600' :
                                    getStatusColor(school.subscriptionExpiry) === 'warning' ? 'text-amber-600' : 'text-green-600'
                                    }`}>
                                    <span className={`h-2 w-2 rounded-full ${getStatusColor(school.subscriptionExpiry) === 'destructive' ? 'bg-red-600' :
                                        getStatusColor(school.subscriptionExpiry) === 'warning' ? 'bg-amber-600' : 'bg-green-600'
                                        }`}></span>
                                    {getStatusLabel(school.subscriptionExpiry)}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs">Expires On</span>
                                <span className="font-medium block mt-1">{format(new Date(school.subscriptionExpiry), 'MMM d, yyyy')}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs">School ID</span>
                                <span className="font-mono text-xs block mt-1">{school.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-4 flex flex-wrap gap-2">
                        <Button className="flex-1" onClick={() => onEdit(school)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => onAccess(school)}>
                            <Lock className="mr-2 h-4 w-4" /> Access
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => onAnalytics(school)}>
                            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => onDelete(school)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
