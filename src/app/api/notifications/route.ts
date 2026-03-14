import { NextRequest, NextResponse } from 'next/server';

// Mock notification data - in production this would come from the database
const mockNotifications = [
  {
    id: 'n1',
    type: 'DEAL_OPPORTUNITY',
    title: 'New Investment Opportunity',
    message: 'A new multifamily deal in Toronto is now available for review.',
    timestamp: '2026-03-12T09:30:00Z',
    read: false,
    href: '/opportunities',
  },
  {
    id: 'n2',
    type: 'DEAL_STATUS',
    title: 'Deal Status Updated',
    message: 'The Riverside Plaza deal has moved to the funding stage.',
    timestamp: '2026-03-12T08:15:00Z',
    read: false,
    href: '/deals',
  },
  {
    id: 'n3',
    type: 'REPORT_UPLOADED',
    title: 'Monthly Report Ready',
    message: 'Your February 2026 portfolio statement is now available.',
    timestamp: '2026-03-11T16:00:00Z',
    read: false,
    href: '/reports',
  },
  {
    id: 'n4',
    type: 'CHAT_MESSAGE',
    title: 'New Message from Underwriter',
    message: 'Sarah Chen sent you a message regarding the Oak Street property.',
    timestamp: '2026-03-11T14:22:00Z',
    read: false,
    href: '/messages',
  },
  {
    id: 'n5',
    type: 'COMMITMENT_UPDATE',
    title: 'Commitment Approved',
    message: 'Your $250,000 commitment to Harbour View Condos has been approved.',
    timestamp: '2026-03-10T17:45:00Z',
    read: true,
    href: '/deals',
  },
  {
    id: 'n6',
    type: 'SYSTEM',
    title: 'Scheduled Maintenance',
    message: 'Platform maintenance scheduled for March 15, 2026, 2:00 AM - 4:00 AM EST.',
    timestamp: '2026-03-10T12:00:00Z',
    read: true,
  },
];

/**
 * GET /api/notifications
 * List notifications for the current user with pagination.
 * Query params: page (default 1), limit (default 10), type, read
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const type = searchParams.get('type');
  const readFilter = searchParams.get('read');

  let filtered = [...mockNotifications];

  if (type) {
    filtered = filtered.filter((n) => n.type === type);
  }

  if (readFilter === 'true') {
    filtered = filtered.filter((n) => n.read);
  } else if (readFilter === 'false') {
    filtered = filtered.filter((n) => !n.read);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    notifications: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    unreadCount: mockNotifications.filter((n) => !n.read).length,
  });
}

/**
 * PATCH /api/notifications
 * Mark notifications as read.
 * Body: { ids: string[] } or { all: true }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.all) {
      // Mark all as read
      // In production: UPDATE notifications SET read = true WHERE userId = ?
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    if (body.ids && Array.isArray(body.ids)) {
      // Mark specific notifications as read
      // In production: UPDATE notifications SET read = true WHERE id IN (?) AND userId = ?
      return NextResponse.json({
        success: true,
        message: `${body.ids.length} notification(s) marked as read`,
        ids: body.ids,
      });
    }

    return NextResponse.json(
      { error: 'Invalid request body. Provide { ids: string[] } or { all: true }' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}
