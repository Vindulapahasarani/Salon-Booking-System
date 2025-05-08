'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext'; 
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

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
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };

  const router = useRouter();

  const fetchAllAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const res = await axios.get('/appointments/all');
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      toast.error('Failed to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (loading) return; // wait until auth finishes loading

    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    fetchAllAppointments();
  }, [user, loading, router]);

  const updateStatus = async (id: string, status: 'approved' | 'canceled') => {
    // Validate ID
    if (!id) {
      toast.error('Invalid appointment ID');
      return;
    }

    try {
      setProcessingId(id);
      await axios.put(`/appointments/${id}`, { status });
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === id ? { ...appt, status } : appt))
      );
      toast.success(`Appointment ${status} successfully`);
    } catch (err) {
      console.error('Failed to update appointment:', err);
      toast.error('Failed to update appointment status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    // Validate ID
    if (!id) {
      toast.error('Invalid appointment ID');
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirm) return;
    
    try {
      setProcessingId(id);
      await axios.delete(`/appointments/${id}`);
      toast.success('Appointment deleted successfully');
      // Remove from list
      setAppointments(prev => prev.filter(appt => appt._id !== id));
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      toast.error('Failed to delete appointment');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <p className="p-6">Loading user...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-center" />
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
                      disabled={processingId === appt._id || appt.status === 'approved'}
                    >
                      {processingId === appt._id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => updateStatus(appt._id, 'canceled')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      disabled={processingId === appt._id || appt.status === 'canceled'}
                    >
                      {processingId === appt._id ? 'Processing...' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      disabled={processingId === appt._id}
                    >
                      {processingId === appt._id ? 'Processing...' : 'Delete'}
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