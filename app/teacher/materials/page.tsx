'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FileText, Search, Upload, FolderOpen, File, Download, Eye, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function TeacherMaterialsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'teacher')) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'teacher') return null;

    const materials = [
        { id: 'm1', name: 'Robotics Module 1 - Introduction.pdf', course: 'Robotics Fundamentals', type: 'PDF', size: '2.4 MB', uploaded: '2026-02-15' },
        { id: 'm2', name: 'Python Basics - Variables & Data Types.pptx', course: 'Python for Beginners', type: 'PPTX', size: '5.1 MB', uploaded: '2026-02-14' },
        { id: 'm3', name: 'Arduino Circuit Diagrams.zip', course: 'Arduino Workshop', type: 'ZIP', size: '12 MB', uploaded: '2026-02-13' },
        { id: 'm4', name: 'Assignment 3 - Sensor Programming.docx', course: 'Robotics Fundamentals', type: 'DOCX', size: '1.2 MB', uploaded: '2026-02-12' },
        { id: 'm5', name: 'Lab Exercise - LED Control.pdf', course: 'Arduino Workshop', type: 'PDF', size: '850 KB', uploaded: '2026-02-10' },
        { id: 'm6', name: 'Python Practice Problems Set 2.pdf', course: 'Python for Beginners', type: 'PDF', size: '1.8 MB', uploaded: '2026-02-09' },
    ];

    const filtered = materials.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.course.toLowerCase().includes(search.toLowerCase())
    );

    const typeColors: Record<string, string> = {
        'PDF': 'bg-red-100 text-red-700',
        'PPTX': 'bg-orange-100 text-orange-700',
        'DOCX': 'bg-blue-100 text-blue-700',
        'ZIP': 'bg-purple-100 text-purple-700',
    };

    return (
        <DashboardLayout role="teacher" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" /> Teaching Materials
                        </h1>
                        <p className="text-muted-foreground">Upload and manage course materials</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search materials..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Button className="gap-2" onClick={() => toast.info('Upload dialog coming soon')}>
                            <Upload className="h-4 w-4" /> Upload
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                            <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p>No materials found</p>
                        </div>
                    ) : filtered.map(m => (
                        <Card key={m.id} className="hover:shadow-md transition-shadow group">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                        <File className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate" title={m.name}>{m.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{m.course}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeColors[m.type] || ''}`}>{m.type}</Badge>
                                            <span className="text-xs text-muted-foreground">{m.size}</span>
                                            <span className="text-xs text-muted-foreground">• {new Date(m.uploaded).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="flex-1 text-xs h-8"><Download className="h-3 w-3 mr-1" /> Download</Button>
                                    <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:text-destructive" onClick={() => toast.info('Delete coming soon')}><Trash2 className="h-3 w-3" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
