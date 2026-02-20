'use client';

import { useState } from 'react';
import {
    Settings,
    User,
    Lock,
    Bell,
    Shield,
    Save,
    Globe,
    Server,
    Database
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function AdminSettingsPage() {
    const { user, isLoading: authLoading } = useAuth();

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading Settings...</div>;
    if (!user || user.role !== 'superadmin') return null;

    const admin = user;

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        System Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Configure global platform settings and preferences
                    </p>
                </div>

                <Tabs defaultValue="platform" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="platform">Platform</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                        <TabsTrigger value="system">System Status</TabsTrigger>
                    </TabsList>

                    <TabsContent value="platform">
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Configuration</CardTitle>
                                <CardDescription>
                                    Global settings affecting all users.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Maintenance Mode</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Disable access for non-admin users.
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">New User Registration</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Allow new schools/students to sign up.
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="platform-name">Platform Name</Label>
                                        <Input id="platform-name" defaultValue="Sarvtra Labs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="support-email">Support Email</Label>
                                        <Input id="support-email" defaultValue="connect@pushpako2.com" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button className="gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Configuration
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Profile</CardTitle>
                                <CardDescription>
                                    Update your personal admin details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={admin.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" defaultValue={admin.email} disabled />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button className="gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="roles">
                        <Card>
                            <CardHeader>
                                <CardTitle>Access Control</CardTitle>
                                <CardDescription>
                                    Manage default permissions for user roles.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">School Admins</p>
                                        <p className="text-sm text-muted-foreground">Can manage student data and view reports.</p>
                                    </div>
                                    <Button variant="outline" size="sm">Edit Permissions</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Govt Officials</p>
                                        <p className="text-sm text-muted-foreground">Read-only access to analytics and school data.</p>
                                    </div>
                                    <Button variant="outline" size="sm">Edit Permissions</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Students</p>
                                        <p className="text-sm text-muted-foreground">Access to courses and personal progress only.</p>
                                    </div>
                                    <Button variant="outline" size="sm">Edit Permissions</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="system">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Health</CardTitle>
                                <CardDescription>
                                    Monitor server status and database connectivity.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">Server Status</p>
                                                <p className="text-xs text-muted-foreground">Running (99.9% Uptime)</p>
                                            </div>
                                            <Globe className="h-4 w-4 text-green-500" />
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">Database</p>
                                                <p className="text-xs text-muted-foreground">Connected (54ms latency)</p>
                                            </div>
                                            <Database className="h-4 w-4 text-green-500" />
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">API Gateway</p>
                                                <p className="text-xs text-muted-foreground">Healthy</p>
                                            </div>
                                            <Server className="h-4 w-4 text-green-500" />
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="space-y-2">
                                    <Label>System Logs</Label>
                                    <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md h-32 overflow-y-auto">
                                        <p>[INFO] 2024-05-12 10:00:01 - System started successfully</p>
                                        <p>[INFO] 2024-05-12 10:05:23 - Database connection established</p>
                                        <p>[INFO] 2024-05-12 10:15:00 - Scheduled backup completed</p>
                                        <p>[WARN] 2024-05-12 11:30:45 - High memory usage detected (85%)</p>
                                        <p>[INFO] 2024-05-12 11:35:00 - Auto-scaling triggered</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
