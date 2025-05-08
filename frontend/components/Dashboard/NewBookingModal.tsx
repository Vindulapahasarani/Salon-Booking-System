'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import axios from '@/utils/axios';
import toast from 'react-hot-toast';

interface Service {
  _id: string;
  name: string;
  price: number;
}

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchAppointments: () => void;
}

export default function NewBookingModal({
  isOpen,
  onClose,
  fetchAppointments,
}: NewBookingModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedService('');
    setDate('');
    setTime('');
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error('Fetch services error:', err);
      toast.error('Failed to load services.');
    }
  };

  const handleBooking = async () => {
    const service = services.find((s) => s._id === selectedService);

    if (!service || !date || !time) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/appointments', {
        serviceId: service._id,
        serviceName: service.name,
        date, // send as plain YYYY-MM-DD
        timeSlot: time, // send as plain HH:mm
        price: service.price,
      });

      toast.success('Appointment booked!');
      onClose();
      fetchAppointments();
    } catch (err: any) {
      console.error('Booking error:', err);
      toast.error(err?.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold mb-4">Book New Appointment</Dialog.Title>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                      disabled={loading}
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} – ${s.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Book'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
