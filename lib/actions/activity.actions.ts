
'use server';

import connectToDatabase from '@/lib/mongoose';
import ActivityLog from '@/lib/models/ActivityLog';
import Notification from '@/lib/models/Notification';
import { clean } from '@/lib/utils';

export async function logActivity(userId: string, action: string, details: string) {
    await connectToDatabase();
    try {
        await ActivityLog.create({
            user: userId,
            action,
            details,
            timestamp: new Date()
        });
    } catch (e) {
        console.error("Log Activity Error:", e);
    }
}

export async function sendNotification(userId: string, title: string, message: string, type: string = 'info') {
    await connectToDatabase();
    try {
        await Notification.create({
            userId,
            title,
            message,
            type,
            isRead: false
        });
    } catch (e) {
        console.error("Send Notification Error:", e);
    }
}

export async function getNotifications(userId: string) {
    await connectToDatabase();
    try {
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        return clean(notifications);
    } catch (e) {
        console.error("Get Notifications Error:", e);
        return [];
    }
}

export async function markNotificationAsRead(notificationId: string) {
    await connectToDatabase();
    try {
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        return true;
    } catch (e) {
        console.error("Mark Notification Read Error:", e);
        return false;
    }
}

export async function deleteNotification(notificationId: string) {
    await connectToDatabase();
    try {
        await Notification.findByIdAndDelete(notificationId);
        return true;
    } catch (e) {
        console.error("Delete Notification Error:", e);
        return false;
    }
}
