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
    Plus,
    MoreVertical,
    Trash2,
    Edit,
    Mail,
    Phone,
    Briefcase,
    Shield,
    FileText,
    Eye
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockHelpSupport, mockSupportTickets, mockStudents } from '@/data/users';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';

export default function AdminHelpSupportPage() {
    const admin = mockSuperAdmin;
    const [searchQuery, setSearchQuery] = useState('');

    // State
    const [staffList, setStaffList] = useState(mockHelpSupport);
    const [tickets, setTickets] = useState(mockSupportTickets);

    // Actions
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
    const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
    const [isViewStaffOpen, setIsViewStaffOpen] = useState(false);
    const [isDeleteStaffOpen, setIsDeleteStaffOpen] = useState(false);
    const [isViewTicketOpen, setIsViewTicketOpen] = useState(false);

    // Form Data Staff
    const [staffForm, setStaffForm] = useState({
        name: '',
        email: '',
        role: 'helpsupport',
        department: '',
        status: 'available'
    });

    // Form Data Ticket
    const [ticketStatus, setTicketStatus] = useState('');


    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStaffName = (id: string) => {
        const staff = staffList.find(s => s.id === id);
        return staff ? staff.name : 'Unassigned';
    };

    const handleAddStaff = () => {
        const newStaff: any = {
            id: `SUP-${Math.random().toString(36).substr(2, 9)}`,
            ...staffForm,
            role: 'helpsupport' as const,
            department: staffForm.department as 'technical' | 'academic' | 'general',
            ticketsResolved: 0,
            ticketsPending: 0,
            assignedStudents: [],
            password: 'password123',
            phone: '',
            createdAt: new Date().toISOString()
        };
        // @ts-ignore
        setStaffList([newStaff, ...staffList]);
        setIsAddStaffOpen(false);
        resetStaffForm();
        toast.success("Support agent added");
    };

    const handleEditStaff = () => {
        if (!selectedStaff) return;
        setStaffList(staffList.map(s =>
            s.id === selectedStaff.id ? {
                ...s,
                ...staffForm,
                role: 'helpsupport' as const,
                department: staffForm.department as 'technical' | 'academic' | 'general',
                status: staffForm.status as 'available' | 'busy' | 'offline'
            } : s
        ));
        setIsEditStaffOpen(false);
        toast.success("Agent details updated");
    };

    const handleDeleteStaff = () => {
        if (!selectedStaff) return;
        setStaffList(staffList.filter(s => s.id !== selectedStaff.id));
        setIsDeleteStaffOpen(false);
        toast.success("Agent removed");
    };

    const handleUpdateTicket = () => {
        if (!selectedTicket) return;
        setTickets(tickets.map(t =>
            t.id === selectedTicket.id ? { ...t, status: ticketStatus as 'open' | 'in-progress' | 'resolved' | 'closed' } : t
        ));
        setIsViewTicketOpen(false);
        toast.success("Ticket status updated");
    }

    const openEditStaff = (staff: any) => {
        setSelectedStaff(staff);
        setStaffForm({
            name: staff.name,
            email: staff.email,
            role: staff.role,
            department: staff.department,
            status: staff.status
        });
        setIsEditStaffOpen(true);
    };

    const openViewStaff = (staff: any) => {
        setSelectedStaff(staff);
        setIsViewStaffOpen(true);
    };

    const openViewTicket = (ticket: any) => {
        setSelectedTicket(ticket);
        setTicketStatus(ticket.status);
        setIsViewTicketOpen(true);
    };

    const resetStaffForm = () => {
        setStaffForm({
            name: '',
            email: '',
            role: 'helpsupport',
            department: '',
            status: 'available'
        });
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
                                                    <TableRow
                                                        key={ticket.id}
                                                        className="cursor-pointer hover:bg-muted/50"
                                                        onClick={(e) => {
                                                            if ((e.target as any).closest('.action-btn')) return;
                                                            openViewTicket(ticket);
                                                        }}
                                                    >
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
                                                            <Button variant="ghost" size="sm" className="action-btn" onClick={() => openViewTicket(ticket)}>view</Button>
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
                                    <Sheet open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                                        <SheetTrigger asChild>
                                            <Button size="sm" className="gap-2" onClick={resetStaffForm}>
                                                <Plus className="h-4 w-4" /> Add Agent
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>Add Support Agent</SheetTitle>
                                                <SheetDescription>
                                                    Create a new support staff account.
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="sName">Full Name</Label>
                                                    <Input id="sName" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="sEmail">Email Address</Label>
                                                    <Input id="sEmail" type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="sDept">Department</Label>
                                                    <Select value={staffForm.department} onValueChange={(val) => setStaffForm({ ...staffForm, department: val })}>
                                                        <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="technical">Technical Support</SelectItem>
                                                            <SelectItem value="academic">Academic Support</SelectItem>
                                                            <SelectItem value="billing">Billing & Accounts</SelectItem>
                                                            <SelectItem value="general">General Inquiry</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <SheetFooter>
                                                <Button onClick={handleAddStaff}>Create Account</Button>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>
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
                                                    <TableRow
                                                        key={staff.id}
                                                        className="cursor-pointer hover:bg-muted/50"
                                                        onClick={(e) => {
                                                            if ((e.target as any).closest('.action-btn')) return;
                                                            openViewStaff(staff);
                                                        }}
                                                    >
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
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0 action-btn">
                                                                        <span className="sr-only">Open menu</span>
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => openViewStaff(staff)}>
                                                                        <Eye className="mr-2 h-4 w-4" /> View Profile
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openEditStaff(staff)}>
                                                                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => { setSelectedStaff(staff); setIsDeleteStaffOpen(true); }} className="text-destructive">
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Remove
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
                    </TabsContent>
                </Tabs>
            </div>

            {/* View Staff Sheet */}
            <Sheet open={isViewStaffOpen} onOpenChange={setIsViewStaffOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Agent Profile</SheetTitle>
                        <SheetDescription>
                            Support agent details and performance.
                        </SheetDescription>
                    </SheetHeader>
                    {selectedStaff && (
                        <div className="space-y-6 mt-6">
                            {/* Header Info */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20 border-2 border-primary/10">
                                    <AvatarFallback>{selectedStaff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedStaff.name}</h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            {selectedStaff.email}
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <Badge variant={selectedStaff.status === 'available' ? 'default' : 'secondary'} className="capitalize">
                                                {selectedStaff.status}
                                            </Badge>
                                            <Badge variant="outline" className="capitalize">{selectedStaff.department}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 gap-6">
                                {/* Performance Info */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        Work Performance
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border rounded-md p-3">
                                            <span className="text-muted-foreground text-xs block">Tickets Resolved</span>
                                            <span className="text-2xl font-bold mt-1 block">{selectedStaff.ticketsResolved}</span>
                                        </div>
                                        <div className="border rounded-md p-3">
                                            <span className="text-muted-foreground text-xs block">Pending Tickets</span>
                                            <span className="text-2xl font-bold mt-1 block">{selectedStaff.ticketsPending}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Separator />

                            <div className="pt-4 flex gap-2">
                                <Button className="flex-1" onClick={() => { setIsViewStaffOpen(false); openEditStaff(selectedStaff); }}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Details
                                </Button>
                                <Button variant="destructive" className="flex-1" onClick={() => { setIsViewStaffOpen(false); setSelectedStaff(selectedStaff); setIsDeleteStaffOpen(true); }}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove Agent
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Edit Staff Sheet */}
            <Sheet open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Agent Details</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-sName">Full Name</Label>
                            <Input id="edit-sName" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sEmail">Email Address</Label>
                            <Input id="edit-sEmail" type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sDept">Department</Label>
                            <Select value={staffForm.department} onValueChange={(val) => setStaffForm({ ...staffForm, department: val })}>
                                <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technical">Technical Support</SelectItem>
                                    <SelectItem value="academic">Academic Support</SelectItem>
                                    <SelectItem value="billing">Billing & Accounts</SelectItem>
                                    <SelectItem value="general">General Inquiry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sStatus">Status</Label>
                            <Select value={staffForm.status} onValueChange={(val) => setStaffForm({ ...staffForm, status: val })}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="busy">Busy</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button onClick={handleEditStaff}>Save Changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* View/Edit Ticket Sheet */}
            <Sheet open={isViewTicketOpen} onOpenChange={setIsViewTicketOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Ticket Details</SheetTitle>
                        <SheetDescription>Ticket ID: {selectedTicket?.id}</SheetDescription>
                    </SheetHeader>
                    {selectedTicket && (
                        <div className="mt-6 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={selectedTicket.priority === 'high' ? 'destructive' : selectedTicket.priority === 'medium' ? 'secondary' : 'outline'}>
                                        {selectedTicket.priority} Priority
                                    </Badge>
                                    <Badge variant="outline">{selectedTicket.category}</Badge>
                                    <Badge variant={selectedTicket.status === 'resolved' ? 'default' : 'secondary'} className="capitalize">
                                        {selectedTicket.status}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Description</Label>
                                <div className="p-4 bg-muted/30 rounded-md border text-sm">
                                    {selectedTicket.description}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block text-xs">Created On</span>
                                    <span className="font-medium">{format(new Date(selectedTicket.createdAt), 'PPP')}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-xs">Assigned To</span>
                                    <span className="font-medium">{getStaffName(selectedTicket.assignedTo)}</span>
                                </div>
                            </div>

                            <Separator />

                            {/* Student Profile Section */}
                            {(() => {
                                const student = mockStudents.find(s => s.id === selectedTicket.studentId);
                                if (student) {
                                    return (
                                        <div className="space-y-3">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" />
                                                Student Information
                                            </h4>
                                            <div className="bg-muted/10 border rounded-lg p-4 space-y-3 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </div>
                                                <Separator className="my-2" />
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">School</span>
                                                        <span className="font-medium text-xs sm:text-sm truncate block" title={student.schoolName}>{student.schoolName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Grade</span>
                                                        <span className="font-medium">{student.grade}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Parent</span>
                                                        <span className="font-medium">{student.parentName}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground block text-xs">Phone</span>
                                                        <span className="font-medium">{student.parentPhone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            <Separator />

                            {/* Status Update */}
                            <div className="space-y-3 bg-accent/20 p-4 rounded-lg border border-accent/50">
                                <Label className="flex items-center gap-2 font-semibold">
                                    <CheckCircle className="h-4 w-4" /> Update Status
                                </Label>
                                <div className="flex gap-2">
                                    <Select value={ticketStatus} onValueChange={setTicketStatus}>
                                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleUpdateTicket}>Update</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Staff Alert */}
            <AlertDialog open={isDeleteStaffOpen} onOpenChange={setIsDeleteStaffOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Support Agent?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove the agent from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteStaff} className="bg-destructive hover:bg-destructive/90">
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
