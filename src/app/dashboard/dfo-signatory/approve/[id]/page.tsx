"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useLoans } from "@/lib/store";
import { LoanApplication } from "@/types/loan";
import { 
  Signature, 
  ShieldCheck, 
  ChevronLeft,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AuthorizeLoanPage() {
  const { id } = useParams();
  const router = useRouter();
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [loan, setLoan] = useState<LoanApplication | null>(null);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (id) {
      const found = loans.find(l => l.id === id);
      if (found) setLoan(found);
    }
  }, [id, loans]);

  const navItems = [
    { label: "Executive Approval", href: "/dashboard/dfo-signatory/approve", icon: <Signature className="w-4 h-4" /> },
  ];

  const confirmApprove = () => {
    if (loan && signed) {
      updateLoanStatus(loan.id, 'APPROVED', 'DFO Signatory');
      toast({
        title: "Authorization Executed",
        description: `Loan ${loan.id} has been cryptographically signed and approved.`,
      });
      router.push('/dashboard/dfo-signatory/approve');
    }
  };

  if (!loan) {
    return (
      <DashboardLayout role="dfo-signatory" navItems={navItems}>
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <Info className="w-12 h-12 mb-4 opacity-20" />
          <p className="italic font-medium text-lg tracking-tight">Application record not found in the sovereign registry.</p>
          <Button variant="ghost" onClick={() => router.back()} className="mt-6 text-primary hover:bg-white/5 uppercase font-black text-[10px] tracking-widest">
            <ChevronLeft className="w-4 h-4 mr-2" /> Return to Manifest
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="dfo-signatory" navItems={navItems}>
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
           <Button 
             variant="ghost" 
             onClick={() => router.push('/dashboard/dfo-signatory/approve')} 
             className="text-white/40 hover:text-white p-0 h-auto mb-4"
           >
             <ChevronLeft className="w-4 h-4 mr-1" />
             <span className="text-[10px] font-black uppercase tracking-widest">Back to Manifest</span>
           </Button>
           <h2 className="text-3xl font-black text-white uppercase tracking-tight">Executive Authorization</h2>
           <p className="text-white/40 text-sm font-medium mt-1">Instrument ID: <span className="text-primary font-mono">{loan.id}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
           
           {/* Detailed Summary Card */}
           <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Application Essence
                 </h4>
                 
                 <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Beneficiary Identity</p>
                          <p className="text-lg font-black text-white">{loan.borrower.name}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Exposure Amount</p>
                          <p className="text-2xl font-black text-primary">₦{loan.loan.amount.toLocaleString()}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Source Institution</p>
                          <p className="text-sm font-bold text-white/80">{loan.bankDetails.bankName}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Project Type</p>
                          <p className="text-sm font-bold text-white/80 uppercase">{loan.project.loanType}</p>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-4">
                       <div className="flex items-center gap-2 text-primary">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Verification Status</span>
                       </div>
                       <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                          <p className="text-xs font-medium text-white/80 leading-relaxed italic">
                            &ldquo;Verified and forward for executive approval. All field checks completed by DFO Investigation Unit.&rdquo;
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Authorization Control Card */}
           <div className="space-y-6">
              <div className="bg-[#001a0e] border border-primary/20 rounded-[2rem] p-8 shadow-[0_0_80px_rgba(0,209,102,0.1)]">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">Authorization Protocol</h4>
                 
                 <div className="py-12 rounded-[1.5rem] bg-black/40 border border-white/10 flex flex-col items-center justify-center space-y-8 relative overflow-hidden group mb-8">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="h-24 w-full flex items-center justify-center relative z-10 text-center px-6">
                       {signed ? (
                         <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                            <span className="text-primary text-5xl font-['Dancing_Script',cursive] font-black italic -rotate-2 select-none drop-shadow-[0_0_20px_rgba(0,209,102,0.5)]">
                              Signed Digitally
                            </span>
                            <span className="text-[9px] mt-4 font-sans font-black text-white/40 uppercase tracking-[0.4em]">EXECUTIVE-ID: SEC-SIGN-PROT-99</span>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center opacity-20">
                            <Signature className="w-16 h-16 mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.3em]">Signature Pending</span>
                         </div>
                       )}
                    </div>

                    <div className="flex items-start space-x-4 px-8 text-left relative z-10">
                      <Checkbox 
                        id="terms" 
                        checked={signed} 
                        onCheckedChange={(val) => setSigned(!!val)} 
                        className="h-6 w-6 mt-1 rounded-lg border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-[#001a0e]" 
                      />
                      <Label htmlFor="terms" className="text-[11px] font-bold leading-relaxed cursor-pointer text-white/60 select-none hover:text-white transition-colors">
                        I, the undersigned Signatory, hereby exercise my delegated authority to approve this financial guarantee in accordance with the National Risk Guidelines and the Verification Report.
                      </Label>
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <Button 
                      onClick={confirmApprove} 
                      disabled={!signed} 
                      className="w-full bg-primary text-[#001a0e] hover:bg-primary/90 border-none rounded-2xl h-16 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 disabled:opacity-30 transition-all active:scale-95"
                    >
                      Authorize & Update Ledger
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => router.back()}
                      className="w-full text-white/40 hover:text-white h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    >
                      Decline Authorization
                    </Button>
                 </div>
              </div>

              {/* Informational Mandate */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                 <p className="text-[10px] text-white/40 leading-relaxed italic text-center font-medium">
                   This action is cryptographically recorded and serves as an immutable instrument of financial guarantee. Tampering with this protocol is a national regulatory offense.
                 </p>
              </div>
           </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
