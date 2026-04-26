"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useLoans } from "@/lib/store";
import { LoanApplication } from "@/types/loan";
import { GuaranteeCertificate } from "@/components/shared/GuaranteeCertificate";
import { HARDCODED_DISBURSEMENT_LOANS } from "@/lib/hardcoded-disbursement-loans";
import { 
  UserCheck, 
  Award, 
  Printer, 
  Download, 
  ArrowLeft,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CertificateDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { loans } = useLoans();
  const [loan, setLoan] = useState<LoanApplication | null>(null);

  useEffect(() => {
    if (id) {
      const found = loans.find(l => l.id === id) || HARDCODED_DISBURSEMENT_LOANS.find((loan) => loan.id === id);
      if (found) setLoan(found);
    }
  }, [id, loans]);

  const navItems = [
    { label: "Verify Loans", href: "/dashboard/dfo-officer/verify", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Certificates", href: "/dashboard/dfo-officer/certificate", icon: <Award className="w-4 h-4" /> },
  ];

  if (!loan) {
    return (
      <DashboardLayout role="dfo-officer" navItems={navItems}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-white/40 italic">Record not found in the manifest.</p>
          <Button variant="ghost" onClick={() => router.back()} className="mt-4 text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Manifest
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="dfo-officer" navItems={navItems}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl shrink-0">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Manifest
          </Button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              className="flex-1 bg-primary text-[#001a0e] rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] hover:bg-primary/90"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" /> Print Official Copy
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border-white/10 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" /> Save as PDF
            </Button>
          </div>
        </div>

        {/* Certificate Rendering Area */}
        <div className="certificate-container pb-20">
          <GuaranteeCertificate loan={loan} />
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          .certificate-container, .certificate-container * { visibility: visible !important; }
          .certificate-container { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, footer, .shrink-0 { display: none !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}
