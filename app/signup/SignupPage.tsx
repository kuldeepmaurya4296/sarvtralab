'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, Loader2, User, Mail, Lock, Building2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { registerUser } from '@/lib/actions/auth.actions';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

type UserRole = 'student' | 'school' | 'govt';

const roleOptions: { value: UserRole; label: string; description: string }[] = [
    { value: 'student', label: 'Student', description: 'I want to learn robotics & coding' },
    { value: 'school', label: 'School / Institution', description: 'I want to enroll my school' },
    { value: 'govt', label: 'Government Organization', description: 'I represent a government body' },
];

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        schoolName: '',
    });
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        if ((selectedRole === 'student' || selectedRole === 'school') && !formData.schoolName) {
            toast.error('School name is required');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const result = await registerUser({
                ...formData,
                role: selectedRole,
            });

            if (result.error) {
                toast.error(result.error);
                setIsLoading(false);
                return;
            }

            // Auto login after registration
            const loginResult = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (loginResult?.ok) {
                toast.success('Account created successfully!');
                router.refresh();
                const dashboardMap: Record<UserRole, string> = {
                    student: '/student/dashboard',
                    school: '/school/dashboard',
                    govt: '/govt/dashboard',
                };
                router.push(dashboardMap[selectedRole]);
            } else {
                toast.success('Account created! Please sign in.');
                router.push('/login');
            }
        } catch (error) {
            console.error(error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
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
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            Start Your Journey Today
                        </h2>
                        <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
                            Join thousands of students, schools, and educators on India&apos;s premier robotics education platform.
                        </p>
                        <div className="space-y-5">
                            {[
                                'CBSE & NEP 2020 Aligned Curriculum',
                                'Robotics Kit Included with Courses',
                                '0% EMI Options Available',
                                'Expert-Led Live & Recorded Sessions'
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary-foreground/15 flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="text-primary-foreground/90">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 bg-background overflow-y-auto">
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
                            Create Account
                        </h1>
                        <p className="text-muted-foreground mb-8 text-base">
                            Get started with your free account
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Role Selection */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground">I am a</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                        className="w-full px-4 py-3.5 rounded-xl border bg-background pl-12 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        {roleOptions.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label} — {role.description}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3.5 rounded-xl border bg-background pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* School Name (mandatory for students & schools) */}
                            {(selectedRole === 'school' || selectedRole === 'student') && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1.5"
                                >
                                    <label className="block text-sm font-medium text-foreground">
                                        {selectedRole === 'student' ? 'School Name' : 'School / Institution Name'}
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            name="schoolName"
                                            type="text"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                            placeholder={selectedRole === 'student' ? "Enter your school name" : "Enter institution name"}
                                            className="w-full px-4 py-3.5 rounded-xl border bg-background pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3.5 rounded-xl border bg-background pl-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-foreground">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 6 characters"
                                        className="w-full px-4 py-3.5 rounded-xl border bg-background pl-12 pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                        required
                                        minLength={6}
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
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center mt-3">
                                By creating an account, you agree to our{' '}
                                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </p>
                        </form>

                        <p className="text-center text-muted-foreground mt-8 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
