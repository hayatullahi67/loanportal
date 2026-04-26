"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { BadgeCheck, Banknote, AlertCircle, Sparkles, Zap, ClipboardList, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoanApplication } from "@/types/loan";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { headOfficeLoanSummary } from "@/ai/flows/head-office-loan-summary-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HeadOfficeStampPage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const navItems = [
    { label: "Pending Stamp", href: "/dashboard/head-office/stamp", icon: <BadgeCheck className="w-4 h-4" /> },
    { label: "Pending Disbursement", href: "/dashboard/head-office/disburse", icon: <Banknote className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
    generateSummary(loan);
  };

  const generateSummary = async (loan: LoanApplication) => {
    setIsSummarizing(true);
    try {
      const summary = await headOfficeLoanSummary({
        bankDetails: loan.bankDetails,
        borrower: loan.borrower,
        project: loan.project,
        loan: loan.loan,
        dates: loan.dates
      });
      setAiSummary(summary);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const confirmStamp = () => {
    if (targetLoan) {
      updateLoanStatus(targetLoan.id, 'AWAITING_DFO_VERIFICATION', 'Head Office Admin');
      toast({
        title: "Loan Stamped",
        description: `Loan ${targetLoan.id} is now awaiting DFO verification.`,
      });
      setTargetLoan(null);
      setAiSummary(null);
    }
  };

  const pendingCount = loans.filter(l => l.status === 'PENDING_HEAD_OFFICE_STAMP').length;

  return (
    <DashboardLayout role="head-office" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground">Processing Center</h2>
      </div>

      <div className=" gap-8">
        <div className=" space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
             <Card className="flex-1 border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">In-Queue Manifest</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-3xl font-black text-white">{pendingCount}</p>
                  <Zap className="w-8 h-8 text-amber-400 opacity-30" />
                </CardContent>
             </Card>
             <Card className="flex-1 border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">Avg. T-Time</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-3xl font-black text-white">1.4h</p>
                  <ClipboardList className="w-8 h-8 text-blue-400 opacity-30" />
                </CardContent>
             </Card>
          </div>

          <LoanTable 
            loans={loans} 
            onAction={handleAction} 
            actionLabel="Review & Stamp" 
            allowedStatus="PENDING_HEAD_OFFICE_STAMP"
            role="head-office"
          />
        </div>

        {/* <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-xs font-black uppercase text-primary">Quality Control</AlertTitle>
            <AlertDescription className="text-xs mt-2 leading-relaxed text-foreground/70">
              Before stamping, cross-reference the borrower's BVN with the national database to ensure eligibility for the Agri-Guarantee scheme.
            </AlertDescription>
          </Alert>

          <Card className="border-none shadow-sm ring-1 ring-primary/5 bg-white">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Processing Protocols</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3 text-muted-foreground">
              <p>• Verify institutional bank validity.</p>
              <p>• Review project location coordinates.</p>
              <p>• Assess loan purpose vs scheme mandates.</p>
              <p>• Confirm repayment tenor compliance (Max 36m).</p>
            </CardContent>
          </Card>
        </div> */}
      </div>

      <AlertDialog open={!!targetLoan} onOpenChange={() => { setTargetLoan(null); setAiSummary(null); }}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <BadgeCheck className="w-6 h-6 text-primary" /> Review & Confirm Stamping
            </AlertDialogTitle>
            <AlertDialogDescription>
              Perform final review of the digital dossier. AI summary provides a rapid overview of key metrics.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-4">
            <Card className="bg-primary/5 border-primary/20 shadow-none border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Quick Manifest</span>
                </div>
                {isSummarizing ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                    <div className="h-4 bg-primary/10 rounded w-full"></div>
                    <div className="h-4 bg-primary/10 rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="text-sm prose prose-sm max-w-none prose-p:leading-relaxed text-foreground/80">
                    {aiSummary ? (
                      <div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br/>') }} />
                    ) : (
                      "Failed to generate AI summary. Please review manual details below."
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-accent/30 p-4 rounded-lg flex items-start gap-3 border border-border/50">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Administrative Mandate</p>
                <p className="text-muted-foreground">Stamping this loan moves it to the DFO Verification stage. Ensure all bank requirements are met.</p>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel Review</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStamp} className="font-bold px-8">Confirm & Apply Stamp</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
