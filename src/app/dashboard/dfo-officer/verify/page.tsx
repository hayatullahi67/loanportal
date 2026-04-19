"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { UserCheck, Award, Sparkles, FileText, MapPin, Landmark, ClipboardList, Info } from "lucide-react";
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
import { generateDfoOfficerVerificationSummary } from "@/ai/flows/dfo-officer-verification-summary-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DfoOfficerVerifyPage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const navItems = [
    { label: "Verify Loans", href: "/dashboard/dfo-officer/verify", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Certificates", href: "/dashboard/dfo-officer/certificate", icon: <Award className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
    getAiSummary(loan);
  };

  const getAiSummary = async (loan: LoanApplication) => {
    setIsSummarizing(true);
    try {
      const result = await generateDfoOfficerVerificationSummary({
        bankDetails: {
          bankName: loan.bankDetails.bankName,
          state: loan.bankDetails.state,
          lga: loan.bankDetails.lga,
          applicationDate: loan.bankDetails.date
        },
        borrowerDetails: loan.borrower,
        projectDetails: loan.project,
        loanDetails: loan.loan,
        dateDetails: loan.dates
      });
      setAiSummary(result.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const confirmVerify = () => {
    if (targetLoan) {
      updateLoanStatus(targetLoan.id, 'AWAITING_SIGNATORY_APPROVAL', 'DFO Officer');
      toast({
        title: "Loan Verified",
        description: `Loan ${targetLoan.id} verified and sent for signatory approval.`,
      });
      setTargetLoan(null);
      setAiSummary(null);
    }
  };

  return (
    <DashboardLayout role="dfo-officer" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground">Field Verification</h2>
        <p className="text-muted-foreground">Detailed audit of applications already stamped by the Head Office.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Card className="border-none shadow-sm ring-1 ring-primary/5 bg-white">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase text-muted-foreground">Pending Audit</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <p className="text-2xl font-black text-primary">{loans.filter(l => l.status === 'AWAITING_DFO_VERIFICATION').length}</p>
                </CardContent>
             </Card>
             <Card className="border-none shadow-sm ring-1 ring-primary/5 bg-white">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase text-muted-foreground">Site Visits Today</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <p className="text-2xl font-black text-primary">04</p>
                </CardContent>
             </Card>
             <Card className="border-none shadow-sm ring-1 ring-primary/5 bg-white">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase text-muted-foreground">Verified (MTD)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <p className="text-2xl font-black text-primary">28</p>
                </CardContent>
             </Card>
          </div>

          <LoanTable 
            loans={loans} 
            onAction={handleAction} 
            actionLabel="Start Verification" 
            allowedStatus="AWAITING_DFO_VERIFICATION"
            role="dfo-officer"
          />
        </div>

        <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-xs font-black uppercase text-primary">Officer Protocol</AlertTitle>
            <AlertDescription className="text-xs mt-2 leading-relaxed text-foreground/70">
              Ensure physical or digital GPS verification of the farm location is performed before issuing the verification report.
            </AlertDescription>
          </Alert>

          <Card className="border-none shadow-sm ring-1 ring-primary/5 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {[
                 { label: "Identity Match", icon: <UserCheck className="w-3.5 h-3.5" /> },
                 { label: "Location GPS", icon: <MapPin className="w-3.5 h-3.5" /> },
                 { label: "Bank Reference", icon: <Landmark className="w-3.5 h-3.5" /> },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                   <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-primary">
                      {item.icon}
                   </div>
                   {item.label}
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!targetLoan} onOpenChange={() => setTargetLoan(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <FileText className="w-6 h-6 text-primary" /> Application Verification Manifest
            </AlertDialogTitle>
            <AlertDialogDescription>
              A synthesis of the application has been generated for your executive review.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Card className="bg-accent/30 border-none shadow-none mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Verification Synthesis</span>
              </div>
              {isSummarizing ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-primary/5 rounded w-full"></div>
                  <div className="h-4 bg-primary/5 rounded w-5/6"></div>
                  <div className="h-4 bg-primary/5 rounded w-4/6"></div>
                </div>
              ) : (
                <div className="text-sm prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {aiSummary || "Error generating summary."}
                </div>
              )}
            </CardContent>
          </Card>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>Mark as Incomplete</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVerify} className="font-bold px-6">Approve & Forward to Signatory</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
