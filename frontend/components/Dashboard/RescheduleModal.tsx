"use client";

import { useState } from "react";
import axios from "@/utils/axios";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any; // Replace 'any' with your Appointment type if available
  fetchAppointments: () => void;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  fetchAppointments,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !appointment) return null;

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      setError("Please select a new date and time.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        date: newDate,
        time: newTime,
      };

      await axios.put(`/appointments/${appointment._id}`, payload);

      toast.success("Appointment rescheduled successfully!"); // ✅ Correct place for toast
      fetchAppointments(); // Refetch updated appointments
      onClose(); // Close the modal
    } catch (err: any) {
      console.error("Reschedule Error:", err);
      setError(err?.response?.data?.message || "Failed to reschedule appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Reschedule Appointment</h2>

        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-1">Current Date & Time:</p>
          <p className="text-gray-800 font-semibold">
            {format(new Date(appointment.date), "PPP")} at {appointment.time}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? "Rescheduling..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
