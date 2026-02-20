'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { organizationDetails } from '@/data/organization';

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/pattern-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-accent/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6"
          >
            Ready to Start Your
            <span className="block">Robotics Journey?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8"
          >
            Join thousands of students already learning with Sarvtra Labs.
            Get started today with our free trial class!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl bg-primary-foreground text-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Book Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href={`tel:${organizationDetails.contact.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-2 text-primary-foreground hover:underline">
              <Phone className="w-5 h-5" />
              <span className="font-medium">{organizationDetails.contact.phone}</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements - Hidden on mobile for performance */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full border-4 border-primary-foreground/10 hidden md:block pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border-4 border-primary-foreground/10 hidden md:block pointer-events-none"
      />
    </section>
  );
};

export default CTASection;


