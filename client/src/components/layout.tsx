import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  GraduationCap, 
  LogOut, 
  Bell,
  Menu,
  X,
  Target,
  User,
  FileText,
  LineChart,
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

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Resumes", href: "/resume-history", icon: FileText },
    { label: "Skill Gap", href: "/skill-gap", icon: Target },
    { label: "Interviews", href: "/interview-prep", icon: GraduationCap },
  ];

  const handleLogout = async () => {
    logout();
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Clean Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-all">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-heading font-black tracking-tight text-slate-900">Copilot</span>
            </Link>

            {currentUser && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
                {navItems.map(item => (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={location === item.href || (location === '/ats-analysis' && item.href === '/resume-history') || (location === '/resume-upload' && item.href === '/resume-history') ? "secondary" : "ghost"} 
                      className={`gap-2 h-10 px-4 rounded-xl font-bold transition-all duration-300 ${location === item.href || (location === '/ats-analysis' && item.href === '/resume-history') || (location === '/resume-upload' && item.href === '/resume-history') ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                    >
                      <item.icon className={`h-4 w-4 ${location === item.href || (location === '/ats-analysis' && item.href === '/resume-history') || (location === '/resume-upload' && item.href === '/resume-history') ? 'text-purple-600' : 'text-slate-400'}`} /> {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full bg-slate-100/50 hover:bg-slate-200/50 transition-all">
                      <Bell className="h-5 w-5 text-slate-600" />
                      {unreadCount > 0 && (
                        <span className="absolute 2 top-2 right-2 h-2.5 w-2.5 bg-purple-600 rounded-full border-2 border-white"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-xl border-slate-100">
                    <div className="flex items-center justify-between px-3 py-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">Notifications</span>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-sm">No new notifications</div>
                    ) : (
                       <div className="space-y-1">
                        {notifications.filter(n => n.userId === currentUser.id).slice(0, 5).map(n => (
                          <DropdownMenuItem key={n.id} className="p-3 rounded-xl flex flex-col items-start gap-1 cursor-pointer" onClick={() => markNotificationRead(n.id)}>
                            <span className="font-bold text-sm text-slate-900">{n.title}</span>
                            <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-11 w-11 p-0 rounded-full bg-purple-100 hover:bg-purple-200 transition-all border border-purple-200">
                      <span className="font-bold text-purple-700">{currentUser.name[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-slate-100 mt-2">
                    <div className="px-3 py-2 mb-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-100 mb-2" />
                    <DropdownMenuItem className="font-bold cursor-pointer p-2.5 rounded-xl" onClick={() => setLocation("/profile")}>
                      <User className="h-4 w-4 mr-3 text-slate-400" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 font-bold focus:bg-red-50 focus:text-red-600 cursor-pointer p-2.5 rounded-xl" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-3" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="lg:hidden h-11 w-11 rounded-xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/auth">
                  <Button variant="ghost" className="font-bold text-slate-600 hidden sm:flex">Log In</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && currentUser && (
        <div className="lg:hidden bg-white border-b border-slate-100 p-4 space-y-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                <item.icon className="h-5 w-5 text-slate-400" /> {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-10 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-slate-400" />
            <span className="font-heading font-bold text-slate-900">AI Copilot</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">© 2026 Career Copilot. Empowering job seekers.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
