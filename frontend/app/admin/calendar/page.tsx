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
  status: 'pending' | 'approved' | 'canceled';
}

export default function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    const date = Array.isArray(value) ? value[0] : value;
    if (date instanceof Date) setSelectedDate(date);
  };

  const fetchAppointmentsByDate = async (date: Date) => {
    try {
      setLoading(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const res = await axios.get(`/appointments?date=${formattedDate}`);
      setAppointments(res.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'canceled') => {
    try {
      await axios.put(`/appointments/${id}`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error('Failed to update appointment:', err);
    }
  };

  useEffect(() => {
    fetchAppointmentsByDate(selectedDate);
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
          />
        </div>

        {/* Appointments Table */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Appointments on {format(selectedDate, 'MMMM dd, yyyy')}
          </h2>

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
                          onClick={() => updateStatus(appt._id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(appt._id, 'canceled')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
