'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';

const AddServiceForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/services', {
        ...form,
        price: parseFloat(form.price),
        image: form.image || undefined,
      });
      alert('✅ Service added!');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert('❌ Failed to add service');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-xl mx-auto mt-10 p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-700">Add New Service</h2>
      <input
        name="name"
        placeholder="Service Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Category</option>
        <option value="Haircut">Haircut</option>
        <option value="Beauty">Beauty</option>
        <option value="Premium">Premium</option>
      </select>
      <input
        name="image"
        placeholder="Image URL (e.g. /images/10.png)"
        value={form.image}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add Service
      </button>
    </form>
  );
};

export default AddServiceForm;
