'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    _id: string;
    date: string;
    timeSlot: string;
  };
  fetchAppointments: () => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
}

export default function RescheduleModal({ isOpen, onClose, appointment, fetchAppointments, onReschedule }: RescheduleModalProps) {
  const [newDate, setNewDate] = useState(appointment.date.split('T')[0]); // Pre-fill with current date
  const [newTime, setNewTime] = useState(appointment.timeSlot); // Pre-fill with current time

  const handleSubmit = async () => {
    if (!newDate || !newTime) {
      toast.error('Please select a date and time.');
      return;
    }

    try {
      await onReschedule(appointment._id, newDate, newTime);
      onClose();
    } catch (err) {
      toast.error('Failed to reschedule appointment.');
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
                <Dialog.Title className="text-lg font-bold mb-4">Reschedule Appointment</Dialog.Title>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
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
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
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