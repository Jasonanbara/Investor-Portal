import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSignedUrl } from '@/services/s3/file-service';

/**
 * GET /api/documents/[id]/download - Generate signed download URL for a document
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Auth check
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: { deal: { include: { investments: true } } },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Access control: admins can access all, investors only their own or their deal documents
    const user = session.user;
    if (user.role === 'INVESTOR') {
      const isOwner = document.userId === user.id;
      const hasInvestment = document.deal?.investments.some(
        (inv) => inv.userId === user.id
      );

      if (!isOwner && !hasInvestment) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Generate signed URL (1 hour expiry)
    const signedUrl = await getSignedUrl(document.s3Key, 3600);

    // Check if client wants redirect or JSON
    const wantsRedirect = request.headers.get('accept')?.includes('text/html');
    if (wantsRedirect) {
      return NextResponse.redirect(signedUrl);
    }

    return NextResponse.json({
      id: document.id,
      name: document.name,
      contentType: document.contentType,
      fileSize: document.fileSize,
      url: signedUrl,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('[Download API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
