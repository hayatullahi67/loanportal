"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  Landmark,
  Building2,
  UserCheck,
  Signature,
  Building,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authenticatePortalUser } from "@/lib/admin-store";
import { GLOBAL_ADMIN_ACCOUNT } from "@/lib/admin-data";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("/dashboard/microfinance/loans");

  const roles = [
    { name: "Microfinance Bank", icon: <Landmark className="w-5 h-5" />, href: "/dashboard/microfinance/loans", color: "bg-primary" },
    { name: "Head Office", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/head-office/stamp", color: "bg-primary/90" },
    { name: "DFO Officer", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/dfo-officer/verify", color: "bg-primary/80" },
    { name: "DFO Signatory", icon: <Signature className="w-5 h-5" />, href: "/dashboard/dfo-signatory/approve", color: "bg-primary/70" },
    { name: "Global Admin", icon: <Building className="w-5 h-5" />, href: "/dashboard/admin", color: "bg-white/10" },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = authenticatePortalUser(email, password);

    if (!result.ok) {
      toast({
        title: "Access denied",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Access granted",
      description: `Routing ${result.user.fullName} to the assigned workspace.`,
    });

    router.push(result.user.route);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#000d07] bg-gradient-to-br from-[#001a0e] via-[#000d07] to-black p-4 sm:p-6">
      <div className="pointer-events-none absolute right-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md animate-in space-y-8 fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary shadow-[0_0_40px_rgba(0,209,102,0.3)] transition-transform hover:scale-105 sm:h-24 sm:w-24">
            <ShieldCheck className="h-12 w-12 text-[#001a0e] sm:h-14 sm:w-14" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">FinGuard</h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-widest text-primary/80 sm:text-base">
            Secure Loan Guarantee Access
          </p>
        </div>

        <Card className="overflow-hidden rounded-[2.5rem] border-white/5 bg-white/5 shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-white/5 p-6 sm:p-8">
            <CardTitle className="text-2xl font-black text-white">Sign In</CardTitle>
            <CardDescription className="text-sm text-white/60">
              Use the admin account or any user created from the admin user management page.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@company.com"
                    className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/30 focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                    Password
                  </Label>
                  <span className="text-[11px] font-bold text-primary/80">Protected session</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/30 focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-primary/10 bg-primary/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Admin bootstrap account</p>
                <p className="mt-3 text-sm font-semibold text-white">{GLOBAL_ADMIN_ACCOUNT.email}</p>
                <p className="mt-1 text-xs text-white/55">{GLOBAL_ADMIN_ACCOUNT.password}</p>
              </div>

              <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">Workspace Directory</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {roles.map((role) => {
                    const isActive = selectedRole === role.href;

                    return (
                      <button
                        key={role.name}
                        type="button"
                        onClick={() => setSelectedRole(role.href)}
                        className={`group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold transition-all ${
                          isActive
                            ? "border-primary bg-primary text-[#001a0e]"
                            : "border-white/10 bg-white/5 text-white/70 hover:border-primary/40 hover:text-white"
                        }`}
                      >
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${isActive ? "bg-[#001a0e]/10 text-[#001a0e]" : `${role.color} text-[#001a0e]`}`}>
                          {role.icon}
                        </span>
                        <span className="whitespace-nowrap">{role.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-primary font-black text-[#001a0e] shadow-[0_16px_30px_rgba(0,209,102,0.2)] transition-all hover:bg-primary/90"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-3 text-[11px] text-white/40">
              <span>Created users sign in here too</span>
              <Link href={selectedRole} className="font-bold text-primary/80 transition-colors hover:text-primary">
                Preview selected workspace
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Africa's Identity-First Infrastructure
          </p>
          <div className="flex items-center gap-4 text-[9px] font-bold text-white/20">
            <span>BIOMETRIC SECURE</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>AES-256</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>ISO 27001</span>
          </div>
        </div>
      </div>
    </div>
  );
}
