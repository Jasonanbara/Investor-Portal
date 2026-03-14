import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMortgageAutomatorClient } from '@/services/mortgage-automator';
import { mapMADealToDeal, mapMAPaymentToPayment, mapMADocumentToDocument } from '@/services/mortgage-automator';
import type { MAWebhookPayload } from '@/services/mortgage-automator';

/**
 * Verify the webhook signature using HMAC-SHA256.
 */
async function verifyWebhookSignature(
  body: string,
  signature: string | null
): Promise<boolean> {
  const secret = process.env.MORTGAGE_AUTOMATOR_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[Webhook] MORTGAGE_AUTOMATOR_WEBHOOK_SECRET is not set');
    return false;
  }

  if (!signature) {
    return false;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(body)
  );

  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-webhook-signature');

  // Verify signature
  const isValid = await verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn('[Webhook] Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: MAWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as MAWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Log the webhook event to audit log
  await prisma.auditLog.create({
    data: {
      action: 'webhook.received',
      entity: 'mortgage_automator',
      entityId: payload.event,
      metadata: {
        event: payload.event,
        timestamp: payload.timestamp,
        dataKeys: Object.keys(payload.data),
      },
    },
  });

  // Return 200 immediately, process async
  const response = NextResponse.json({ received: true }, { status: 200 });

  // Process webhook event asynchronously
  processWebhookEvent(payload).catch((error) => {
    console.error('[Webhook] Error processing event:', error);
  });

  return response;
}

async function processWebhookEvent(payload: MAWebhookPayload): Promise<void> {
  const { event, data } = payload;
  const client = getMortgageAutomatorClient();

  switch (event) {
    case 'deal.updated': {
      const externalDealId = data.dealId as string;
      if (!externalDealId) break;

      try {
        const maDeal = await client.getDealById(externalDealId);
        const dealData = mapMADealToDeal(maDeal);

        await prisma.deal.upsert({
          where: { externalId: externalDealId },
          create: dealData,
          update: dealData,
        });

        console.log(`[Webhook] Deal ${externalDealId} synced successfully`);
      } catch (error) {
        console.error(`[Webhook] Failed to sync deal ${externalDealId}:`, error);
      }
      break;
    }

    case 'payment.received': {
      const externalDealId = data.dealId as string;
      const paymentData = data.payment as {
        id: string;
        amount: number;
        principal: number;
        interest: number;
        dueDate: string;
        paidDate: string;
        status: string;
      };

      if (!externalDealId || !paymentData) break;

      try {
        const localDeal = await prisma.deal.findUnique({
          where: { externalId: externalDealId },
        });

        if (!localDeal) {
          console.warn(`[Webhook] Local deal not found for ${externalDealId}`);
          break;
        }

        const mapped = mapMAPaymentToPayment(
          {
            id: paymentData.id,
            dealId: externalDealId,
            amount: paymentData.amount,
            principal: paymentData.principal,
            interest: paymentData.interest,
            dueDate: paymentData.dueDate,
            paidDate: paymentData.paidDate,
            status: paymentData.status,
          },
          localDeal.id
        );

        await prisma.payment.upsert({
          where: { externalId: paymentData.id },
          create: mapped,
          update: mapped,
        });

        console.log(`[Webhook] Payment ${paymentData.id} recorded`);
      } catch (error) {
        console.error('[Webhook] Failed to record payment:', error);
      }
      break;
    }

    case 'document.uploaded': {
      const externalDealId = data.dealId as string;
      const docData = data.document as {
        id: string;
        type: string;
        name: string;
        url: string;
        contentType: string | null;
        fileSize: number | null;
        uploadedAt: string;
      };

      if (!externalDealId || !docData) break;

      try {
        const localDeal = await prisma.deal.findUnique({
          where: { externalId: externalDealId },
        });

        if (!localDeal) {
          console.warn(`[Webhook] Local deal not found for ${externalDealId}`);
          break;
        }

        const mapped = mapMADocumentToDocument(
          {
            id: docData.id,
            dealId: externalDealId,
            type: docData.type,
            name: docData.name,
            url: docData.url,
            contentType: docData.contentType,
            fileSize: docData.fileSize,
            uploadedAt: docData.uploadedAt,
          },
          localDeal.id
        );

        await prisma.document.upsert({
          where: { externalId: docData.id },
          create: mapped,
          update: mapped,
        });

        console.log(`[Webhook] Document ${docData.id} synced`);
      } catch (error) {
        console.error('[Webhook] Failed to sync document:', error);
      }
      break;
    }

    case 'borrower.updated': {
      const externalDealId = data.dealId as string;
      if (!externalDealId) break;

      try {
        const borrower = await client.getBorrowerData(externalDealId);

        await prisma.deal.update({
          where: { externalId: externalDealId },
          data: {
            borrowerName: borrower.name,
            borrowerCreditScore: borrower.creditScore,
            borrowerIncomeVerified: borrower.incomeVerified,
            borrowerDebtServiceRatio: borrower.debtServiceRatio,
            borrowerEmploymentType: borrower.employmentType,
            lastSyncedAt: new Date(),
          },
        });

        console.log(`[Webhook] Borrower data updated for deal ${externalDealId}`);
      } catch (error) {
        console.error('[Webhook] Failed to update borrower data:', error);
      }
      break;
    }

    default:
      console.warn(`[Webhook] Unknown event type: ${event}`);
  }
}
