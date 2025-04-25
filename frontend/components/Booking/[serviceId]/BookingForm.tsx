'use client';

import { useState } from 'react';
import axios from '@/utils/axios';

const BookingForm = ({ serviceId }: { serviceId: string }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/appointments',
        { serviceId, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Appointment booked!');
    } catch (err) {
      alert('Booking failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input" />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="input" />
      <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white">Confirm Booking</button>
    </form>
  );
};

export default BookingForm;
