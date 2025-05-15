'use client';
import React from 'react';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="p-4 border rounded-md shadow-md hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-2">{service.description}</p>
      <span className="text-lg font-bold">${service.price}</span>
    </div>
  );
};

export default ServiceCard;
