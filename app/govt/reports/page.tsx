'use client';

import { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    Filter,
    Search,
    Clock,
    CheckCircle,
    User
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockGovtOrgs } from '@/data/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

const mockReports = [
    {
        id: 'rpt-001',
        name: 'Annual Enrollment Summary 2024',
        type: 'Enrollment',
        generatedBy: 'System',
        generatedAt: '2025-01-15T10:00:00',
        status: 'Ready',
        size: '2.4 MB'
    },
    {
        id: 'rpt-002',
        name: 'Q4 2024 Performance Metrics',
        type: 'Performance',
        generatedBy: 'System',
        generatedAt: '2025-01-05T09:30:00',
        status: 'Ready',
        size: '1.8 MB'
    },
    {
        id: 'rpt-003',
        name: 'District A Attendance Report - Dec 2024',
        type: 'Attendance',
        generatedBy: 'Admin User',
        generatedAt: '2024-12-31T16:45:00',
        status: 'Ready',
        size: '3.1 MB'
    },
    {
        id: 'rpt-004',
        name: 'Teacher Effectiveness Assessment',
        type: 'Assessment',
        generatedBy: 'System',
        generatedAt: '2024-12-20T11:15:00',
        status: 'Processing',
        size: '-'
    },
    {
        id: 'rpt-005',
        name: 'Infrastructure Audit - Q3',
        type: 'Audit',
        generatedBy: 'Admin User',
        generatedAt: '2024-10-10T14:20:00',
        status: 'Ready',
        size: '5.2 MB'
    }
];

export default function GovtReportsPage() {
    const govtOrg = mockGovtOrgs[0];
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredReports = mockReports.filter(report => {
        const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || report.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <DashboardLayout role="govt" userName={govtOrg.name} userEmail={govtOrg.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            Reports Center
                        </h1>
                        <p className="text-muted-foreground">
                            Generate, view, and download comprehensive reports
                        </p>
                    </div>
                    <Button className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Generate New Report
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Generated Reports</CardTitle>
                            <div className="flex gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search reports..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Report Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Enrollment">Enrollment</SelectItem>
                                        <SelectItem value="Performance">Performance</SelectItem>
                                        <SelectItem value="Attendance">Attendance</SelectItem>
                                        <SelectItem value="Assessment">Assessment</SelectItem>
                                        <SelectItem value="Audit">Audit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Report Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Generated By</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReports.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No reports found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium text-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        {report.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{report.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {report.generatedBy}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(report.generatedAt), 'MMM d, yyyy')}
                                                        <Clock className="h-3 w-3 ml-2" />
                                                        {format(new Date(report.generatedAt), 'h:mm a')}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{report.size}</TableCell>
                                                <TableCell>
                                                    <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}
                                                        className={report.status === 'Ready' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                    >
                                                        {report.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        disabled={report.status !== 'Ready'}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        <span className="sr-only">Download</span>
                                                    </Button>
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
