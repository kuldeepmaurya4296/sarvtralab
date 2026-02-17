'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import patternBg from '@/assets/pattern-bg.jpg';

type UserRole = 'student' | 'school' | 'govt';

export default function SignupPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<UserRole>('student');
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        schoolName: '',
        email: '',
        password: ''
    });

    const getTotalSteps = () => 2; // Simplified to 2 steps for all for now, or add logic if needed

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, validation and API call here
        console.log('Registering:', { ...formData, role: activeTab });
        router.push(`/${activeTab}/dashboard`);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex flex-1 relative bg-primary">
                <img
                    src={patternBg.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
                <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Journey Today</h2>
                    <p className="text-lg text-primary-foreground/80 mb-8">
                        Join thousands of students, schools, and educators on India's premier robotics education platform.
                    </p>
                    <div className="space-y-4">
                        {['CBSE & NEP 2020 Aligned', 'Robotics Kit Included', '0% EMI Options'].map((item) => (
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

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 bg-background overflow-y-auto">
                <div className="max-w-lg mx-auto w-full">
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white">
                            <img src="/logo.jpeg" alt="Sarvtra Labs" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-display text-xl font-bold text-foreground">
                            Sarvtra <span className="text-primary">Labs</span>
                        </span>
                    </Link>

                    <motion.div
                        key={`${activeTab}-${step}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Your Account</h1>
                        <p className="text-muted-foreground mb-6">
                            Step {step} of {getTotalSteps()} - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Registration
                        </p>

                        <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / getTotalSteps()) * 100}%` }} />
                        </div>

                        {step === 1 && (
                            <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8">
                                {(['student', 'school', 'govt'] as UserRole[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => { setActiveTab(tab); setStep(1); }}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                                        type="button"
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={(e) => {
                            if (step === getTotalSteps()) {
                                handleSubmit(e);
                            } else {
                                e.preventDefault();
                                setStep(step + 1);
                            }
                        }} className="space-y-4">
                            {step === 1 ? (
                                <>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Full Name"
                                        required
                                    />
                                    {activeTab === 'school' && (
                                        <input
                                            name="schoolName"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="School Name"
                                            required
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Email Address"
                                        required
                                    />
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                                            placeholder="Password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-4 pt-4">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(step - 1)}
                                        className="w-full"
                                    >
                                        Back
                                    </Button>
                                )}
                                <Button type="submit" className="w-full flex-1">
                                    {step === getTotalSteps() ? 'Create Account' : 'Continue'}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center text-muted-foreground mt-6 text-sm">
                            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
