"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { 
  UserCheck, 
  Award, 
  FileBadge, 
  ShieldCheck, 
  ArrowUpRight, 
  Download, 
  Printer, 
  X,
  CreditCard,
  Calendar,
  Building2,
  BadgeCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoanApplication } from "@/types/loan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

export default function DfoOfficerCertificatePage() {
  const router = useRouter();
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);

  const navItems = [
    { label: "Verify Loans", href: "/dashboard/dfo-officer/verify", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Certificates", href: "/dashboard/dfo-officer/certificate", icon: <Award className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    if (loan.status === 'CERTIFICATE_GENERATED') {
      router.push(`/dashboard/dfo-officer/certificate/${loan.id}`);
    } else {
      setTargetLoan(loan);
    }
  };

  const confirmGenerate = () => {
    if (targetLoan) {
      updateLoanStatus(targetLoan.id, 'CERTIFICATE_GENERATED', 'DFO Officer');
      toast({
        title: "Certificate Generated",
        description: `Certificate for Loan ${targetLoan.id} has been securely issued.`,
      });
      router.push(`/dashboard/dfo-officer/certificate/${targetLoan.id}`);
      setTargetLoan(null);
    }
  };

  return (
    <DashboardLayout role="dfo-officer" navItems={navItems}>
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <LoanTable 
          loans={loans} 
          onAction={handleAction} 
          onPreview={(loan) => router.push(`/dashboard/dfo-officer/certificate/${loan.id}`)}
          actionLabel="Generate Certificate" 
          allowedStatus={['APPROVED', 'CERTIFICATE_GENERATED']}
          role="dfo-officer"
        />
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!targetLoan} onOpenChange={() => setTargetLoan(null)}>
        <AlertDialogContent className="bg-[#001a0e] border-white/10 rounded-3xl p-8 max-w-md">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center mx-auto">
               <FileBadge className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
               <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Issue Guarantee?</AlertDialogTitle>
               <AlertDialogDescription className="text-white/60 text-sm font-medium">
                 You are about to issue a formal guarantee instrument for <span className="text-white font-bold">{targetLoan?.id}</span>. This action is cryptographically recorded.
               </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex gap-3">
            <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]">Decline</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGenerate} className="flex-1 bg-primary text-[#001a0e] hover:bg-primary/90 border-none rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]">Execute & Issue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
