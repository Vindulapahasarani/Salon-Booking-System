'use client';

import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  date: string;
  timeSlot: string;
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  fetchAppointments: () => void;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  fetchAppointments,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewDate('');
      setNewTime('');
      setError('');
    }
  }, [isOpen]);

  // Safety check - don't render if no appointment or ID
  if (!isOpen || !appointment || !appointment._id) return null;

  const handleReschedule = async () => {
    setError('');
    if (!newDate || !newTime) {
      setError('Please select a new date and time.');
      return;
    }

    try {
      setLoading(true);
      console.log(`Rescheduling appointment ${appointment._id} to ${newDate} at ${newTime}`);

      // Send only date and timeSlot as expected by backend schema
      await axios.put(`/appointments/${appointment._id}`, {
        date: newDate,       // e.g. "2025-05-08"
        timeSlot: newTime,   // e.g. "10:30"
      });

      toast.success('Appointment rescheduled!');
      await fetchAppointments();
      onClose();
    } catch (err: any) {
      console.error('Reschedule Error:', err);
      setError(err?.response?.data?.message || 'Failed to reschedule appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Reschedule Appointment</h2>

        <div className="mb-4 text-sm text-gray-700">
          <p className="mb-1">Current:</p>
          <p className="font-semibold">
            {format(new Date(appointment.date), 'PPP')} at {appointment.timeSlot}
          </p>
          {/* Display appointment ID for debugging */}
          <p className="text-xs text-gray-500 mt-1">Appointment ID: {appointment._id}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? 'Rescheduling...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}