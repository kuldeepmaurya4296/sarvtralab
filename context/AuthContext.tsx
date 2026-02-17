'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/data/services/database';
import { User, UserRole, mockSuperAdmin } from '@/data/users';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem('lms_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setRole(parsedUser.role);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('lms_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // 1. Check Students
            const student = db.students.find(s => s.email === email && s.password === pass)[0];
            if (student) {
                handleSuccess(student);
                return true;
            }

            // 2. Check Schools
            const school = db.schools.find(s => s.email === email && s.password === pass)[0];
            if (school) {
                handleSuccess(school);
                return true;
            }

            // 3. Check Teachers
            const teacher = db.teachers.find(s => s.email === email && s.password === pass)[0];
            if (teacher) {
                handleSuccess(teacher);
                return true;
            }

            // 4. Check Govt
            const govt = db.govt.find(s => s.email === email && s.password === pass)[0];
            if (govt) {
                handleSuccess(govt);
                return true;
            }

            // 5. Check SuperAdmin (Single Object)
            if (mockSuperAdmin.email === email && mockSuperAdmin.password === pass) {
                handleSuccess(mockSuperAdmin);
                return true;
            }

            // 6. Check HelpSupport
            const support = db.support.find(s => s.email === email && s.password === pass)[0];
            if (support) {
                handleSuccess(support);
                return true;
            }

            toast.error('Invalid credentials');
            return false;
        } catch (error) {
            console.error(error);
            toast.error('Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = (userData: User) => {
        setUser(userData);
        setRole(userData.role);
        localStorage.setItem('lms_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);

        // Redirect based on role
        switch (userData.role) {
            case 'student':
                router.push('/student/dashboard');
                break;
            case 'school':
                router.push('/school/dashboard');
                break;
            case 'teacher':
                // Assuming teacher has a dashboard or uses school dashboard?
                // Current structure suggests school dashboard or maybe a simpler view. 
                // Let's default to school dashboard for now or check if there is a teacher route.
                // Looking at file structure, there is no root 'teacher' route, but 'school' has subfolders.
                // Actually, previous list_dir showed 'admin', 'govt', 'school', 'student'.
                // Teacher might login to 'school' portal or 'admin' portal?
                // Let's assume '/school/dashboard' for now or handle later.
                router.push('/school/dashboard');
                break;
            case 'govt':
                router.push('/govt/dashboard');
                break;
            case 'superadmin':
                router.push('/admin/dashboard');
                break;
            case 'helpsupport':
                // Assume admin or separate?
                router.push('/admin/help-support');
                break;
            default:
                router.push('/');
        }
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('lms_user');
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
