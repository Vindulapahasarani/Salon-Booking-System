'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext'; // ✅ corrected path
import { useRouter } from 'next/navigation';

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

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait until auth finishes loading

    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    const fetchAllAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const res = await axios.get('/appointments/all');
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAllAppointments();
  }, [user, loading, router]);

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

  if (loading) {
    return <p className="p-6">Loading user...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">All Appointments</h1>

      {loadingAppointments ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Service</th>
                <th className="py-3 px-4 text-left">Client</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className="border-t">
                  <td className="py-3 px-4">{appt.serviceName}</td>
                  <td className="py-3 px-4">
                    {appt.userName || appt.userEmail}
                  </td>
                  <td className="py-3 px-4">
                    {format(new Date(appt.date), 'MMMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4">{appt.timeSlot}</td>
                  <td className="py-3 px-4 capitalize">{appt.status}</td>
                  <td className="py-3 px-4 flex gap-2 justify-center">
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
  );
}
