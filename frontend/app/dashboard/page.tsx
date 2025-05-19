'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import AppointmentCard from '@/components/Dashboard/AppointmentCard';
import RescheduleModal from '@/components/Dashboard/RescheduleModal';
import NewBookingModal from '@/components/Dashboard/NewBookingModal';
import UserProfile from '@/components/Dashboard/UserProfile';
import toast, { Toaster } from 'react-hot-toast';

interface Appointment {
  _id: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: string;
  paymentStatus?: string;
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
      setError(err?.response?.data?.message || 'Failed to fetch appointments');
      toast.error(err?.response?.data?.message || 'Failed to fetch appointments');
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

  const cancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelingId(id);
    try {
      await axios.put(`/appointments/${id}/cancel`);
      toast.success('Appointment canceled!');
      fetchAppointments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancelingId(null);
    }
  };

  const rescheduleAppointment = async (id: string, newDate: string, newTime: string) => {
    try {
      const isoDateTime = new Date(`${newDate}T${newTime}`).toISOString();
      await axios.put(`/appointments/${id}`, { date: isoDateTime, timeSlot: newTime });
      toast.success('Appointment rescheduled!');
      fetchAppointments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reschedule appointment');
      throw err; // Let the modal handle the error display
    }
  };

  const payAppointment = async (id: string, paymentMethod: 'stripe' | 'cash') => {
    try {
      if (paymentMethod === 'stripe') {
        const res = await axios.post('/payments/stripe/checkout', { appointmentIds: [id] });
        window.location.href = res.data.url;
      } else {
        await axios.put(`/appointments/${id}/pay-with-cash`);
        toast.success('Cash payment confirmed!');
        fetchAppointments();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <UserProfile />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            {loading ? (
              <p className="text-gray-500">Loading appointments...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : appointments.length === 0 ? (
              <p className="text-gray-500">No appointments found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onCancel={cancelAppointment}
                    onReschedule={() => openRescheduleModal(appointment)}
                    onPay={payAppointment}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isRescheduleModalOpen && selectedAppointment && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={closeRescheduleModal}
          appointment={selectedAppointment}
          fetchAppointments={fetchAppointments}
          onReschedule={rescheduleAppointment}
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