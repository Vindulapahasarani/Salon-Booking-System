'use client';

import { useState } from 'react';
import { motion } from 'framer-motion'; // Add framer-motion for animation (optional)

interface AppointmentCardProps {
  appointment: {
    _id: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
    status: string;
    paymentStatus?: string;
  };
  onCancel: (id: string) => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
  onPay: (id: string) => void;
}

const AppointmentCard = ({ appointment, onCancel, onReschedule, onPay }: AppointmentCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleRescheduleSubmit = () => {
    if (newDate && newTime) {
      onReschedule(appointment._id, newDate, newTime);
      setShowModal(false);
    }
  };

  return (
    <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition relative bg-white">
      <h3 className="text-xl font-bold mb-2">{appointment.serviceName}</h3>

      <p className="text-gray-600">
        Date: {appointment.bookingDate ? new Date(appointment.bookingDate).toLocaleDateString() : 'Not Set'}
      </p>
      <p className="text-gray-600 mb-2">
        Time: {appointment.bookingTime || 'Not Set'}
      </p>

      <p
        className={`text-sm font-bold mb-4 ${
          appointment.status === 'approved'
            ? 'text-green-600'
            : appointment.status === 'canceled'
            ? 'text-red-600'
            : 'text-yellow-500'
        }`}
      >
        Status: {appointment.status}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCancel(appointment._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel Appointment
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reschedule
        </button>

        {appointment.paymentStatus !== 'paid' && (
          <button
            onClick={() => onPay(appointment._id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Pay Now
          </button>
        )}
      </div>

      {/* Reschedule Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Reschedule Appointment</h2>

            <div className="space-y-4">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />

              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleRescheduleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AppointmentCard;
