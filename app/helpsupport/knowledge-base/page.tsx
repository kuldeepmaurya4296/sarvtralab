'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FileText, Search, BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function HelpSupportKnowledgeBasePage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'helpsupport')) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'helpsupport') return null;

    const categories = [
        {
            title: 'Technical Issues',
            icon: '🔧',
            articles: [
                { title: 'How to troubleshoot video playback issues', views: 245 },
                { title: 'Resolving login and authentication errors', views: 189 },
                { title: 'Browser compatibility guide', views: 156 },
                { title: 'Mobile app common issues & fixes', views: 132 },
            ]
        },
        {
            title: 'Course & Academic',
            icon: '📚',
            articles: [
                { title: 'Certificate generation process', views: 312 },
                { title: 'How to handle course enrollment extensions', views: 178 },
                { title: 'Quiz score recalculation process', views: 145 },
                { title: 'Course completion requirements FAQ', views: 201 },
            ]
        },
        {
            title: 'Billing & Payments',
            icon: '💳',
            articles: [
                { title: 'Processing refund requests', views: 267 },
                { title: 'Subscription plan upgrade/downgrade', views: 198 },
                { title: 'Payment gateway error codes', views: 134 },
                { title: 'Invoice generation guide', views: 89 },
            ]
        },
        {
            title: 'General Inquiries',
            icon: '❓',
            articles: [
                { title: 'Escalation procedures for complex issues', views: 156 },
                { title: 'SLA response time guidelines', views: 234 },
                { title: 'Student communication templates', views: 178 },
                { title: 'Privacy & data handling policies', views: 112 },
            ]
        },
    ];

    const allArticles = categories.flatMap(c => c.articles.map(a => ({ ...a, category: c.title })));
    const filteredCategories = search
        ? [{
            title: 'Search Results',
            icon: '🔍',
            articles: allArticles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
        }]
        : categories;

    return (
        <DashboardLayout role="helpsupport" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" /> Knowledge Base
                        </h1>
                        <p className="text-muted-foreground">Reference guides and solutions for common issues</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search articles..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCategories.map((cat, idx) => (
                        <Card key={idx}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <span className="text-xl">{cat.icon}</span> {cat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {cat.articles.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center">No articles found</p>
                                ) : cat.articles.map((article, aIdx) => (
                                    <div key={aIdx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="text-sm truncate">{article.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{article.views} views</Badge>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
