import {
  MADeal,
  MAPayment,
  MADocument,
  MA_DEAL_STATUS_MAP,
  MA_PAYMENT_STATUS_MAP,
  MA_PROPERTY_TYPE_MAP,
  MA_DOCUMENT_TYPE_MAP,
} from './types';

/**
 * Maps a Mortgage Automator deal to the local Prisma Deal shape.
 * Returns a partial object suitable for prisma create/update.
 */
export function mapMADealToDeal(maDeal: MADeal) {
  return {
    externalId: maDeal.id,
    title: `${maDeal.property.address}, ${maDeal.property.city}`,
    propertyAddress: maDeal.property.address,
    propertyCity: maDeal.property.city,
    propertyProvince: maDeal.property.province,
    propertyPostalCode: maDeal.property.postalCode,
    propertyType: (MA_PROPERTY_TYPE_MAP[maDeal.property.type.toLowerCase()] ??
      'RESIDENTIAL') as
      | 'RESIDENTIAL'
      | 'COMMERCIAL'
      | 'INDUSTRIAL'
      | 'MIXED_USE'
      | 'LAND',
    propertyValue: maDeal.property.value,
    loanAmount: maDeal.loanAmount,
    ltv: maDeal.ltv,
    interestRate: maDeal.interestRate,
    term: maDeal.term,
    amortization: maDeal.amortization,
    status: (MA_DEAL_STATUS_MAP[maDeal.status.toLowerCase()] ?? 'DRAFT') as
      | 'DRAFT'
      | 'PENDING_REVIEW'
      | 'UNDERWRITING'
      | 'APPROVED'
      | 'FUNDING'
      | 'FUNDED'
      | 'ACTIVE'
      | 'MATURED'
      | 'DEFAULT'
      | 'CLOSED',
    borrowerName: maDeal.borrower.name,
    borrowerCreditScore: maDeal.borrower.creditScore,
    borrowerIncomeVerified: maDeal.borrower.incomeVerified,
    borrowerDebtServiceRatio: maDeal.borrower.debtServiceRatio,
    borrowerEmploymentType: maDeal.borrower.employmentType,
    description: maDeal.description,
    riskRating: maDeal.riskRating,
    targetAmount: maDeal.targetAmount,
    minimumInvestment: maDeal.minimumInvestment,
    totalFunded: maDeal.totalFunded,
    maturityDate: maDeal.maturityDate ? new Date(maDeal.maturityDate) : null,
    fundedDate: maDeal.fundedDate ? new Date(maDeal.fundedDate) : null,
    closedDate: maDeal.closedDate ? new Date(maDeal.closedDate) : null,
    lastSyncedAt: new Date(),
  };
}

/**
 * Maps a Mortgage Automator payment to the local Prisma Payment shape.
 */
export function mapMAPaymentToPayment(maPayment: MAPayment, localDealId: string) {
  return {
    externalId: maPayment.id,
    dealId: localDealId,
    amount: maPayment.amount,
    principal: maPayment.principal,
    interest: maPayment.interest,
    dueDate: new Date(maPayment.dueDate),
    paidDate: maPayment.paidDate ? new Date(maPayment.paidDate) : null,
    status: (MA_PAYMENT_STATUS_MAP[maPayment.status.toLowerCase()] ??
      'SCHEDULED') as
      | 'SCHEDULED'
      | 'PENDING'
      | 'RECEIVED'
      | 'LATE'
      | 'MISSED'
      | 'PARTIAL',
    lastSyncedAt: new Date(),
  };
}

/**
 * Maps a Mortgage Automator document to the local Prisma Document shape.
 */
export function mapMADocumentToDocument(
  maDoc: MADocument,
  localDealId: string
) {
  return {
    externalId: maDoc.id,
    dealId: localDealId,
    type: (MA_DOCUMENT_TYPE_MAP[maDoc.type.toLowerCase()] ?? 'OTHER') as
      | 'NDA'
      | 'SUBSCRIPTION_AGREEMENT'
      | 'TAX_FORM'
      | 'KYC_DOCUMENT'
      | 'DEAL_SUMMARY'
      | 'APPRAISAL'
      | 'LEGAL_OPINION'
      | 'FINANCIAL_STATEMENT'
      | 'MORTGAGE_DOCUMENT'
      | 'REPORT'
      | 'OTHER',
    name: maDoc.name,
    s3Key: maDoc.url, // Will be replaced with actual S3 key if downloaded
    contentType: maDoc.contentType,
    fileSize: maDoc.fileSize,
    uploadedAt: new Date(maDoc.uploadedAt),
    lastSyncedAt: new Date(),
  };
}
