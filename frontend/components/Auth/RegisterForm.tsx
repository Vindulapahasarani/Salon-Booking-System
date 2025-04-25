'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', formData);
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Name" onChange={handleChange} className="input" required />
      <input name="email" placeholder="Email" onChange={handleChange} className="input" required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" required />
      <button type="submit" className="btn">Register</button>
    </form>
  );
};

export default RegisterForm;
