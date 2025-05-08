'use client';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface ServiceCardProps {
  service: Service;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleBookNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: service.name,
          price: service.price,
          serviceId: service._id,
          userId: user._id,
        }),
      });

      const data = await res.json();
      const stripe = await stripePromise;

      if (stripe && data.id) {
        stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert('Unable to redirect to payment.');
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
      alert('Something went wrong with payment.');
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md hover:shadow-lg transition flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-2">{service.description}</p>
        <span className="text-lg font-bold">${service.price}</span>
      </div>
      <button
        onClick={handleBookNow}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Book Now
      </button>
    </div>
  );
};

export default ServiceCard;
