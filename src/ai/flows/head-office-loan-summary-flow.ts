'use server';
/**
 * @fileOverview A Genkit flow for generating a concise summary of a loan application for Head Office users.
 *
 * - headOfficeLoanSummary - A function that handles the generation of the loan summary.
 * - HeadOfficeLoanSummaryInput - The input type for the headOfficeLoanSummary function.
 * - HeadOfficeLoanSummaryOutput - The return type for the headOfficeLoanSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HeadOfficeLoanSummaryInputSchema = z.object({
  bankDetails: z.object({
    bankName: z.string().describe('The name of the bank.'),
    state: z.string().describe('The state where the bank is located.'),
    lga: z.string().describe('The Local Government Area of the bank.'),
    date: z.string().describe('The date of the application.'),
  }),
  borrower: z.object({
    name: z.string().describe('The name of the borrower.'),
    gender: z.string().describe('The gender of the borrower.'),
    phone: z.string().describe('The phone number of the borrower.'),
    address: z.string().describe('The address of the borrower.'),
    bvn: z.string().length(11).describe('The Bank Verification Number (BVN) of the borrower (11 digits).'),
  }),
  project: z.object({
    location: z.string().describe('The project location.'),
    loanType: z.enum(['Livestock', 'Crop', 'Mixed']).describe('The type of loan (Livestock, Crop, or Mixed).'),
    purpose: z.string().describe('The purpose of the loan.'),
  }),
  loan: z.object({
    loanAccount: z.string().length(10).describe('The loan account number (10 digits).'),
    amount: z.number().describe('The loan amount in Naira.'),
    interestRate: z.number().describe('The interest rate of the loan.'),
    tenor: z.string().describe('The tenor of the loan.'),
    facilityType: z.string().describe('The facility type of the loan.'),
  }),
  dates: z.object({
    disbursementDate: z.string().describe('The disbursement date of the loan.'),
    finalRepaymentDate: z.string().describe('The final repayment date of the loan.'),
  }),
}).describe('Comprehensive details of a loan application.');
export type HeadOfficeLoanSummaryInput = z.infer<typeof HeadOfficeLoanSummaryInputSchema>;

const HeadOfficeLoanSummaryOutputSchema = z.string().describe('A concise summary of the loan application details.');
export type HeadOfficeLoanSummaryOutput = z.infer<typeof HeadOfficeLoanSummaryOutputSchema>;

export async function headOfficeLoanSummary(input: HeadOfficeLoanSummaryInput): Promise<HeadOfficeLoanSummaryOutput> {
  return headOfficeLoanSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'headOfficeLoanSummaryPrompt',
  input: { schema: HeadOfficeLoanSummaryInputSchema },
  output: { schema: HeadOfficeLoanSummaryOutputSchema },
  prompt: `As a Head Office user, you need a concise summary of a loan application's key details to make faster initial stamping decisions.

Generate a brief, bullet-point summary highlighting the most critical information from the following loan application, including:
- Borrower's Name and BVN
- Loan Amount, Type, and Purpose
- Key Dates (Disbursement and Final Repayment)
- Bank Name

Loan Application Details:
Bank Name: {{{bankDetails.bankName}}}
State: {{{bankDetails.state}}}
LGA: {{{bankDetails.lga}}}
Application Date: {{{bankDetails.date}}}

Borrower Name: {{{borrower.name}}}
Borrower Gender: {{{borrower.gender}}}
Borrower Phone: {{{borrower.phone}}}
Borrower Address: {{{borrower.address}}}
Borrower BVN: {{{borrower.bvn}}}

Project Location: {{{project.location}}}
Loan Type: {{{project.loanType}}}
Loan Purpose: {{{project.purpose}}}

Loan Account: {{{loan.loanAccount}}}
Loan Amount: ₦{{{loan.amount}}}
Interest Rate: {{{loan.interestRate}}}%
Tenor: {{{loan.tenor}}}
Facility Type: {{{loan.facilityType}}}

Disbursement Date: {{{dates.disbursementDate}}}
Final Repayment Date: {{{dates.finalRepaymentDate}}}`,
});

const headOfficeLoanSummaryFlow = ai.defineFlow(
  {
    name: 'headOfficeLoanSummaryFlow',
    inputSchema: HeadOfficeLoanSummaryInputSchema,
    outputSchema: HeadOfficeLoanSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
