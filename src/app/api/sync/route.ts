import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSyncService } from '@/services/mortgage-automator';

/**
 * Check if user has admin role. In a full implementation this would use
 * next-auth session, but for now we check via a header or session token.
 */
async function isAdmin(request: NextRequest): Promise<boolean> {
  // TODO: Replace with actual next-auth session check
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.slice(7);
  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    return false;
  }

  return session.user.role === 'SUPER_ADMIN' || session.user.role === 'ADMIN';
}

/**
 * POST /api/sync - Trigger a manual sync (admin only)
 */
export async function POST(request: NextRequest) {
  const authorized = await isAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const syncType = (body as { type?: string }).type ?? 'incremental';

    const syncService = getSyncService();

    // Get user ID from session for audit
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.slice(7);
    const session = token
      ? await prisma.session.findUnique({
          where: { sessionToken: token },
          select: { userId: true },
        })
      : null;

    const { syncLogId, results } =
      syncType === 'full'
        ? await syncService.fullSync(session?.userId)
        : await syncService.incrementalSync(session?.userId);

    return NextResponse.json({
      syncLogId,
      type: syncType,
      results,
    });
  } catch (error) {
    console.error('[Sync API] Error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync - Get last sync status and timestamp
 */
export async function GET(request: NextRequest) {
  const authorized = await isAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const lastSync = await prisma.syncLog.findFirst({
      orderBy: { startedAt: 'desc' },
    });

    const recentSyncs = await prisma.syncLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      lastSync: lastSync
        ? {
            id: lastSync.id,
            type: lastSync.type,
            status: lastSync.status,
            itemsSynced: lastSync.itemsSynced,
            errors: lastSync.errors,
            startedAt: lastSync.startedAt,
            completedAt: lastSync.completedAt,
            triggeredBy: lastSync.triggeredBy,
          }
        : null,
      recentSyncs: recentSyncs.map((s) => ({
        id: s.id,
        type: s.type,
        status: s.status,
        itemsSynced: s.itemsSynced,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
      })),
    });
  } catch (error) {
    console.error('[Sync API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
