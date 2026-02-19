'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter your email and password');
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email, password, redirectPath || undefined);
            if (!success) {
                setError('Invalid email or password. Please try again.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 bg-background">
                <div className="max-w-md mx-auto w-full">
                    <Link href="/" className="flex items-center gap-2 mb-10">
                        <div className="h-10 w-32 relative overflow-hidden flex items-center justify-center">
                            <Image
                                src="/favicon.svg"
                                alt="Sarvtra Labs Logo"
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
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground mb-8 text-base">
                            Sign in to your account to continue
                        </p>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2"
                                >
                                    <ShieldCheck className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3.5 rounded-xl border bg-background pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-foreground">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3.5 rounded-xl border bg-background pl-12 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full gap-2 rounded-xl h-12 text-base font-semibold mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-muted-foreground mt-8 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-primary font-semibold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex flex-1 relative bg-primary overflow-hidden">
                <Image
                    src="/pattern-bg.jpg"
                    alt=""
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-accent/90" />
                <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16 text-primary-foreground">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            Empowering the Next Generation of Innovators
                        </h2>
                        <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
                            India&apos;s most comprehensive robotics and coding education platform designed for K-12 students.
                        </p>
                        <div className="space-y-5">
                            {[
                                { stat: '15,000+', label: 'Students Trained' },
                                { stat: '120+', label: 'Partner Schools' },
                                { stat: 'CBSE & NEP', label: '2020 Aligned Curriculum' }
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary-foreground/15 flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-lg">{item.stat}</span>
                                        <span className="text-primary-foreground/70 ml-2">{item.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
