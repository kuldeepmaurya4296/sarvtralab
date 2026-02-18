'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Info, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useNotifications, Notification, NotificationType } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const iconMap: Record<NotificationType, React.ElementType> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
};

const colorMap: Record<NotificationType, string> = {
    info: 'text-blue-500 bg-blue-500/10',
    success: 'text-green-500 bg-green-500/10',
    warning: 'text-orange-500 bg-orange-500/10',
    error: 'text-red-500 bg-red-500/10'
};

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
    const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed sm:absolute top-[4.5rem] sm:top-full left-4 sm:left-auto right-4 sm:right-0 mt-0 sm:mt-2 w-auto sm:w-96 bg-card border rounded-xl shadow-xl overflow-hidden z-50 origin-top sm:origin-top-right"
        >
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center gap-1">
                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-muted-foreground hover:text-foreground"
                            onClick={markAllAsRead}
                        >
                            Mark all read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={clearNotifications}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Bell className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-medium">No notifications</p>
                        <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        <AnimatePresence>
                            {notifications.map((notification) => {
                                const Icon = iconMap[notification.type];
                                const colorClass = colorMap[notification.type];

                                return (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className={`p-4 hover:bg-muted/50 transition-colors relative group ${!notification.read ? 'bg-muted/30' : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        {!notification.read && (
                                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                                        )}

                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-0.5 break-words">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {notification.link && (
                                                        <Link
                                                            href={notification.link}
                                                            className="text-xs text-primary hover:underline font-medium"
                                                            onClick={onClose}
                                                        >
                                                            View Details
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
