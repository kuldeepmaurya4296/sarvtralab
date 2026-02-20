'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { ChartCard, AreaChartComponent } from '@/components/dashboard/Charts';
import { getSupportDashboardStats } from '@/lib/actions/support.actions';
import { motion } from 'framer-motion';
import {
    Headphones,
    CheckCircle,
    Clock,
    AlertCircle,
    MessageSquare,
    ArrowRight,
    Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HelpSupportDashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<any>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'helpsupport')) {
            router.push('/login');
        }

        const fetchStats = async () => {
            const data = await getSupportDashboardStats();
            setStats(data);
            setIsLoadingStats(false);
        };

        if (user) {
            fetchStats();
        }
    }, [user, authLoading, router]);

    if (authLoading || isLoadingStats) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
    if (!user || user.role !== 'helpsupport') return null;

    const statCards = [
        { title: 'Open Tickets', value: stats?.openTickets || '0', icon: AlertCircle, change: '+0', changeType: 'negative' as const },
        { title: 'In Progress', value: stats?.inProgress || '0', icon: Clock, change: '+0', changeType: 'positive' as const },
        { title: 'Resolved Today', value: stats?.resolvedToday || '0', icon: CheckCircle, change: '+0', changeType: 'positive' as const },
        { title: 'Avg Response Time', value: stats?.avgResponseTime || '2.5h', icon: MessageSquare, change: '+0', changeType: 'positive' as const },
    ];

    const recentTickets = stats?.recentTickets || [];
    const ticketTrend = stats?.ticketTrend?.length > 0 ? stats.ticketTrend : [
        { name: 'Mon', tickets: 0, resolved: 0 },
        { name: 'Tue', tickets: 0, resolved: 0 },
        { name: 'Wed', tickets: 0, resolved: 0 },
        { name: 'Thu', tickets: 0, resolved: 0 },
        { name: 'Fri', tickets: 0, resolved: 0 },
        { name: 'Sat', tickets: 0, resolved: 0 },
        { name: 'Sun', tickets: 0, resolved: 0 },
    ];

    const getPriorityColor = (p: string) => {
        if (p === 'high') return 'destructive';
        if (p === 'medium') return 'secondary';
        return 'outline';
    };

    const getStatusIcon = (s: string) => {
        if (s === 'open') return <AlertCircle className="h-3 w-3 text-red-500" />;
        if (s === 'in-progress') return <Clock className="h-3 w-3 text-amber-500" />;
        return <CheckCircle className="h-3 w-3 text-green-500" />;
    };

    return (
        <DashboardLayout role="helpsupport" userName={user.name || ''} userEmail={user.email || ''}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Support Dashboard 🎧</h1>
                    <p className="text-muted-foreground">Welcome back, {user.name?.split(' ')[0]}. Here&apos;s your overview.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat: any, idx: number) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <StatCard {...stat} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Tickets */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Recent Tickets</CardTitle>
                                    <Link href="/helpsupport/tickets">
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            View All <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentTickets.map((ticket: any) => (
                                    <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="mt-0.5">{getStatusIcon(ticket.status)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm truncate">{ticket.subject}</span>
                                                    <Badge variant={getPriorityColor(ticket.priority) as any} className="text-[10px] px-1.5 py-0 shrink-0">{ticket.priority}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                                    <span>{ticket.student}</span>
                                                    <span>•</span>
                                                    <span>{ticket.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize shrink-0 ml-2">{ticket.status}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Ticket Trend */}
                        <ChartCard title="Ticket Trend (This Week)">
                            <AreaChartComponent
                                data={ticketTrend}
                                dataKey="resolved"
                                xAxisKey="name"
                                color="#22c55e"
                            />
                        </ChartCard>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href="/helpsupport/tickets" className="block">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Headphones className="h-4 w-4" /> View All Tickets
                                    </Button>
                                </Link>
                                <Link href="/helpsupport/students" className="block">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Users className="h-4 w-4" /> Student Directory
                                    </Button>
                                </Link>
                                <Link href="/helpsupport/knowledge-base" className="block">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <MessageSquare className="h-4 w-4" /> Knowledge Base
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
