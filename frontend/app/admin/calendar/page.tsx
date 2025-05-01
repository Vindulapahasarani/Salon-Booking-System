'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '@/utils/axios';
import { format } from 'date-fns';

// ✅ Use the correct Calendar value types from react-calendar
import type { CalendarProps } from 'react-calendar';

interface Appointment {
  _id: string;
  userEmail: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: string;
}

export default function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Correct handler using react-calendar's types
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    const date = Array.isArray(value) ? value[0] : value;
    if (date instanceof Date) {
      setSelectedDate(date);
    }
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

        {/* Appointments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Appointments on {format(selectedDate, 'MMMM dd, yyyy')}
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border-l-4 border-blue-500 bg-white p-4 rounded-md shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium">{appointment.serviceName}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.timeSlot} - ${appointment.price}
                    </p>
                    <p className="text-sm text-gray-500">Client: {appointment.userEmail}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
