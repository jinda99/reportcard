import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { SubscriptionStatus, InvoiceStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_secret';

    // Verify webhook signature if in production
    if (process.env.NODE_ENV === 'production' && signature) {
      const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid Paystack signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    // Idempotent processing by providerRef
    const providerRef = data?.reference;
    if (!providerRef) {
      return NextResponse.json({ message: 'No reference found' }, { status: 200 });
    }

    // Check if invoice already processed (idempotency contract)
    const existingInvoice = await prisma.invoice.findFirst({
      where: { providerRef },
    });

    if (existingInvoice && existingInvoice.status === InvoiceStatus.PAID) {
      return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
    }

    if (event === 'charge.success') {
      const schoolId = data?.metadata?.schoolId;
      const planId = data?.metadata?.planId;
      const amountNgn = Math.round((data?.amount || 0) / 100);

      if (schoolId && planId) {
        // Upgrade/Renew subscription
        await prisma.subscription.upsert({
          where: { id: `sub_${schoolId}` },
          update: {
            status: SubscriptionStatus.ACTIVE,
            providerRef,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          create: {
            id: `sub_${schoolId}`,
            schoolId,
            planId,
            status: SubscriptionStatus.ACTIVE,
            providerRef,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });

        // Record paid invoice
        await prisma.invoice.create({
          data: {
            subscriptionId: `sub_${schoolId}`,
            amountNgn,
            status: InvoiceStatus.PAID,
            providerRef,
            paidAt: new Date(),
            periodStart: new Date(),
            periodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Paystack webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
