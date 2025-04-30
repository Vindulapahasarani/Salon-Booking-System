"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/axios"; // Use your configured axios instance
import { useRouter } from "next/navigation";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/services");

        // Remove duplicates by service name
        const uniqueServices = Array.from(
          new Map(res.data.map((service: Service) => [service.name, service])).values()
        );

        setServices(uniqueServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = (id: string) => {
    router.push(`/booking/${id}`);
  };

  return (
    <section className="py-12 px-4 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-10 text-blue-900">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between border-t-4 border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-lg font-bold text-blue-700">${service.price}</p>
            </div>
            <button
              onClick={() => handleBookNow(service._id)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
