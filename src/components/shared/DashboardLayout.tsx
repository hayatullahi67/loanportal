"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Fingerprint, 
  LogOut,
  Bell,
  Search,
  User,
  Settings,
  History,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'microfinance' | 'dfo-officer' | 'dfo-signatory' | 'head-office';
  navItems: NavItem[];
}

export function DashboardLayout({ children, role, navItems }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#001a0e]">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,209,102,0.2)]">
            <Fingerprint className="text-[#001a0e] w-7 h-7" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white truncate">FinGuard</span>
        </Link>
        <div className="mt-4">
          <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em] font-black border-primary/20 text-primary bg-primary/5 px-3 py-1">
            {role.replace('-', ' ')}
          </Badge>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black transition-all duration-300",
                isActive
                  ? "bg-primary text-[#001a0e] shadow-[0_10px_20px_rgba(0,209,102,0.15)]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className={cn("shrink-0 transition-transform", isActive && "scale-110")}>
                {item.icon}
              </span>
              <span className="truncate uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 mt-auto">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl h-12 font-bold">
            <LogOut className="mr-3 h-5 w-5" />
            SIGN OUT
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#000d07] overflow-hidden text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col shadow-2xl z-20">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-20 bg-[#001a0e]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-30 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden shrink-0 text-white hover:bg-white/5">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 border-white/5">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="flex-1 max-w-lg hidden sm:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input 
                  placeholder="Search secure database..." 
                  className="pl-12 bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-2xl w-full text-sm text-white placeholder:text-white/30"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-2xl h-11 w-11 bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/30">
                  <Bell className="h-5 w-5 text-white" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(0,209,102,0.8)]"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 bg-[#001a0e] border-white/10 text-white">
                <DropdownMenuLabel className="p-4 bg-white/5 font-black uppercase tracking-widest text-xs">Security Notifications</DropdownMenuLabel>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                    <p className="text-sm font-black text-primary">ACTION REQUIRED</p>
                    <p className="text-xs text-white/60 mt-1">Loan LN-001 audit report requires your biometric sign-off.</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-2xl flex items-center gap-3 pr-2 pl-4 h-11 hover:bg-white/5">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black uppercase tracking-widest text-white leading-none">{role.replace('-', ' ')}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#001a0e]" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#001a0e] border-white/10 text-white">
                <DropdownMenuLabel className="font-black">ADMIN CONSOLE</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="hover:bg-white/5"><Settings className="mr-3 h-4 w-4" /> System Settings</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5"><History className="mr-3 h-4 w-4" /> Security Logs</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-400/10"><LogOut className="mr-3 h-4 w-4" /> Terminate Session</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#000d07] relative">
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="p-6 sm:p-10 lg:p-12 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}