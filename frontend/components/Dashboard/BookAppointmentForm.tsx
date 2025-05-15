'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
        date, // formatted as 'YYYY-MM-DD' from input
        timeSlot: time, // e.g., '14:30'
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

      toast.success('Appointment booked successfully!');
      router.refresh();
      onClose?.();
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
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>
    </form>
  );
}
