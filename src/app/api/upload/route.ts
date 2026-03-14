import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadFile, generateKey, getSignedUrl } from '@/services/s3/file-service';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

/**
 * POST /api/upload - Handle file uploads
 */
export async function POST(request: NextRequest) {
  // TODO: Replace with actual next-auth session check
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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const dealId = formData.get('dealId') as string | null;
    const docType = (formData.get('type') as string) ?? 'OTHER';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate content type
    if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type}` },
        { status: 400 }
      );
    }

    // Generate S3 key and upload
    const folder = dealId ? `deals/${dealId}` : `users/${session.userId}`;
    const s3Key = generateKey(folder, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadFile(buffer, s3Key, file.type);

    // Create document record in DB
    const document = await prisma.document.create({
      data: {
        dealId: dealId ?? undefined,
        userId: session.userId,
        type: docType as 'NDA' | 'SUBSCRIPTION_AGREEMENT' | 'TAX_FORM' | 'KYC_DOCUMENT' | 'DEAL_SUMMARY' | 'APPRAISAL' | 'LEGAL_OPINION' | 'FINANCIAL_STATEMENT' | 'MORTGAGE_DOCUMENT' | 'REPORT' | 'OTHER',
        name: file.name,
        s3Key,
        contentType: file.type,
        fileSize: file.size,
      },
    });

    // Generate a signed URL for immediate access
    const signedUrl = await getSignedUrl(s3Key);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'document.uploaded',
        entity: 'document',
        entityId: document.id,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
          dealId,
        },
      },
    });

    return NextResponse.json({
      id: document.id,
      name: document.name,
      type: document.type,
      s3Key: document.s3Key,
      contentType: document.contentType,
      fileSize: document.fileSize,
      url: signedUrl,
      uploadedAt: document.uploadedAt,
    });
  } catch (error) {
    console.error('[Upload API] Error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
