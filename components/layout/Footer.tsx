import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { footerLinks } from '@/data/content';
import { organizationDetails } from '@/data/organization';
import { SEO_KEYWORDS } from '@/lib/seo';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-32 relative overflow-hidden flex items-center justify-center">
                <Image
                  src="/favicon.svg"
                  alt="Sarvtra Labs (Sarwatra Labs) Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-xl font-bold">
                Sarvtra <span className="text-primary">Labs</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm mb-6">
              India's leading CBSE-aligned robotics and coding education platform for K-12 students.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Follow us on Facebook" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Follow us on Twitter" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Follow us on Instagram" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Follow us on LinkedIn" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Subscribe to our Youtube channel" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Dashboards</h4>
            <ul className="space-y-3">
              {footerLinks.dashboards.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-primary text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-background/50">Email Us</p>
                <p className="font-medium text-sm">{organizationDetails.contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-background/50">Call Us</p>
                <p className="font-medium text-sm">{organizationDetails.contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-background/50">Visit Us</p>
                <p className="font-medium text-sm">{organizationDetails.contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Keyword Cloud - Hidden on mobile for performance */}
      <div className="border-t border-background/5 bg-background/2 hidden md:block">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h5 className="text-[10px] uppercase tracking-widest text-background/30 mb-4 font-bold">Recommended Topics & Areas We Serve</h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-background/40">
              {SEO_KEYWORDS.slice(0, 50).map((keyword, index, array) => (
                <span key={index} className="hover:text-primary transition-colors cursor-default">
                  {keyword}
                  {index < array.length - 1 && <span className="ml-3 text-background/10">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              © 2025 Sarvtra Labs. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-background/60 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-background/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/refund" className="text-sm text-background/60 hover:text-primary transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

