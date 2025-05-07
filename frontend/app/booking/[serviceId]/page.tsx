'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import axios from '@/utils/axios';

export default function BookingPage() {
  const { serviceId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [service, setService] = useState<any>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (error) {
        console.error('Error fetching service:', error);
        toast.error('Error loading service details');
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  useEffect(() => {
    if (!user && !loading) {
      toast.error('Please log in to book an appointment');
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleBooking = async () => {
    if (!user || !user.token) {
      toast.error('You must be logged in to book');
      router.push('/login');
      return;
    }

    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }

    if (!service) {
      toast.error('Service information missing');
      return;
    }

    const formattedDate = new Date(date).toISOString().split('T')[0];

    setLoading(true);
    try {
      const res = await axios.post(
        '/appointments',
        {
          serviceId,
          serviceName: service.name,
          price: service.price,
          date: formattedDate,
          timeSlot: time,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success('Appointment booked successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create appointment.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !service) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] text-center">
          Loading service details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Book New Appointment</h2>

        {service && (
          <div className="mb-4">
            <label className="block mb-1 text-sm">Service</label>
            <select disabled className="w-full border px-3 py-2 rounded-lg text-gray-700">
              <option>
                {service.name} – ${service.price}
              </option>
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
            min={new Date().toISOString().split('T')[0]}
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
