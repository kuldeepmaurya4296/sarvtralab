'use client';

import { useState } from 'react';
import { FileBarChart, Search, Plus } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockSchools } from '@/data/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { SchoolReportTable } from '@/components/school/reports/SchoolReportTable';
import { SchoolReportViewSheet } from '@/components/school/reports/SchoolReportViewSheet';
import { SchoolReportGenerateSheet } from '@/components/school/reports/SchoolReportGenerateSheet';


import { ReportService } from '@/data/services/report.service';
import { SchoolService } from '@/data/services/school.service';

export default function SchoolReportsPage() {
    const school = SchoolService.getAll()[0];
    const [reports, setReports] = useState(ReportService.getBySchool(school.id));
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || report.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleGenerateReport = (data: { type: string; period: string; format: string }) => {
        const newReport = ReportService.generate({
            name: `${data.type} Report - ${data.period}`,
            type: data.type || 'Custom',
            generatedBy: school.name,
            schoolId: school.id,
            description: `Generated report for ${data.period} in ${data.format} format.`
        });

        if (newReport) {
            setReports([newReport, ...reports]);
            toast.info("Report generation started. It will be available shortly.");

            // Database simulation: complete the processing after 3s
            setTimeout(() => {
                const updated = ReportService.update(newReport.id, { status: 'Ready', size: '1.5 MB' });
                if (updated) {
                    setReports(prev => prev.map(r => r.id === newReport.id ? updated : r));
                    toast.success("Report generated successfully!");
                }
            }, 3000);
        }
    };

    const openReportView = (report: any) => { setSelectedReport(report); setIsViewOpen(true); };

    return (
        <DashboardLayout role="school" userName={school.name} userEmail={school.email}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileBarChart className="h-6 w-6 text-primary" /> Reports
                        </h1>
                        <p className="text-muted-foreground">Generate and view academic and administrative reports</p>
                    </div>
                    <Button className="gap-2" onClick={() => setIsGenerateOpen(true)}>
                        <Plus className="h-4 w-4" /> Generate New Report
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>Reports List</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search reports..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
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
                        <SchoolReportTable reports={filteredReports} onView={openReportView} />
                    </CardContent>
                </Card>
            </div>

            <SchoolReportViewSheet report={selectedReport} open={isViewOpen} onOpenChange={setIsViewOpen} />
            <SchoolReportGenerateSheet open={isGenerateOpen} onOpenChange={setIsGenerateOpen} onGenerate={handleGenerateReport} />
        </DashboardLayout>
    );
}
