'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  Users,
  Building,
  School,
  Shield,
  Headphones,
  Award,
  ShoppingCart,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'school' | 'govt' | 'admin' | 'superadmin' | 'teacher' | 'helpsupport';
  userName: string;
  userEmail: string;
  hideSidebar?: boolean;
}

interface MenuItem {
  icon: any;
  label: string;
  href: string;
}

const roleMenuItems: Record<string, MenuItem[]> = {
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '/student/courses' },
    { icon: Award, label: 'Certificates', href: '/student/certificates' },
    { icon: FileText, label: 'Materials', href: '/student/materials' },
    { icon: ShoppingCart, label: 'Order', href: 'https://www.yantraq.com/products' },
    { icon: Headphones, label: 'Support', href: '/student/support' },
    { icon: Settings, label: 'Settings', href: '/student/settings' }
  ],
  school: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/school/dashboard' },
    { icon: Users, label: 'Students', href: '/school/students' },
    { icon: BookOpen, label: 'Courses', href: '/school/courses' },
    { icon: FileText, label: 'Reports', href: '/school/reports' },
    { icon: Settings, label: 'Settings', href: '/school/settings' }
  ],
  govt: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/govt/dashboard' },
    { icon: Building, label: 'Schools', href: '/govt/schools' },
    { icon: Users, label: 'Students', href: '/govt/students' },
    { icon: FileText, label: 'Reports', href: '/govt/reports' },
    { icon: Settings, label: 'Settings', href: '/govt/settings' }
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: School, label: 'Schools', href: '/admin/schools' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: GraduationCap, label: 'Teachers', href: '/admin/teachers' },
    { icon: Headphones, label: 'Help Support', href: '/admin/help-support' },
    { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
    { icon: Award, label: 'Certificates', href: '/admin/certificates' },
    { icon: FileText, label: 'Content', href: '/admin/content' },
    { icon: Target, label: 'CRM', href: '/admin/crm' },
    { icon: Shield, label: 'Govt Orgs', href: '/admin/govt' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' }
  ],
  superadmin: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: School, label: 'Schools', href: '/admin/schools' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: GraduationCap, label: 'Teachers', href: '/admin/teachers' },
    { icon: Headphones, label: 'Help Support', href: '/admin/help-support' },
    { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
    { icon: Award, label: 'Certificates', href: '/admin/certificates' },
    { icon: FileText, label: 'Content', href: '/admin/content' },
    { icon: Target, label: 'CRM', href: '/admin/crm' },
    { icon: Shield, label: 'Govt Orgs', href: '/admin/govt' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' }
  ],
  teacher: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/teacher/dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '/teacher/courses' },
    { icon: Users, label: 'Students', href: '/teacher/students' },
    { icon: FileText, label: 'Materials', href: '/teacher/materials' },
    { icon: BarChart3, label: 'Reports', href: '/teacher/reports' },
    { icon: Settings, label: 'Settings', href: '/teacher/settings' }
  ],
  helpsupport: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/helpsupport/dashboard' },
    { icon: Headphones, label: 'Tickets', href: '/helpsupport/tickets' },
    { icon: Users, label: 'Students', href: '/helpsupport/students' },
    { icon: FileText, label: 'Knowledge Base', href: '/helpsupport/knowledge-base' },
    { icon: Settings, label: 'Settings', href: '/helpsupport/settings' }
  ]
};

const roleColors: Record<string, string> = {
  student: 'from-primary to-accent',
  school: 'from-secondary to-primary',
  govt: 'from-accent to-success',
  admin: 'from-primary to-secondary',
  superadmin: 'from-primary to-secondary',
  teacher: 'from-primary to-accent',
  helpsupport: 'from-accent to-success'
};

const roleLabels: Record<string, string> = {
  student: 'Student Portal',
  school: 'School Portal',
  govt: 'Govt Portal',
  admin: 'Super Admin',
  superadmin: 'Super Admin',
  teacher: 'Teacher Portal',
  helpsupport: 'Support Portal'
};

const DashboardLayout = ({ children, role, userName, userEmail, hideSidebar = false }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();
  const menuItems = roleMenuItems[role] || roleMenuItems['student'];

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      {!hideSidebar && (
        <aside
          className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
            }`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 relative overflow-hidden flex items-center justify-center flex-shrink-0">
                <Image
                  src="/favicon.svg"
                  alt="Sarvtra Labs"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {sidebarOpen && (
                <span className="font-display text-lg font-bold">
                  Sarvtra <span className="text-sidebar-primary">Labs</span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Role Badge */}
          {sidebarOpen && (
            <div className="px-4 py-3">
              <div className={`px-3 py-2 rounded-lg bg-gradient-to-r ${roleColors[role] || roleColors['student']} text-primary-foreground text-xs font-semibold text-center`}>
                {roleLabels[role] || roleLabels['student']}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item: MenuItem) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className={`sidebar-link w-full text-destructive hover:bg-destructive/10 ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-sidebar text-sidebar-foreground z-50"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 relative overflow-hidden flex items-center justify-center">
                    <Image
                      src="/favicon.svg"
                      alt="Sarvtra Labs"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-display text-lg font-bold">
                    Sarvtra <span className="text-sidebar-primary">Labs</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-sidebar-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 py-3">
                <div className={`px-3 py-2 rounded-lg bg-gradient-to-r ${roleColors[role] || roleColors['student']} text-primary-foreground text-xs font-semibold text-center`}>
                  {roleLabels[role] || roleLabels['student']}
                </div>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item: MenuItem) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`sidebar-link ${isActive ? 'active' : ''}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-sidebar-border">
                <button
                  onClick={handleLogout}
                  className="sidebar-link w-full text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${(!sidebarOpen || hideSidebar) ? 'lg:ml-0' : 'lg:ml-64'} ${!sidebarOpen && !hideSidebar ? 'lg:ml-20' : ''}`}>
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground hidden md:block">
              {menuItems.find((item: MenuItem) => item.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle notifications"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </button>
              <AnimatePresence>
                {notificationOpen && (
                  <NotificationDropdown onClose={() => setNotificationOpen(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-card border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-4 border-b">
                      <p className="font-medium text-foreground">{userName}</p>
                      <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href={`/${role}/settings`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;



