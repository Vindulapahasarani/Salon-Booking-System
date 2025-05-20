import { NextRequest, NextResponse } from 'next/server';
import axios from '@/utils/axios';

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST request to /api/stripe/checkout');
    const body = await request.json();
    const { appointmentIds } = body;

    const response = await axios.post('/api/payments/stripe/checkout', { appointmentIds });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Error creating checkout session' },
      { status: error.response?.status || 500 }
    );
  }
}