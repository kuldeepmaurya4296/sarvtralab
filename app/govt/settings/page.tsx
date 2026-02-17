'use client';

import { useState } from 'react';
import {
    Settings,
    User,
    Lock,
    Bell,
    Shield,
    Save
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockGovtOrgs } from '@/data/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function GovtSettingsPage() {
    const govtOrg = mockGovtOrgs[0];

    return (
        <DashboardLayout role="govt" userName={govtOrg.name} userEmail={govtOrg.email}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account preferences and organization details
                    </p>
                </div>

                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your personal and organizational profile details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={govtOrg.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" defaultValue={govtOrg.email} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="designation">Designation</Label>
                                        <Input id="designation" defaultValue={govtOrg.designation} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input id="department" defaultValue={govtOrg.department} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="orgName">Organization Name</Label>
                                        <Input id="orgName" defaultValue={govtOrg.organizationName} />
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

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Preferences</CardTitle>
                                <CardDescription>
                                    Manage your account settings and preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Language</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Select the language for the dashboard interface.
                                            </p>
                                        </div>
                                        <Select defaultValue="en">
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="hi">Hindi</SelectItem>
                                                <SelectItem value="fr">French</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Timezone</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Set your local timezone for reporting.
                                            </p>
                                        </div>
                                        <Select defaultValue="ist">
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ist">IST (UTC+05:30)</SelectItem>
                                                <SelectItem value="utc">UTC</SelectItem>
                                                <SelectItem value="pst">PST (UTC-08:00)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Choose what you want to be notified about.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between space-y-2">
                                    <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                                        <span>Email Notifications</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Receive system updates via email.
                                        </span>
                                    </Label>
                                    <Switch id="email-notif" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between space-y-2">
                                    <Label htmlFor="report-notif" className="flex flex-col space-y-1">
                                        <span>Report Generation</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Get notified when requested reports are ready.
                                        </span>
                                    </Label>
                                    <Switch id="report-notif" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between space-y-2">
                                    <Label htmlFor="alert-notif" className="flex flex-col space-y-1">
                                        <span>Critical Alerts</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Immediate notifications for system issues.
                                        </span>
                                    </Label>
                                    <Switch id="alert-notif" defaultChecked />
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
