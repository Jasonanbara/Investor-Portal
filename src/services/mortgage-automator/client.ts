import {
  MADeal,
  MAPayment,
  MABorrower,
  MADocument,
  MATransaction,
} from './types';

export class MortgageAutomatorError extends Error {
  public statusCode: number;
  public responseBody: unknown;

  constructor(message: string, statusCode: number, responseBody?: unknown) {
    super(message);
    this.name = 'MortgageAutomatorError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

interface ClientConfig {
  apiUrl: string;
  apiKey: string;
  maxRetries?: number;
  baseDelay?: number;
}

export class MortgageAutomatorClient {
  private apiUrl: string;
  private apiKey: string;
  private maxRetries: number;
  private baseDelay: number;

  constructor(config?: Partial<ClientConfig>) {
    this.apiUrl = config?.apiUrl ?? process.env.MORTGAGE_AUTOMATOR_API_URL ?? '';
    this.apiKey = config?.apiKey ?? process.env.MORTGAGE_AUTOMATOR_API_KEY ?? '';
    this.maxRetries = config?.maxRetries ?? 3;
    this.baseDelay = config?.baseDelay ?? 1000;

    if (!this.apiUrl) {
      throw new MortgageAutomatorError(
        'MORTGAGE_AUTOMATOR_API_URL is not configured',
        0
      );
    }
    if (!this.apiKey) {
      throw new MortgageAutomatorError(
        'MORTGAGE_AUTOMATOR_API_KEY is not configured',
        0
      );
    }
  }

  private async fetchWithAuth<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...(options.headers as Record<string, string>),
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(
          `[MortgageAutomator] ${options.method ?? 'GET'} ${path} (attempt ${attempt}/${this.maxRetries})`
        );

        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          const body = await response.text();
          let parsedBody: unknown;
          try {
            parsedBody = JSON.parse(body);
          } catch {
            parsedBody = body;
          }

          throw new MortgageAutomatorError(
            `Mortgage Automator API error: ${response.status} ${response.statusText}`,
            response.status,
            parsedBody
          );
        }

        const data = (await response.json()) as T;
        console.log(`[MortgageAutomator] ${path} responded successfully`);
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on 4xx client errors (except 429)
        if (
          error instanceof MortgageAutomatorError &&
          error.statusCode >= 400 &&
          error.statusCode < 500 &&
          error.statusCode !== 429
        ) {
          throw error;
        }

        if (attempt < this.maxRetries) {
          const delay = this.baseDelay * Math.pow(2, attempt - 1);
          console.warn(
            `[MortgageAutomator] Request failed, retrying in ${delay}ms...`,
            lastError.message
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw (
      lastError ??
      new MortgageAutomatorError('Request failed after all retries', 0)
    );
  }

  // ─── Deal Methods ────────────────────────────────────────────────────

  async getDeals(): Promise<MADeal[]> {
    return this.fetchWithAuth<MADeal[]>('/deals');
  }

  async getDealById(id: string): Promise<MADeal> {
    return this.fetchWithAuth<MADeal>(`/deals/${id}`);
  }

  async getDealPayments(dealId: string): Promise<MAPayment[]> {
    return this.fetchWithAuth<MAPayment[]>(`/deals/${dealId}/payments`);
  }

  async getBorrowerData(dealId: string): Promise<MABorrower> {
    return this.fetchWithAuth<MABorrower>(`/deals/${dealId}/borrower`);
  }

  async getDocuments(dealId: string): Promise<MADocument[]> {
    return this.fetchWithAuth<MADocument[]>(`/deals/${dealId}/documents`);
  }

  // ─── Investor Methods ────────────────────────────────────────────────

  async getInvestorTransactions(investorId: string): Promise<MATransaction[]> {
    return this.fetchWithAuth<MATransaction[]>(
      `/investors/${investorId}/transactions`
    );
  }

  // ─── Sync Methods ────────────────────────────────────────────────────

  async syncDealStatus(dealId: string): Promise<void> {
    await this.fetchWithAuth(`/deals/${dealId}/sync`, { method: 'POST' });
  }
}
