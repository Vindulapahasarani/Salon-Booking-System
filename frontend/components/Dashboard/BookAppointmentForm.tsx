'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from '@/utils/axios';

interface Service {
  _id: string;
  name: string;
  price: number;
  duration?: number;
  description?: string;
}

interface BookAppointmentFormProps {
  service: Service;
  onClose?: () => void;
}

export default function BookAppointmentForm({ service, onClose }: BookAppointmentFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!date || !time) {
      toast.error('Please select both date and time!');
      setIsSubmitting(false);
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error('Please select a future date!');
      setIsSubmitting(false);
      return;
    }

    if (!session?.user) {
      toast.error('Please login to book an appointment!');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        serviceId: service._id,
        serviceName: service.name,
        date, // formatted as 'YYYY-MM-DD' from input
        timeSlot: time, // e.g., '14:30'
        price: service.price,
        paymentMethod,
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      // Handle payment after booking
      if (paymentMethod === 'card') {
        const stripeResponse = await axios.post('/api/payments/stripe/checkout', {
          appointmentIds: [data.id],
        });
        if (stripeResponse.data.url) {
          window.location.href = stripeResponse.data.url;
        } else {
          throw new Error('No redirect URL received from Stripe');
        }
      } else {
        await axios.post('/api/payments/cash', {
          appointmentIds: [data.id],
        });
        toast.success('Appointment booked and cash payment confirmed!');
        router.refresh();
        onClose?.();
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Book New Appointment</h2>

      <div className="space-y-4">
        {/* Service Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <div className="p-2 border border-gray-200 rounded bg-gray-50">
            <p className="font-medium">{service.name}</p>
            <p className="text-gray-600">${service.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Date Picker */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Time Picker */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="h-5 w-5"
              />
              <span>💳 Card</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="h-5 w-5"
              />
              <span>💵 Cash</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose || (() => router.back())}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? paymentMethod === 'card'
                ? 'Processing Payment...'
                : 'Booking...'
              : 'Book and Pay'}
          </button>
        </div>
      </div>
    </form>
  );
}