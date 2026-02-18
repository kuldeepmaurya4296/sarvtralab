'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loginCredentials } from '@/data/users';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

type UserRole = 'student' | 'school' | 'govt' | 'admin';

export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<UserRole>('student');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const tabs: { key: UserRole; label: string }[] = [
        { key: 'student', label: 'Student' },
        { key: 'school', label: 'School' },
        { key: 'govt', label: 'Govt Org' },
        { key: 'admin', label: 'Admin' }
    ];

    const { login } = useAuth();

    const fillDemoCredentials = () => {
        const roleToFind = activeTab === 'admin' ? 'superadmin' : activeTab;
        const creds = loginCredentials.find(c => c.role === roleToFind);
        if (creds) {
            setEmail(creds.email);
            setPassword(creds.password);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter your credentials');
            return;
        }

        const success = await login(email, password);
        if (!success) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 bg-background">
                <div className="max-w-md mx-auto w-full">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="h-10 w-32 relative overflow-hidden flex items-center justify-center">
                            <Image
                                src="/favicon.svg"
                                alt="Sarvtra Labs (Sarwatra Labs) Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="font-display text-xl font-bold text-foreground">
                            Sarvtra <span className="text-primary">Labs</span>
                        </span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Welcome Back!
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            Sign in to continue your learning journey
                        </p>

                        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        setActiveTab(tab.key);
                                        setEmail('');
                                        setPassword('');
                                        setError('');
                                    }}
                                    className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg transition-all
                    ${activeTab === tab.key
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="w-full mb-4 py-2 text-sm text-primary hover:underline"
                        >
                            Click to fill demo credentials
                        </button>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 rounded-xl border bg-background pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 rounded-xl border bg-background pl-12 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-border" />
                                    <span className="text-sm text-muted-foreground">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" size="lg" className="w-full gap-2">
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </form>

                        <p className="text-center text-muted-foreground mt-6">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-primary font-medium hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 relative bg-primary">
                <Image
                    src="/pattern-bg.jpg"
                    alt=""
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
                <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Empowering the Next Generation of Innovators
                    </h2>
                    <p className="text-lg text-primary-foreground/80 mb-8">
                        Join India's most comprehensive robotics and coding education platform
                        designed for K-12 students.
                    </p>
                    <div className="space-y-4">
                        {['15,000+ Students Trained', '120+ Partner Schools', 'CBSE & NEP 2020 Aligned'].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                    <Check className="w-4 h-4" />
                                </div>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
