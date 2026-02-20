'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getNotifications, markNotificationAsRead, deleteNotification } from '@/lib/actions/activity.actions';

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    timestamp: Date;
    read: boolean;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type?: NotificationType, link?: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    notifyAdmin: (title: string, message: string, type?: NotificationType, link?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useAuth();

    // No dependencies needed as setNotifications is stable
    const addNotification = useCallback((title: string, message: string, type: NotificationType = 'info', link?: string) => {
        const newNotification: Notification = {
            id: generateId(),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
            link
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    // Load notifications from MongoDB
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        const loadNotifications = async () => {
            const data = await getNotifications(user.id);
            const mapped = data.map((n: any) => ({
                id: n._id,
                title: n.title,
                message: n.message,
                type: n.type,
                timestamp: new Date(n.createdAt),
                read: n.isRead,
                link: n.link
            }));
            setNotifications(mapped);
        };
        loadNotifications();
    }, [user]);

    const markAsRead = useCallback(async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(async () => {
        if (!user) return;
        // Optimization: mark all as read in DB if needed, but for now we'll do it locally and assume DB sync or add a bulk action.
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, [user]);

    const clearNotifications = useCallback(async () => {
        if (!user) return;
        // In a real app, we'd delete from DB too.
        setNotifications([]);
    }, [user]);

    const notifyAdmin = useCallback((title: string, message: string, type: NotificationType = 'info', link?: string) => {
        const adminId = 'admin-001';
        const newNotification: Notification = {
            id: generateId(),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
            link
        };

        // 1. Update Admin's LocalStorage directly
        const storageKey = `lms_notifications_${adminId}`;
        const stored = localStorage.getItem(storageKey);
        let adminNotifications: Notification[] = [];
        if (stored) {
            try {
                adminNotifications = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse admin notifications", e);
            }
        }
        adminNotifications = [newNotification, ...adminNotifications];
        localStorage.setItem(storageKey, JSON.stringify(adminNotifications));

        // 2. If current user is Admin, update state too
        if (user?.id === adminId) {
            setNotifications(prev => [newNotification, ...prev]);
        }
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotifications,
                notifyAdmin
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
