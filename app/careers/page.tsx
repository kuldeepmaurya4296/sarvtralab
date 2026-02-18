'use client';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Search } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { jobs } from '@/data/content';
import { useNotifications } from '@/context/NotificationContext';
import { toast } from 'sonner';

export default function CareersPage() {
    const { notifyAdmin } = useNotifications();

    const handleApply = (jobTitle: string) => {
        toast.success(`Application for ${jobTitle} submitted successfully!`);
        notifyAdmin(
            'New Job Application',
            `Someone has applied for the ${jobTitle} position.`,
            'info',
            '/admin/dashboard'
        );
    };

    return (
        <PublicLayout>
            <section className="pt-32 pb-16 bg-muted/50">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Join the <span className="text-primary">Sarvtra Labs</span> Team
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl mx-auto mb-8"
                    >
                        We are on a mission to revolutionize STEM education in India. Join us and make a real impact on students' lives.
                    </motion.p>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl font-bold mb-8">Open Positions</h2>

                    <div className="space-y-4">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <h3 className="font-semibold text-lg">{job.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4" /> {job.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> {job.location}
                                        </span>
                                        <span className="bg-muted px-2 py-0.5 rounded text-xs">
                                            {job.type}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-3 text-foreground/80">{job.description}</p>
                                </div>
                                <Button
                                    className="shrink-0"
                                    onClick={() => handleApply(job.title)}
                                >
                                    Apply Now
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center bg-primary/5 rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-2">Don't see a fit?</h3>
                        <p className="text-muted-foreground mb-4">
                            We are always looking for talented individuals. Send your resume to careers@sarvtralab.in
                        </p>
                        <Button variant="outline">Contact Us</Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
