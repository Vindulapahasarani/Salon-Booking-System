'use client';

import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';

const AppointmentsPage = () => {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editingId, setEditingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';

  const fetchServices = async () => {
    try {
      const res = await axios.get('/services');
      const unique = Array.from(new Map(res.data.map(item => [item.name, item])).values());
      setServices(unique);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`/appointments/${email}`);
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, []);

  const handleSubmit = async () => {
    if (!selectedService || !date || !time) {
      setErrorMessage('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/appointments/${editingId}`, {
          date,
          timeSlot: time,
        });
        setSuccessMessage('Appointment updated!');
        setEditingId('');
      } else {
        await axios.post('/appointments', {
          serviceId: selectedService,
          date,
          timeSlot: time,
          userEmail: email,
        });
        setSuccessMessage('Appointment booked!');
      }

      setErrorMessage('');
      setDate('');
      setTime('');
      setSelectedService('');
      fetchAppointments();
    } catch (err) {
      console.error('❌ Booking error:', err);
      setErrorMessage('Error booking/updating appointment.');
      setSuccessMessage('');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  const handleReschedule = (appt) => {
    setEditingId(appt._id);
    setSelectedService(appt.serviceId?._id || '');
    setDate(appt.date.slice(0, 10));
    setTime(appt.timeSlot);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          {editingId ? 'Reschedule Appointment' : 'Book New Appointment'}
        </h3>

        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          disabled={!!editingId}
        >
          <option value="">Select Service</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Update Appointment' : 'Book Appointment'}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId('');
              setDate('');
              setTime('');
              setSelectedService('');
            }}
            className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel Editing
          </button>
        )}

        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt._id} className="border p-4 rounded-lg shadow-sm mb-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Service:</strong> {appt.serviceId?.name || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appt.timeSlot}</p>
                  <p><strong>Status:</strong> {appt.status}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleReschedule(appt)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
