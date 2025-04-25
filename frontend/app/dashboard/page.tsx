'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';

const DashboardPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    };
    fetchAppointments();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
      <ul className="space-y-4">
        {appointments.map((a: any) => (
          <li key={a._id} className="border p-4 rounded shadow">
            <p>Service: {a.serviceType}</p>
            <p>Date: {a.date}</p>
            <p>Time: {a.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
