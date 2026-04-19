"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Landmark, Building2, UserCheck, Signature, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const roles = [
    { name: "Microfinance Bank", icon: <Landmark className="w-5 h-5" />, href: "/dashboard/microfinance/loans", color: "bg-primary" },
    { name: "Head Office", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/head-office/stamp", color: "bg-primary/90" },
    { name: "DFO Officer", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/dfo-officer/verify", color: "bg-secondary" },
    { name: "DFO Signatory", icon: <Signature className="w-5 h-5" />, href: "/dashboard/dfo-signatory/approve", color: "bg-secondary/80" },
    { name: "Global Admin", icon: <Building className="w-5 h-5" />, href: "/dashboard/admin", color: "bg-slate-800" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary shadow-2xl shadow-primary/30 mb-8 transform hover:scale-105 transition-transform">
            <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">FinGuard</h1>
          <p className="text-muted-foreground mt-3 font-medium text-sm sm:text-base">Secured Loan Guarantee Ecosystem</p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50 p-6 sm:p-8">
            <CardTitle className="text-xl font-bold">Portal Entry</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Select authorized operational module to proceed</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 sm:p-8 bg-white">
            {roles.map((role) => (
              <Link key={role.name} href={role.href} className="group">
                <Button 
                  variant="outline" 
                  className="w-full h-14 sm:h-16 justify-between border-slate-100 hover:bg-accent hover:border-primary/30 hover:ring-1 hover:ring-primary/10 transition-all duration-300 rounded-2xl px-4 sm:px-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${role.color} flex items-center justify-center text-white shadow-md transform group-hover:rotate-6 transition-transform`}>
                      {role.icon}
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-primary transition-colors text-sm sm:text-base">
                      {role.name}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-2 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
            Federal Republic of Nigeria
          </p>
          <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground opacity-30">
            <span>SECURE AES-256</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>2FA ENABLED</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>AUDITED 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}