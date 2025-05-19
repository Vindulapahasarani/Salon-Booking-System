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

export default function NewBookingModal({ isOpen, onClose, fetchAppointments }: NewBookingModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const fetchServices = async () => {
    try {
      const res = await axios.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch services', err);
      toast.error('Failed to load services.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      setDate(''); // Reset form when modal opens
      setTime('');
      setSelectedService('');
    }
  }, [isOpen]);

  const handleBooking = async () => {
    const selectedServiceObj = services.find((s) => s._id === selectedService);

    if (!selectedServiceObj || !date || !time) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(`${date}T${time}`);
    if (selectedDate < new Date()) {
      toast.error('Cannot book an appointment in the past.');
      return;
    }

    try {
      await axios.post('/appointments', {
        serviceId: selectedServiceObj._id,
        serviceName: selectedServiceObj.name,
        date: selectedDate.toISOString(),
        timeSlot: time,
        price: selectedServiceObj.price,
      });

      toast.success('Appointment booked!');
      onClose();
      fetchAppointments();
    } catch (err: any) {
      console.error('Booking error:', err);
      toast.error(err?.response?.data?.message || 'Failed to book appointment.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold mb-4">Book New Appointment</Dialog.Title>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} – ${service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Book
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