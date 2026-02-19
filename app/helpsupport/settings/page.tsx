'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Settings, User, Lock, Save, Eye, EyeOff, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function HelpSupportSettingsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'helpsupport')) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'helpsupport') return null;

    return (
        <DashboardLayout role="helpsupport" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" /> Settings
                    </h1>
                    <p className="text-muted-foreground">Manage your support account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Profile Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user.name || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user.email || ''} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dept">Department</Label>
                                <Select defaultValue="technical">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technical">Technical Support</SelectItem>
                                        <SelectItem value="academic">Academic Support</SelectItem>
                                        <SelectItem value="billing">Billing & Accounts</SelectItem>
                                        <SelectItem value="general">General Inquiry</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Availability Status</Label>
                            <Select defaultValue="available">
                                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">🟢 Available</SelectItem>
                                    <SelectItem value="busy">🟡 Busy</SelectItem>
                                    <SelectItem value="offline">🔴 Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => toast.success('Profile updated!')} className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5" /> Notification Preferences</CardTitle>
                        <CardDescription>Choose how you receive ticket notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                                <p className="font-medium text-sm">Email Notifications</p>
                                <p className="text-xs text-muted-foreground">Get notified via email for new tickets</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                                <p className="font-medium text-sm">High Priority Alerts</p>
                                <p className="text-xs text-muted-foreground">Instant alerts for high priority tickets</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                                <p className="font-medium text-sm">Daily Summary</p>
                                <p className="text-xs text-muted-foreground">Receive a daily summary of ticket activity</p>
                            </div>
                            <input type="checkbox" className="h-4 w-4 accent-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Lock className="h-5 w-5" /> Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type={showPassword ? 'text' : 'password'} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input id="confirm" type={showPassword ? 'text' : 'password'} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button onClick={() => toast.success('Password updated!')} className="gap-2"><Save className="h-4 w-4" /> Update Password</Button>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
