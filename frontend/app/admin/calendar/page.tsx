'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '@/utils/axios';
import { format } from 'date-fns';
import type { CalendarProps } from 'react-calendar';

interface Appointment {
  _id: string;
  userEmail: string;
  userName?: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export default function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [appointmentCounts, setAppointmentCounts] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    const date = Array.isArray(value) ? value[0] : value;
    if (date instanceof Date) setSelectedDate(date);
  };

  const fetchAppointmentsByDate = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Fetching appointments for date:', formattedDate);
      const res = await axios.get(`/appointments/date/${formattedDate}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      console.log('Appointments response:', res.data);
      setAppointments(res.data);
    } catch (error: any) {
      console.error('Fetch appointments error:', error.response?.data || error.message);
      setError(`Failed to fetch appointments: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsByMonth = async (date: Date) => {
    try {
      setError(null);
      const formattedMonth = format(date, 'yyyy-MM');
      console.log('Fetching appointment counts for month:', formattedMonth);
      const res = await axios.get(`/appointments/month/${formattedMonth}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      console.log('Appointment counts response:', res.data);
      setAppointmentCounts(res.data);
    } catch (error: any) {
      console.error('Fetch appointment counts error:', error.response?.data || error.message);
      setError(`Failed to fetch appointment counts: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`);
    }
  };

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const endpoint = status === 'confirmed' ? `/appointments/${id}/approve` : `/appointments/${id}/cancel`;
      await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err: any) {
      console.error('Update appointment error:', err.response?.data || err.message);
      setError(`Failed to update appointment: ${err.response?.status || 'Unknown'} - ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    fetchAppointmentsByDate(selectedDate);
    fetchAppointmentsByMonth(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Calendar View</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow p-4">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            calendarType="gregory"
            tileContent={({ date }) => {
              const day = date.getDate();
              const count = appointmentCounts[day] || 0;
              return count > 0 ? <div className="dot" /> : null;
            }}
          />
          <style jsx>{`
            .dot {
              height: 8px;
              width: 8px;
              background-color: #4CAF50;
              border-radius: 50%;
              display: inline-block;
              margin-top: 2px;
            }
          `}</style>
        </div>

        {/* Appointments Table */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Appointments on {format(selectedDate, 'MMMM dd, yyyy')}
          </h2>

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4 text-left">Service</th>
                    <th className="py-2 px-4 text-left">Client</th>
                    <th className="py-2 px-4 text-left">Time</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id} className="border-t">
                      <td className="py-2 px-4">{appt.serviceName}</td>
                      <td className="py-2 px-4">{appt.userName || appt.userEmail}</td>
                      <td className="py-2 px-4">{appt.timeSlot}</td>
                      <td className="py-2 px-4 capitalize">{appt.status}</td>
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        <button
                          onClick={() => updateStatus(appt._id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          disabled={appt.status === 'confirmed' || appt.status === 'cancelled' || appt.status === 'completed'}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(appt._id, 'cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          disabled={appt.status === 'cancelled' || appt.status === 'completed'}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}