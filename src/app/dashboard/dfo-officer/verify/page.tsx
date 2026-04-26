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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function DfoOfficerVerifyPage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");

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
      closeModal();
    }
  };

  const confirmReject = () => {
    if (targetLoan && rejectionNote.trim()) {
      updateLoanStatus(targetLoan.id, 'REJECTED', 'DFO Officer', rejectionNote);
      toast({
        title: "Loan Rejected",
        description: `Loan ${targetLoan.id} has been rejected with a note.`,
        variant: "destructive",
      });
      closeModal();
    } else {
      toast({
        title: "Note Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
    }
  };

  const closeModal = () => {
    setTargetLoan(null);
    setAiSummary(null);
    setRejectionNote("");
  };

  return (
    <DashboardLayout role="dfo-officer" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground">Field Verification</h2>
        <p className="text-muted-foreground">Detailed audit of applications already stamped by the Head Office.</p>
      </div>

      <div className=" gap-8">
        <div className=" space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase text-white/40 tracking-widest">Pending Audit</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <p className="text-3xl font-black text-primary">{loans.filter(l => l.status === 'AWAITING_DFO_VERIFICATION').length}</p>
                </CardContent>
             </Card>
             <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase text-white/40 tracking-widest">Rejected Apps</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <p className="text-3xl font-black text-red-500">{loans.filter(l => l.status === 'REJECTED').length}</p>
                </CardContent>
             </Card>
             <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-[10px] font-black uppercase text-white/40 tracking-widest">Verified (MTD)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <p className="text-3xl font-black text-primary">28</p>
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

       
      </div>

      <AlertDialog open={!!targetLoan} onOpenChange={closeModal}>
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

          <div className="mt-8 space-y-4">
             <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-500">Rejection Protocol</span>
             </div>
             <Textarea 
                placeholder="Specify the reason for rejection (e.g., physical location mismatch, documentation discrepancy)..."
                className="bg-white/5 border-white/10 text-sm min-h-[100px] rounded-2xl p-4 focus:ring-red-500/20 focus:border-red-500/50"
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
             />
          </div>

          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <Button variant="ghost" onClick={closeModal} className="font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/5 rounded-xl">
              Dismiss
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                variant="destructive" 
                onClick={confirmReject}
                className="font-black uppercase tracking-widest text-[10px] px-6 h-11 rounded-xl shadow-lg shadow-red-500/10"
              >
                Reject Application
              </Button>
              <AlertDialogAction 
                onClick={confirmVerify} 
                className="bg-primary text-[#001a0e] hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] px-8 h-11 rounded-xl shadow-lg shadow-primary/10 m-0"
              >
                Approve & Forward
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
