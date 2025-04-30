'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BookAppointmentForm({
  serviceId,
  serviceName,
}: {
  serviceId: string;
  serviceName: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      toast.error('Please select both date and time!');
      return;
    }

    if (!session?.user?.id) {
      toast.error('User not logged in!');
      return;
    }

    const timeSlot = `${date}T${time}`; // Format: "YYYY-MM-DDTHH:mm"

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: session.user.id,
          service: serviceId,
          timeSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      toast.success('Appointment booked successfully!');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to book appointment.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Book New Appointment</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Service</label>
        <input
          type="text"
          value={serviceName}
          disabled
          className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </form>
  );
}
