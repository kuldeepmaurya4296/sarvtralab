'use server';

import connectToDatabase from '@/lib/mongoose';
import SupportTicket from '@/lib/models/SupportTicket';
import User from '@/lib/models/User';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { clean } from '@/lib/utils';

export async function getSupportDashboardStats() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'helpsupport' && session.user.role !== 'superadmin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        // 1. Counters
        const openTickets = await SupportTicket.countDocuments({ status: 'Open' });
        const inProgress = await SupportTicket.countDocuments({ status: 'In Progress' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const resolvedToday = await SupportTicket.countDocuments({
            status: 'Resolved',
            updatedAt: { $gte: today }
        });

        // 2. Recent Tickets
        const recentTicketsDocs = await SupportTicket.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .lean() as any[];

        const recentTickets = recentTicketsDocs.map(t => ({
            id: t.ticketId,
            subject: t.subject,
            student: t.user?.name || 'Unknown',
            priority: t.priority.toLowerCase(),
            status: t.status.toLowerCase().replace(' ', '-'),
            time: formatTimeAgo(t.createdAt)
        }));

        // 3. Ticket Trend (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendResult = await SupportTicket.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    tickets: { $sum: 1 },
                    resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const ticketTrend = trendResult.map(r => ({
            name: days[r._id - 1],
            tickets: r.tickets,
            resolved: r.resolved
        }));

        return {
            openTickets,
            inProgress,
            resolvedToday,
            avgResponseTime: "2.5h", // Placeholder
            recentTickets,
            ticketTrend
        };
    } catch (e) {
        console.error("Support Dashboard Stats Error:", e);
        return null;
    }
}

export async function getAllTickets() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const tickets = await SupportTicket.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'name email schoolName grade parentName parentPhone')
            .lean();
        return clean(tickets);
    } catch (e) {
        console.error("Get All Tickets Error:", e);
        return [];
    }
}

export async function getSupportStaff() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const staff = await User.find({ role: 'helpsupport' }).lean();
        return clean(staff);
    } catch (e) {
        console.error("Get Support Staff Error:", e);
        return [];
    }
}

export async function updateTicketStatus(ticketId: string, status: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'superadmin' && session.user.role !== 'helpsupport')) {
        throw new Error("Unauthorized");
    }
    await connectToDatabase();
    try {
        const updated = await SupportTicket.findOneAndUpdate(
            { ticketId },
            { $set: { status } },
            { new: true }
        ).lean();
        return clean(updated);
    } catch (e) {
        console.error("Update Ticket Status Error:", e);
        return null;
    }
}

function formatTimeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
}
