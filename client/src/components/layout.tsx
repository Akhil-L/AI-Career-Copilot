import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  CheckSquare, 
  LogOut, 
  User as UserIcon, 
  Bell,
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { currentUser, logout, notifications, markNotificationRead } = useStore();

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-primary hover:opacity-90 transition-opacity">
              <div className="bg-primary text-white p-1 rounded-lg">
                <CheckSquare className="h-5 w-5" />
              </div>
              DataEntry Pro
            </a>
          </Link>

          <nav className="flex items-center gap-2">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center gap-4 mr-4">
                  <Link href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                    <a className={`text-sm font-medium transition-colors hover:text-primary ${location === '/dashboard' || location === '/admin' ? 'text-primary' : 'text-slate-600'}`}>
                      Dashboard
                    </a>
                  </Link>
                  {currentUser.role === 'worker' && (
                    <Link href="/payouts">
                      <a className={`text-sm font-medium transition-colors hover:text-primary ${location === '/payouts' ? 'text-primary' : 'text-slate-600'}`}>
                        Earnings
                      </a>
                    </Link>
                  )}
                </div>

                {/* Notifications */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative mr-2">
                      <Bell className="h-5 w-5 text-slate-600" />
                      {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 flex items-center justify-between">
                      <h4 className="font-bold text-sm">Notifications</h4>
                      {unreadCount > 0 && <Badge variant="secondary" className="bg-red-50 text-red-600">{unreadCount} new</Badge>}
                    </div>
                    <Separator />
                    <ScrollArea className="h-[300px]">
                      {userNotifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No notifications yet</div>
                      ) : (
                        userNotifications.map(n => (
                          <div 
                            key={n.id} 
                            className={`p-4 border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                            onClick={() => markNotificationRead(n.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-xs font-bold uppercase ${n.type === 'success' ? 'text-emerald-600' : n.type === 'warning' ? 'text-red-600' : 'text-blue-600'}`}>
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-slate-200">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} />
                        <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                        <p className="text-xs leading-none text-slate-500 capitalize">{currentUser.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                      <DropdownMenuItem className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                    </Link>
                    {currentUser.role === 'worker' && (
                      <Link href="/payouts">
                        <DropdownMenuItem className="cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4" /> Earnings
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 animate-in fade-in duration-500">
        {children}
      </main>
      <footer className="border-t py-8 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <CheckSquare className="h-4 w-4 text-primary" /> DataEntry Pro
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
          <div>© 2024 Secure Task Platform.</div>
        </div>
      </footer>
    </div>
  );
}
