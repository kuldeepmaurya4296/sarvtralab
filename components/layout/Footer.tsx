import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { footerLinks } from '@/data/content';
import { organizationDetails } from '@/data/organization';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-200 pt-20 pb-10 border-t border-zinc-800 font-sans">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo commented as per request */}
              {/* <div className="h-10 w-10 relative overflow-hidden flex items-center justify-center">
                <Image
                  src="/favicon.svg"
                  alt="Sarvtra Labs Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div> */}
              <span className="font-display text-2xl font-bold transition-all duration-300 group-hover:scale-105">
                <span className="text-white">Sarvtra</span>
                <span className="text-primary ml-1">Labs</span>
              </span>
            </Link>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              India's leading CBSE-aligned robotics and coding education platform for K-12 students.
              Empowering the next generation of innovators with hands-on learning.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { Icon: Facebook, label: "Facebook", href: organizationDetails.socials.find(s => s.platform === 'Facebook')?.url || '#' },
                { Icon: Twitter, label: "Twitter", href: organizationDetails.socials.find(s => s.platform === 'Twitter')?.url || '#' },
                { Icon: Instagram, label: "Instagram", href: organizationDetails.socials.find(s => s.platform === 'Instagram')?.url || '#' },
                { Icon: Linkedin, label: "LinkedIn", href: organizationDetails.socials.find(s => s.platform === 'LinkedIn')?.url || '#' },
                { Icon: Youtube, label: "YouTube", href: organizationDetails.socials.find(s => s.platform === 'YouTube')?.url || '#' },
              ].map(({ Icon, label, href }, index) => (
                <a
                  key={index}
                  href={href}
                  aria-label={`Follow us on ${label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-zinc-400"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections (8 cols total, 2 cols each) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-6">Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-6">Dashboards</h4>
            <ul className="space-y-3">
              {footerLinks.dashboards.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-400 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Strip - Industry Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-white/10 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">Email Us</h5>
              <a href={`mailto:${organizationDetails.contact.email}`} className="text-zinc-400 hover:text-white transition-colors block">
                {organizationDetails.contact.email}
              </a>
              <span className="text-xs text-zinc-500 mt-1 block">We reply within 24 hours</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">Call Us</h5>
              <a href={`tel:${organizationDetails.contact.phone.replace(/[^0-9+]/g, '')}`} className="text-zinc-400 hover:text-white transition-colors block">
                {organizationDetails.contact.phone}
              </a>
              <span className="text-xs text-zinc-500 mt-1 block">{organizationDetails.contact.hours}</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">Visit Sarvtra Labs</h5>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                {organizationDetails.contact.address}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Sarvtra Labs. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
            <Link href="/site-map" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

