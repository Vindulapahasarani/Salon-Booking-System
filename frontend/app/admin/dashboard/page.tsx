'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalUsers: 0,
    totalServices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load admin statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading stats...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
      )}
    </div>
  );
};

export default DashboardPage;
