'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input" />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="input" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="btn">{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
};

export default LoginForm;
