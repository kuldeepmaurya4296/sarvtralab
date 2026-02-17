'use client';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Download } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { pressReleases } from '@/data/content';

export default function PressPage() {
    return (
        <PublicLayout>
            <section className="pt-32 pb-16 bg-muted/50">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Press & Media
                    </motion.h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Stay up to date with the latest announcements and media coverage about Sarvtra Labs.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" /> Download Brand Assets
                        </Button>
                        <Button className="gap-2">
                            Media Contact
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl font-bold mb-8">Latest Press Releases</h2>

                    <div className="space-y-4">
                        {pressReleases.map((release, index) => (
                            <motion.div
                                key={release.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow flex items-start justify-between gap-4"
                            >
                                <div>
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                                        {release.source}
                                    </span>
                                    <h3 className="text-lg font-bold mb-2">{release.title}</h3>
                                    <p className="text-sm text-muted-foreground">{release.date}</p>
                                </div>
                                <Link href={release.link} className="shrink-0">
                                    <Button variant="ghost" size="icon">
                                        <ExternalLink className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
