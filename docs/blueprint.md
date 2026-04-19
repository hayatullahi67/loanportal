# **App Name**: FinGuard Portal

## Core Features:

- Role-Based Authentication & Dashboards: Secure login system with distinct dashboards and dedicated pages/flows for Admin, Microfinance, DFO Officer, DFO Signatory, and Head Office roles. Includes quick login buttons for demo purposes.
- Strict Workflow & Status Enforcement: Implement the six-step loan processing workflow, enforcing action progression (disabling actions if previous steps are not complete) across all dashboards with visual indicators.
- Comprehensive Loan Application Form: Microfinance dashboard feature allowing submission of new loan applications with detailed sections for bank, borrower, project, loan, dates, and file uploads, utilizing React Hook Form and Zod for validation.
- Centralized Loan Tracking & Details: A reusable tracking table component visible across relevant dashboards, displaying loan ID, borrower, amount, status, etc., with a modal to view full loan details, timeline, payment history, and certificate preview on row click.
- Proactive Notification System: Dynamic notifications (e.g., 'Loan LN001 waiting for your action') displayed via a bell icon and dropdown, guiding users to perform their required actions.
- AI-Powered Loan Summary Tool: Utilizes generative AI to create concise summaries of comprehensive loan application details for Head Office and DFO Officer roles, streamlining the review process.
- Digital Signature & Approval Interface: Dedicated DFO Signatory interface for approving loans, incorporating a user-friendly digital signature UI, only enabled after DFO verification is complete.

## Style Guidelines:

- Primary interactive color: A professional and stable blue (#2E68C8) to signify trust and clarity within a clean fintech aesthetic.
- Background color: A very light, subtly blue-tinged grey (#ECEFF3) providing a clean, bright canvas that enhances readability and modern feel.
- Accent color: A fresh and modern aqua (#4DC4CC) for secondary calls to action, highlights, and status indicators, offering visual contrast and an analogous palette harmony.
- All text: 'Inter' sans-serif, providing a modern, objective, and highly legible aesthetic suitable for a data-intensive fintech application. Note: currently only Google Fonts are supported.
- Clean, modern, and outline-style icons are to be used for clear visual communication, especially in navigation, dashboard actions, and status indicators, aligning with the fintech theme.
- Dashboards will feature a multi-column responsive layout with clear spacing, utilizing reusable sidebar and content area organisms for consistent structure across all roles. Soft shadows and rounded corners will provide a modern and friendly feel.
- Subtle and efficient animations, such as smooth transitions for state changes, hovers, and notifications, will be implemented to enhance user experience without impacting performance, adhering to optimization rules.