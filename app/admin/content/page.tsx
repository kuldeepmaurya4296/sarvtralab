'use client';

import { useState } from 'react';
import {
    FileText,
    Upload,
    Video,
    File,
    Folder,
    Search,
    MoreVertical
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin } from '@/data/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockContent = [
    { id: 'cnt-001', title: 'Intro to Robotics Video', type: 'Video', size: '450 MB', lastModified: '2024-05-10', status: 'Published' },
    { id: 'cnt-002', title: 'Advanced AI Guide PDF', type: 'PDF', size: '12 MB', lastModified: '2024-05-08', status: 'Published' },
    { id: 'cnt-003', title: 'Python Basics Quiz', type: 'Quiz', size: '-', lastModified: '2024-05-05', status: 'Draft' },
    { id: 'cnt-004', title: 'Sensor Integration Schematics', type: 'Image', size: '2.5 MB', lastModified: '2024-04-20', status: 'Published' },
    { id: 'cnt-005', title: 'Project Rubrics', type: 'Doc', size: '0.5 MB', lastModified: '2024-04-15', status: 'Archived' },
];

export default function AdminContentPage() {
    const admin = mockSuperAdmin;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContent = mockContent.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            Content Library
                        </h1>
                        <p className="text-muted-foreground">
                            Manage educational resources and assets
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Folder className="h-4 w-4" />
                            New Folder
                        </Button>
                        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Upload className="h-4 w-4" />
                            Upload Resource
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Library Assets</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search content..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>File Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Last Modified</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredContent.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No content found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredContent.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {item.type === 'Video' ? <Video className="h-4 w-4 text-blue-500" /> :
                                                            item.type === 'PDF' ? <File className="h-4 w-4 text-red-500" /> :
                                                                <FileText className="h-4 w-4 text-gray-500" />}
                                                        <span className="font-medium">{item.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{item.size}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{item.lastModified}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.status === 'Published' ? 'default' : item.status === 'Draft' ? 'outline' : 'secondary'}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>Download</DropdownMenuItem>
                                                            <DropdownMenuItem>Rename</DropdownMenuItem>
                                                            <DropdownMenuItem>Share Link</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive">
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
