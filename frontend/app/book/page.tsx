'use client';

import { useState } from 'react';
import axios from '@/utils/axios';

const BookAppointment = () => {
  const [form, setForm] = useState({
    serviceId: '',
    date: '',
    timeSlot: '',
  });

  const [message, setMessage] = useState('');

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        '/appointments',
        {
          email: userEmail,
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Appointment booked successfully!');
    } catch (error: any) {
      setMessage(`❌ Failed: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="serviceId"
          placeholder="Service ID"
          value={form.serviceId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="timeSlot"
          placeholder="10:00 AM"
          value={form.timeSlot}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Book
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default BookAppointment;
