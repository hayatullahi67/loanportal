"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ChevronRight } from "lucide-react";
import { LoanApplication, STATUS_LABELS, LoanStatus } from "@/types/loan";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LoanTableProps {
  loans: LoanApplication[];
  onAction?: (loan: LoanApplication) => void;
  actionLabel?: string;
  allowedStatus?: LoanStatus;
  role: string;
}

export function LoanTable({ loans, onAction, actionLabel, allowedStatus, role }: LoanTableProps) {
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusVariant = (status: LoanStatus) => {
    switch (status) {
      case 'APPROVED':
      case 'DISBURSED':
      case 'CERTIFICATE_GENERATED':
        return 'default';
      case 'AWAITING_DFO_VERIFICATION':
      case 'AWAITING_SIGNATORY_APPROVAL':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden w-full">
      <div className="overflow-x-auto w-full scrollbar-thin">
        <Table className="min-w-[700px] w-full">
          <TableHeader>
            <TableRow className="bg-accent/50 hover:bg-accent/50">
              <TableHead className="font-bold py-4">Loan ID</TableHead>
              <TableHead className="font-bold py-4">Borrower</TableHead>
              <TableHead className="hidden md:table-cell font-bold py-4">BVN</TableHead>
              <TableHead className="font-bold py-4">Amount</TableHead>
              <TableHead className="font-bold py-4">Status</TableHead>
              <TableHead className="font-bold text-right py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                  No applications found in this category.
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow key={loan.id} className="cursor-default hover:bg-accent/20 transition-colors">
                  <TableCell className="font-mono font-bold text-primary">{loan.id}</TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="font-medium truncate">{loan.borrower.name}</div>
                    <div className="text-[10px] text-muted-foreground md:hidden">{loan.borrower.bvn}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-muted-foreground">{loan.borrower.bvn}</TableCell>
                  <TableCell className="font-bold whitespace-nowrap">{formatCurrency(loan.loan.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(loan.status)} className="whitespace-nowrap text-[10px] lg:text-xs px-2 py-0.5">
                      {STATUS_LABELS[loan.status].split(' ').slice(1).join(' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLoan(loan)} className="h-8 lg:h-9 text-xs">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden sm:inline">Details</span>
                      </Button>
                      {onAction && (
                        <Button 
                          size="sm"
                          disabled={loan.status !== allowedStatus}
                          onClick={() => onAction(loan)}
                          className="h-8 lg:h-9 text-xs font-bold"
                        >
                          {actionLabel}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
          <DialogHeader className="p-6 bg-primary text-primary-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <DialogTitle className="text-xl sm:text-2xl font-black">
                Application <span className="opacity-70">#</span>{selectedLoan?.id}
              </DialogTitle>
              {selectedLoan && (
                <Badge variant="outline" className="w-fit border-white/30 text-white bg-white/10 px-3 py-1">
                  {STATUS_LABELS[selectedLoan.status]}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Borrower Identity</h4>
                  <div className="space-y-2">
                    <p className="text-base font-bold text-foreground">{selectedLoan?.borrower.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                         <p className="font-bold text-[9px] uppercase opacity-50">Phone</p>
                         <p className="text-foreground">{selectedLoan?.borrower.phone}</p>
                      </div>
                      <div>
                         <p className="font-bold text-[9px] uppercase opacity-50">BVN</p>
                         <p className="text-foreground font-mono">{selectedLoan?.borrower.bvn}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-[9px] uppercase opacity-50">Address</p>
                      <p className="text-foreground leading-relaxed">{selectedLoan?.borrower.address}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="opacity-50" />
                
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Project Scope</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-bold">{selectedLoan?.project.loanType} Production</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        Location: {selectedLoan?.project.location}
                      </p>
                      <p className="flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        <span>Purpose: {selectedLoan?.project.purpose}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="bg-accent/30 p-4 rounded-xl border border-primary/10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Financial Structure</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-primary/5 pb-2">
                      <span className="text-xs text-muted-foreground">Principal Amount</span>
                      <span className="text-xl font-black text-primary">{selectedLoan && formatCurrency(selectedLoan.loan.amount)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Interest Rate</p>
                        <p className="text-sm font-bold">{selectedLoan?.loan.interestRate}% P.A.</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Repayment Tenor</p>
                        <p className="text-sm font-bold">{selectedLoan?.loan.tenor}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-4 border-t border-primary/10 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-secondary uppercase">Guaranteed Rebate (40%)</span>
                      <span className="text-sm font-black text-secondary">
                        {selectedLoan && formatCurrency(selectedLoan.loan.amount * (selectedLoan.loan.interestRate / 100) * 0.4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Audit Timeline</h4>
                  <div className="space-y-4 border-l-2 border-primary/10 ml-2 pl-4">
                    {selectedLoan?.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white shadow-sm" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-foreground">{STATUS_LABELS[event.status].split(' ').slice(1).join(' ')}</p>
                          <p className="text-[10px] text-muted-foreground">{event.timestamp} • {event.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>

          <DialogFooter className="p-4 sm:p-6 border-t bg-accent/20">
            <Button variant="outline" onClick={() => setSelectedLoan(null)} className="w-full sm:w-auto font-bold">
              Dismiss Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}