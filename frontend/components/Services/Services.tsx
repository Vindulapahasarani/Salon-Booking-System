'use client';

import React, { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import axios from '@/utils/axios';
import ServiceCard from './ServiceCard';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  category: string;
  image?: string;
}

// ✅ Add fallback services here
const fallbackServices: Service[] = [
  {
    _id: '1',
    name: 'Classic Haircut',
    image: '/images/5.png',
    price: 25,
    duration: 30,
    category: 'Haircut',
    description: 'A stylish haircut tailored to your needs.',
  },
  {
    _id: '2',
    name: 'Beard Trim',
    image: '/images/6.png',
    price: 15,
    duration: 20,
    category: 'Haircut',
    description: 'Clean up your beard with precision trimming.',
  },
  {
    _id: '3',
    name: 'Shave & Facial',
    image: '/images/14.jpg',
    price: 35,
    duration: 30,
    category: 'Haircut',
    description: 'Luxurious shave with rejuvenating facial treatment.',
  },
  {
    _id: '4',
    name: 'Kids Haircut',
    image: '/images/10.png',
    price: 15,
    duration: 25,
    category: 'Haircut',
    description: 'Fun and gentle haircuts for little ones.',
  },
  {
    _id: '5',
    name: 'Hair Wash',
    image: '/images/8.png',
    price: 8,
    duration: 15,
    category: 'Haircut',
    description: 'Refreshing wash with premium products.',
  },
  {
    _id: '6',
    name: 'Facial Glow',
    image: '/images/14.jpg',
    price: 35,
    duration: 30,
    category: 'Beauty',
    description: 'Refresh your skin with a premium facial treatment.',
  },
  {
    _id: '7',
    name: 'Manicure',
    image: '/images/15.jpg',
    price: 20,
    duration: 25,
    category: 'Beauty',
    description: 'Perfect nails with a professional manicure.',
  },
];

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/services`)
      .then((res) => {
        setServices(res.data.length ? res.data : fallbackServices);
      })
      .catch((err) => {
        console.error('❌ Error fetching services:', err);
        setServices(fallbackServices);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gray-900 text-white py-20 px-4">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4">
          <span className="w-16 h-px bg-gray-500" />
          <Scissors size={36} className="text-yellow-500" />
          <span className="w-16 h-px bg-gray-500" />
        </div>
        <h2 className="text-4xl font-extrabold mt-4">Our Services</h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          Discover premium grooming and beauty services delivered with care and expertise.
        </p>
      </div>

      {loading ? (
        <p className="text-yellow-400 text-center animate-pulse">Loading services...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}

      <div className="mt-16 bg-gray-800 border border-yellow-600 p-8 rounded-2xl max-w-5xl mx-auto shadow-lg">
        <h3 className="text-3xl font-bold text-yellow-400 text-center mb-6">🕒 Open Hours</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-yellow-300 font-medium text-center">
          {[['Mon', '7 AM – 10 PM'], ['Tue', '7 AM – 10 PM'], ['Wed', '7 AM – 10 PM'], ['Thu', '7 AM – 10 PM'], ['Fri', '7 AM – 10 PM'], ['Sat', '8 AM – 10 PM'], ['Sun', '8 AM – 11 PM']].map(
            ([day, time], idx) => (
              <div
                key={idx}
                className="bg-gray-700 py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <p className="font-semibold">{day}</p>
                <p>{time}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
