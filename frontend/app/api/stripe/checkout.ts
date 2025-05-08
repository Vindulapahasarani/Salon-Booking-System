import { NextRequest, NextResponse } from 'next/server';
import axios from '@/utils/axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await axios.post('/payments/create-checkout-session', body);
    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
