'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '@/utils/axios';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

// Define Appointment interface
interface Appointment {
  id: string; // Use id instead of _id due to toJSON transform in backend
  userId: { name: string; email: string };
  serviceId: { name: string; price: number };
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
  const { user, loading: authLoading } = useAuth();

  // Define handleDateChange to match the Value type from react-calendar
  const handleDateChange = (
    value: Date | null | [Date | null, Date | null],
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    }
  };

  const fetchAppointmentsByDate = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Fetching appointments for date:', formattedDate);
      const res = await axios.get(`/admin/appointments/date/${formattedDate}`, {
        headers: { Authorization: `Bearer ${user?.token || ''}` },
      });
      console.log('Raw Appointments response:', res.data);
      if (!res.data || !Array.isArray(res.data)) {
        throw new Error('Invalid response format: Expected an array of appointments');
      }
      // Map the response to ensure all required fields are present
      const formattedAppointments = res.data.map((appt: any) => ({
        id: appt.id || '', // Use id instead of _id
        userId: appt.userId || { name: '', email: '' },
        serviceId: appt.serviceId || { name: '', price: 0 },
        userEmail: appt.userEmail || '',
        userName: appt.userId?.name || '',
        serviceName: appt.serviceId?.name || appt.serviceName || '',
        date: appt.date || '',
        timeSlot: appt.timeSlot || '',
        price: appt.price || 0,
        status: appt.status || 'pending',
      })).filter((appt: Appointment) => appt.id); // Filter out invalid appointments
      setAppointments(formattedAppointments);
    } catch (error: any) {
      console.error('Fetch appointments error:', error.response?.data || error.message);
      setError(`Failed to fetch appointments: ${error.response?.status || 'Unknown'} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsByMonth = async (date: Date) => {
    try {
      setError(null);
      const formattedMonth = format(date, 'yyyy-MM');
      console.log('Fetching appointment counts for month:', formattedMonth);
      const res = await axios.get(`/admin/appointments/month/${formattedMonth}`, {
        headers: { Authorization: `Bearer ${user?.token || ''}` },
      });
      console.log('Raw Appointment counts response:', res.data);
      if (!res.data || typeof res.data !== 'object') {
        throw new Error('Invalid response format: Expected an object for appointment counts');
      }
      setAppointmentCounts(res.data);
    } catch (error: any) {
      console.error('Fetch appointment counts error:', error.response?.data || error.message);
      setError(`Failed to fetch appointment counts: ${error.response?.status || 'Unknown'} - ${error.message}`);
    }
  };

  const handleApprove = async (id: string) => {
    if (!id) {
      setError('Appointment ID is undefined');
      return;
    }
    try {
      console.log('Approving appointment with ID:', id);
      const res = await axios.patch(`/admin/appointments/${id}`, { status: 'confirmed' }, {
        headers: { Authorization: `Bearer ${user?.token || ''}` },
      });
      console.log('Approve response:', res.data);
      fetchAppointmentsByDate(selectedDate);
    } catch (err: any) {
      console.error('Approve appointment error:', err.response?.data || err.message);
      setError(`Failed to approve appointment: ${err.response?.status || 'Unknown'} - ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Appointment ID is undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        console.log('Deleting appointment with ID:', id);
        const res = await axios.delete(`/admin/appointments/${id}`, {
          headers: { Authorization: `Bearer ${user?.token || ''}` },
        });
        console.log('Delete response:', res.data);
        fetchAppointmentsByDate(selectedDate);
      } catch (err: any) {
        console.error('Delete appointment error:', err.response?.data || err.message);
        setError(`Failed to delete appointment: ${err.response?.status || 'Unknown'} - ${err.response?.data?.message || err.message}`);
      }
    }
  };

  useEffect(() => {
    if (!authLoading && user?.isAdmin) {
      fetchAppointmentsByDate(selectedDate);
      fetchAppointmentsByMonth(selectedDate);
    }
  }, [selectedDate, user, authLoading]);

  if (authLoading) return <p>Loading authentication...</p>;
  if (!user?.isAdmin) return <p>Access denied. Admins only.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Calendar View</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            selectRange={false}
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
                    <tr key={appt.id} className="border-t">
                      <td className="py-2 px-4">{appt.serviceName}</td>
                      <td className="py-2 px-4">{appt.userName || appt.userEmail}</td>
                      <td className="py-2 px-4">{appt.timeSlot}</td>
                      <td className="py-2 px-4 capitalize">{appt.status}</td>
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        <Button
                          onClick={() => handleApprove(appt.id)}
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                          disabled={appt.status === 'confirmed' || appt.status === 'cancelled' || appt.status === 'completed'}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleDelete(appt.id)}
                          variant="default"
                          className="bg-red-500 hover:bg-red-600"
                          disabled={appt.status === 'cancelled' || appt.status === 'completed'}
                        >
                          Delete
                        </Button>
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