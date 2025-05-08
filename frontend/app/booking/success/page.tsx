'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

const BookingSuccessPage = () => {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Payment Successful! 🎉</h1>
      <p className="text-lg text-gray-800 mb-2">
        Your booking for the selected service has been confirmed.
      </p>
      {serviceId && (
        <p className="text-sm text-gray-500">Service ID: {serviceId}</p>
      )}
      <a
        href="/dashboard"
        className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Go to Dashboard
      </a>
    </div>
  );
};

export default BookingSuccessPage;
