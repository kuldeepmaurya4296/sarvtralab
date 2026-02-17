'use client';

import { useState } from 'react';
import {
    Headphones,
    MessageSquare,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    Search,
    Filter,
    Plus
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockHelpSupport, mockSupportTickets } from '@/data/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

export default function AdminHelpSupportPage() {
    const admin = mockSuperAdmin;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTickets = mockSupportTickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStaff = mockHelpSupport.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStaffName = (id: string) => {
        const staff = mockHelpSupport.find(s => s.id === id);
        return staff ? staff.name : 'Unassigned';
    };

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Headphones className="h-6 w-6 text-primary" />
                        Help & Support
                    </h1>
                    <p className="text-muted-foreground">
                        Manage support tickets and support staff
                    </p>
                </div>

                <Tabs defaultValue="tickets" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
                        <TabsTrigger value="staff">Support Staff</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tickets">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <CardTitle>Recent Tickets</CardTitle>
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search tickets..."
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
                                                <TableHead>Subject</TableHead>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Priority</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Assigned To</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTickets.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-24 text-center">
                                                        No tickets found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredTickets.map((ticket) => (
                                                    <TableRow key={ticket.id}>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium truncate max-w-[200px]">{ticket.subject}</span>
                                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{ticket.description}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{ticket.studentName}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'secondary' : 'outline'}>
                                                                {ticket.priority}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                {ticket.status === 'resolved' ? <CheckCircle className="h-3 w-3 text-green-500" /> :
                                                                    ticket.status === 'in-progress' ? <Clock className="h-3 w-3 text-amber-500" /> :
                                                                        <AlertCircle className="h-3 w-3 text-red-500" />}
                                                                <span className="capitalize">{ticket.status}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {getStaffName(ticket.assignedTo)}
                                                        </TableCell>
                                                        <TableCell className="text-xs text-muted-foreground">
                                                            {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm">View</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="staff">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <CardTitle>Support Team</CardTitle>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" /> Add Agent
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Department</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Tickets Resolved</TableHead>
                                                <TableHead>Active Tickets</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredStaff.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        No staff found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredStaff.map((staff) => (
                                                    <TableRow key={staff.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{staff.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{staff.email}</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="capitalize">{staff.department}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={staff.status === 'available' ? 'default' : 'secondary'}
                                                                className={staff.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                                                            >
                                                                {staff.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="font-medium">{staff.ticketsResolved}</TableCell>
                                                        <TableCell>{staff.ticketsPending}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm">Manage</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

// I need to import Plus from lucide-react, I missed it in the imports.
// wait, I did: import { ..., Plus, ... } from 'lucide-react';
// Ah, no, I see I already imported it. Let me check the code block again.
// Yes, Plus is imported.
