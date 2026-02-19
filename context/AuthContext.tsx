'use client';

import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { User, UserRole } from '@/data/users';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, pass: string, redirectPath?: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === 'loading';

    // Cast session user to custom User type. Be careful about missing fields.
    const user = session?.user ? (session.user as unknown as User) : null;
    const role = user?.role as UserRole || null;

    const login = async (email: string, pass: string, redirectPath?: string): Promise<boolean> => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password: pass,
            });

            if (result?.error) {
                toast.error('Invalid credentials');
                return false;
            }

            toast.success('Welcome back!');

            // Get fresh session to handle redirection immediately
            const freshSession = await getSession();
            router.refresh();

            if (redirectPath) {
                router.push(redirectPath);
                return true;
            }

            if (freshSession?.user) {
                const userRole = (freshSession.user as any).role;
                switch (userRole) {
                    case 'student': router.push('/student/dashboard'); break;
                    case 'school': router.push('/school/dashboard'); break;
                    case 'teacher': router.push('/teacher/dashboard'); break;
                    case 'govt': router.push('/govt/dashboard'); break;
                    case 'superadmin': router.push('/admin/dashboard'); break;
                    case 'helpsupport': router.push('/helpsupport/dashboard'); break;
                    default: router.push('/');
                }
            } else {
                router.push('/');
            }

            return true;
        } catch (error) {
            console.error("Login Error:", error);
            toast.error('Login failed');
            return false;
        }
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
        toast.info('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
