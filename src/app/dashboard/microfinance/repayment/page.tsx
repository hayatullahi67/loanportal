"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useLoans } from "@/lib/store";
import { LayoutDashboard, FilePlus, CreditCard, CalendarClock, History, TriangleAlert, Download, Wallet, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PaymentTrackingStatus = "PAID" | "OVERDUE" | "UPCOMING";
type LoanTrackingStatus = "ACTIVE" | "SETTLED" | "DEFAULTED";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const parseTenorMonths = (tenor: string) => {
  const match = tenor.match(/\d+/);
  return match ? Math.max(parseInt(match[0], 10), 1) : 12;
};

const addMonths = (dateString: string, months: number) => {
  const date = new Date(dateString);
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const formatShortDate = (date: Date) =>
  date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getTodayInputValue = () => new Date().toISOString().split("T")[0];

const getPaidTotal = (loan: LoanApplication) =>
  loan.repayments.reduce((sum, repayment) => sum + repayment.amount, 0);

const getScheduledInstallment = (loan: LoanApplication) =>
  loan.loan.amount / parseTenorMonths(loan.loan.tenor);

const getNextDueDate = (loan: LoanApplication) => {
  const installmentsPaid = loan.repayments.length;
  const tenorMonths = parseTenorMonths(loan.loan.tenor);

  if (installmentsPaid >= tenorMonths) {
    return new Date(loan.dates.finalRepaymentDate);
  }

  return addMonths(loan.dates.disbursementDate, installmentsPaid + 1);
};

const getPaymentTrackingStatus = (loan: LoanApplication): PaymentTrackingStatus => {
  const paidTotal = getPaidTotal(loan);
  if (paidTotal >= loan.loan.amount) {
    return "PAID";
  }

  const nextDueDate = getNextDueDate(loan);
  const today = new Date();
  return nextDueDate < today ? "OVERDUE" : "UPCOMING";
};

const getLoanTrackingStatus = (loan: LoanApplication): LoanTrackingStatus => {
  const paidTotal = getPaidTotal(loan);
  if (paidTotal >= loan.loan.amount) {
    return "SETTLED";
  }

  const nextDueDate = getNextDueDate(loan);
  const today = new Date();
  const overdueDays = Math.floor((today.getTime() - nextDueDate.getTime()) / (1000 * 60 * 60 * 24));

  if (overdueDays > 60) {
    return "DEFAULTED";
  }

  return "ACTIVE";
};

const getPaymentStatusBadgeClass = (status: PaymentTrackingStatus) => {
  if (status === "PAID") return "bg-primary text-[#001a0e]";
  if (status === "OVERDUE") return "bg-red-500/15 text-red-400 border border-red-500/20";
  return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
};

const getLoanStatusBadgeClass = (status: LoanTrackingStatus) => {
  if (status === "SETTLED") return "bg-primary text-[#001a0e]";
  if (status === "DEFAULTED") return "bg-red-500/15 text-red-400 border border-red-500/20";
  return "bg-blue-500/15 text-blue-300 border border-blue-500/20";
};

export default function MicrofinanceRepaymentPage() {
  const { loans, addRepayment } = useLoans();
  const { toast } = useToast();
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(getTodayInputValue());
  const [nameFilter, setNameFilter] = useState<string>("");
  const [bvnFilter, setBvnFilter] = useState<string>("");

  const navItems = [
    { label: "Dashboard", href: "/dashboard/microfinance/loans", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "New Application", href: "/dashboard/microfinance/apply", icon: <FilePlus className="w-4 h-4" /> },
    { label: "Repayments", href: "/dashboard/microfinance/repayment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const repaymentLoans = useMemo(
    () => loans.filter((loan) => loan.status === "DISBURSED" || loan.repayments.length > 0),
    [loans]
  );

  const filteredLoans = useMemo(() => {
    const normalizedName = nameFilter.trim().toLowerCase();
    const normalizedBvn = bvnFilter.trim();

    return repaymentLoans.filter((loan) => {
      const matchesName = normalizedName
        ? loan.borrower.name.toLowerCase().includes(normalizedName)
        : true;
      const matchesBvn = normalizedBvn
        ? loan.borrower.bvn.includes(normalizedBvn)
        : true;

      return matchesName && matchesBvn;
    });
  }, [repaymentLoans, nameFilter, bvnFilter]);

  const metrics = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const totalRecovered = repaymentLoans.reduce((sum, loan) => sum + getPaidTotal(loan), 0);
    const monthlyRecovered = repaymentLoans.reduce((sum, loan) => {
      const currentMonthTotal = loan.repayments
        .filter((repayment) => {
          const repaymentDate = new Date(repayment.date);
          return repaymentDate.getMonth() === currentMonth && repaymentDate.getFullYear() === currentYear;
        })
        .reduce((subtotal, repayment) => subtotal + repayment.amount, 0);

      return sum + currentMonthTotal;
    }, 0);

    const annualRecovered = repaymentLoans.reduce((sum, loan) => {
      const currentYearTotal = loan.repayments
        .filter((repayment) => new Date(repayment.date).getFullYear() === currentYear)
        .reduce((subtotal, repayment) => subtotal + repayment.amount, 0);

      return sum + currentYearTotal;
    }, 0);

    const overdueLoans = repaymentLoans.filter((loan) => getPaymentTrackingStatus(loan) === "OVERDUE");
    const defaultedLoans = repaymentLoans.filter((loan) => getLoanTrackingStatus(loan) === "DEFAULTED");

    return {
      totalRecovered,
      monthlyRecovered,
      annualRecovered,
      overdueLoans: overdueLoans.length,
      defaultedLoans: defaultedLoans.length,
      nplExposure: defaultedLoans.reduce((sum, loan) => sum + (loan.loan.amount - getPaidTotal(loan)), 0),
    };
  }, [repaymentLoans]);

  const openDetails = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setPaymentAmount(getScheduledInstallment(loan).toFixed(2));
    setPaymentDate(getTodayInputValue());
  };

  const closeDetails = () => {
    setSelectedLoan(null);
    setPaymentAmount("");
    setPaymentDate(getTodayInputValue());
  };

  const submitPayment = () => {
    if (!selectedLoan || !paymentAmount || !paymentDate) {
      return;
    }

    addRepayment(selectedLoan.id, parseFloat(paymentAmount), paymentDate);
    toast({
      title: "Payment Marked as Paid",
      description: `${formatCurrency(parseFloat(paymentAmount))} was recorded for ${selectedLoan.borrower.name} on ${paymentDate}.`,
    });
    closeDetails();
  };

  const exportTrackingLogs = () => {
    const rows = filteredLoans.map((loan) => {
      const paidTotal = getPaidTotal(loan);
      const nextDueDate = getNextDueDate(loan);
      const paymentStatus = getPaymentTrackingStatus(loan);
      const loanStatus = getLoanTrackingStatus(loan);

      return [
        loan.id,
        loan.borrower.name,
        loan.borrower.bvn,
        loan.loan.loanAccount,
        formatShortDate(nextDueDate),
        paymentStatus,
        loanStatus,
      ].join(",");
    });

    const csv = [
      "Loan ID,Borrower,BVN,Account Number,Next Due Date,Payment Status,Loan Status",
      ...rows,
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "repayment-tracking-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="microfinance" navItems={navItems}>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Loan Repayment Tracking</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitor repayment schedules, track loan status, and review borrower repayment details.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={exportTrackingLogs}
          className="w-full sm:w-auto font-black uppercase tracking-widest text-[10px]"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Tracking Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Recovery</p>
              <p className="text-lg sm:text-xl font-black text-foreground">{formatCurrency(metrics.totalRecovered)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Monthly / Annual</p>
              <p className="text-lg sm:text-xl font-black text-foreground">{formatCurrency(metrics.monthlyRecovered)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Annual: {formatCurrency(metrics.annualRecovered)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Overdue Alerts</p>
              <p className="text-lg sm:text-xl font-black text-foreground">{metrics.overdueLoans} Loan(s)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <TriangleAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">NPL Exposure</p>
              <p className="text-lg sm:text-xl font-black text-foreground">{formatCurrency(metrics.nplExposure)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{metrics.defaultedLoans} defaulted loan(s)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-white/5 space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">Repayment Status Monitoring</h3>
                <p className="text-sm text-white/50">
                  Filter by borrower name or BVN, then open the detail modal to review the full repayment record.
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                View details for full borrower timeline
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Filter by borrower name"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/30"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  value={bvnFilter}
                  onChange={(e) => setBvnFilter(e.target.value)}
                  placeholder="Filter by BVN"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/30"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black">Borrower</TableHead>
                  <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black">BVN</TableHead>
                  <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black">Account Number</TableHead>
                  <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black">Next Due Date</TableHead>
                  <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black">Payment Status</TableHead>
                  <TableHead className="text-white/40 uppercase tracking-widest text-[10px] font-black">Loan Status</TableHead>
                  <TableHead className="text-right text-white/40 uppercase tracking-widest text-[10px] font-black">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.length === 0 ? (
                  <TableRow className="border-white/5">
                    <TableCell colSpan={7} className="py-16 text-center text-white/40">
                      No repayment records match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLoans.map((loan) => {
                    const nextDueDate = getNextDueDate(loan);
                    const paymentStatus = getPaymentTrackingStatus(loan);
                    const loanStatus = getLoanTrackingStatus(loan);

                    return (
                      <TableRow key={loan.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div className="font-black text-white">{loan.borrower.name}</div>
                          <div className="text-[10px] font-mono text-white/40">{loan.id}</div>
                        </TableCell>
                        <TableCell className="font-mono text-white/80">{loan.borrower.bvn}</TableCell>
                        <TableCell className="font-mono text-white/80">{loan.loan.loanAccount}</TableCell>
                        <TableCell className="text-white/80 whitespace-nowrap">{formatShortDate(nextDueDate)}</TableCell>
                        <TableCell>
                          <Badge className={`border-none font-black uppercase tracking-widest text-[9px] ${getPaymentStatusBadgeClass(paymentStatus)}`}>
                            {paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`border-none font-black uppercase tracking-widest text-[9px] ${getLoanStatusBadgeClass(loanStatus)}`}>
                            {loanStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetails(loan)}
                            className="h-9 text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-5"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLoan} onOpenChange={(open) => !open && closeDetails()}>
        <DialogContent className="w-[95vw] h-[90%] sm:max-w-3xl p-0 border border-white/10 bg-[#03170d] shadow-2xl overflow-hidden rounded-3xl">
          <DialogHeader className="px-5 py-4 border-b border-white/5 bg-white/[0.03] text-white">
            <DialogTitle className="text-base sm:text-lg font-black tracking-tight">Repayment Details</DialogTitle>
          </DialogHeader>

          {selectedLoan && (
            <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Borrower Profile</p>
                  <div>
                    <p className="text-lg font-black text-white">{selectedLoan.borrower.name}</p>
                    <p className="text-xs text-white/50">{selectedLoan.borrower.phone}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">BVN</Label>
                      <p className="font-mono text-white/85">{selectedLoan.borrower.bvn}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Account Number</Label>
                      <p className="font-mono text-white/85">{selectedLoan.loan.loanAccount}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Address</Label>
                      <p className="text-white/75">{selectedLoan.borrower.address}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Loan Summary</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Bank</Label>
                      <p className="font-bold text-white">{selectedLoan.bankDetails.bankName}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Loan ID</Label>
                      <p className="font-mono text-white/85">{selectedLoan.id}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Principal</Label>
                      <p className="font-bold text-white">{formatCurrency(selectedLoan.loan.amount)}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Scheduled Installment</Label>
                      <p className="font-bold text-white">{formatCurrency(getScheduledInstallment(selectedLoan))}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Disbursement Date</Label>
                      <p className="text-white/75">{selectedLoan.dates.disbursementDate}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Final Repayment Date</Label>
                      <p className="text-white/75">{selectedLoan.dates.finalRepaymentDate}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Next Due Date</Label>
                      <p className="text-white/75">{formatShortDate(getNextDueDate(selectedLoan))}</p>
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Outstanding</Label>
                      <p className="font-bold text-white">{formatCurrency(Math.max(selectedLoan.loan.amount - getPaidTotal(selectedLoan), 0))}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="rounded-xl border border-white/8 p-3 bg-white/[0.03]">
                  <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Paid Total</Label>
                  <p className="font-bold text-sm text-white">{formatCurrency(getPaidTotal(selectedLoan))}</p>
                </div>
                <div className="rounded-xl border border-white/8 p-3 bg-white/[0.03]">
                  <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Payment Status</Label>
                  <Badge className={`border-none font-black uppercase tracking-widest text-[9px] ${getPaymentStatusBadgeClass(getPaymentTrackingStatus(selectedLoan))}`}>
                    {getPaymentTrackingStatus(selectedLoan)}
                  </Badge>
                </div>
                <div className="rounded-xl border border-white/8 p-3 bg-white/[0.03]">
                  <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Loan Status</Label>
                  <Badge className={`border-none font-black uppercase tracking-widest text-[9px] ${getLoanStatusBadgeClass(getLoanTrackingStatus(selectedLoan))}`}>
                    {getLoanTrackingStatus(selectedLoan)}
                  </Badge>
                </div>
                <div className="rounded-xl border border-white/8 p-3 bg-white/[0.03]">
                  <Label className="text-[9px] font-bold uppercase text-white/35 block mb-1">Facility Type</Label>
                  <p className="font-bold text-sm text-white">{selectedLoan.loan.facilityType}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Mark Repayment As Paid</p>
                    <p className="text-sm text-white/55 mt-1">
                      Record amount and payment date.
                    </p>
                  </div>
                  <Button
                    onClick={submitPayment}
                    className="h-10 rounded-xl font-black px-6 text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Mark As Paid
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount" className="text-[10px] font-bold uppercase tracking-widest text-white/45">Payment Amount</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="h-11 rounded-xl border-white/10 bg-[#062314] text-white focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-date" className="text-[10px] font-bold uppercase tracking-widest text-white/45">Payment Date</Label>
                    <Input
                      id="payment-date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="h-11 rounded-xl border-white/10 bg-[#062314] text-white focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Repayment History Timeline</p>
                  <p className="text-sm text-white/55 mt-1">
                    Recorded payments for this borrower.
                  </p>
                </div>
                <div className="space-y-2">
                  {selectedLoan.repayments.length ? (
                    selectedLoan.repayments.map((repayment) => (
                      <div key={repayment.id} className="rounded-xl border border-white/8 p-3 bg-[#062314]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-black text-sm text-white">{formatCurrency(repayment.amount)}</p>
                            <p className="text-[10px] text-white/45 mt-1">{repayment.date}</p>
                          </div>
                          <Badge className={`border-none font-black uppercase tracking-widest text-[9px] ${getPaymentStatusBadgeClass(repayment.status)}`}>
                            {repayment.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/10 p-3 text-[10px] uppercase tracking-widest text-white/40">
                      No repayment history recorded for this borrower.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-5 py-4 bg-white/[0.03] border-t border-white/5">
            <Button variant="outline" onClick={closeDetails} className="h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest border-white/10 bg-white/5 text-white hover:bg-white/10">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
