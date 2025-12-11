import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  QrCode, 
  Settings, 
  LogOut, 
  Menu, 
  Store,
  ChefHat,
  BarChart3 
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Manage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation Items Configuration
  const navItems = [
    { name: "Dashboard", href: "/manage", icon: LayoutDashboard, end: true },
    { name: "Analytics", href: "/manage/stats", icon: BarChart3 },
    { name: "Orders", href: "/manage/orders", icon: Store },
    { name: "Menu Management", href: "/manage/menu", icon: UtensilsCrossed },
    { name: "QR Codes", href: "/manage/qr", icon: QrCode },
    { name: "Team", href: "/manage/team", icon: BarChart3 },
    { name: "Settings", href: "/manage/settings", icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <ChefHat className="h-6 w-6 text-orange-500 mr-2" />
        <span className="font-bold text-white text-lg tracking-tight">Quisine-IQ</span>
      </div>

      {/* User Mini Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
            <Avatar className="h-10 w-10 border border-slate-600">
                <AvatarImage src={user?.logo} />
                <AvatarFallback className="bg-orange-600 text-white font-bold">
                    {user?.username?.substring(0,2).toUpperCase() || "AD"}
                </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user?.username || "Admin"}</p>
                <p className="truncate text-xs text-slate-400">Shop Owner</p>
            </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
           const isActive = item.end 
             ? location.pathname === item.href 
             : location.pathname.startsWith(item.href);
             
           return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? "bg-orange-600 text-white shadow-md shadow-orange-900/20" 
                  : "hover:bg-slate-800 hover:text-white"}
              `}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
           );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={handleLogout}
        >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden w-64 flex-col md:flex shadow-xl z-20 sticky top-0 h-screen">
        <NavContent />
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
            <div className="flex items-center gap-2 font-bold text-slate-900">
                <ChefHat className="h-6 w-6 text-orange-600" />
                Quisine-IQ
            </div>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-r-slate-800">
                    <NavContent />
                </SheetContent>
            </Sheet>
        </header>

        {/* Content Outlet (Where Dashboard/Menu/Orders renders) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
}