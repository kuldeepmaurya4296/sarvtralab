'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

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

    // Load notifications from local storage when user changes
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        const storageKey = `lms_notifications_${user.id}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored).map((n: any) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                }));
                setNotifications(parsed);
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        } else {
            // Add welcome notification for new user session
            addNotification(
                `Welcome back, ${user.name}`,
                'We hope you have a productive session!',
                'info'
            );
        }
    }, [user, addNotification]); // addNotification is a dependency because it's called here

    // Save to local storage whenever notifications change
    useEffect(() => {
        if (user) {
            const storageKey = `lms_notifications_${user.id}`;
            localStorage.setItem(storageKey, JSON.stringify(notifications));
        }
    }, [notifications, user]);

    // Simulate real-time notifications
    useEffect(() => {
        // Only simulate if a user is logged in
        if (!user) return;

        const interval = setInterval(() => {
            // Randomly decide to add a notification (e.g., 5% chance every 30 seconds)
            if (Math.random() > 0.95) {
                const types: NotificationType[] = ['info', 'success', 'warning'];
                const randomType = types[Math.floor(Math.random() * types.length)];

                let messages = [];

                if (user.role === 'student') {
                    messages = [
                        { title: 'New Course Available', message: 'Check out the new Advanced Robotics module.', type: 'info', link: '/student/courses' },
                        { title: 'Assignment Graded', message: 'Your "Robot Basics" assignment has been graded.', type: 'success', link: '/student/courses' },
                        { title: 'Upcoming Quiz', message: 'Artificial Intelligence quiz starts tomorrow at 10 AM.', type: 'warning', link: '/student/dashboard' },
                        { title: 'New Message', message: 'You have a new message from your instructor Vikram Sharma.', type: 'info', link: '/student/support' }
                    ];
                } else if (user.role === 'superadmin') {
                    messages = [
                        { title: 'Server Load Peak', message: 'The platform is experiencing high traffic.', type: 'warning', link: '/admin/dashboard' },
                        { title: 'New School Signup', message: 'Delhi Public School has registered for a trial.', type: 'success', link: '/admin/schools' },
                        { title: 'Pending Support Tickets', message: 'There are 5 support tickets waiting for response.', type: 'info', link: '/admin/help-support' },
                        { title: 'Reports Ready', message: 'Monthly financial and usage reports are ready for download.', type: 'success', link: '/admin/dashboard' }
                    ];
                } else {
                    messages = [
                        { title: 'System Notification', message: 'Welcome to the Sarvtra Labs dashboard!', type: 'info' }
                    ];
                }

                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                addNotification(randomMsg.title, randomMsg.message, randomMsg.type as NotificationType, randomMsg.link);
            }
        }, 15000); // Check every 15 seconds for a bit more dynamic feel in demo

        return () => clearInterval(interval);
    }, [user, addNotification]);



    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

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
