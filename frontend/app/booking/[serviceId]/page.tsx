'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ params }: { params: { serviceId: string } }) {
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      const res = await fetch(`http://localhost:5000/api/services/${params.serviceId}`);
      const data = await res.json();
      setService(data);
      setPrice(data.price); // set default price
    };

    fetchService();

    // ✅ Check for token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to book an appointment.');
      router.push('/signin');
    }
  }, [params.serviceId, router]);

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceName: service?.name,
          date,
          timeSlot,
          price,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Appointment booked successfully!');
        router.push('/dashboard/user'); // redirect to user dashboard
      } else {
        alert(result.message || 'Booking failed.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred while booking.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Book Appointment</h2>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Time</label>
          <input
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
