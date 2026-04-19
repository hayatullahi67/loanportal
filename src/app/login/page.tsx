"use client";

import React from "react";
import Link from "next/link";
import { Fingerprint, ArrowRight, Landmark, Building2, UserCheck, Signature, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const roles = [
    { name: "Microfinance Bank", icon: <Landmark className="w-5 h-5" />, href: "/dashboard/microfinance/loans", color: "bg-primary" },
    { name: "Head Office", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/head-office/stamp", color: "bg-primary/90" },
    { name: "DFO Officer", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/dfo-officer/verify", color: "bg-primary/80" },
    { name: "DFO Signatory", icon: <Signature className="w-5 h-5" />, href: "/dashboard/dfo-signatory/approve", color: "bg-primary/70" },
    { name: "Global Admin", icon: <Building className="w-5 h-5" />, href: "/dashboard/admin", color: "bg-white/10" },
  ];

  return (
    <div className="min-h-screen bg-[#000d07] bg-gradient-to-br from-[#001a0e] via-[#000d07] to-black flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-[2.5rem] bg-primary shadow-[0_0_40px_rgba(0,209,102,0.3)] mb-8 transform hover:scale-105 transition-transform">
            <Fingerprint className="w-12 h-12 sm:w-14 sm:h-14 text-[#001a0e]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">FinGuard</h1>
          <p className="text-primary/80 mt-3 font-bold text-sm sm:text-base uppercase tracking-widest">Powered by WePay Infrastructure</p>
        </div>

        <Card className="border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 p-6 sm:p-8">
            <CardTitle className="text-2xl font-black text-white">Portal Entry</CardTitle>
            <CardDescription className="text-white/60 text-sm">Select your operational module to proceed</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:p-8">
            {roles.map((role) => (
              <Link key={role.name} href={role.href} className="group">
                <Button 
                  variant="outline" 
                  className="w-full h-16 sm:h-20 justify-between border-white/10 bg-white/5 hover:bg-primary hover:border-primary transition-all duration-300 rounded-3xl px-6"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${role.color} flex items-center justify-center text-[#001a0e] shadow-lg transform group-hover:scale-110 transition-transform`}>
                      {role.icon}
                    </div>
                    <span className="font-black text-white group-hover:text-[#001a0e] transition-colors text-base sm:text-lg">
                      {role.name}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#001a0e] shrink-0" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Africa's Identity-First Infrastructure
          </p>
          <div className="flex items-center gap-4 text-[9px] font-bold text-white/20">
            <span>BIOMETRIC SECURE</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>AES-256</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>ISO 27001</span>
          </div>
        </div>
      </div>
    </div>
  );
}