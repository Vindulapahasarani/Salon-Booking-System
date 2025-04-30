"use client";

import { useState } from "react";
import axios from "@/utils/axios";
import { useAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";

type BookingFormProps = {
  serviceId: string;
};

const BookingForm = ({ serviceId }: BookingFormProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("User not authenticated");
      return;
    }

    const typedUser = user as { id?: string; _id?: string };
    const userId = typedUser.id || typedUser._id;

    if (!bookingDate || !bookingTime || !price || !userId || !serviceId) {
      alert("Missing required fields.");
      return;
    }

    try {
      const res = await axios.post("/api/appointments", {
        userId,
        serviceId,
        serviceName: "", // placeholder if needed
        timeSlot: `${bookingDate} ${bookingTime}`,
        price,
        date: bookingDate,
      });

      if (res.status === 201) {
        router.push("/booking/success");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input
        type="date"
        value={bookingDate}
        onChange={(e) => setBookingDate(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="time"
        value={bookingTime}
        onChange={(e) => setBookingTime(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Book Appointment
      </button>
    </form>
  );
};

export default BookingForm;
