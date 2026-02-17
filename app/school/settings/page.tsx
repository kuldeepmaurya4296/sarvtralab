'use client';

import { useState } from 'react';
import {
    Settings,
    User,
    Lock,
    Bell,
    Shield,
    Save,
    Image as ImageIcon
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools } from '@/data/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SchoolSettingsPage() {
    const school = mockSchools[0];

    return (
        <DashboardLayout role="school" userName={school.name} userEmail={school.email}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your school profile and preferences
                    </p>
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="branding">Branding</TabsTrigger>
                        <TabsTrigger value="users">User Access</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>School Information</CardTitle>
                                <CardDescription>
                                    Update your school's basic details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolName">School Name</Label>
                                        <Input id="schoolName" defaultValue={school.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolCode">School Code</Label>
                                        <Input id="schoolCode" defaultValue={school.schoolCode} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="principal">Principal Name</Label>
                                        <Input id="principal" defaultValue={school.principalName} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue={school.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" defaultValue={school.phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" defaultValue={school.city} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" defaultValue="123 Example Street, City, State, Country" />
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

                    <TabsContent value="branding">
                        <Card>
                            <CardHeader>
                                <CardTitle>School Branding</CardTitle>
                                <CardDescription>
                                    Customize your school's appearance on the platform.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>School Logo</Label>
                                        <p className="text-sm text-muted-foreground">Upload a logo (PNG, JPG, SVG) max 2MB.</p>
                                        <Button variant="outline" size="sm">Upload New Logo</Button>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Custom Theme Color</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Select a primary color for your school's dashboard.
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer ring-2 ring-offset-2 ring-blue-600"></div>
                                            <div className="w-8 h-8 rounded-full bg-green-600 cursor-pointer hover:ring-2 ring-offset-2 ring-green-600"></div>
                                            <div className="w-8 h-8 rounded-full bg-red-600 cursor-pointer hover:ring-2 ring-offset-2 ring-red-600"></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage staff access and permissions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Administrator Access</p>
                                            <p className="text-sm text-muted-foreground">Full access to all settings and data.</p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-secondary/10 p-2 rounded-full">
                                            <User className="h-5 w-5 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Teacher Access</p>
                                            <p className="text-sm text-muted-foreground">Can view students and input grades.</p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>
                                    Update password and manage security preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-pass">Current Password</Label>
                                    <Input id="current-pass" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-pass">New Password</Label>
                                    <Input id="new-pass" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-pass">Confirm Password</Label>
                                    <Input id="confirm-pass" type="password" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button variant="destructive" className="gap-2">
                                        <Lock className="h-4 w-4" />
                                        Update Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
