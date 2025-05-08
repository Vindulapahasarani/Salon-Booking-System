'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import RescheduleModal from '@/components/Dashboard/RescheduleModal';
import NewBookingModal from '@/components/Dashboard/NewBookingModal';
import { format, differenceInHours } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

interface Appointment {
  _id: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/appointments/my');
      setAppointments(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const closeRescheduleModal = () => {
    setSelectedAppointment(null);
    setIsRescheduleModalOpen(false);
  };

  const cancelAppointment = async (id: string, appointmentDate: string, timeSlot: string) => {
    if (!id) {
      toast.error('Invalid appointment ID');
      return;
    }

    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T${timeSlot}`);
    const hoursDiff = differenceInHours(appointmentDateTime, now);

    if (hoursDiff < 24) {
      toast.error('You can only cancel appointments more than 24 hours in advance.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmed) return;

    setCancelingId(id);
    try {
      await axios.delete(`/appointments/${id}`);
      toast.success('Appointment canceled successfully!');
      fetchAppointments();
    } catch (err: any) {
      console.error('Cancel error:', err);
      toast.error(err?.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Book New Appointment
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading appointments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{appointment.serviceName}</h2>
                <p className="text-gray-600 text-sm mb-1">
                  {format(new Date(appointment.date), 'PPP')} at {appointment.timeSlot}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Price: <span className="font-semibold">${appointment.price}</span>
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                    appointment.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {appointment.status.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openRescheduleModal(appointment)}
                  className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => cancelAppointment(appointment._id, appointment.date, appointment.timeSlot)}
                  className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                  disabled={cancelingId === appointment._id}
                >
                  {cancelingId === appointment._id ? 'Canceling...' : 'Cancel'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isRescheduleModalOpen && selectedAppointment && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={closeRescheduleModal}
          appointment={selectedAppointment}
          fetchAppointments={fetchAppointments}
        />
      )}

      {isNewBookingModalOpen && (
        <NewBookingModal
          isOpen={isNewBookingModalOpen}
          onClose={() => setIsNewBookingModalOpen(false)}
          fetchAppointments={fetchAppointments}
        />
      )}
    </div>
  );
}
