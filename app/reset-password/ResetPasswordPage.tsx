'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSuccess(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-32 relative overflow-hidden flex items-center justify-center">
                            <Image
                                src="/favicon.svg"
                                alt="Sarvtra Labs Logo"
                                fill
                                className="object-contain transition-transform group-hover:scale-110"
                                priority
                            />
                        </div>
                        <span className="font-display text-2xl font-bold text-foreground">
                            Sarvtra <span className="text-primary">Labs</span>
                        </span>
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="reset-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl backdrop-blur-sm"
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
                                <p className="text-muted-foreground">
                                    Create a new, strong password for your account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full px-4 py-3.5 rounded-2xl border bg-background/50 pl-12 pr-12 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
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

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat password"
                                            className="w-full px-4 py-3.5 rounded-2xl border bg-background/50 pl-12 pr-12 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-12 rounded-2xl gap-2 text-base font-semibold mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                            Updating Password...
                                        </div>
                                    ) : (
                                        <>
                                            Update Password
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card border border-border/50 rounded-3xl p-10 shadow-2xl text-center"
                        >
                            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-success" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-4">Password Updated!</h1>
                            <p className="text-muted-foreground mb-8">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>

                            <Link href="/login">
                                <Button className="w-full h-12 rounded-2xl text-base font-semibold">
                                    Sign In Now
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-6 left-0 w-full text-center">
                <p className="text-sm text-muted-foreground">
                    © 2025 Sarvtra Labs. All rights reserved.
                </p>
            </div>
        </div>
    );
}
