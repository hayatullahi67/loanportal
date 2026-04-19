"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Landmark, Building2, UserCheck, Signature, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const roles = [
    { name: "Microfinance Bank", icon: <Landmark className="w-5 h-5" />, href: "/dashboard/microfinance/loans", color: "bg-blue-500" },
    { name: "Head Office", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/head-office/stamp", color: "bg-purple-500" },
    { name: "DFO Officer", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/dfo-officer/verify", color: "bg-teal-500" },
    { name: "DFO Signatory", icon: <Signature className="w-5 h-5" />, href: "/dashboard/dfo-signatory/approve", color: "bg-amber-500" },
    { name: "Admin", icon: <Building className="w-5 h-5" />, href: "/dashboard/admin", color: "bg-slate-700" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary shadow-xl shadow-primary/20 mb-6">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">FinGuard Portal</h1>
          <p className="text-muted-foreground mt-2">Secure Loan Guarantee Management System</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Quick Access (Demo)</CardTitle>
            <CardDescription>Select a role to enter the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {roles.map((role) => (
              <Link key={role.name} href={role.href} className="group">
                <Button 
                  variant="outline" 
                  className="w-full h-14 justify-between hover:bg-accent hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg ${role.color} flex items-center justify-center text-white shadow-sm`}>
                      {role.icon}
                    </div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {role.name}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground opacity-50">
          © 2024 FinGuard Systems • Federal Republic of Nigeria
        </p>
      </div>
    </div>
  );
}
