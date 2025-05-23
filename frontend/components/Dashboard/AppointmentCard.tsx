'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AppointmentCardProps {
  appointment: {
    id?:string;
    _id: string;
    serviceName: string;
    date: string;
    timeSlot: string;
    status: string;
    price: number;
    paymentStatus?: string;
  };
  onCancel: (id: string) => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
  onPay: (id: string, paymentMethod: 'stripe' | 'cash') => void;
}

const AppointmentCard = ({ appointment, onCancel, onReschedule, onPay }: AppointmentCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const handleRescheduleSubmit = () => {
    if (newDate && newTime) {
      onReschedule(appointment.id, newDate, newTime);
      setShowModal(false);
    }
  };

  const handlePayClick = () => {
    setShowPaymentOptions(true);
  };

  const handlePaymentSelection = (method: 'stripe' | 'cash') => {
    onPay(appointment._id, method);
    setShowPaymentOptions(false);
  };

  return (
    <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition relative bg-white">
      <h3 className="text-xl font-bold mb-2">{appointment.serviceName}</h3>
      <p className="text-gray-600">
        Date: {new Date(appointment.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-2">
        Time: {appointment.timeSlot}
      </p>
      <p className={`text-sm font-bold mb-4 ${
        appointment.status === 'approved'
          ? 'text-green-600'
          : appointment.status === 'cancelled'
          ? 'text-red-600'
          : 'text-yellow-500'
      }`}>
        Status: {appointment.status}
      </p>
      <p className="text-sm mb-2">Price: ${appointment.price}</p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCancel(appointment._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reschedule
        </button>
        {appointment.paymentStatus !== 'paid' && (
          <button
            onClick={handlePayClick}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Pay Now
          </button>
        )}
      </div>

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

      {showPaymentOptions && appointment.paymentStatus !== 'paid' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Select Payment Method</h2>
            <div className="space-y-4">
              <button
                onClick={() => handlePaymentSelection('stripe')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Pay with Card (Stripe)
              </button>
              <button
                onClick={() => handlePaymentSelection('cash')}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Pay with Cash
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPaymentOptions(false)}
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