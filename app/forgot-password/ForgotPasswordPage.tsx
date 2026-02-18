'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
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
                    {!isSubmitted ? (
                        <motion.div
                            key="forgot-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl backdrop-blur-sm"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
                                <p className="text-muted-foreground">
                                    Don't worry! Enter your email and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your registered email"
                                            className="w-full px-4 py-3.5 rounded-2xl border bg-background/50 pl-12 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-12 rounded-2xl gap-2 text-base font-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                            Sending Link...
                                        </div>
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>

                                <div className="pt-2 text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </Link>
                                </div>
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
                            <h1 className="text-2xl font-bold text-foreground mb-4">Check Your Inbox</h1>
                            <p className="text-muted-foreground mb-8">
                                We've sent a password reset link to <br />
                                <span className="font-semibold text-foreground">{email}</span>
                            </p>

                            <div className="space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-2xl text-base"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Didn't get the email? Try again
                                </Button>

                                <Link href="/login">
                                    <Button className="w-full h-12 rounded-2xl text-base mt-2">
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>

                            <p className="text-xs text-muted-foreground mt-8">
                                Please check your spam folder if you don't see the email in your inbox.
                            </p>
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
