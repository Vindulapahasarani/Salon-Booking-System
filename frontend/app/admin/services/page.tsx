'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import toast from 'react-hot-toast';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('/services');
      setServices(res.data);
    } catch (err) {
      toast.error('Failed to fetch services');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.name || !form.description || !form.price) {
        toast.error('Please fill in all fields');
        return;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
      };

      if (editingId) {
        await axios.put(`/services/${editingId}`, payload);
        toast.success('Service updated');
      } else {
        const res = await axios.post('/services', payload);
        toast.success('Service added');
      }

      setForm({ name: '', description: '', price: '' });
      setEditingId(null);
      fetchServices();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
    });
    setEditingId(service._id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`/services/${id}`);
        toast.success('Service deleted');
        fetchServices();
      } catch (err) {
        toast.error('Failed to delete service');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white shadow rounded p-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Service Name"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Service Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Service' : 'Add Service'}
        </button>
      </form>

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-gray-500">No services added yet.</p>
        ) : (
          services.map(service => (
            <div
              key={service._id}
              className="p-4 bg-gray-100 rounded shadow flex justify-between items-start"
            >
              <div>
                <h2 className="text-lg font-semibold">{service.name}</h2>
                <p>{service.description}</p>
                <p className="font-bold">${service.price.toFixed(2)}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
