'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating a concise summary of a loan application
 * for a DFO Officer. The summary helps the officer efficiently review and verify essential information.
 *
 * - generateDfoOfficerVerificationSummary - A function that generates the loan application summary.
 * - DfoOfficerVerificationSummaryInput - The input type for the summary generation.
 * - DfoOfficerVerificationSummaryOutput - The return type for the summary generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DfoOfficerVerificationSummaryInputSchema = z.object({
  bankDetails: z.object({
    bankName: z.string().describe('The name of the microfinance bank.'),
    state: z.string().describe('The state where the bank is located.'),
    lga: z.string().describe('The Local Government Area of the bank.'),
    applicationDate: z.string().describe('The date the loan application was submitted (e.g., "YYYY-MM-DD").'),
  }),
  borrowerDetails: z.object({
    name: z.string().describe('The full name of the borrower.'),
    gender: z.string().describe('The gender of the borrower.'),
    phone: z.string().describe('The phone number of the borrower.'),
    address: z.string().describe('The residential address of the borrower.'),
    bvn: z.string().length(11).describe('The Bank Verification Number (BVN) of the borrower.'),
  }),
  projectDetails: z.object({
    location: z.string().describe('The location of the project.'),
    loanType: z.enum(['Livestock', 'Crop', 'Mixed']).describe('The type of loan project.'),
    purpose: z.string().describe('The purpose of the loan.'),
  }),
  loanDetails: z.object({
    loanAccount: z.string().length(10).describe('The loan account number.'),
    amount: z.number().positive().describe('The loan amount in Naira.'),
    interestRate: z.number().min(0).describe('The annual interest rate of the loan.'),
    tenor: z.string().describe('The repayment tenor of the loan (e.g., "12 months").'),
    facilityType: z.string().describe('The type of facility (e.g., "Term Loan").'),
  }),
  dateDetails: z.object({
    disbursementDate: z.string().describe('The expected disbursement date of the loan (e.g., "YYYY-MM-DD").'),
    finalRepaymentDate: z.string().describe('The final repayment date of the loan (e.g., "YYYY-MM-DD").'),
  }),
});

export type DfoOfficerVerificationSummaryInput = z.infer<typeof DfoOfficerVerificationSummaryInputSchema>;

const DfoOfficerVerificationSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the loan application for DFO Officer verification.'),
});

export type DfoOfficerVerificationSummaryOutput = z.infer<typeof DfoOfficerVerificationSummaryOutputSchema>;

export async function generateDfoOfficerVerificationSummary(
  input: DfoOfficerVerificationSummaryInput
): Promise<DfoOfficerVerificationSummaryOutput> {
  return dfoOfficerVerificationSummaryFlow(input);
}

const dfoOfficerSummaryPrompt = ai.definePrompt({
  name: 'dfoOfficerSummaryPrompt',
  input: { schema: DfoOfficerVerificationSummaryInputSchema },
  output: { schema: DfoOfficerVerificationSummaryOutputSchema },
  prompt: `You are an AI assistant tasked with summarizing a loan application for a DFO Officer. The DFO Officer needs a concise summary of essential information to efficiently review and verify the application before proceeding to signatory approval.

Provide a clear, brief, and structured summary covering the following key aspects from the provided loan application details:
- **Borrower Information**: Name, BVN, Gender, Address, Phone, and a brief mention of the project type and location.
- **Loan Details**: Loan Account, Amount (NGN), Purpose, Interest Rate, Tenor, and Facility Type.
- **Bank Details**: Originating bank name, state, LGA, and the application date.
- **Key Dates**: Expected disbursement date and final repayment date.

Ensure the summary is easy to read, focuses on critical data points for verification, and uses clear headings for each section.

---
Loan Application Details:

**Bank Details:**
Bank Name: {{{bankDetails.bankName}}}
State: {{{bankDetails.state}}}
LGA: {{{bankDetails.lga}}}
Application Date: {{{bankDetails.applicationDate}}}

**Borrower Details:**
Name: {{{borrowerDetails.name}}}
Gender: {{{borrowerDetails.gender}}}
Phone: {{{borrowerDetails.phone}}}
Address: {{{borrowerDetails.address}}}
BVN: {{{borrowerDetails.bvn}}}

**Project Details:**
Location: {{{projectDetails.location}}}
Loan Type: {{{projectDetails.loanType}}}
Purpose: {{{projectDetails.purpose}}}

**Loan Details:**
Loan Account: {{{loanDetails.loanAccount}}}
Amount: NGN {{{loanDetails.amount}}}
Interest Rate: {{{loanDetails.interestRate}}}%
Tenor: {{{loanDetails.tenor}}}
Facility Type: {{{loanDetails.facilityType}}}

**Date Details:**
Disbursement Date: {{{dateDetails.disbursementDate}}}
Final Repayment Date: {{{dateDetails.finalRepaymentDate}}}
---`,
});

const dfoOfficerVerificationSummaryFlow = ai.defineFlow(
  {
    name: 'dfoOfficerVerificationSummaryFlow',
    inputSchema: DfoOfficerVerificationSummaryInputSchema,
    outputSchema: DfoOfficerVerificationSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await dfoOfficerSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate DFO Officer verification summary.');
    }
    return output;
  }
);
