import { MortgageAutomatorClient } from './client';
import { SyncService } from './sync';

export { MortgageAutomatorClient, MortgageAutomatorError } from './client';
export { SyncService } from './sync';
export {
  mapMADealToDeal,
  mapMAPaymentToPayment,
  mapMADocumentToDocument,
} from './mapper';
export type {
  MADeal,
  MAPayment,
  MABorrower,
  MADocument,
  MATransaction,
  MAWebhookPayload,
} from './types';

// Singleton instances - lazy initialization to avoid errors when env vars aren't set
let _client: MortgageAutomatorClient | null = null;
let _syncService: SyncService | null = null;

export function getMortgageAutomatorClient(): MortgageAutomatorClient {
  if (!_client) {
    _client = new MortgageAutomatorClient();
  }
  return _client;
}

export function getSyncService(): SyncService {
  if (!_syncService) {
    _syncService = new SyncService(getMortgageAutomatorClient());
  }
  return _syncService;
}
