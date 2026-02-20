'use client';

import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Plus,
    School as SchoolIcon,
    MapPin,
    GraduationCap,
    MoreVertical
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getGovtStudentData } from '@/lib/actions/govt.actions';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function GovtSchoolsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<{ govtOrg: any, schools: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            const res = await getGovtStudentData();
            setData(res);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (authLoading || isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Managed Schools...</div>;
    if (!data || !data.govtOrg) return null;

    const { govtOrg, schools: mySchools } = data;

    // Filter logic
    const filteredSchools = mySchools.filter(school => {
        const matchesSearch =
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.schoolCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.principalName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'all' || school.schoolType === typeFilter;
        const matchesBoard = boardFilter === 'all' || school.board === boardFilter;

        return matchesSearch && matchesType && matchesBoard;
    });

    const getStatusColor = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return "destructive"; // Expired
        if (daysLeft < 30) return "warning"; // Expiring soon
        return "success"; // Active
    };

    const getStatusLabel = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        if (expiry < today) return "Expired";
        return "Active";
    };

    return (
        <DashboardLayout role="govt" userName={govtOrg.name || ''} userEmail={govtOrg.email || ''}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <SchoolIcon className="h-6 w-6 text-primary" />
                            Managed Schools
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and recruit schools under {govtOrg.organizationName}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="h-4 w-4" />
                            Add New School
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>School Directory</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search schools, cities..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="School Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="government">Government</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                        <SelectItem value="aided">Aided</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={boardFilter} onValueChange={setBoardFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px]">
                                        <SelectValue placeholder="Board" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Boards</SelectItem>
                                        <SelectItem value="CBSE">CBSE</SelectItem>
                                        <SelectItem value="ICSE">ICSE</SelectItem>
                                        <SelectItem value="State Board">State Board</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <CardDescription>
                            Showing {filteredSchools.length} of {mySchools.length} assigned schools
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>School Info</TableHead>
                                        <TableHead>Principal / Contact</TableHead>
                                        <TableHead>Type / Board</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSchools.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No schools found matching your filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        mySchools.map((school) => (
                                            <TableRow key={school.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{school.name}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {school.city}, {school.state}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">ID: {school.schoolCode}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{school.principalName}</span>
                                                        <span className="text-xs text-muted-foreground">{school.phone}</span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{school.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Badge variant="outline" className="w-fit">
                                                            {school.schoolType}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <GraduationCap className="h-3 w-3" />
                                                            {school.board}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {(school.totalStudents || 0).toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="capitalize">
                                                        {school.subscriptionPlan}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getStatusColor(school.subscriptionExpiry || new Date().toISOString()) === 'destructive' ? 'destructive' : 'default'}
                                                        className={getStatusColor(school.subscriptionExpiry || new Date().toISOString()) === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                    >
                                                        {getStatusLabel(school.subscriptionExpiry || new Date().toISOString())}
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
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(school.id)}>
                                                                Copy School ID
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                                            <DropdownMenuItem>Generate Report</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">
                                                                Revoke Access
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
