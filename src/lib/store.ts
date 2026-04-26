"use client";

import { useState, useEffect, useCallback } from "react";
import { LoanApplication, LoanStatus } from "@/types/loan";
import { MOCK_LOANS } from "./mock-data";
import { addAuditLogEntry } from "./admin-store";

// Simple singleton-like store for demo
let loansStore: LoanApplication[] = [...MOCK_LOANS];
let listeners: Array<(loans: LoanApplication[]) => void> = [];

export const useLoans = () => {
  const [loans, setLoans] = useState<LoanApplication[]>(loansStore);

  useEffect(() => {
    const listener = (newLoans: LoanApplication[]) => setLoans([...newLoans]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const updateLoanStatus = useCallback((id: string, nextStatus: LoanStatus, userRole: string, note?: string) => {
    loansStore = loansStore.map((loan) => {
      if (loan.id === id) {
        addAuditLogEntry({
          actor: userRole,
          actorRole: userRole,
          action: `Updated loan status to ${nextStatus}`,
          target: loan.id,
          severity: nextStatus === "REJECTED" ? "WARNING" : "INFO",
          outcome: nextStatus === "REJECTED" ? "REVIEW" : "SUCCESS",
        });

        return {
          ...loan,
          status: nextStatus,
          timeline: [
            ...loan.timeline,
            {
              status: nextStatus,
              timestamp: new Date().toLocaleString(),
              user: userRole,
              note,
            },
          ],
        };
      }
      return loan;
    });
    listeners.forEach((l) => l(loansStore));
  }, []);

  const addLoan = useCallback((newLoan: LoanApplication) => {
    loansStore = [newLoan, ...loansStore];
    addAuditLogEntry({
      actor: "MFB Officer",
      actorRole: "Microfinance Bank",
      action: "Submitted new guarantee application",
      target: newLoan.id,
      severity: "INFO",
      outcome: "SUCCESS",
    });
    listeners.forEach((l) => l(loansStore));
  }, []);

  const addRepayment = useCallback((loanId: string, amount: number, paymentDate: string) => {
    loansStore = loansStore.map((loan) => {
      if (loan.id === loanId) {
        addAuditLogEntry({
          actor: "Microfinance Collections",
          actorRole: "Microfinance Bank",
          action: "Recorded repayment",
          target: `${loan.id} / NGN ${amount.toLocaleString()}`,
          severity: "INFO",
          outcome: "SUCCESS",
        });

        return {
          ...loan,
          repayments: [
            ...loan.repayments,
            {
              id: Math.random().toString(36).substr(2, 9),
              date: paymentDate,
              amount,
              status: 'PAID'
            }
          ]
        };
      }
      return loan;
    });
    listeners.forEach((l) => l(loansStore));
  }, []);

  return { loans, updateLoanStatus, addLoan, addRepayment };
};
