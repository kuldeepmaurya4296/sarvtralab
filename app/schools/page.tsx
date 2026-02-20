
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Check, ArrowRight,
    Phone
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { schoolPlans, schoolBenefits } from '@/data/products';
import { organizationDetails } from '@/data/organization';
import * as Icons from 'lucide-react';

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (Icons as any)[name];
    if (!Icon) return null;
    return <Icon className={className} />;
};

export default function SchoolsPage() {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden bg-foreground">
                <div className="absolute inset-0 z-0 opacity-40">
                    {/* Placeholder for image */}
                    <div className="w-full h-full bg-linear-to-r from-gray-900 via-gray-800 to-gray-900" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-semibold mb-4 text-sm">For Schools</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-background mb-6">
                            Partner with India's Leading
                            <span className="block text-primary">Robotics Education Platform</span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-8">
                            Transform your school's STEM program with our comprehensive robotics curriculum,
                            training, and support. Join {organizationDetails.stats.find(s => s.label.includes('Partner'))?.value || '120+'} partner schools across India.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="w-full sm:w-auto h-12 text-lg font-semibold bg-primary hover:bg-primary/90" asChild>
                                <Link href="/contact">
                                    Request Demo
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 text-lg text-white border-white/20 cursor-pointer bg-white/10" asChild>
                                <a href={`tel:${organizationDetails.contact.phone.replace(/\s+/g, '')}`}>
                                    <Phone className="w-5 h-5 mr-2" />
                                    {organizationDetails.contact.phone}
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-primary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {organizationDetails.stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                                <p className="text-primary-foreground/70">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner with Sarvtra Labs?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to deliver world-class robotics education
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {schoolBenefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <IconComponent name={benefit.iconName} className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">School Partnership Plans</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Flexible plans designed for schools of all sizes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {schoolPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-8 rounded-2xl bg-card border-2 relative transition-all hover:-translate-y-2 ${plan.popular ? 'border-primary shadow-xl ring-2 ring-primary/20' : 'border-transparent shadow-lg'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full shadow-md">
                                        Most Popular
                                    </span>
                                )}
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-muted-foreground mb-4">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-auto">
                                    <Button
                                        className="w-full h-12 font-medium"
                                        variant={plan.popular ? 'default' : 'outline'}
                                        asChild
                                    >
                                        <Link href="/contact">
                                            Get Started
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-primary to-accent">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                        Ready to Transform Your School's STEM Program?
                    </h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Schedule a free demo to see how Sarvtra Labs can help your students excel in robotics and coding.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg font-semibold h-14 px-8" asChild>
                        <Link href="/contact">
                            Schedule Free Demo
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
