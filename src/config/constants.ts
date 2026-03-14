export const COMPANY_NAME = 'NorthLend Financial';
export const COMPANY_WEBSITE = 'https://www.northlendfinancial.com';
export const SUPPORT_EMAIL = 'support@northlendfinancial.com';

export const PASSWORD_MIN_LENGTH = 12;
export const SESSION_TIMEOUT_MINUTES = 15;
export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const KYC_EXPIRY_DAYS = 365;
export const PAGE_SIZE = 10;

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PROPERTY_TYPES = [
  { value: 'RESIDENTIAL', label: 'Residential' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
  { value: 'LAND', label: 'Land' },
  { value: 'MIXED_USE', label: 'Mixed Use' },
] as const;

export const RISK_LEVELS = [
  { value: 'LOW', label: 'Low', color: '#4CAF50' },
  { value: 'MEDIUM', label: 'Medium', color: '#FFB300' },
  { value: 'HIGH', label: 'High', color: '#E53935' },
] as const;

export const DEAL_STATUSES = [
  { value: 'DRAFT', label: 'Draft', color: '#8b8fa3' },
  { value: 'OPEN', label: 'Open', color: '#C6AB4E' },
  { value: 'FUNDING', label: 'Funding', color: '#FFB300' },
  { value: 'FUNDED', label: 'Funded', color: '#4CAF50' },
  { value: 'ACTIVE', label: 'Active', color: '#4CAF50' },
  { value: 'MATURING', label: 'Maturing', color: '#2196F3' },
  { value: 'REPAID', label: 'Repaid', color: '#4CAF50' },
  { value: 'DEFAULT', label: 'Default', color: '#E53935' },
  { value: 'CLOSED', label: 'Closed', color: '#8b8fa3' },
] as const;

export const INVESTMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: '#FFB300' },
  { value: 'APPROVED', label: 'Approved', color: '#4CAF50' },
  { value: 'REJECTED', label: 'Rejected', color: '#E53935' },
  { value: 'CANCELLED', label: 'Cancelled', color: '#8b8fa3' },
  { value: 'ACTIVE', label: 'Active', color: '#4CAF50' },
  { value: 'MATURED', label: 'Matured', color: '#2196F3' },
  { value: 'DEFAULTED', label: 'Defaulted', color: '#E53935' },
] as const;

export const KYC_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: '#FFB300' },
  { value: 'SUBMITTED', label: 'Submitted', color: '#2196F3' },
  { value: 'APPROVED', label: 'Approved', color: '#4CAF50' },
  { value: 'REJECTED', label: 'Rejected', color: '#E53935' },
  { value: 'EXPIRED', label: 'Expired', color: '#8b8fa3' },
] as const;

export const CANADIAN_PROVINCES = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
] as const;

export const MASTER_NDA_TEXT = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of the date of electronic signature below, by and between NorthLend Financial Inc. ("Company") and the undersigned investor ("Recipient").

1. CONFIDENTIAL INFORMATION
The Recipient acknowledges that in connection with evaluating potential mortgage investment opportunities presented by the Company, the Recipient may receive confidential and proprietary information including but not limited to: borrower personal and financial information, property appraisals, credit reports, income verification documents, loan terms, and other sensitive business information (collectively, "Confidential Information").

2. NON-DISCLOSURE OBLIGATIONS
The Recipient agrees to:
(a) Hold all Confidential Information in strict confidence;
(b) Not disclose any Confidential Information to any third party without prior written consent of the Company;
(c) Use the Confidential Information solely for the purpose of evaluating potential investment opportunities;
(d) Take all reasonable measures to protect the secrecy of and avoid disclosure or unauthorized use of Confidential Information;
(e) Not copy or reproduce any Confidential Information except as reasonably necessary for evaluation purposes.

3. EXCLUSIONS
This Agreement does not apply to information that:
(a) Is or becomes publicly available through no fault of the Recipient;
(b) Was already known to the Recipient prior to disclosure;
(c) Is independently developed by the Recipient without use of Confidential Information;
(d) Is disclosed pursuant to a court order or legal requirement, provided the Recipient gives prompt notice to the Company.

4. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of execution. The obligations of confidentiality shall survive termination of this Agreement.

5. REMEDIES
The Recipient acknowledges that any breach of this Agreement may cause irreparable harm to the Company and that monetary damages may be inadequate. The Company shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or in equity.

6. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein.

7. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, or agreements relating thereto.

By signing below, the Recipient acknowledges that they have read, understood, and agree to be bound by the terms of this Non-Disclosure Agreement.`;
