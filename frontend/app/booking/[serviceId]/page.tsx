/* Updated /app/booking/[serviceId]/page.tsx */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function BookingPage() {
  const { serviceId } = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };
    if (serviceId) fetchService();
  }, [serviceId]);

  const handleBooking = async () => {
    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }

    const datetime = new Date(`${date}T${time}`);

    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          date: datetime.toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create appointment');
      }

      toast.success('Appointment booked!');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to create appointment.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Book New Appointment</h2>

        {service && (
          <div className="mb-4">
            <label className="block mb-1 text-sm">Service</label>
            <select
              value={service._id}
              disabled
              className="w-full border px-3 py-2 rounded-lg text-gray-700"
            >
              <option>{service.name} – ${service.price}</option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-200 px-4 py-2 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
