"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  CreditCard, 
  CheckCircle, 
  ShieldCheck, 
  Award, 
  Banknote,
  LogOut,
  Bell,
  Search,
  User,
  Settings,
  History
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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">FinGuard</span>
          </Link>
          <div className="mt-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
              {role.replace('-', ' ')} PORTAL
            </Badge>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-primary"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t mt-auto">
          <Link href="/login">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search loans, borrowers, accounts..." 
                className="pl-10 bg-background/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-[10px] font-bold text-white rounded-full flex items-center justify-center">2</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <DropdownMenuLabel className="p-4 bg-accent/50">Notifications</DropdownMenuLabel>
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-4 border-b hover:bg-accent cursor-pointer transition-colors">
                    <p className="text-sm font-semibold">Action Required</p>
                    <p className="text-xs text-muted-foreground mt-1">Loan LN-001 is waiting for your verification.</p>
                  </div>
                  <div className="p-4 border-b hover:bg-accent cursor-pointer transition-colors">
                    <p className="text-sm font-semibold">Loan Approved</p>
                    <p className="text-xs text-muted-foreground mt-1">Sarah Williams' application (LN-002) has been approved.</p>
                  </div>
                </div>
                <div className="p-2 text-center border-t">
                  <Button variant="link" size="sm" className="text-xs">View all notifications</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full flex items-center gap-3 pr-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold leading-none capitalize">{role.replace('-', ' ')}</p>
                    <p className="text-[10px] text-muted-foreground">Admin User</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem><History className="mr-2 h-4 w-4" /> Activity Log</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}