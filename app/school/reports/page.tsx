'use client';

import { useEffect, useState } from 'react';
import { FileBarChart, Search, Plus } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

import { SchoolReportTable } from '@/components/school/reports/SchoolReportTable';
import { SchoolReportViewSheet } from '@/components/school/reports/SchoolReportViewSheet';
import { SchoolReportGenerateSheet } from '@/components/school/reports/SchoolReportGenerateSheet';

import { getReportsBySchool, createReport } from '@/lib/actions/report.actions';

export default function SchoolReportsPage() {
    const { user } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            loadReports();
        }
    }, [user]);

    async function loadReports() {
        if (!user) return;
        try {
            const data = await getReportsBySchool(user.id);
            setReports(data || []);
        } catch (error) {
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    }

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || report.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleGenerateReport = async (data: { type: string; period: string; format: string }) => {
        if (!user) return;
        try {
            const newReport = await createReport({
                name: `${data.type} Report - ${data.period}`,
                type: data.type || 'Custom',
                generatedBy: user.name,
                schoolId: user.id,
                description: `Generated report for ${data.period} in ${data.format} format.`
            });

            if (newReport) {
                setReports([newReport, ...reports]);
                toast.success("Report generated successfully!");
            }
        } catch (error) {
            toast.error("Failed to generate report");
        }
    };

    const openReportView = (report: any) => { setSelectedReport(report); setIsViewOpen(true); };

    if (!user) return null;

    return (
        <DashboardLayout role="school" userName={user.name} userEmail={user.email}>
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
