// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface InvestmentPreferencesForm {
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  preferredDealSizeMin: number;
  preferredDealSizeMax: number;
  preferredPropertyTypes: string[];
}

export interface DealForm {
  title: string;
  propertyType: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  description: string;
  loanAmount: number;
  ltv: number;
  interestRate: number;
  term: number;
  riskRating: string;
  fundingGoal: number;
  minAllocation: number;
  maxAllocation: number;
  exitStrategy: string;
  borrowerSummary: string;
  incomeVerified: boolean;
}

export interface CommitmentForm {
  dealId: string;
  amount: number;
  confirmed: boolean;
}

export interface NDASigningForm {
  fullName: string;
  agreed: boolean;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Dashboard Types
export interface PortfolioSummary {
  totalInvested: number;
  activeDeals: number;
  pendingReturns: number;
  yieldToDate: number;
}

export interface DealSummary {
  id: string;
  title: string;
  propertyType: string;
  ltv: number;
  interestRate: number;
  term: number;
  maturityDate: string;
  allocation: number;
  status: string;
}

export interface ActivityItem {
  id: string;
  type: 'deal_opportunity' | 'payment_received' | 'commitment_approved' | 'report_available' | 'deal_status' | 'chat_message';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

// Chat Types
export interface ChatMessageWithSender {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  readBy: string[];
  createdAt: string;
}

export interface ChatRoomWithDetails {
  id: string;
  type: 'DEAL' | 'SUPPORT';
  name: string;
  dealId?: string;
  participants: {
    userId: string;
    name: string;
    avatar?: string;
    role: string;
  }[];
  lastMessage?: ChatMessageWithSender;
  unreadCount: number;
}

// Filter/Sort Types
export interface DealFilters {
  status?: string;
  propertyType?: string;
  search?: string;
  sortBy?: 'date' | 'amount' | 'rate' | 'maturity';
  sortOrder?: 'asc' | 'desc';
}

export interface ReportFilters {
  type?: string;
  dealId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Admin Types
export interface AdminStats {
  totalInvestors: number;
  totalAUM: number;
  activeDeals: number;
  pendingCommitments: number;
}

export interface InvestorOverview {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
  activeDeals: number;
  totalInvested: number;
  joinedDate: string;
  accountStatus: 'active' | 'suspended';
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// Notification Types
export type NotificationType =
  | 'DEAL_OPPORTUNITY'
  | 'DEAL_STATUS'
  | 'REPORT_UPLOADED'
  | 'CHAT_MESSAGE'
  | 'PROFILE_ACTION'
  | 'COMMITMENT_UPDATE'
  | 'SYSTEM';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
