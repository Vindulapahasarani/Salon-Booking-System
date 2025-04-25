"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

// ...rest of your component code


const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/contact", formData);
      setSuccessMessage(res.data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setSuccessMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <section className="relative bg-gray-50 py-16 px-6">
      <div className="absolute inset-0">
        <Image src="/images/c1.svg" alt="Background Pattern" fill className="object-cover opacity-5" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-3xl font-semibold tracking-wide">✂️</div>
          <h2 className="text-sm text-yellow-600 font-medium uppercase">Contact</h2>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Send a Message</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button type="submit" className="bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-700 transition">
            Send Message
          </button>
          {successMessage && <p className="text-green-600 font-medium mt-2">{successMessage}</p>}
        </form>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 mt-10">
          <div>
            <h3 className="font-semibold">Visit Us</h3>
            <p className="text-sm">123 Main Street, Downtown, NY 10001</p>
          </div>
          <div>
            <h3 className="font-semibold">Get In Touch</h3>
            <p className="text-sm">+1 813-644-6006</p>
            <p className="text-sm">info@salonbarber99.com</p>
          </div>
          <div>
            <h3 className="font-semibold">Open Hours</h3>
            <p className="text-sm">Monday - Friday: 2 PM - 10 PM</p>
            <p className="text-sm">Saturday - Sunday: 10 AM - 10 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
