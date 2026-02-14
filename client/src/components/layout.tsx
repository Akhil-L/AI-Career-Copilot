import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  GraduationCap, 
  CreditCard, 
  LogOut, 
  Bell,
  Menu,
  X,
  ChevronRight,
  Globe,
  Shield,
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { currentUser, logout, notifications, markNotificationRead } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  const navItems = currentUser?.role === 'admin' 
    ? [{ label: "Admin Portal", href: "/admin", icon: Shield }]
    : currentUser?.role === 'client'
    ? [{ label: "Client Portal", href: "/client", icon: Briefcase }]
    : [
        { label: "Work Hub", href: "/dashboard", icon: LayoutDashboard },
        { label: "Academy", href: "/training", icon: GraduationCap },
        { label: "Earnings", href: "/payouts", icon: CreditCard },
      ];

  const publicLinks = [
    { label: "For Businesses", href: "/businesses" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-black tracking-tight text-slate-900 leading-none">LEXINGTON</span>
                <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">Global Systems</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {publicLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="text-slate-600 font-semibold hover:text-blue-600">
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center gap-2 mr-4 bg-slate-50 p-1 rounded-xl">
                  {navItems.map(item => (
                    <Link key={item.href} href={item.href}>
                      <Button 
                        variant={location === item.href ? "secondary" : "ghost"} 
                        className={`gap-2 h-10 px-4 rounded-lg font-bold ${location === item.href ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                      >
                        <item.icon className="h-4 w-4" /> {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full bg-slate-50 hover:bg-blue-50">
                      <Bell className="h-5 w-5 text-slate-600" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-2">
                    <div className="px-3 py-2 text-xs font-bold uppercase text-slate-400">Notifications</div>
                    <DropdownMenuSeparator />
                    {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400 italic">No notifications</div>
                    ) : (
                      notifications.filter(n => n.userId === currentUser.id).slice(0, 5).map(n => (
                        <DropdownMenuItem key={n.id} className="p-3 rounded-lg flex flex-col items-start gap-1 cursor-pointer hover:bg-slate-50" onClick={() => markNotificationRead(n.id)}>
                          <div className="flex justify-between w-full">
                            <span className={`font-bold text-sm ${n.read ? 'text-slate-600' : 'text-blue-600'}`}>{n.title}</span>
                            {!n.read && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-3 h-11 px-2 rounded-full hover:bg-slate-50">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {currentUser.name[0]}
                      </div>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{currentUser.role}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <div className="px-3 py-2 flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
                      <span className="text-xs text-slate-500">{currentUser.email}</span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 font-bold focus:bg-red-50 focus:text-red-600 cursor-pointer p-3 rounded-lg" onClick={() => { logout(); setLocation("/"); }}>
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth">
                  <Button variant="ghost" className="font-bold text-slate-600">Login</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-200">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                <item.icon className="h-5 w-5" /> {item.label}
              </Button>
            </Link>
          ))}
          <DropdownMenuSeparator />
          {publicLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" className="w-full justify-start h-12 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <Globe className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-heading font-black tracking-tight uppercase">Lexington Global</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Enterprise-grade data processing and verification systems for the modern global economy. Certified accuracy at scale.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-widest">Platform</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="/businesses" className="hover:text-blue-400 transition-colors">For Businesses</Link></li>
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
                <li><Link href="/auth?tab=register" className="hover:text-blue-400 transition-colors">Apply as Specialist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-widest">Legal</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/payout-policy" className="hover:text-blue-400 transition-colors">Payout Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>© 2026 Lexington Global Systems. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Bank-Grade Security</span>
              <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> Global Infrastructure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
