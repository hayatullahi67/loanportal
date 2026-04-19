"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { 
  LayoutDashboard, 
  FilePlus, 
  CreditCard, 
  Upload, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLoans } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  bankName: z.string().min(2, "Bank name required"),
  state: z.string().min(1, "State required"),
  lga: z.string().min(1, "LGA required"),
  date: z.string().min(1, "Date required"),
  borrowerName: z.string().min(2, "Name required"),
  gender: z.enum(["Male", "Female"]),
  phone: z.string().min(10, "Valid phone required"),
  address: z.string().min(5, "Address required"),
  bvn: z.string().length(11, "BVN must be exactly 11 digits"),
  location: z.string().min(2, "Project location required"),
  loanType: z.enum(["Livestock", "Crop", "Mixed"]),
  purpose: z.string().min(10, "Provide a detailed purpose"),
  loanAccount: z.string().length(10, "Account must be 10 digits"),
  amount: z.coerce.number().positive("Amount must be positive"),
  interestRate: z.coerce.number().min(0).max(100),
  tenor: z.string().min(1, "Tenor required"),
  facilityType: z.string().min(1, "Facility type required"),
  disbursementDate: z.string().min(1, "Required"),
  finalRepaymentDate: z.string().min(1, "Required"),
});

export default function LoanApplyPage() {
  const { addLoan } = useLoans();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "Male",
      loanType: "Crop",
      bankName: "First Microfinance Bank",
      interestRate: 15,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newLoan = {
      id: `LN-${Math.floor(100 + Math.random() * 900)}`,
      status: 'PENDING_HEAD_OFFICE_STAMP' as const,
      bankDetails: {
        bankName: values.bankName,
        state: values.state,
        lga: values.lga,
        date: values.date,
      },
      borrower: {
        name: values.borrowerName,
        gender: values.gender,
        phone: values.phone,
        address: values.address,
        bvn: values.bvn,
      },
      project: {
        location: values.location,
        loanType: values.loanType,
        purpose: values.purpose,
      },
      loan: {
        loanAccount: values.loanAccount,
        amount: values.amount,
        interestRate: values.interestRate,
        tenor: values.tenor,
        facilityType: values.facilityType,
      },
      dates: {
        disbursementDate: values.disbursementDate,
        finalRepaymentDate: values.finalRepaymentDate,
      },
      timeline: [
        {
          status: 'PENDING_HEAD_OFFICE_STAMP' as const,
          timestamp: new Date().toLocaleString(),
          user: "MFB Officer",
        },
      ],
      repayments: [],
    };

    addLoan(newLoan);
    toast({
      title: "Application Submitted",
      description: `Loan ${newLoan.id} has been submitted for Head Office stamp.`,
    });
    router.push("/dashboard/microfinance/loans");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard/microfinance/loans", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "New Application", href: "/dashboard/microfinance/apply", icon: <FilePlus className="w-4 h-4" /> },
    { label: "Repayments", href: "/dashboard/microfinance/repayment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout role="microfinance" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">Guarantee Application</h2>
        <p className="text-sm lg:text-base text-muted-foreground">Complete the form below to initiate a request.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <Card className="shadow-sm">
              <CardHeader className="bg-accent/30 rounded-t-xl border-b py-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="bankName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input placeholder="e.g. Lagos" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lga" render={({ field }) => (
                    <FormItem>
                      <FormLabel>LGA</FormLabel>
                      <FormControl><Input placeholder="e.g. Ikeja" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="bg-accent/30 rounded-t-xl border-b py-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Borrower Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <FormField control={form.control} name="borrowerName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Borrower's Name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="080..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="bvn" render={({ field }) => (
                  <FormItem>
                    <FormLabel>BVN (11 Digits)</FormLabel>
                    <FormControl><Input placeholder="22233344455" maxLength={11} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential Address</FormLabel>
                    <FormControl><Input placeholder="Full address" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="bg-accent/30 rounded-t-xl border-b py-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Project & Financials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="loanType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Livestock">Livestock</SelectItem>
                          <SelectItem value="Crop">Crop</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Location</FormLabel>
                      <FormControl><Input placeholder="Farm address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="purpose" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose</FormLabel>
                    <FormControl><Input placeholder="Detailed purpose" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="loanAccount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Account (10 Digits)</FormLabel>
                      <FormControl><Input placeholder="0123456789" maxLength={10} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount (₦)</FormLabel>
                      <FormControl><Input type="number" placeholder="5,000,000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="interestRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate (%)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="tenor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenor</FormLabel>
                      <FormControl><Input placeholder="24 Mos" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="facilityType" render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Facility Type</FormLabel>
                      <FormControl><Input placeholder="Term Loan" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="bg-accent/30 rounded-t-xl border-b py-4">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Dates & Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="disbursementDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disbursement Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="finalRepaymentDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Repayment Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="pt-4 border-t space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent transition-colors cursor-pointer min-h-[100px]">
                      <Upload className="h-5 w-5 text-primary mb-2" />
                      <p className="text-[10px] font-bold">Passport</p>
                    </div>
                    <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center hover:bg-accent transition-colors cursor-pointer min-h-[100px]">
                      <Upload className="h-5 w-5 text-primary mb-2" />
                      <p className="text-[10px] font-bold">Collateral</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 bg-white p-4 lg:p-6 rounded-xl border shadow-lg sticky bottom-4 lg:bottom-6 z-10">
            <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" size="lg" className="w-full sm:w-auto px-12 font-bold">Submit Application</Button>
          </div>
        </form>
      </Form>
    </DashboardLayout>
  );
}
