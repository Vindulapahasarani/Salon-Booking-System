'use client';

import { useState } from 'react';

interface AppointmentCardProps {
  appointment: {
    _id: string;
    serviceName: string;
    date: string;
    timeSlot: string;
    status: string;
    price: number;
    paymentStatus?: string;
  };
  onCancel: (id: string) => void;
  onReschedule: () => void; // Simplified to trigger the modal in the parent
  onPay: (id: string, paymentMethod: 'stripe' | 'cash') => void;
}

const AppointmentCard = ({ appointment, onCancel, onReschedule, onPay }: AppointmentCardProps) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

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
      <p
        className={`text-sm font-bold mb-4 ${
          appointment.status === 'approved'
            ? 'text-green-600'
            : appointment.status === 'cancelled'
            ? 'text-red-600'
            : 'text-yellow-500'
        }`}
      >
        Status: {appointment.status}
      </p>
      <p className="text-sm mb-2">Price: ${appointment.price}</p>

      <div className="flex flex-wrap gap-3">
        {appointment.status !== 'cancelled' && (
          <>
            <button
              onClick={() => onCancel(appointment._id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={onReschedule}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reschedule
            </button>
          </>
        )}
        {appointment.paymentStatus !== 'paid' && (
          <button
            onClick={() => setShowPaymentOptions(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Pay Now
          </button>
        )}
      </div>

      {showPaymentOptions && appointment.paymentStatus !== 'paid' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;