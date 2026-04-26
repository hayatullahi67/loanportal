"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { LoanApplication } from "@/types/loan";

interface GuaranteeCertificateProps {
  loan: LoanApplication;
}

export function GuaranteeCertificate({ loan }: GuaranteeCertificateProps) {
  return (
    <div className="relative bg-white text-[#001a0e] p-8 sm:p-16 rounded-none shadow-2xl overflow-hidden min-h-[842px] w-full border-[1px] border-[#001a0e]/10 mx-auto">
      
      {/* Clean Official Header */}
      <div className="flex flex-row items-center justify-between mb-16 pb-8 border-b-2 border-[#001a0e]">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#001a0e]">Guarantee Certificate</h1>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Official DFO Financial Instrument</p>
        </div>
        <div className="w-16 h-16 flex items-center justify-center border-2 border-[#001a0e] rounded-full">
          <ShieldCheck className="w-8 h-8 text-[#001a0e]" />
        </div>
      </div>

      {/* Simplified Content Layout */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          {/* Bank Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Name of Bank</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1">{loan.bankDetails.bankName}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Branch (State / LGA)</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1">{loan.bankDetails.state} / {loan.bankDetails.lga}</p>
            </div>
          </div>

          {/* Borrower Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Name of Borrower</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1 uppercase">{loan.borrower.name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">BVN of Borrower</label>
              <p className="text-lg font-mono font-bold border-b border-[#001a0e]/5 pb-1 tracking-widest">{loan.borrower.bvn}</p>
            </div>
          </div>

          {/* Business Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Loan Account Number</label>
              <p className="text-lg font-mono font-bold border-b border-[#001a0e]/5 pb-1">{loan.loan.loanAccount}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Type of Facility</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1">{loan.loan.facilityType}</p>
            </div>
          </div>

          {/* Financials Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Loan Amount (₦)</label>
              <p className="text-2xl font-black text-primary border-b border-[#001a0e]/5 pb-1">₦ {loan.loan.amount.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Loan Tenor (Months)</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1">{loan.loan.tenor}</p>
            </div>
          </div>

          {/* Dates Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Date of Disbursement</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1">{loan.dates.disbursementDate}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Final Repayment Date</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1">{loan.dates.finalRepaymentDate}</p>
            </div>
          </div>

          {/* Control Section */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Date Issued (Certificate Date)</label>
              <p className="text-lg font-bold border-b border-[#001a0e]/5 pb-1">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#001a0e]/40 uppercase tracking-widest">Certificate Number</label>
              <p className="text-lg font-black text-[#001a0e] border-b border-[#001a0e]/5 pb-1">GC-{loan.id.split('-')[1]}-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>
        </div>

        {/* Simplified Footer - Clear and Visual */}
        <div className="mt-20 pt-16 flex flex-col sm:flex-row justify-between items-end gap-16">
          {/* Signature Zone */}
          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <div className="w-56 h-20 border-b border-[#001a0e] flex items-center justify-center relative">
               <span className="text-xl font-bold italic text-[#001a0e]/60 select-none">
                 [ DIGITAL SIGNATURE ]
               </span>
               <div className="absolute inset-0 flex items-center justify-center opacity-10">
                 <ShieldCheck className="w-16 h-16" />
               </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#001a0e]/80">DFO Digital Signature</p>
          </div>

          {/* Stamp Zone */}
          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <div className="w-32 h-32 border-2 border-dashed border-[#001a0e]/10 rounded-2xl flex items-center justify-center p-4">
              <p className="text-[8px] font-bold uppercase text-center opacity-20">Space for Stamp Affix</p>
            </div>
          </div>
        </div>

        <div className="pt-24 text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-20">
            SECURED DIGITAL INSTRUMENT • VALIDATION ID: {loan.id}
          </p>
        </div>
      </div>
    </div>
  );
}
