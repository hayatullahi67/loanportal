import { LoanApplication } from "@/types/loan";

export const HARDCODED_DISBURSEMENT_LOANS: LoanApplication[] = [
  {
    id: "LN-701",
    status: "CERTIFICATE_GENERATED",
    bankDetails: {
      bankName: "Harvest Field MFB",
      state: "Kaduna",
      lga: "Chikun",
      date: "2026-04-18",
    },
    borrower: {
      name: "Bello Musa",
      gender: "Male",
      phone: "08030001122",
      address: "Sabon Tasha, Kaduna",
      bvn: "55667788990",
    },
    project: {
      location: "Chikun Rice Cluster",
      loanType: "Crop",
      purpose: "Rice expansion and irrigation support",
    },
    loan: {
      loanAccount: "3400112299",
      amount: 3200000,
      interestRate: 14,
      tenor: "18 Months",
      facilityType: "Seasonal Facility",
    },
    dates: {
      disbursementDate: "2026-04-26",
      finalRepaymentDate: "2027-10-26",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2026-04-18 09:10", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2026-04-19 12:20", user: "HO Admin" },
      { status: "APPROVED", timestamp: "2026-04-22 14:10", user: "DFO Signatory" },
      { status: "CERTIFICATE_GENERATED", timestamp: "2026-04-23 10:00", user: "DFO Officer" },
    ],
    repayments: [],
  },
  {
    id: "LN-702",
    status: "DISBURSED",
    bankDetails: {
      bankName: "Unity Farm Bank",
      state: "Nasarawa",
      lga: "Lafia",
      date: "2026-04-12",
    },
    borrower: {
      name: "Grace Yakubu",
      gender: "Female",
      phone: "08145566778",
      address: "Shendam Road, Lafia",
      bvn: "66778899001",
    },
    project: {
      location: "Lafia Poultry Hub",
      loanType: "Livestock",
      purpose: "Poultry stocking and feed procurement",
    },
    loan: {
      loanAccount: "4500221188",
      amount: 2750000,
      interestRate: 13,
      tenor: "12 Months",
      facilityType: "Livestock Credit",
    },
    dates: {
      disbursementDate: "2026-04-20",
      finalRepaymentDate: "2027-04-20",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2026-04-12 08:15", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2026-04-13 13:05", user: "HO Admin" },
      { status: "APPROVED", timestamp: "2026-04-16 15:30", user: "DFO Signatory" },
      { status: "CERTIFICATE_GENERATED", timestamp: "2026-04-17 10:45", user: "DFO Officer" },
      { status: "DISBURSED", timestamp: "2026-04-20 16:05", user: "Head Office Admin" },
    ],
    repayments: [],
  },
  {
    id: "LN-703",
    status: "CERTIFICATE_GENERATED",
    bankDetails: {
      bankName: "Prime Rural MFB",
      state: "Benue",
      lga: "Makurdi",
      date: "2026-04-16",
    },
    borrower: {
      name: "Terseer Orpine",
      gender: "Male",
      phone: "07012344321",
      address: "North Bank, Makurdi",
      bvn: "77889900112",
    },
    project: {
      location: "Makurdi Yam Belt",
      loanType: "Mixed",
      purpose: "Yam storage and distribution capital",
    },
    loan: {
      loanAccount: "7800456123",
      amount: 4100000,
      interestRate: 12.5,
      tenor: "24 Months",
      facilityType: "Value Chain Support",
    },
    dates: {
      disbursementDate: "2026-04-27",
      finalRepaymentDate: "2028-04-27",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2026-04-16 11:00", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2026-04-17 09:45", user: "HO Admin" },
      { status: "APPROVED", timestamp: "2026-04-21 13:10", user: "DFO Signatory" },
      { status: "CERTIFICATE_GENERATED", timestamp: "2026-04-24 09:20", user: "DFO Officer" },
    ],
    repayments: [],
  },
];
