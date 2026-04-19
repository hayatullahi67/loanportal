"use client";

import { useState, useEffect, useCallback } from "react";
import { LoanApplication, LoanStatus } from "@/types/loan";
import { MOCK_LOANS } from "./mock-data";

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

  const updateLoanStatus = useCallback((id: string, nextStatus: LoanStatus, userRole: string) => {
    loansStore = loansStore.map((loan) => {
      if (loan.id === id) {
        return {
          ...loan,
          status: nextStatus,
          timeline: [
            ...loan.timeline,
            {
              status: nextStatus,
              timestamp: new Date().toLocaleString(),
              user: userRole,
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
    listeners.forEach((l) => l(loansStore));
  }, []);

  const addRepayment = useCallback((loanId: string, amount: number) => {
    loansStore = loansStore.map((loan) => {
      if (loan.id === loanId) {
        return {
          ...loan,
          repayments: [
            ...loan.repayments,
            {
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toLocaleDateString(),
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