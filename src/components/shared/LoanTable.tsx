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
import { Eye } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

  return (
    <div className="bg-white/5 rounded-3xl shadow-2xl border border-white/5 overflow-hidden w-full backdrop-blur-md">
      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-primary/20">
        <Table className="min-w-[700px] w-full">
          <TableHeader>
            <TableRow className="bg-white/5 border-white/5 hover:bg-white/5">
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Registry ID</TableHead>
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Beneficiary</TableHead>
              <TableHead className="hidden md:table-cell font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">BVN Identity</TableHead>
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Exposure</TableHead>
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Manifest Status</TableHead>
              <TableHead className="font-black text-right py-5 text-white/40 uppercase tracking-widest text-[10px]">Audit Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-white/20 italic font-medium">
                  No secure records found for this operational filter.
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow key={loan.id} className="border-white/5 hover:bg-white/10 transition-all duration-300">
                  <TableCell className="font-black text-primary font-mono tracking-tighter">{loan.id}</TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="font-black text-white truncate uppercase tracking-tight">{loan.borrower.name}</div>
                    <div className="text-[10px] text-white/40 md:hidden font-mono">{loan.borrower.bvn}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-white/40">{loan.borrower.bvn}</TableCell>
                  <TableCell className="font-black text-white whitespace-nowrap">{formatCurrency(loan.loan.amount)}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "whitespace-nowrap text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none",
                      loan.status === 'DISBURSED' || loan.status === 'APPROVED' ? "bg-primary text-[#001a0e]" : "bg-white/10 text-white/80"
                    )}>
                      {STATUS_LABELS[loan.status].split(' ').slice(1).join(' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLoan(loan)} className="h-9 text-[10px] font-black uppercase text-white/60 hover:text-white hover:bg-white/10 rounded-xl px-4">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      {onAction && (
                        <Button 
                          size="sm"
                          disabled={loan.status !== allowedStatus}
                          onClick={() => onAction(loan)}
                          className="h-9 text-[10px] font-black uppercase tracking-widest bg-primary text-[#001a0e] hover:bg-primary/80 rounded-xl px-6"
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
        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 border-white/10 bg-[#001a0e] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <DialogHeader className="p-8 bg-white/5 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-black text-white tracking-tighter">
                  Dossier <span className="text-primary opacity-50">#</span>{selectedLoan?.id}
                </DialogTitle>
                <DialogDescription className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Secure Financial Identity Record
                </DialogDescription>
              </div>
              {selectedLoan && (
                <Badge className="w-fit bg-primary text-[#001a0e] font-black uppercase tracking-widest px-4 py-2 rounded-xl text-[10px]">
                  {STATUS_LABELS[selectedLoan.status]}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5">Biometric Identity</h4>
                  <div className="space-y-4">
                    <p className="text-xl font-black text-white tracking-tight">{selectedLoan?.borrower.name}</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <p className="font-black text-[9px] uppercase tracking-widest text-white/30">Mobile Contact</p>
                         <p className="text-white font-bold">{selectedLoan?.borrower.phone}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="font-black text-[9px] uppercase tracking-widest text-white/30">Verified BVN</p>
                         <p className="text-primary font-mono font-bold tracking-widest">{selectedLoan?.borrower.bvn}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-[9px] uppercase tracking-widest text-white/30">Registered Domicile</p>
                      <p className="text-white/80 leading-relaxed font-medium">{selectedLoan?.borrower.address}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/5" />
                
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5">Venture Scope</h4>
                  <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      </div>
                      <p className="text-lg font-black text-white uppercase tracking-tight">{selectedLoan?.project.loanType} Division</p>
                    </div>
                    <div className="text-sm text-white/60 space-y-3">
                      <div className="flex items-start gap-3">
                        <p className="font-black text-[10px] uppercase text-white/20 mt-1 shrink-0">LOC:</p>
                        <p className="font-bold text-white/80">{selectedLoan?.project.location}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <p className="font-black text-[10px] uppercase text-white/20 mt-1 shrink-0">OBJ:</p>
                        <p className="leading-relaxed font-medium">{selectedLoan?.project.purpose}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="bg-primary p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,209,102,0.1)]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001a0e]/60 mb-6">Financial Structure</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-[#001a0e]/10 pb-4">
                      <span className="text-xs font-black text-[#001a0e]/70 uppercase tracking-widest">Principal Manifest</span>
                      <span className="text-3xl font-black text-[#001a0e] tracking-tighter">{selectedLoan && formatCurrency(selectedLoan.loan.amount)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-[#001a0e]/60 tracking-widest">Fixed Rate</p>
                        <p className="text-lg font-black text-[#001a0e]">{selectedLoan?.loan.interestRate}% P.A.</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-[#001a0e]/60 tracking-widest">Maturity</p>
                        <p className="text-lg font-black text-[#001a0e]">{selectedLoan?.loan.tenor}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-6 border-t border-[#001a0e]/10 flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#001a0e]/60 uppercase tracking-widest">Guaranteed Rebate</span>
                      <span className="text-lg font-black text-[#001a0e]">
                        {selectedLoan && formatCurrency(selectedLoan.loan.amount * (selectedLoan.loan.interestRate / 100) * 0.4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Audit Chain</h4>
                  <div className="space-y-6 border-l-2 border-white/5 ml-3 pl-6">
                    {selectedLoan?.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,209,102,0.5)] border-2 border-[#001a0e]" />
                        <div className="space-y-1">
                          <p className="text-xs font-black text-white uppercase tracking-wider">{STATUS_LABELS[event.status].split(' ').slice(1).join(' ')}</p>
                          <p className="text-[10px] text-white/40 font-bold">{event.timestamp} • {event.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>

          <DialogFooter className="p-8 border-t border-white/5 bg-white/5">
            <Button variant="outline" onClick={() => setSelectedLoan(null)} className="w-full sm:w-auto font-black uppercase tracking-widest text-xs h-12 rounded-2xl border-white/10 hover:bg-white/10 text-white">
              CLOSE RECORD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}