// Mortgage Automator API response types

export interface MADeal {
  id: string;
  property: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    type: string;
    value: number;
  };
  borrower: {
    name: string;
    creditScore: number;
    incomeVerified: boolean;
    debtServiceRatio: number;
    employmentType: string;
  };
  loanAmount: number;
  ltv: number;
  interestRate: number;
  term: number; // months
  amortization: number | null;
  status: string;
  riskRating: string | null;
  description: string | null;
  targetAmount: number | null;
  minimumInvestment: number | null;
  maturityDate: string | null;
  fundedDate: string | null;
  closedDate: string | null;
  totalFunded: number;
  createdAt: string;
  updatedAt: string;
}

export interface MAPayment {
  id: string;
  dealId: string;
  amount: number;
  principal: number;
  interest: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
}

export interface MABorrower {
  id: string;
  creditScore: number;
  incomeVerified: boolean;
  debtServiceRatio: number;
  employmentType: string;
  name: string;
}

export interface MADocument {
  id: string;
  dealId: string;
  type: string;
  name: string;
  url: string;
  contentType: string | null;
  fileSize: number | null;
  uploadedAt: string;
}

export interface MATransaction {
  id: string;
  investorId: string;
  dealId: string;
  type: string;
  amount: number;
  date: string;
  description: string | null;
}

export interface MAWebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

// Status mapping from Mortgage Automator to local enum values
export const MA_DEAL_STATUS_MAP: Record<string, string> = {
  draft: 'DRAFT',
  pending_review: 'PENDING_REVIEW',
  underwriting: 'UNDERWRITING',
  approved: 'APPROVED',
  funding: 'FUNDING',
  funded: 'FUNDED',
  active: 'ACTIVE',
  matured: 'MATURED',
  default: 'DEFAULT',
  closed: 'CLOSED',
};

export const MA_PAYMENT_STATUS_MAP: Record<string, string> = {
  scheduled: 'SCHEDULED',
  pending: 'PENDING',
  received: 'RECEIVED',
  late: 'LATE',
  missed: 'MISSED',
  partial: 'PARTIAL',
};

export const MA_PROPERTY_TYPE_MAP: Record<string, string> = {
  residential: 'RESIDENTIAL',
  commercial: 'COMMERCIAL',
  industrial: 'INDUSTRIAL',
  mixed_use: 'MIXED_USE',
  land: 'LAND',
};

export const MA_DOCUMENT_TYPE_MAP: Record<string, string> = {
  nda: 'NDA',
  subscription_agreement: 'SUBSCRIPTION_AGREEMENT',
  tax_form: 'TAX_FORM',
  kyc_document: 'KYC_DOCUMENT',
  deal_summary: 'DEAL_SUMMARY',
  appraisal: 'APPRAISAL',
  legal_opinion: 'LEGAL_OPINION',
  financial_statement: 'FINANCIAL_STATEMENT',
  mortgage_document: 'MORTGAGE_DOCUMENT',
  report: 'REPORT',
  other: 'OTHER',
};
