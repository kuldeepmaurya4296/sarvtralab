'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Lock, Mail, Save } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // removed unused useState

export default function StudentSettingsPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // In a real app, you might fetch additional data if the user object is minimal.
    // For now, we assume user object has what we need, or we fail gracefully.

    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== 'student')) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    if (isAuthLoading || !user) {
        return <div className="p-8">Loading...</div>;
    }

    // Cast to any to access specific fields if not strictly typed in context yet
    const student = user as any;

    return (
        <DashboardLayout role="student" userName={student.name} userEmail={student.email}>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile and preferences.</p>
                </div>

                <div className="bg-card p-8 rounded-2xl border shadow-sm space-y-8">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-md">
                                {student.name.charAt(0)}
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 border shadow-sm"
                            >
                                <User className="w-4 h-4" />
                            </Button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">Student ID: {student.id}</p>
                            <Button variant="link" className="px-0 h-auto text-primary">Change Avatar</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="fullName" defaultValue={student.name} className="pl-9" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="email" type="email" defaultValue={student.email} className="pl-9" disabled />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" placeholder="+91 98765 43210" disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="school">School</Label>
                            <Input id="school" defaultValue={student.schoolName} disabled />
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end gap-4">
                        <Button variant="outline">Cancel</Button>
                        <Button className="gap-2">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-card p-8 rounded-2xl border shadow-sm space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Security</h3>
                        <p className="text-sm text-muted-foreground">Update your password or manage login sessions.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="currentPassword" type="password" className="pl-9" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="newPassword" type="password" className="pl-9" placeholder="New password" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="confirmPassword" type="password" className="pl-9" placeholder="Confirm new password" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button variant="outline" className="text-primary hover:text-primary border-primary/20 hover:bg-primary/5">
                            Update Password
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
