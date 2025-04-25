'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const ServiceCard = ({ service }: { service: Service }) => {
  const fallbackImage = '/images/default.jpg'; // Place this in /public/images/
  const imageSrc = service.image && service.image !== '' ? service.image : fallbackImage;

  const capitalize = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white text-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1 overflow-hidden">
      <Image
        src={imageSrc}
        alt={service.name}
        width={500}
        height={300}
        className="w-full h-40 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = fallbackImage;
        }}
      />
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full uppercase font-semibold mb-2">
            {capitalize(service.category)}
          </span>
          <h3 className="text-xl font-bold mb-1">{capitalize(service.name)}</h3>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-yellow-600">₹{service.price}</span>
          <Link
            href={`/book/${service._id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm px-4 py-1.5 rounded-md font-semibold transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
