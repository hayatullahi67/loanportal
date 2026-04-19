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
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader>
            <TableRow className="bg-accent/50">
              <TableHead className="font-bold">Loan ID</TableHead>
              <TableHead className="font-bold">Borrower</TableHead>
              <TableHead className="hidden md:table-cell font-bold">BVN</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow key={loan.id} className="cursor-pointer hover:bg-accent/20">
                  <TableCell className="font-mono font-bold text-primary">{loan.id}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{loan.borrower.name}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-muted-foreground">{loan.borrower.bvn}</TableCell>
                  <TableCell className="font-bold whitespace-nowrap">{formatCurrency(loan.loan.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(loan.status)} className="whitespace-nowrap text-[10px] lg:text-xs">
                      {STATUS_LABELS[loan.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedLoan(loan)} className="h-8 w-8 p-0 lg:w-auto lg:px-3 lg:py-1">
                      <Eye className="h-4 w-4 lg:mr-2" />
                      <span className="hidden lg:inline">Details</span>
                    </Button>
                    {onAction && (
                      <Button 
                        size="sm"
                        disabled={loan.status !== allowedStatus}
                        onClick={() => onAction(loan)}
                        className="h-8 text-[10px] lg:text-xs"
                      >
                        {actionLabel}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-[95vw] lg:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-2 lg:pr-8">
              <DialogTitle className="text-xl lg:text-2xl font-bold flex items-center gap-2">
                Loan: <span className="text-primary">{selectedLoan?.id}</span>
              </DialogTitle>
              {selectedLoan && (
                <Badge variant={getStatusVariant(selectedLoan.status)} className="w-fit">
                  {STATUS_LABELS[selectedLoan.status]}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedLoan && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <section className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Borrower Information</h4>
                  <p className="text-sm font-semibold">{selectedLoan.borrower.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLoan.borrower.phone}</p>
                  <p className="text-sm text-muted-foreground">BVN: {selectedLoan.borrower.bvn}</p>
                  <p className="text-sm text-muted-foreground">{selectedLoan.borrower.address}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Project Details</h4>
                  <p className="text-sm font-semibold">{selectedLoan.project.loanType} Project</p>
                  <p className="text-sm text-muted-foreground">{selectedLoan.project.location}</p>
                  <p className="text-sm text-muted-foreground">Purpose: {selectedLoan.project.purpose}</p>
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Financial Overview</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">Loan Amount:</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(selectedLoan.loan.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="text-sm font-semibold">{selectedLoan.loan.interestRate}%</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 p-3 bg-accent/50 rounded-lg">
                    <span className="text-xs font-bold text-muted-foreground">Estimated Rebate (40%):</span>
                    <span className="text-sm font-bold text-secondary">
                      {formatCurrency(selectedLoan.loan.amount * (selectedLoan.loan.interestRate / 100) * 0.4)}
                    </span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Timeline</h4>
                  <div className="space-y-3 mt-2">
                    {selectedLoan.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-2 text-[10px] lg:text-xs">
                        <div className="w-0.5 h-auto bg-primary/20 rounded-full shrink-0" />
                        <div>
                          <p className="font-bold text-foreground">{STATUS_LABELS[event.status]}</p>
                          <p className="text-muted-foreground">{event.timestamp} • {event.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSelectedLoan(null)} className="w-full lg:w-auto">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
