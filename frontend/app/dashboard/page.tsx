'use client';

import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import RescheduleModal from "@/components/Dashboard/RescheduleModal";
import NewBookingModal from "@/components/Dashboard/NewBookingModal";
import UserProfile from "@/components/Dashboard/UserProfile";
import PaymentSection from '@/components/Dashboard/PaymentSection';
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

interface Appointment {
  _id: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: "pending" | "approved" | "rejected" | "paid";
  paymentMethod?: 'card' | 'cash';
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/appointments/my");
      setAppointments(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch appointments");
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
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelingId(id);
    try {
      await axios.delete(`/appointments/${id}`);
      toast.success("Appointment canceled!");
      fetchAppointments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancelingId(null);
    }
  };

  const unpaidAppointments = appointments.filter(a => a.status === "approved");
  const totalPrice = unpaidAppointments.reduce((sum, a) => sum + a.price, 0);

  const handleGroupedPayment = async () => {
    if (unpaidAppointments.length === 0) return;

    if (paymentMethod === 'card') {
      try {
        const res = await axios.post("/api/stripe/checkout", {
          appointments: unpaidAppointments.map(a => ({
            appointmentId: a._id,
            serviceName: a.serviceName,
            price: a.price,
            tipAmount: 0,
          })),
        });
        window.location.href = res.data.checkoutUrl;
      } catch (err) {
        toast.error("Failed to start Stripe payment.");
      }
    } else {
      try {
        await Promise.all(
          unpaidAppointments.map(a =>
            axios.put(`/appointments/${a._id}/pay-with-cash`)
          )
        );
        toast.success("Cash payment confirmed for all appointments.");
        fetchAppointments();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to confirm cash payments");
      }
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
        {/* Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <UserProfile />
          </div>
        </div>

        {/* Appointments and Payment Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Appointments */}
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
                  <div
                    key={appointment._id}
                    className="border p-4 rounded-lg shadow-sm bg-gray-50"
                  >
                    <h3 className="text-lg font-bold">{appointment.serviceName}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appointment.date), "PPP")} at {appointment.timeSlot}
                    </p>
                    <p className="text-sm text-gray-600">Price: ${appointment.price}</p>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          appointment.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : appointment.status === "paid"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openRescheduleModal(appointment)}
                        className="text-sm px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        disabled={cancelingId === appointment._id}
                      >
                        {cancelingId === appointment._id ? "Canceling..." : "Cancel"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Section */}
          {unpaidAppointments.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>

              <p className="mb-2">
                <strong>Total Unpaid:</strong> ${totalPrice.toFixed(2)}
              </p>

              <div className="my-4">
                <label className="block font-medium mb-2">Select Payment Method:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    Card
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    Cash
                  </label>
                </div>
              </div>

              <button
                onClick={handleGroupedPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {paymentMethod === 'card' ? 'Pay Now' : 'Confirm with Cash'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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
        <PaymentSection />
    </div>
  );
}
