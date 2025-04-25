'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const Booking = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleClick = () => {
    if (!token) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <section className="py-20 text-center bg-gray-100">
      <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
      <p className="mb-6">Secure your slot at your favorite salon now.</p>
      <button onClick={handleClick} className="btn bg-pink-600 hover:bg-pink-700 text-white">
        Book Now
      </button>
    </section>
  );
};

export default Booking;
