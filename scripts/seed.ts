import { PrismaClient } from '../src/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── Users ───────────────────────────────────────────────────────────────

  const passwordHash = await hash('password', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@northlendfinancial.com' },
    update: {},
    create: {
      email: 'admin@northlendfinancial.com',
      name: 'Sarah Mitchell',
      passwordHash,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log('Created Super Admin:', superAdmin.email);

  const underwriter = await prisma.user.upsert({
    where: { email: 'underwriter@northlendfinancial.com' },
    update: {},
    create: {
      email: 'underwriter@northlendfinancial.com',
      name: 'James Chen',
      passwordHash,
      role: 'UNDERWRITER',
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log('Created Underwriter:', underwriter.email);

  // 5 Investors at various onboarding stages
  const investorData = [
    {
      email: 'investor1@example.com',
      name: 'Michael Thompson',
      onboardingStatus: 'APPROVED' as const,
      kycVerified: true,
      totalInvested: 500000,
    },
    {
      email: 'investor2@example.com',
      name: 'Emily Rodriguez',
      onboardingStatus: 'APPROVED' as const,
      kycVerified: true,
      totalInvested: 250000,
    },
    {
      email: 'investor3@example.com',
      name: 'David Kim',
      onboardingStatus: 'NDA_REQUIRED' as const,
      kycVerified: true,
      totalInvested: 0,
    },
    {
      email: 'investor4@example.com',
      name: 'Jessica Patel',
      onboardingStatus: 'KYC_REQUIRED' as const,
      kycVerified: false,
      totalInvested: 0,
    },
    {
      email: 'investor5@example.com',
      name: 'Robert Wilson',
      onboardingStatus: 'PENDING' as const,
      kycVerified: false,
      totalInvested: 0,
    },
  ];

  const investors = [];
  for (const inv of investorData) {
    const user = await prisma.user.upsert({
      where: { email: inv.email },
      update: {},
      create: {
        email: inv.email,
        name: inv.name,
        passwordHash,
        role: 'INVESTOR',
        emailVerified: inv.onboardingStatus !== 'PENDING' ? new Date() : null,
        isActive: true,
      },
    });

    await prisma.investorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        onboardingStatus: inv.onboardingStatus,
        kycVerified: inv.kycVerified,
        kycVerifiedAt: inv.kycVerified ? new Date() : null,
        totalInvested: inv.totalInvested,
        entityName: inv.totalInvested > 0 ? `${inv.name} Holdings Inc.` : null,
        entityType: inv.totalInvested > 0 ? 'Corporation' : null,
        address: inv.kycVerified ? '123 Bay Street' : null,
        city: inv.kycVerified ? 'Toronto' : null,
        province: inv.kycVerified ? 'ON' : null,
        postalCode: inv.kycVerified ? 'M5J 2T3' : null,
      },
    });

    investors.push(user);
    console.log(`Created Investor: ${user.email} (${inv.onboardingStatus})`);
  }

  // ─── NDA Signatures ──────────────────────────────────────────────────────

  for (const inv of investors.slice(0, 3)) {
    await prisma.nDASignature.upsert({
      where: { userId_version: { userId: inv.id, version: '1.0' } },
      update: {},
      create: {
        userId: inv.id,
        version: '1.0',
        ipAddress: '192.168.1.1',
      },
    });
  }
  console.log('Created NDA signatures for first 3 investors');

  // ─── Deals ───────────────────────────────────────────────────────────────

  const dealData = [
    {
      title: '123 King Street W, Toronto',
      propertyAddress: '123 King Street W',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M5H 1A1',
      propertyType: 'COMMERCIAL' as const,
      propertyValue: 2500000,
      loanAmount: 1750000,
      ltv: 0.70,
      interestRate: 8.5,
      term: 12,
      status: 'ACTIVE' as const,
      riskRating: 'A',
      totalFunded: 1750000,
      targetAmount: 1750000,
      minimumInvestment: 50000,
      fundedDate: new Date('2025-06-01'),
    },
    {
      title: '456 Yonge Street, Toronto',
      propertyAddress: '456 Yonge Street',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M4Y 1X9',
      propertyType: 'RESIDENTIAL' as const,
      propertyValue: 1200000,
      loanAmount: 840000,
      ltv: 0.70,
      interestRate: 9.0,
      term: 12,
      status: 'ACTIVE' as const,
      riskRating: 'B+',
      totalFunded: 840000,
      targetAmount: 840000,
      minimumInvestment: 25000,
      fundedDate: new Date('2025-08-15'),
    },
    {
      title: '789 Bloor Street W, Toronto',
      propertyAddress: '789 Bloor Street W',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M6G 1L5',
      propertyType: 'MIXED_USE' as const,
      propertyValue: 3200000,
      loanAmount: 2240000,
      ltv: 0.70,
      interestRate: 8.75,
      term: 24,
      status: 'FUNDING' as const,
      riskRating: 'A-',
      totalFunded: 1500000,
      targetAmount: 2240000,
      minimumInvestment: 50000,
    },
    {
      title: '321 Queen Street E, Toronto',
      propertyAddress: '321 Queen Street E',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M5A 1S8',
      propertyType: 'RESIDENTIAL' as const,
      propertyValue: 850000,
      loanAmount: 595000,
      ltv: 0.70,
      interestRate: 9.5,
      term: 12,
      status: 'APPROVED' as const,
      riskRating: 'B',
      totalFunded: 0,
      targetAmount: 595000,
      minimumInvestment: 25000,
    },
    {
      title: '555 Dundas Street W, Toronto',
      propertyAddress: '555 Dundas Street W',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M5T 1H4',
      propertyType: 'COMMERCIAL' as const,
      propertyValue: 4100000,
      loanAmount: 2870000,
      ltv: 0.70,
      interestRate: 8.25,
      term: 24,
      status: 'ACTIVE' as const,
      riskRating: 'A+',
      totalFunded: 2870000,
      targetAmount: 2870000,
      minimumInvestment: 100000,
      fundedDate: new Date('2025-03-01'),
    },
    {
      title: '100 Front Street W, Toronto',
      propertyAddress: '100 Front Street W',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M5J 1E3',
      propertyType: 'COMMERCIAL' as const,
      propertyValue: 5500000,
      loanAmount: 3850000,
      ltv: 0.70,
      interestRate: 7.75,
      term: 36,
      status: 'MATURED' as const,
      riskRating: 'A+',
      totalFunded: 3850000,
      targetAmount: 3850000,
      minimumInvestment: 100000,
      fundedDate: new Date('2023-01-15'),
      closedDate: new Date('2026-01-15'),
    },
    {
      title: '222 Spadina Avenue, Toronto',
      propertyAddress: '222 Spadina Avenue',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M5T 2C2',
      propertyType: 'RESIDENTIAL' as const,
      propertyValue: 680000,
      loanAmount: 476000,
      ltv: 0.70,
      interestRate: 10.0,
      term: 12,
      status: 'UNDERWRITING' as const,
      riskRating: null,
      totalFunded: 0,
      targetAmount: 476000,
      minimumInvestment: 25000,
    },
    {
      title: '888 Bay Street, Toronto',
      propertyAddress: '888 Bay Street',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M5S 3K4',
      propertyType: 'COMMERCIAL' as const,
      propertyValue: 7200000,
      loanAmount: 5040000,
      ltv: 0.70,
      interestRate: 7.5,
      term: 36,
      status: 'ACTIVE' as const,
      riskRating: 'A+',
      totalFunded: 5040000,
      targetAmount: 5040000,
      minimumInvestment: 250000,
      fundedDate: new Date('2025-01-10'),
    },
    {
      title: '44 Lakeshore Blvd E, Mississauga',
      propertyAddress: '44 Lakeshore Blvd E',
      propertyCity: 'Mississauga',
      propertyProvince: 'ON',
      propertyPostalCode: 'L5G 1C8',
      propertyType: 'LAND' as const,
      propertyValue: 1800000,
      loanAmount: 1080000,
      ltv: 0.60,
      interestRate: 11.0,
      term: 12,
      status: 'DEFAULT' as const,
      riskRating: 'C',
      totalFunded: 1080000,
      targetAmount: 1080000,
      minimumInvestment: 50000,
      fundedDate: new Date('2025-02-01'),
    },
    {
      title: '77 Richmond Street W, Toronto',
      propertyAddress: '77 Richmond Street W',
      propertyCity: 'Toronto',
      propertyProvince: 'ON',
      propertyPostalCode: 'M5H 4A3',
      propertyType: 'MIXED_USE' as const,
      propertyValue: 2100000,
      loanAmount: 1470000,
      ltv: 0.70,
      interestRate: 8.75,
      term: 18,
      status: 'DRAFT' as const,
      riskRating: null,
      totalFunded: 0,
      targetAmount: 1470000,
      minimumInvestment: 50000,
    },
  ];

  const deals = [];
  for (const d of dealData) {
    const deal = await prisma.deal.create({ data: d });
    deals.push(deal);
    console.log(`Created Deal: ${deal.title} (${deal.status})`);
  }

  // ─── Investments ─────────────────────────────────────────────────────────

  // Investor 1 (Michael) - invested in deals 0, 1, 4, 5, 7
  const investmentData = [
    { userId: investors[0].id, dealId: deals[0].id, amount: 200000, sharePercent: 11.43, status: 'ACTIVE' as const },
    { userId: investors[0].id, dealId: deals[1].id, amount: 100000, sharePercent: 11.90, status: 'ACTIVE' as const },
    { userId: investors[0].id, dealId: deals[4].id, amount: 200000, sharePercent: 6.97, status: 'ACTIVE' as const },
    { userId: investors[1].id, dealId: deals[0].id, amount: 150000, sharePercent: 8.57, status: 'ACTIVE' as const },
    { userId: investors[1].id, dealId: deals[2].id, amount: 100000, sharePercent: 4.46, status: 'COMMITTED' as const },
    { userId: investors[0].id, dealId: deals[5].id, amount: 250000, sharePercent: 6.49, status: 'MATURED' as const },
    { userId: investors[1].id, dealId: deals[7].id, amount: 250000, sharePercent: 4.96, status: 'ACTIVE' as const },
    { userId: investors[0].id, dealId: deals[8].id, amount: 100000, sharePercent: 9.26, status: 'ACTIVE' as const },
  ];

  const investmentRecords = [];
  for (const inv of investmentData) {
    const investment = await prisma.investment.create({
      data: {
        ...inv,
        investedAt: inv.status !== 'COMMITTED' ? new Date() : null,
        maturedAt: inv.status === 'MATURED' ? new Date() : null,
      },
    });
    investmentRecords.push(investment);
  }
  console.log(`Created ${investmentRecords.length} investments`);

  // ─── Sample Payments ─────────────────────────────────────────────────────

  // Payments for deal 0 (active deal)
  for (let i = 0; i < 6; i++) {
    const dueDate = new Date('2025-07-01');
    dueDate.setMonth(dueDate.getMonth() + i);
    const isPaid = i < 5;

    await prisma.payment.create({
      data: {
        dealId: deals[0].id,
        amount: 14583.33,
        principal: 2083.33,
        interest: 12500.00,
        dueDate,
        paidDate: isPaid ? new Date(dueDate.getTime() - 86400000) : null,
        status: isPaid ? 'RECEIVED' : 'SCHEDULED',
      },
    });
  }
  console.log('Created sample payments for deal 0');

  // ─── Transactions ────────────────────────────────────────────────────────

  for (const inv of investmentRecords.slice(0, 4)) {
    await prisma.transaction.create({
      data: {
        investmentId: inv.id,
        type: 'INVESTMENT',
        amount: inv.amount,
        description: 'Initial investment',
        date: new Date(),
      },
    });

    if (inv.status === 'ACTIVE' || inv.status === 'MATURED') {
      await prisma.transaction.create({
        data: {
          investmentId: inv.id,
          type: 'DISTRIBUTION',
          amount: inv.amount * 0.007,
          description: 'Monthly interest distribution',
          date: new Date(),
        },
      });
    }
  }
  console.log('Created sample transactions');

  // ─── Notifications ───────────────────────────────────────────────────────

  await prisma.notification.createMany({
    data: [
      {
        userId: investors[0].id,
        title: 'Payment Received',
        message: 'A payment of $14,583.33 has been received for 123 King Street W.',
        type: 'success',
        link: `/deals/${deals[0].id}`,
      },
      {
        userId: investors[0].id,
        title: 'New Deal Available',
        message: 'A new investment opportunity is available: 789 Bloor Street W.',
        type: 'info',
        link: `/deals/${deals[2].id}`,
      },
      {
        userId: investors[1].id,
        title: 'Monthly Report Ready',
        message: 'Your February 2026 monthly statement is ready for download.',
        type: 'info',
        link: '/reports',
      },
      {
        userId: investors[2].id,
        title: 'NDA Required',
        message: 'Please sign the NDA to proceed with your onboarding.',
        type: 'warning',
        link: '/onboarding/nda',
      },
      {
        userId: investors[3].id,
        title: 'KYC Verification Needed',
        message: 'Please complete your KYC verification to access investment opportunities.',
        type: 'warning',
        link: '/onboarding/kyc',
      },
      {
        userId: superAdmin.id,
        title: 'Deal in Default',
        message: '44 Lakeshore Blvd E is now in default status. Action required.',
        type: 'error',
        link: `/deals/${deals[8].id}`,
      },
    ],
  });
  console.log('Created sample notifications');

  // ─── Audit Logs ──────────────────────────────────────────────────────────

  await prisma.auditLog.createMany({
    data: [
      {
        userId: superAdmin.id,
        action: 'deal.created',
        entity: 'deal',
        entityId: deals[0].id,
        metadata: { title: deals[0].title },
      },
      {
        userId: underwriter.id,
        action: 'deal.approved',
        entity: 'deal',
        entityId: deals[0].id,
        metadata: { title: deals[0].title, riskRating: 'A' },
      },
      {
        userId: investors[0].id,
        action: 'investment.created',
        entity: 'investment',
        entityId: investmentRecords[0].id,
        metadata: { amount: 200000, dealTitle: deals[0].title },
      },
      {
        userId: investors[0].id,
        action: 'user.login',
        entity: 'user',
        entityId: investors[0].id,
        ipAddress: '192.168.1.100',
      },
      {
        userId: null,
        action: 'sync.completed',
        entity: 'sync',
        metadata: { type: 'full', itemsSynced: 42 },
      },
    ],
  });
  console.log('Created sample audit logs');

  // ─── Reports ─────────────────────────────────────────────────────────────

  await prisma.report.createMany({
    data: [
      {
        type: 'MONTHLY_STATEMENT',
        title: 'February 2026 Monthly Statement',
        s3Key: 'reports/2026/02/monthly-statement.pdf',
        status: 'READY',
        metadata: { month: '2026-02', generatedFor: 'all-investors' },
      },
      {
        type: 'QUARTERLY_REPORT',
        title: 'Q4 2025 Quarterly Report',
        s3Key: 'reports/2025/q4/quarterly-report.pdf',
        status: 'READY',
        metadata: { quarter: '2025-Q4' },
      },
      {
        type: 'PORTFOLIO_SUMMARY',
        title: 'Portfolio Summary - March 2026',
        status: 'GENERATING',
        metadata: { month: '2026-03' },
      },
    ],
  });
  console.log('Created sample reports');

  // ─── Documents (metadata only) ──────────────────────────────────────────

  await prisma.document.createMany({
    data: [
      {
        dealId: deals[0].id,
        type: 'DEAL_SUMMARY',
        name: '123 King Street W - Deal Summary.pdf',
        s3Key: 'deals/king-st/deal-summary.pdf',
        contentType: 'application/pdf',
        fileSize: 245000,
      },
      {
        dealId: deals[0].id,
        type: 'APPRAISAL',
        name: '123 King Street W - Appraisal Report.pdf',
        s3Key: 'deals/king-st/appraisal.pdf',
        contentType: 'application/pdf',
        fileSize: 1850000,
      },
      {
        dealId: deals[1].id,
        type: 'DEAL_SUMMARY',
        name: '456 Yonge Street - Deal Summary.pdf',
        s3Key: 'deals/yonge-st/deal-summary.pdf',
        contentType: 'application/pdf',
        fileSize: 198000,
      },
      {
        userId: investors[0].id,
        type: 'KYC_DOCUMENT',
        name: 'Michael Thompson - ID Verification.pdf',
        s3Key: 'users/thompson/kyc-id.pdf',
        contentType: 'application/pdf',
        fileSize: 520000,
      },
      {
        userId: investors[0].id,
        type: 'SUBSCRIPTION_AGREEMENT',
        name: 'Subscription Agreement - King Street W.pdf',
        s3Key: 'users/thompson/sub-agreement-king.pdf',
        contentType: 'application/pdf',
        fileSize: 340000,
      },
    ],
  });
  console.log('Created sample documents');

  // ─── Chat Rooms & Messages ───────────────────────────────────────────────

  const supportRoom = await prisma.chatRoom.create({
    data: {
      name: 'Support - Michael Thompson',
      type: 'support',
    },
  });

  await prisma.chatRoomUser.createMany({
    data: [
      { chatRoomId: supportRoom.id, userId: investors[0].id },
      { chatRoomId: supportRoom.id, userId: superAdmin.id },
    ],
  });

  const dealRoom = await prisma.chatRoom.create({
    data: {
      name: 'Deal Discussion - 123 King Street W',
      type: 'deal',
      dealId: deals[0].id,
    },
  });

  await prisma.chatRoomUser.createMany({
    data: [
      { chatRoomId: dealRoom.id, userId: investors[0].id },
      { chatRoomId: dealRoom.id, userId: investors[1].id },
      { chatRoomId: dealRoom.id, userId: superAdmin.id },
    ],
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        chatRoomId: supportRoom.id,
        userId: investors[0].id,
        content: 'Hi, I have a question about my latest distribution payment.',
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        chatRoomId: supportRoom.id,
        userId: superAdmin.id,
        content: 'Of course, Michael. Let me pull up your account details. Which deal is this regarding?',
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        chatRoomId: supportRoom.id,
        userId: investors[0].id,
        content: 'The King Street W deal. I expected the distribution on the 1st but haven\'t seen it yet.',
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        chatRoomId: dealRoom.id,
        userId: superAdmin.id,
        content: 'Update: The borrower payment for King Street W has been received on time.',
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        chatRoomId: dealRoom.id,
        userId: investors[0].id,
        content: 'Great news, thanks for the update!',
        createdAt: new Date(Date.now() - 82800000),
      },
    ],
  });
  console.log('Created sample chat rooms and messages');

  console.log('\nSeeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
