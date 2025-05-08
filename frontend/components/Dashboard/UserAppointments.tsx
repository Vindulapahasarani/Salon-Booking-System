'use client';

import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import RescheduleModal from './RescheduleModal';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  date: string;
  timeSlot: string;
  service: {
    name: string;
    duration: number;
  };
  status: string;
}

export default function UserAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setShowModal(false);
  };

  if (loading) return <p>Loading appointments...</p>;

  if (appointments.length === 0) {
    return <p className="text-gray-500 text-center">No appointments found.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      <div className="space-y-4">
        {appointments.map((appt) => (
          <div key={appt._id} className="border p-4 rounded shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{appt.service?.name}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(appt.date), 'PPP')} at {appt.timeSlot}
                </p>
                <p className="text-xs text-gray-500 mt-1">Status: {appt.status}</p>
              </div>

              <button
                onClick={() => openModal(appt)}
                className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <RescheduleModal
          isOpen={showModal}
          onClose={closeModal}
          appointment={selectedAppointment}
          fetchAppointments={fetchAppointments}
        />
      )}
    </div>
  );
}
