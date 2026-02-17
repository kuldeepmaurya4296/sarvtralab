'use client';

import { useState } from 'react';
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SchoolReportGenerateSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerate: (data: { type: string; period: string; format: string }) => void;
}

export function SchoolReportGenerateSheet({ open, onOpenChange, onGenerate }: SchoolReportGenerateSheetProps) {
    const [formData, setFormData] = useState({ type: '', period: '', format: 'PDF' });

    const handleSubmit = () => {
        onGenerate(formData);
        onOpenChange(false);
        setFormData({ type: '', period: '', format: 'PDF' });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Generate New Report</SheetTitle>
                    <SheetDescription>Select parameters to generate a custom report.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                        <Select value={formData.period} onValueChange={(val) => setFormData({ ...formData, period: val })}>
                            <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
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
                        <Select value={formData.format} onValueChange={(val) => setFormData({ ...formData, format: val })}>
                            <SelectTrigger><SelectValue placeholder="PDF" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PDF">PDF Document</SelectItem>
                                <SelectItem value="Excel">Excel Spreadsheet</SelectItem>
                                <SelectItem value="CSV">CSV Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <Button onClick={handleSubmit} disabled={!formData.type || !formData.period}>
                        Generate Report
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
