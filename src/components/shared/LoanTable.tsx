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
import { User, Landmark, ShieldAlert, History, Award } from "lucide-react";
import { LoanApplication, STATUS_LABELS, LoanStatus } from "@/types/loan";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface LoanTableProps {
  loans: LoanApplication[];
  onAction?: (loan: LoanApplication) => void;
  onPreview?: (loan: LoanApplication) => void;
  actionLabel?: string;
  allowedStatus?: LoanStatus | LoanStatus[];
  role: string;
}

export function LoanTable({ loans, onAction, onPreview, actionLabel, allowedStatus, role }: LoanTableProps) {
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const showOperations = Boolean(onAction);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <div className="bg-white/5 rounded-3xl shadow-2xl border border-white/5 overflow-hidden w-full backdrop-blur-md">
      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-primary/20">
        <Table className=" w-full">
          <TableHeader>
            <TableRow className="bg-white/5 border-white/5 hover:bg-white/5">
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Registry ID</TableHead>
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Beneficiary</TableHead>
              <TableHead className="hidden md:table-cell font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">BVN Identity</TableHead>
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Exposure</TableHead>
              <TableHead className="font-black py-5 text-white/40 uppercase tracking-widest text-[10px]">Manifest Status</TableHead>
              {showOperations && (
                <TableHead className="font-black text-right py-5 text-white/40 uppercase tracking-widest text-[10px]">Operations</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showOperations ? 6 : 5} className="text-center py-20 text-white/20 italic font-medium">
                  No secure records found for this operational filter.
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow 
                  key={loan.id} 
                  onClick={() => setSelectedLoan(loan)}
                  className="border-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <TableCell className="font-black text-primary font-mono tracking-tighter group-hover:pl-4 transition-all">{loan.id}</TableCell>
                  <TableCell className="max-w-[150px]">
                    <div className="font-black text-white truncate uppercase tracking-tight">{loan.borrower.name}</div>
                    <div className="text-[10px] text-white/40 md:hidden font-mono">{loan.borrower.bvn}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-white/40">{loan.borrower.bvn}</TableCell>
                  <TableCell className="font-black text-white whitespace-nowrap">{formatCurrency(loan.loan.amount)}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "whitespace-nowrap text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none transition-colors",
                      loan.status === 'DISBURSED' || loan.status === 'APPROVED' ? "bg-primary text-[#001a0e]" : 
                      loan.status === 'REJECTED' ? "bg-red-500/20 text-red-500 border border-red-500/20" :
                      "bg-white/10 text-white/80"
                    )}>
                      {STATUS_LABELS[loan.status]}
                    </Badge>
                  </TableCell>
                  {showOperations && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        {onAction && (
                          <Button 
                            size="sm"
                            disabled={
                              Array.isArray(allowedStatus) 
                                ? !allowedStatus.includes(loan.status)
                                : loan.status !== allowedStatus
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction(loan);
                            }}
                            className="h-9 text-[10px] font-black uppercase tracking-widest bg-primary text-[#001a0e] hover:bg-primary/80 rounded-xl px-6 relative z-10"
                          >
                            {actionLabel}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-3xl w-[98vw] sm:w-[90vw] h-[85vh] overflow-hidden flex flex-col p-0 border-white/10 bg-[#001a0e] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl sm:rounded-3xl">
          {/* Persistent Header */}
          <DialogHeader className="p-6 bg-white/5 border-b border-white/5 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="text-primary opacity-50">#</span>{selectedLoan?.id}
                </DialogTitle>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Loan Dossier Record</p>
              </div>
              {selectedLoan && (
                <Badge className={cn(
                  "font-black uppercase tracking-widest px-4 py-2 rounded-xl text-[10px] border-none shadow-lg",
                  selectedLoan.status === 'REJECTED' ? "bg-red-500 text-white" : "bg-primary text-[#001a0e]"
                )}>
                  {STATUS_LABELS[selectedLoan.status]}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-8 max-w-2xl mx-auto">
              
              {/* Financial Summary */}
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center sm:text-left relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Loan Exposure</p>
                      <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                         {selectedLoan && formatCurrency(selectedLoan.loan.amount)}
                      </h2>
                   </div>
                   <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="rounded-lg border-white/10 text-white/60 bg-white/5 px-4 py-1.5 font-bold uppercase tracking-wider text-[9px]">
                        {selectedLoan?.loan.interestRate}% Interest
                      </Badge>
                      <Badge variant="outline" className="rounded-lg border-white/10 text-white/60 bg-white/5 px-4 py-1.5 font-bold uppercase tracking-wider text-[9px]">
                        {selectedLoan?.loan.tenor} Tenor
                      </Badge>
                   </div>
                </div>
              </div>

              {/* Rejection Note */}
              {selectedLoan?.status === 'REJECTED' && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-[10px]">
                     <ShieldAlert className="w-4 h-4" /> Rejection Remark
                  </div>
                  <p className="text-sm text-white/90 font-medium italic border-l border-red-500/30 pl-3">
                    &ldquo;{selectedLoan.timeline.find(t => t.status === 'REJECTED')?.note || "No reason specified."}&rdquo;
                  </p>
                </div>
              )}

              {/* Core Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                   <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4 opacity-40" /> Borrower
                   </h4>
                   <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">FullName</p>
                         <p className="text-sm font-bold text-white">{selectedLoan?.borrower.name}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">BVN Identity</p>
                         <p className="text-sm font-mono text-primary font-bold">{selectedLoan?.borrower.bvn}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Contact</p>
                         <p className="text-sm font-bold text-white">{selectedLoan?.borrower.phone}</p>
                      </div>
                   </div>
                </section>

                <section className="space-y-4">
                   <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Landmark className="w-4 h-4 opacity-40" /> Deployment
                   </h4>
                   <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Source Bank</p>
                         <p className="text-sm font-bold text-white">{selectedLoan?.bankDetails.bankName}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Location</p>
                         <p className="text-sm font-bold text-white">{selectedLoan?.project.location}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Project</p>
                         <p className="text-sm font-bold text-white uppercase">{selectedLoan?.project.loanType}</p>
                      </div>
                   </div>
                </section>
              </div>

              {/* Minimal Timeline */}
              <section className="space-y-6 pt-4 pb-8">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <History className="w-4 h-4 opacity-40" /> Audit Log
                 </h4>
                 <div className="space-y-6 ml-3 border-l border-white/10 pl-6">
                    {selectedLoan?.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className={cn(
                          "absolute -left-[30px] top-1.5 w-2 h-2 rounded-full",
                          idx === selectedLoan.timeline.length - 1 ? "bg-primary shadow-[0_0_10px_rgba(0,209,102,0.5)]" : "bg-white/20"
                        )} />
                        <div className="space-y-1">
                          <p className="text-xs font-black text-white uppercase tracking-wider leading-none">
                            {STATUS_LABELS[event.status].split(' ').slice(1).join(' ')}
                          </p>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{event.timestamp} • {event.user}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </section>

            </div>
          </div>

          {/* Persistent Footer */}
          <DialogFooter className="p-4 sm:p-6 border-t border-white/5 bg-white/5 flex flex-col sm:flex-row gap-3 shrink-0">
            {(selectedLoan?.status === 'CERTIFICATE_GENERATED' || selectedLoan?.status === 'DISBURSED') && onPreview && (
              <Button 
                onClick={() => {
                  onPreview(selectedLoan);
                  setSelectedLoan(null);
                }} 
                className="flex-1 font-black uppercase tracking-widest text-[10px] h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary text-[#001a0e] hover:bg-primary/90 transition-all active:scale-95"
              >
                <Award className="w-4 h-4 mr-2" />
                View Guarantee Certificate
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setSelectedLoan(null)} 
              className={cn(
                "font-black uppercase tracking-widest text-[10px] h-12 sm:h-14 rounded-xl sm:rounded-2xl border-white/10 hover:bg-white/10 text-white transition-all active:scale-95",
                selectedLoan?.status === 'CERTIFICATE_GENERATED' ? "flex-1" : "w-full"
              )}
            >
              Terminate View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
