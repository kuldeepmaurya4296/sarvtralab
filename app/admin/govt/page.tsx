'use client';

import { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    MoreVertical,
    Building2,
    MapPin,
    School,
    Trash2,
    Edit,
    Eye,
    Briefcase,
    Building,
    Mail,
    Globe,
    Phone
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSuperAdmin, mockGovtOrgs } from '@/data/users';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from '@/components/ui/separator';

export default function AdminGovtOrgsPage() {
    const admin = mockSuperAdmin;
    const [orgs, setOrgs] = useState(mockGovtOrgs);
    const [searchQuery, setSearchQuery] = useState('');

    // Action States
    const [selectedOrg, setSelectedOrg] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        organizationName: '',
        name: '', // Contact Person
        email: '',
        designation: '',
        department: '',
        state: '',
        status: 'active'
    });

    const filteredOrgs = orgs.filter(org => {
        return org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            org.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            org.email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddOrg = () => {
        const newOrg = {
            id: `GOV-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            role: 'govt' as const,
            organizationType: 'education_dept' as const,
            jurisdiction: 'state' as const,
            assignedSchools: [],
            createdAt: new Date().toISOString()
        };
        // @ts-ignore
        setOrgs([newOrg, ...orgs]);
        setIsAddOpen(false);
        resetForm();
        toast.success("Organization added successfully");
    };

    const handleEditSave = () => {
        if (!selectedOrg) return;
        setOrgs(orgs.map(o =>
            o.id === selectedOrg.id ? { ...o, ...formData, status: formData.status as 'active' | 'inactive' } : o
        ));
        setIsEditOpen(false);
        toast.success("Organization details updated");
    };

    const handleDelete = () => {
        if (!selectedOrg) return;
        setOrgs(orgs.filter(o => o.id !== selectedOrg.id));
        setIsDeleteOpen(false);
        toast.success("Organization account deactivated");
    };

    const openEdit = (org: any) => {
        setSelectedOrg(org);
        setFormData({
            organizationName: org.organizationName,
            name: org.name,
            email: org.email,
            designation: org.designation,
            department: org.department,
            state: org.state || '',
            status: org.status
        });
        setIsEditOpen(true);
    };

    const openView = (org: any) => {
        setSelectedOrg(org);
        setIsViewOpen(true);
    };

    const openDelete = (org: any) => {
        setSelectedOrg(org);
        setIsDeleteOpen(true);
    };

    const resetForm = () => {
        setFormData({
            organizationName: '',
            name: '',
            email: '',
            designation: '',
            department: '',
            state: '',
            status: 'active'
        });
    };

    const handleExport = () => {
        const headers = ['ID', 'Organization', 'Contact Person', 'Email', 'State', 'Department', 'Status'];
        const csvContent = [
            headers.join(','),
            ...orgs.map(o => [
                o.id,
                `"${o.organizationName}"`,
                `"${o.name}"`,
                o.email,
                o.state || 'N/A',
                o.department,
                o.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'govt-orgs-export.csv';
        a.click();
        toast.success("Exported organization list");
    };

    return (
        <DashboardLayout role="admin" userName={admin.name} userEmail={admin.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            Government Organizations
                        </h1>
                        <p className="text-muted-foreground">
                            Manage partnerships and government accounts
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" />
                            Export List
                        </Button>
                        <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <SheetTrigger asChild>
                                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={resetForm}>
                                    <Plus className="h-4 w-4" />
                                    Add Organization
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Add Government Organization</SheetTitle>
                                    <SheetDescription>
                                        Register a new government partner or department.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="orgName">Organization Name</Label>
                                        <Input id="orgName" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} placeholder="e.g. Ministry of Education" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Contact Person</Label>
                                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Official Email</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="designation">Designation</Label>
                                            <Input id="designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dept">Department</Label>
                                            <Input id="dept" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State/Region</Label>
                                        <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                                    </div>
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </SheetClose>
                                    <Button onClick={handleAddOrg}>Save Organization</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Registered Organizations</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orgs..."
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
                                        <TableHead>Organization</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Region/Department</TableHead>
                                        <TableHead>Assigned Schools</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrgs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No organizations found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrgs.map((org) => (
                                            <TableRow
                                                key={org.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => {
                                                    if ((e.target as any).closest('.action-btn')) return;
                                                    openView(org);
                                                }}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 bg-primary/10">
                                                            <AvatarFallback className="text-primary">{org.organizationName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground">{org.organizationName}</span>
                                                            <span className="text-xs text-muted-foreground">ID: {org.id}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{org.name}</span>
                                                        <span className="text-xs text-muted-foreground">{org.designation}</span>
                                                        <span className="text-xs text-muted-foreground">{org.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{org.state}</span>
                                                        <span className="text-xs text-muted-foreground">{org.department}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 font-medium">
                                                        <School className="h-3 w-3 text-muted-foreground" />
                                                        {org.assignedSchools?.length || 0} Schools
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={org.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                        {org.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 action-btn">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(org.id)}>
                                                                Copy ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => openView(org)}>
                                                                <Eye className="mr-2 h-4 w-4" /> View Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openEdit(org)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <School className="mr-2 h-4 w-4" /> Manage Schools
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openDelete(org)} className="text-destructive focus:text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Deactivate Account
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
            {/* Edit Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Edit Organization Details</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-orgName">Organization Name</Label>
                            <Input id="edit-orgName" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Contact Person</Label>
                            <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Official Email</Label>
                            <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-designation">Designation</Label>
                                <Input id="edit-designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-dept">Department</Label>
                                <Input id="edit-dept" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-state">State/Region</Label>
                            <Input id="edit-state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as any })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button onClick={handleEditSave}>Save Changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* View Profile Sheet */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle>Organization Profile</SheetTitle>
                    </SheetHeader>
                    {selectedOrg && (
                        <div className="mt-6 space-y-6">
                            {/* Header Info */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20 border-2 border-primary/10">
                                    <AvatarFallback className="text-2xl text-primary font-bold">
                                        {selectedOrg.organizationName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedOrg.organizationName}</h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Building className="h-3.5 w-3.5" />
                                            {selectedOrg.department}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {selectedOrg.state || 'N/A'}
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <Badge variant={selectedOrg.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                {selectedOrg.status}
                                            </Badge>
                                            <Badge variant="outline" className="capitalize">{selectedOrg.organizationType?.replace('_', ' ') || 'Government'}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 gap-6">
                                {/* Contact Person Info */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        Primary Contact
                                    </h4>
                                    <div className="bg-muted/30 p-4 rounded-lg border text-sm space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>{selectedOrg.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{selectedOrg.name}</p>
                                                <p className="text-xs text-muted-foreground">{selectedOrg.designation}</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Email</span>
                                                <span className="font-medium text-xs sm:text-sm">{selectedOrg.email}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Phone</span>
                                                <span className="font-medium text-xs sm:text-sm">{selectedOrg.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Jurisdiction & Stats */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        Jurisdiction & Reach
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border rounded-md p-3">
                                            <span className="text-muted-foreground text-xs block">Jurisdiction Level</span>
                                            <span className="font-medium text-sm block capitalize mt-1">{selectedOrg.jurisdiction || 'State'}</span>
                                        </div>
                                        <div className="border rounded-md p-3">
                                            <span className="text-muted-foreground text-xs block">Assigned Schools</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <School className="h-4 w-4 text-primary" />
                                                <span className="font-bold text-lg">{selectedOrg.assignedSchools?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="pt-4 flex gap-2 flex-wrap">
                                <Button className="flex-1" onClick={() => { setIsViewOpen(false); openEdit(selectedOrg); }}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Details
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <School className="mr-2 h-4 w-4" /> Manage Schools
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => { setIsViewOpen(false); setSelectedOrg(selectedOrg); setIsDeleteOpen(true); }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will deactivate the organization's account. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Deactivate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
