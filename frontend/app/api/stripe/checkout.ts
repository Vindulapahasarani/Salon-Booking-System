import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, price, tipAmount = 0, serviceName } = body;

    // Validate required fields
    if (!appointmentId || !price || !serviceName) {
      return new NextResponse('Missing required fields: appointmentId, price, serviceName', { status: 400 });
    }

    const totalAmount = (price + tipAmount) * 100; // Convert to cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Booking: ${serviceName}`,
            },
            unit_amount: Math.round(totalAmount), // Stripe requires an integer in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?appointmentId=${appointmentId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
      metadata: {
        appointmentId,
        serviceName,
        price: price.toString(),
        tipAmount: tipAmount.toString(),
      },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error: any) {
    console.error('❌ Stripe checkout session error:', error.stack || error.message);
    return new NextResponse('Stripe checkout session creation failed', { status: 500 });
  }
}
