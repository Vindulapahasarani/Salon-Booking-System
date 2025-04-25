'use client';

import React, { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/auth/login', formData);

      // ✅ Save token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.user.email);

      alert('✅ Login successful!');
      router.push('/dashboard');
    } catch (err: any) {
      // ✅ Extract meaningful message
      const message = err.response?.data?.message;

      if (message === 'User not found') {
        setError('❌ No account found with that email.');
      } else if (message === 'Invalid password') {
        setError('❌ Incorrect password.');
      } else {
        setError(message || '❌ Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          placeholder="Email"
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          placeholder="Password"
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white px-6 py-2 rounded-md focus:outline-none transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Back to Home link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Or go back to{' '}
            <span
              onClick={() => router.push('/')}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Home
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
