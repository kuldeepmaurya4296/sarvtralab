'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, GraduationCap, ChevronDown, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { navLinks } from '@/data/content';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  const getDashboardUrl = () => {
    const role = (session?.user as any)?.role;
    switch (role) {
      case 'student': return '/student/dashboard';
      case 'school': return '/school/dashboard';
      case 'teacher': return '/teacher/dashboard';
      case 'govt': return '/govt/dashboard';
      case 'superadmin': return '/admin/dashboard';
      case 'helpsupport': return '/helpsupport/dashboard';
      default: return '/login';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background md:bg-background/80 md:backdrop-blur-xl border-b">
      <Link
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] bg-primary text-primary-foreground px-4 py-2 rounded-lg"
      >
        Skip to main content
      </Link>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Logo commented as per request */}
            {/* <div className="h-10 w-32 relative overflow-hidden flex items-center justify-center">
              <Image
                src="/favicon.svg"
                alt="Sarvtra Labs (Sarwatra Labs) Logo"
                fill
                className="object-contain"
                priority
              />
            </div> */}
            <span className="text-2xl md:text-3xl font-black tracking-tighter transition-all duration-300 group-hover:scale-105">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-primary/80 to-accent animate-gradient">Sarvtra</span>
              <span className="text-foreground ml-1">Labs</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? 'active text-foreground' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {session?.user ? (
              <Link href={getDashboardUrl()}>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b"
            id="mobile-menu"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                {session?.user ? (
                  <Link href={getDashboardUrl()} className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
