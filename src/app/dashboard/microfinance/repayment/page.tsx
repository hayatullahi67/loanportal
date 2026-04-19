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
        <h2 className="text-3xl font-black text-foreground">Repayment Tracking</h2>
        <p className="text-muted-foreground">Monitor and update loan repayment statuses for disbursed funds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-xl shadow-sm border flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Total Collected</p>
            <p className="text-2xl font-black">₦3,450,000</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Expected (Month)</p>
            <p className="text-2xl font-black">₦1,200,000</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">Overdue</p>
            <p className="text-2xl font-black">₦450,000</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Disbursed Loans Registry
        </h3>
        <LoanTable 
          loans={disburnedLoans} 
          onAction={handleAction} 
          actionLabel="Add Payment" 
          allowedStatus="DISBURSED"
          role="microfinance"
        />
      </div>

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Post Monthly Payment</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="text-xs font-bold text-muted-foreground uppercase">Borrower</p>
              <p className="font-bold">{selectedLoan?.borrower.name}</p>
              <p className="text-xs text-muted-foreground">{selectedLoan?.id} • {selectedLoan?.loan.loanAccount}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₦)</Label>
              <Input 
                id="amount" 
                type="number" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="text-lg font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Paid To Date</Label>
                <p className="font-bold text-sm">₦{(selectedLoan?.repayments.reduce((a,c) => a+c.amount, 0) || 0).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-xs">Interest Rebate Earned</Label>
                <p className="font-bold text-sm text-secondary">₦{(selectedLoan?.loan.amount ? (selectedLoan.loan.amount * (selectedLoan.loan.interestRate/100) * 0.4) : 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLoan(null)}>Cancel</Button>
            <Button onClick={submitPayment} className="font-bold px-8">Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}