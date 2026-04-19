import { LoanApplication, LoanStatus } from "@/types/loan";

export const MOCK_LOANS: LoanApplication[] = [
  {
    id: "LN-001",
    status: "PENDING_HEAD_OFFICE_STAMP",
    bankDetails: {
      bankName: "First Microfinance Bank",
      state: "Lagos",
      lga: "Ikeja",
      date: "2024-03-20",
    },
    borrower: {
      name: "John Adebayo",
      gender: "Male",
      phone: "08012345678",
      address: "123 Farm Road, Ikeja",
      bvn: "22233344455",
    },
    project: {
      location: "Ikorodu Farm Settlement",
      loanType: "Livestock",
      purpose: "Poultry expansion and feed purchase",
    },
    loan: {
      loanAccount: "1009988776",
      amount: 5000000,
      interestRate: 15,
      tenor: "24 Months",
      facilityType: "Term Loan",
    },
    dates: {
      disbursementDate: "2024-04-01",
      finalRepaymentDate: "2026-04-01",
    },
    timeline: [
      {
        status: "PENDING_HEAD_OFFICE_STAMP",
        timestamp: "2024-03-20 09:00",
        user: "MFB Officer",
      },
    ],
    repayments: [],
  },
  {
    id: "LN-002",
    status: "AWAITING_DFO_VERIFICATION",
    bankDetails: {
      bankName: "Sunrise Microfinance Bank",
      state: "Oyo",
      lga: "Ibadan North",
      date: "2024-03-15",
    },
    borrower: {
      name: "Sarah Williams",
      gender: "Female",
      phone: "07088776655",
      address: "45 Market Square, Ibadan",
      bvn: "11122233344",
    },
    project: {
      location: "Akinyele Farm",
      loanType: "Crop",
      purpose: "Maize cultivation and tractor leasing",
    },
    loan: {
      loanAccount: "5556667770",
      amount: 2500000,
      interestRate: 12,
      tenor: "12 Months",
      facilityType: "Agri-Loan",
    },
    dates: {
      disbursementDate: "2024-03-25",
      finalRepaymentDate: "2025-03-25",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2024-03-15 10:00", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2024-03-16 14:00", user: "HO Admin" },
    ],
    repayments: [],
  },
];