'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

const Booking = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get<Service[]>('/services');
        setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = (serviceId: string) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/booking/${serviceId}`);
    }
  };

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((service) => service.category === selectedCategory);

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Book Your Service</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
        </div>
      ) : filteredServices.length === 0 ? (
        <p className="text-center text-gray-600">No services available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                <p className="text-gray-600 mb-3">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    ${service.price}
                  </span>
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {service.duration}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleBookNow(service._id)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;
