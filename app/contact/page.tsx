
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle, Send } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { contactCards, organizationDetails } from '@/data/organization'; // Dynamic data

// Mapping icon strings to components for ContactPage specific rendering if needed, 
// though we can just import from lucide-react in the map loop if we are sure about the strings.
// A safer way is to have a small helper component or map.
import * as Icons from 'lucide-react';

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (Icons as any)[name];
    if (!Icon) return null;
    return <Icon className={className} />;
};

export default function ContactPage() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            toast({
                title: 'Message Sent!',
                description: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <PublicLayout>
            {/* Hero */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-semibold mb-4 text-sm">Contact Us</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Get in Touch with
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Our Team</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Have questions about our courses or school partnerships?
                            We're here to help you get started on your robotics journey.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactCards.map((info, index) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <IconComponent name={info.iconName} className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="font-semibold mb-1">{info.title}</h3>
                                {info.link && info.link !== '#' ? (
                                    <a href={info.link} className="text-foreground font-medium hover:text-primary transition-colors">{info.content}</a>
                                ) : (
                                    <p className="text-foreground font-medium">{info.content}</p>
                                )}
                                <p className="text-sm text-muted-foreground">{info.subtext}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card rounded-2xl border p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Send us a Message</h2>
                            </div>

                            {submitted ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
                                    <p className="text-muted-foreground mt-2">We'll get back to you shortly.</p>
                                    <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Course inquiry"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help..."
                                            rows={5}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full">
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </Button>
                                </form>
                            )}
                        </motion.div>

                        {/* Map & Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            {/* Map */}
                            <div className="h-72 rounded-2xl bg-muted overflow-hidden border">
                                <iframe
                                    src={organizationDetails.contact.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Sarvtra Lab Office Location"
                                />
                            </div>

                            {/* FAQ Teaser */}
                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                                <h3 className="text-lg font-semibold mb-2">Looking for Quick Answers?</h3>
                                <p className="text-muted-foreground mb-4">
                                    Check out our FAQ section for answers to common questions about courses,
                                    pricing, and enrollment.
                                </p>
                                <Button variant="outline" asChild>
                                    <a href="/#faqs">View FAQs</a>
                                </Button>
                            </div>

                            {/* School Partnership CTA */}
                            <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200">
                                <h3 className="text-lg font-semibold mb-2 text-orange-900">School Partnership Inquiry?</h3>
                                <p className="text-orange-700 mb-4">
                                    Interested in bringing robotics education to your school?
                                    Schedule a demo with our partnership team.
                                </p>
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                                    <a href="/schools">Learn More</a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
