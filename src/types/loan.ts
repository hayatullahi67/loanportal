export type LoanStatus = 
  | 'PENDING_HEAD_OFFICE_STAMP'
  | 'AWAITING_DFO_VERIFICATION'
  | 'AWAITING_SIGNATORY_APPROVAL'
  | 'APPROVED'
  | 'CERTIFICATE_GENERATED'
  | 'DISBURSED';

export type LoanType = 'Livestock' | 'Crop' | 'Mixed';

export interface BorrowerDetails {
  name: string;
  gender: 'Male' | 'Female';
  phone: string;
  address: string;
  bvn: string;
}

export interface BankDetails {
  bankName: string;
  state: string;
  lga: string;
  date: string;
}

export interface ProjectDetails {
  location: string;
  loanType: LoanType;
  purpose: string;
}

export interface LoanFinancials {
  loanAccount: string;
  amount: number;
  interestRate: number;
  tenor: string;
  facilityType: string;
}

export interface LoanDates {
  disbursementDate: string;
  finalRepaymentDate: string;
}

export interface Repayment {
  id: string;
  date: string;
  amount: number;
  status: 'PAID' | 'OVERDUE' | 'UPCOMING';
}

export interface LoanApplication {
  id: string;
  status: LoanStatus;
  bankDetails: BankDetails;
  borrower: BorrowerDetails;
  project: ProjectDetails;
  loan: LoanFinancials;
  dates: LoanDates;
  timeline: {
    status: LoanStatus;
    timestamp: string;
    user: string;
    note?: string;
  }[];
  repayments: Repayment[];
  passportUrl?: string;
  collateralUrl?: string;
}

export const STATUS_LABELS: Record<LoanStatus, string> = {
  PENDING_HEAD_OFFICE_STAMP: '⏳ Pending Stamp',
  AWAITING_DFO_VERIFICATION: '🟡 Awaiting Verification',
  AWAITING_SIGNATORY_APPROVAL: '🔵 Awaiting Approval',
  APPROVED: '🟢 Approved',
  CERTIFICATE_GENERATED: '🧾 Certificate Generated',
  DISBURSED: '💰 Disbursed',
};