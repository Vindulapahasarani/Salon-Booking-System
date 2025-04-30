'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { format } from 'date-fns';
import { useAuth } from '@/utils/auth'; // your custom hook to get user
import { useRouter } from 'next/navigation';

interface Appointment {
  _id: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'canceled';
}

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth() as { user: User | null };
  const router = useRouter();

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/'); // Not admin? redirect
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get('/appointments/all');
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      }
    };

    fetchAppointments();
  }, [user, router]);

  const updateStatus = async (id: string, status: 'approved' | 'canceled') => {
    try {
      await axios.put(`/appointments/${id}`, { status });
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
      );
    } catch (err) {
      console.error('Failed to update appointment:', err);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Admin - Manage Appointments</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-6 text-left">Service</th>
              <th className="py-3 px-6 text-left">Customer</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Time</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="border-t">
                <td className="py-3 px-6">{appt.serviceName}</td>
                <td className="py-3 px-6">
                  {appt.userName}
                  <br />
                  {appt.userEmail}
                </td>
                <td className="py-3 px-6">
                  {format(new Date(appt.bookingDate), 'PP')}
                </td>
                <td className="py-3 px-6">{appt.bookingTime}</td>
                <td className="py-3 px-6 capitalize">{appt.status}</td>
                <td className="py-3 px-6 flex gap-2 justify-center">
                  <button
                    onClick={() => updateStatus(appt._id, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(appt._id, 'canceled')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
