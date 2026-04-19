"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useLoans } from "@/lib/store";
import { LayoutDashboard, FilePlus, CreditCard, Banknote, History, Wallet } from "lucide-react";
import { LoanTable } from "@/components/shared/LoanTable";
import { LoanApplication } from "@/types/loan";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function MicrofinanceRepaymentPage() {
  const { loans, addRepayment } = useLoans();
  const { toast } = useToast();
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  const navItems = [
    { label: "Dashboard", href: "/dashboard/microfinance/loans", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "New Application", href: "/dashboard/microfinance/apply", icon: <FilePlus className="w-4 h-4" /> },
    { label: "Repayments", href: "/dashboard/microfinance/repayment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setPaymentAmount((loan.loan.amount / 12).toFixed(2)); // Default to monthly estimate
  };

  const submitPayment = () => {
    if (selectedLoan && paymentAmount) {
      addRepayment(selectedLoan.id, parseFloat(paymentAmount));
      toast({
        title: "Payment Recorded",
        description: `₦${parseFloat(paymentAmount).toLocaleString()} payment added to ${selectedLoan.id}`,
      });
      setSelectedLoan(null);
      setPaymentAmount("");
    }
  };

  const disbursedLoans = loans.filter(l => l.status === 'DISBURSED');

  return (
    <DashboardLayout role="microfinance" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Repayment Management</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Audit and record recovery performance for active facilities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Aggregate Recovery</p>
              <p className="text-xl sm:text-2xl font-black text-foreground">₦3,450,000</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Proj. (Month)</p>
              <p className="text-xl sm:text-2xl font-black text-foreground">₦1,200,000</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-primary/5 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Delinquent Volume</p>
              <p className="text-xl sm:text-2xl font-black text-foreground">₦450,000</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold tracking-tight">Active Disbursement Registry</h3>
        </div>
        <LoanTable 
          loans={disbursedLoans} 
          onAction={handleAction} 
          actionLabel="Post Payment" 
          allowedStatus="DISBURSED"
          role="microfinance"
        />
      </div>

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="w-[95vw] sm:max-w-md p-0 border-none shadow-2xl overflow-hidden">
          <DialogHeader className="p-6 bg-primary text-primary-foreground">
            <DialogTitle className="text-xl font-black uppercase tracking-widest">Post Amortization</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-6">
            <div className="p-4 bg-accent/40 rounded-xl border border-primary/5">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Verified Borrower</p>
              <p className="font-black text-foreground">{selectedLoan?.borrower.name}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-mono">
                 <span>{selectedLoan?.id}</span>
                 <span className="opacity-30">|</span>
                 <span>{selectedLoan?.loan.loanAccount}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-widest opacity-70">Payment Tranche (₦)</Label>
              <Input 
                id="amount" 
                type="number" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="h-14 text-2xl font-black text-primary border-primary/20 bg-primary/5 focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
              <div>
                <Label className="text-[9px] font-bold uppercase opacity-50 block mb-1">Cumulative Paid</Label>
                <p className="font-bold text-sm">₦{(selectedLoan?.repayments.reduce((a,c) => a+c.amount, 0) || 0).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-[9px] font-bold uppercase opacity-50 block mb-1">Earned Rebate</Label>
                <p className="font-bold text-sm text-secondary">₦{(selectedLoan?.loan.amount ? (selectedLoan.loan.amount * (selectedLoan.loan.interestRate/100) * 0.4) : 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-accent/20 border-t">
            <Button variant="outline" onClick={() => setSelectedLoan(null)} className="font-bold text-xs uppercase tracking-widest">Cancel</Button>
            <Button onClick={submitPayment} className="font-black px-8 text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Authorize Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}