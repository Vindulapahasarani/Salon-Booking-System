'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

export default function PaymentSection() {
  const [total, setTotal] = useState(0);
  const [method, setMethod] = useState<'card' | 'cash'>('card');

  useEffect(() => {
    const fetchUnpaid = async () => {
      try {
        const res = await axios.get('/payments/unpaid-total');
        setTotal(res.data.totalUnpaid);
      } catch (err) {
        console.error('Failed to fetch unpaid total', err);
      }
    };
    fetchUnpaid();
  }, []);

  const handleCashConfirm = async () => {
    try {
      await axios.post('/payments/confirm-cash');
      alert('Cash payment confirmed!');
    } catch (err) {
      alert('Cash confirmation failed.');
    }
  };

  const handleStripePayment = async () => {
    try {
      const res = await axios.post('/stripe/checkout', { amount: total });
      window.location.href = res.data.url;
    } catch (err) {
      alert('Stripe payment failed.');
    }
  };

  if (total === 0) return null;

  return (
    <div className="mt-6 p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-3">Payment Information</h2>
      <p>Total Unpaid: <span className="font-semibold">${total}</span></p>

      <div className="mt-4">
        <label className="mr-4">
          <input type="radio" value="card" checked={method === 'card'} onChange={() => setMethod('card')} />
          <span className="ml-1">Card</span>
        </label>
        <label className="ml-4">
          <input type="radio" value="cash" checked={method === 'cash'} onChange={() => setMethod('cash')} />
          <span className="ml-1">Cash</span>
        </label>
      </div>

      <div className="mt-4">
        {method === 'card' ? (
          <button onClick={handleStripePayment} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Pay Now
          </button>
        ) : (
          <button onClick={handleCashConfirm} className="bg-green-600 text-white px-4 py-2 rounded-md">
            Confirm with Cash
          </button>
        )}
      </div>
    </div>
  );
}
