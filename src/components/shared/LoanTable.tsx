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
        return 'default'; // Success green in many designs, here primary or custom
      case 'AWAITING_DFO_VERIFICATION':
      case 'AWAITING_SIGNATORY_APPROVAL':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent/50">
            <TableHead className="font-bold">Loan ID</TableHead>
            <TableHead className="font-bold">Borrower</TableHead>
            <TableHead className="font-bold">BVN</TableHead>
            <TableHead className="font-bold">Amount</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id} className="cursor-pointer hover:bg-accent/20">
              <TableCell className="font-mono font-bold text-primary">{loan.id}</TableCell>
              <TableCell>{loan.borrower.name}</TableCell>
              <TableCell className="font-mono text-muted-foreground">{loan.borrower.bvn}</TableCell>
              <TableCell className="font-bold">{formatCurrency(loan.loan.amount)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(loan.status)} className="whitespace-nowrap">
                  {STATUS_LABELS[loan.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedLoan(loan)}>
                  <Eye className="h-4 w-4 mr-2" /> Details
                </Button>
                {onAction && (
                  <Button 
                    size="sm"
                    disabled={loan.status !== allowedStatus}
                    onClick={() => onAction(loan)}
                  >
                    {actionLabel}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-center pr-8">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                Loan Details: <span className="text-primary">{selectedLoan?.id}</span>
              </DialogTitle>
              {selectedLoan && (
                <Badge variant={getStatusVariant(selectedLoan.status)}>
                  {STATUS_LABELS[selectedLoan.status]}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedLoan && (
            <div className="grid grid-cols-2 gap-6 py-4">
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tenor:</span>
                    <span className="text-sm font-semibold">{selectedLoan.loan.tenor}</span>
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
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Workflow Timeline</h4>
                  <div className="space-y-2 mt-2">
                    {selectedLoan.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-2 text-xs">
                        <div className="w-1 h-auto bg-primary/20 rounded-full" />
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLoan(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}