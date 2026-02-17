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
    User,
    Eye,
    MoreVertical,
    FileBarChart,
    Printer,
    Share2,
    Plus
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools } from '@/data/users';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { toast } from "sonner";

// Mock data remains similar but can be extended
const initialReports = [
    {
        id: 'rpt-001',
        name: 'Annual Academic Report 2024',
        type: 'Academic',
        generatedBy: 'System',
        generatedAt: '2025-01-15T10:00:00',
        status: 'Ready',
        size: '1.2 MB',
        description: 'Comprehensive analysis of student performance, grade distribution, and attendance records for the academic year 2024.'
    },
    {
        id: 'rpt-002',
        name: 'Student Attendance Summary',
        type: 'Attendance',
        generatedBy: 'Admin User',
        generatedAt: '2025-01-05T09:30:00',
        status: 'Ready',
        size: '0.8 MB',
        description: 'Detailed attendance logs including daily absence rates, late arrivals, and excused leaves for all classes.'
    },
    {
        id: 'rpt-003',
        name: 'Teacher Performance Review',
        type: 'Performance',
        generatedBy: 'System',
        generatedAt: '2024-12-31T16:45:00',
        status: 'Ready',
        size: '2.1 MB',
        description: 'Evaluation metrics for teaching staff based on student feedback, peer reviews, and classroom observation data.'
    },
    {
        id: 'rpt-004',
        name: 'Financial Audit Report',
        type: 'Financial',
        generatedBy: 'Admin User',
        generatedAt: '2024-12-20T11:15:00',
        status: 'Processing',
        size: '-',
        description: 'Audit of school expenditures, tuition fee collections, and budget allocations for Q4 2024.'
    },
    {
        id: 'rpt-005',
        name: 'Infrastructure Audit',
        type: 'Audit',
        generatedBy: 'System',
        generatedAt: '2024-10-10T14:20:00',
        status: 'Ready',
        size: '4.5 MB',
        description: 'Assessment of school facilities, including maintenance requirements for classrooms, labs, and sports grounds.'
    }
];

export default function SchoolReportsPage() {
    const school = mockSchools[0];
    const [reports, setReports] = useState(initialReports);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);

    // Generate Report Form State
    const [newReportData, setNewReportData] = useState({
        type: '',
        period: '',
        format: 'PDF',
        includeCharts: true
    });

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || report.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleGenerateReport = () => {
        const newReport = {
            id: `rpt-${Math.floor(Math.random() * 1000)}`,
            name: `${newReportData.type} Report - ${newReportData.period}`,
            type: newReportData.type || 'Custom',
            generatedBy: school.name,
            generatedAt: new Date().toISOString(),
            status: 'Processing',
            size: '-',
            description: `Generated report for ${newReportData.period} in ${newReportData.format} format.`
        };

        setReports([newReport, ...reports]);
        setIsGenerateOpen(false);
        toast.info("Report generation started. It will be available shortly.");

        // Simulate completion
        setTimeout(() => {
            setReports(prev => prev.map(r =>
                r.id === newReport.id ? { ...r, status: 'Ready', size: '1.5 MB' } : r
            ));
            toast.success("Report generated successfully!");
        }, 3000);
    };

    const openReportView = (report: any) => {
        setSelectedReport(report);
        setIsViewOpen(true);
    };

    return (
        <DashboardLayout role="school" userName={school.name} userEmail={school.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileBarChart className="h-6 w-6 text-primary" />
                            Reports
                        </h1>
                        <p className="text-muted-foreground">
                            Generate and view academic and administrative reports
                        </p>
                    </div>
                    <Sheet open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                        <SheetTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Generate New Report
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Generate New Report</SheetTitle>
                                <SheetDescription>
                                    Select parameters to generate a custom report.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="report-type">Report Type</Label>
                                    <Select
                                        value={newReportData.type}
                                        onValueChange={(val) => setNewReportData({ ...newReportData, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Academic">Academic Performance</SelectItem>
                                            <SelectItem value="Attendance">Attendance Summary</SelectItem>
                                            <SelectItem value="Financial">Financial Statement</SelectItem>
                                            <SelectItem value="Staff">Staff Activity</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="period">Time Period</Label>
                                    <Select
                                        value={newReportData.period}
                                        onValueChange={(val) => setNewReportData({ ...newReportData, period: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                                            <SelectItem value="Current Month">Current Month</SelectItem>
                                            <SelectItem value="Last Quarter">Last Quarter</SelectItem>
                                            <SelectItem value="Annual">Annual (YTD)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="format">Export Format</Label>
                                    <Select
                                        value={newReportData.format}
                                        onValueChange={(val) => setNewReportData({ ...newReportData, format: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="PDF" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PDF">PDF Document</SelectItem>
                                            <SelectItem value="Excel">Excel Spreadsheet</SelectItem>
                                            <SelectItem value="CSV">CSV Data</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button onClick={handleGenerateReport} disabled={!newReportData.type || !newReportData.period}>
                                    Generate Report
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Reports List</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
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
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Academic">Academic</SelectItem>
                                        <SelectItem value="Attendance">Attendance</SelectItem>
                                        <SelectItem value="Performance">Performance</SelectItem>
                                        <SelectItem value="Financial">Financial</SelectItem>
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
                                                No reports found matching your filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredReports.map((report) => (
                                            <TableRow
                                                key={report.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={(e) => {
                                                    if ((e.target as any).closest('.action-btn')) return;
                                                    openReportView(report);
                                                }}
                                            >
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
                                                        <span className="hidden sm:inline">
                                                            <Clock className="h-3 w-3 ml-2 inline" />
                                                            {format(new Date(report.generatedAt), 'h:mm a')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{report.size}</TableCell>
                                                <TableCell>
                                                    <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}
                                                        className={report.status === 'Ready' ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' : ''}
                                                    >
                                                        {report.status}
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
                                                            <DropdownMenuItem onClick={() => openReportView(report)}>
                                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem disabled={report.status !== 'Ready'}>
                                                                <Download className="mr-2 h-4 w-4" /> Download
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <Share2 className="mr-2 h-4 w-4" /> Share
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

                {/* Report Details Sheet */}
                <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <SheetContent className="overflow-y-auto sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>Report Details</SheetTitle>
                            <SheetDescription>Detailed metadata and actions.</SheetDescription>
                        </SheetHeader>
                        {selectedReport && (
                            <div className="space-y-6 py-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                            <FileBarChart className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg leading-tight">{selectedReport.name}</h3>
                                            <p className="text-sm text-muted-foreground">{selectedReport.type} Report</p>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
                                        {selectedReport.description}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Generated On</span>
                                            <div className="flex items-center gap-1 font-medium">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(selectedReport.generatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">File Size</span>
                                            <div className="font-medium">{selectedReport.size}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Generated By</span>
                                            <div className="flex items-center gap-1 font-medium">
                                                <User className="h-3.5 w-3.5" />
                                                {selectedReport.generatedBy}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Status</span>
                                            <Badge variant={selectedReport.status === 'Ready' ? 'default' : 'secondary'} className="w-fit">
                                                {selectedReport.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold">Actions</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button className="w-full" disabled={selectedReport.status !== 'Ready'}>
                                            <Download className="mr-2 h-4 w-4" /> Download PDF
                                        </Button>
                                        <Button variant="outline" className="w-full" disabled={selectedReport.status !== 'Ready'}>
                                            <Printer className="mr-2 h-4 w-4" /> Print
                                        </Button>
                                    </div>
                                    <Button variant="secondary" className="w-full">
                                        <Share2 className="mr-2 h-4 w-4" /> Share with Staff
                                    </Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </DashboardLayout>
    );
}
