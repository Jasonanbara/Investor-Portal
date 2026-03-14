import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/health - Health check endpoint
 * Used by Docker healthcheck and load balancers.
 */
export async function GET() {
  const version = process.env.APP_VERSION ?? '0.1.0';

  try {
    // Check DB connectivity with a lightweight query
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version,
      database: 'connected',
    });
  } catch (error) {
    console.error('[Health] Database check failed:', error);

    return NextResponse.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        version,
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
