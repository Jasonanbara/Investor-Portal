import { prisma } from '@/lib/prisma';
import { MortgageAutomatorClient } from './client';
import { mapMADealToDeal, mapMAPaymentToPayment, mapMADocumentToDocument } from './mapper';

interface SyncResult {
  type: string;
  itemsSynced: number;
  errors: Array<{ id: string; error: string }>;
}

export class SyncService {
  private client: MortgageAutomatorClient;

  constructor(client: MortgageAutomatorClient) {
    this.client = client;
  }

  /**
   * Sync all deals from Mortgage Automator to local DB.
   */
  async syncAllDeals(): Promise<SyncResult> {
    const result: SyncResult = { type: 'deals', itemsSynced: 0, errors: [] };

    try {
      const maDeals = await this.client.getDeals();

      for (const maDeal of maDeals) {
        try {
          const dealData = mapMADealToDeal(maDeal);

          await prisma.deal.upsert({
            where: { externalId: maDeal.id },
            create: dealData,
            update: dealData,
          });

          result.itemsSynced++;
        } catch (error) {
          result.errors.push({
            id: maDeal.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    } catch (error) {
      result.errors.push({
        id: 'all',
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return result;
  }

  /**
   * Sync a single deal by its Mortgage Automator ID.
   */
  async syncDeal(externalDealId: string): Promise<SyncResult> {
    const result: SyncResult = { type: 'deal', itemsSynced: 0, errors: [] };

    try {
      const maDeal = await this.client.getDealById(externalDealId);
      const dealData = mapMADealToDeal(maDeal);

      await prisma.deal.upsert({
        where: { externalId: externalDealId },
        create: dealData,
        update: dealData,
      });

      result.itemsSynced = 1;
    } catch (error) {
      result.errors.push({
        id: externalDealId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return result;
  }

  /**
   * Sync payments for a deal (by external deal ID).
   */
  async syncPayments(externalDealId: string): Promise<SyncResult> {
    const result: SyncResult = { type: 'payments', itemsSynced: 0, errors: [] };

    try {
      // Find local deal by external ID
      const localDeal = await prisma.deal.findUnique({
        where: { externalId: externalDealId },
      });

      if (!localDeal) {
        result.errors.push({
          id: externalDealId,
          error: `Local deal not found for external ID: ${externalDealId}`,
        });
        return result;
      }

      const maPayments = await this.client.getDealPayments(externalDealId);

      for (const maPayment of maPayments) {
        try {
          const paymentData = mapMAPaymentToPayment(maPayment, localDeal.id);

          await prisma.payment.upsert({
            where: { externalId: maPayment.id },
            create: paymentData,
            update: paymentData,
          });

          result.itemsSynced++;
        } catch (error) {
          result.errors.push({
            id: maPayment.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    } catch (error) {
      result.errors.push({
        id: externalDealId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return result;
  }

  /**
   * Sync documents for a deal (by external deal ID).
   */
  async syncDocuments(externalDealId: string): Promise<SyncResult> {
    const result: SyncResult = {
      type: 'documents',
      itemsSynced: 0,
      errors: [],
    };

    try {
      const localDeal = await prisma.deal.findUnique({
        where: { externalId: externalDealId },
      });

      if (!localDeal) {
        result.errors.push({
          id: externalDealId,
          error: `Local deal not found for external ID: ${externalDealId}`,
        });
        return result;
      }

      const maDocuments = await this.client.getDocuments(externalDealId);

      for (const maDoc of maDocuments) {
        try {
          const docData = mapMADocumentToDocument(maDoc, localDeal.id);

          await prisma.document.upsert({
            where: { externalId: maDoc.id },
            create: docData,
            update: docData,
          });

          result.itemsSynced++;
        } catch (error) {
          result.errors.push({
            id: maDoc.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    } catch (error) {
      result.errors.push({
        id: externalDealId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return result;
  }

  /**
   * Full sync: syncs all deals, then payments and documents for each deal.
   * Supports incremental sync using lastSyncedAt timestamps.
   */
  async fullSync(triggeredBy?: string): Promise<{
    syncLogId: string;
    results: SyncResult[];
  }> {
    const syncLog = await prisma.syncLog.create({
      data: {
        type: 'full',
        status: 'running',
        triggeredBy: triggeredBy ?? 'system',
      },
    });

    const results: SyncResult[] = [];

    try {
      // Step 1: Sync all deals
      const dealResult = await this.syncAllDeals();
      results.push(dealResult);

      // Step 2: For each deal with an external ID, sync payments and documents
      const deals = await prisma.deal.findMany({
        where: { externalId: { not: null } },
        select: { externalId: true },
      });

      for (const deal of deals) {
        if (deal.externalId) {
          const paymentResult = await this.syncPayments(deal.externalId);
          results.push(paymentResult);

          const docResult = await this.syncDocuments(deal.externalId);
          results.push(docResult);
        }
      }

      const totalSynced = results.reduce((sum, r) => sum + r.itemsSynced, 0);
      const allErrors = results.flatMap((r) => r.errors);

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: allErrors.length > 0 ? 'completed' : 'completed',
          itemsSynced: totalSynced,
          errors: allErrors.length > 0 ? allErrors : undefined,
          completedAt: new Date(),
        },
      });
    } catch (error) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'failed',
          errors: [
            {
              id: 'full-sync',
              error: error instanceof Error ? error.message : String(error),
            },
          ],
          completedAt: new Date(),
        },
      });
    }

    return { syncLogId: syncLog.id, results };
  }

  /**
   * Incremental sync: only syncs deals updated since last successful sync.
   */
  async incrementalSync(triggeredBy?: string): Promise<{
    syncLogId: string;
    results: SyncResult[];
  }> {
    // Get last successful sync timestamp
    const lastSync = await prisma.syncLog.findFirst({
      where: { status: 'completed', type: 'full' },
      orderBy: { completedAt: 'desc' },
    });

    // If no previous sync, run full sync
    if (!lastSync?.completedAt) {
      return this.fullSync(triggeredBy);
    }

    const syncLog = await prisma.syncLog.create({
      data: {
        type: 'incremental',
        status: 'running',
        triggeredBy: triggeredBy ?? 'system',
      },
    });

    const results: SyncResult[] = [];

    try {
      // Sync all deals (the API doesn't support filtering by date, so we sync all
      // but could optimize with lastSyncedAt comparisons locally)
      const dealResult = await this.syncAllDeals();
      results.push(dealResult);

      // Only sync payments/documents for deals updated since last sync
      const recentlyUpdatedDeals = await prisma.deal.findMany({
        where: {
          externalId: { not: null },
          updatedAt: { gte: lastSync.completedAt },
        },
        select: { externalId: true },
      });

      for (const deal of recentlyUpdatedDeals) {
        if (deal.externalId) {
          const paymentResult = await this.syncPayments(deal.externalId);
          results.push(paymentResult);

          const docResult = await this.syncDocuments(deal.externalId);
          results.push(docResult);
        }
      }

      const totalSynced = results.reduce((sum, r) => sum + r.itemsSynced, 0);
      const allErrors = results.flatMap((r) => r.errors);

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'completed',
          itemsSynced: totalSynced,
          errors: allErrors.length > 0 ? allErrors : undefined,
          completedAt: new Date(),
        },
      });
    } catch (error) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'failed',
          errors: [
            {
              id: 'incremental-sync',
              error: error instanceof Error ? error.message : String(error),
            },
          ],
          completedAt: new Date(),
        },
      });
    }

    return { syncLogId: syncLog.id, results };
  }
}
