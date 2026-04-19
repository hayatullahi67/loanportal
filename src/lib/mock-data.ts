import { LoanApplication } from "@/types/loan";

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
      purpose: "Poultry expansion and feed purchase for 5000 birds",
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
      purpose: "Maize cultivation and tractor leasing for 50 hectares",
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
  {
    id: "LN-003",
    status: "DISBURSED",
    bankDetails: {
      bankName: "Green Harvest MFB",
      state: "Kano",
      lga: "Dala",
      date: "2024-02-10",
    },
    borrower: {
      name: "Musa Ibrahim",
      gender: "Male",
      phone: "08109988776",
      address: "99 Grain Road, Kano",
      bvn: "44455566677",
    },
    project: {
      location: "Kano North Fields",
      loanType: "Mixed",
      purpose: "Irrigation setup and wheat seed procurement",
    },
    loan: {
      loanAccount: "1122334455",
      amount: 10000000,
      interestRate: 10,
      tenor: "36 Months",
      facilityType: "Capital Investment",
    },
    dates: {
      disbursementDate: "2024-03-01",
      finalRepaymentDate: "2027-03-01",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2024-02-10 11:00", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2024-02-12 09:00", user: "HO Admin" },
      { status: "APPROVED", timestamp: "2024-02-25 15:00", user: "DFO Signatory" },
      { status: "DISBURSED", timestamp: "2024-03-01 16:30", user: "HO Admin" },
    ],
    repayments: [
      { id: "R-001", date: "2024-04-01", amount: 350000, status: "PAID" }
    ],
  },
  {
    id: "LN-004",
    status: "AWAITING_SIGNATORY_APPROVAL",
    bankDetails: {
      bankName: "Unity Microfinance Bank",
      state: "Kaduna",
      lga: "Zaria",
      date: "2024-03-18",
    },
    borrower: {
      name: "Aisha Bello",
      gender: "Female",
      phone: "09011223344",
      address: "22 Scholars Lane, Zaria",
      bvn: "55566677788",
    },
    project: {
      location: "Zaria Outskirts",
      loanType: "Livestock",
      purpose: "Goat rearing and dairy processing equipment",
    },
    loan: {
      loanAccount: "9988776655",
      amount: 3800000,
      interestRate: 14,
      tenor: "18 Months",
      facilityType: "Agri-Asset Finance",
    },
    dates: {
      disbursementDate: "2024-04-10",
      finalRepaymentDate: "2025-10-10",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2024-03-18 13:00", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2024-03-20 10:00", user: "HO Admin" },
      { status: "AWAITING_SIGNATORY_APPROVAL", timestamp: "2024-03-22 16:00", user: "DFO Officer" },
    ],
    repayments: [],
  },
  {
    id: "LN-005",
    status: "CERTIFICATE_GENERATED",
    bankDetails: {
      bankName: "Apex MFB",
      state: "Anambra",
      lga: "Awka South",
      date: "2024-03-05",
    },
    borrower: {
      name: "Chidi Okafor",
      gender: "Male",
      phone: "08055443322",
      address: "10 Innovation Way, Awka",
      bvn: "99988877766",
    },
    project: {
      location: "Awka Industrial Cluster",
      loanType: "Mixed",
      purpose: "Fish farming and organic fertilizer production",
    },
    loan: {
      loanAccount: "4433221100",
      amount: 7200000,
      interestRate: 13,
      tenor: "24 Months",
      facilityType: "Value Chain Finance",
    },
    dates: {
      disbursementDate: "2024-03-28",
      finalRepaymentDate: "2026-03-28",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2024-03-05 08:30", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2024-03-07 11:00", user: "HO Admin" },
      { status: "APPROVED", timestamp: "2024-03-15 14:00", user: "DFO Signatory" },
      { status: "CERTIFICATE_GENERATED", timestamp: "2024-03-18 10:00", user: "DFO Officer" },
    ],
    repayments: [],
  },
  {
    id: "LN-006",
    status: "APPROVED",
    bankDetails: {
      bankName: "Trust Microfinance",
      state: "Edo",
      lga: "Oredo",
      date: "2024-03-12",
    },
    borrower: {
      name: "Osas Igbinedion",
      gender: "Male",
      phone: "07033445566",
      address: "77 Oba Market Road, Benin City",
      bvn: "33344455511",
    },
    project: {
      location: "Ovia North Farm",
      loanType: "Crop",
      purpose: "Cassava processing mill and solar power install",
    },
    loan: {
      loanAccount: "8877665544",
      amount: 4500000,
      interestRate: 14.5,
      tenor: "30 Months",
      facilityType: "Agri-Processing Loan",
    },
    dates: {
      disbursementDate: "2024-04-05",
      finalRepaymentDate: "2026-10-05",
    },
    timeline: [
      { status: "PENDING_HEAD_OFFICE_STAMP", timestamp: "2024-03-12 14:00", user: "MFB Officer" },
      { status: "AWAITING_DFO_VERIFICATION", timestamp: "2024-03-14 09:00", user: "HO Admin" },
      { status: "AWAITING_SIGNATORY_APPROVAL", timestamp: "2024-03-20 12:00", user: "DFO Officer" },
      { status: "APPROVED", timestamp: "2024-03-21 15:30", user: "DFO Signatory" },
    ],
    repayments: [],
  }
];