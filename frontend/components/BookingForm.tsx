'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/auth';

interface BookingFormProps {
  serviceId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const BookingForm = ({ serviceId }: BookingFormProps) => {
  const [serviceName, setServiceName] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth() as { user: User | null };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !bookingDate || !bookingTime || !price || !user || !serviceId) {
      alert('Missing required appointment fields.');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/appointments', {
        serviceId,
        serviceName,
        date: bookingDate,
        time: bookingTime,
        price: Number(price),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-8 w-full max-w-md mx-auto mt-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Book New Appointment</h2>

      <label className="block mb-4">
        <span className="text-gray-700">Service Name</span>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Date</span>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Time</span>
        <input
          type="time"
          value={bookingTime}
          onChange={(e) => setBookingTime(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </label>

      <label className="block mb-6">
        <span className="text-gray-700">Price ($)</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </label>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
