'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Appointment {
  _id: string;
  user?: {
    name: string;
  };
  service?: {
    name: string;
  };
  date: string;
  timeSlot: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalUsers: 0,
    totalServices: 0,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    if (!user.isAdmin) {
      router.replace('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, appointmentsRes] = await Promise.all([
          axios.get('/api/admin/stats', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('/api/admin/appointments', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setStats(statsRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (!user) return <p className="p-4">Loading user...</p>;
  if (!user.isAdmin) return <p className="p-4">Redirecting...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded-xl p-4 border">
              <h2 className="text-lg font-semibold">Appointments</h2>
              <p className="text-2xl mt-2">{stats.totalAppointments}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 border">
              <h2 className="text-lg font-semibold">Users</h2>
              <p className="text-2xl mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 border">
              <h2 className="text-lg font-semibold">Services</h2>
              <p className="text-2xl mt-2">{stats.totalServices}</p>
            </div>
          </div>

          {/* Recent Appointments Table */}
          <div className="bg-white shadow rounded-xl p-4 border">
            <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
            {appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">User</th>
                    <th className="py-2">Service</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Time</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((appt) => (
                    <tr key={appt._id} className="border-b">
                      <td className="py-2">{appt.user?.name || 'N/A'}</td>
                      <td className="py-2">{appt.service?.name || 'N/A'}</td>
                      <td className="py-2">{appt.date}</td>
                      <td className="py-2">{appt.timeSlot}</td>
                      <td className="py-2 capitalize">{appt.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
