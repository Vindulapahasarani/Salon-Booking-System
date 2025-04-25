'use client';

import React, { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', formData);

      // ✅ Store email so it can be used later
      localStorage.setItem('userEmail', formData.email);

      toast.success('🎉 Registered successfully!');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || '❌ Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-96"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <input
          name="name"
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          required
        />

        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
          required
        />

        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-pink-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 focus:outline-none"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-pink-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
