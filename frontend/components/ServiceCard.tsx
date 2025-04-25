import React from "react";
import { ServiceType } from "@/types";

type Props = {
  service: ServiceType;
  onBook?: () => void;
};

const ServiceCard: React.FC<Props> = ({ service, onBook }) => {
  return (
    <div className="border rounded-2xl shadow-md p-4 flex flex-col justify-between">
      <img
        src={service.image}
        alt={service.name}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-bold mb-1">{service.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
      <div className="text-yellow-700 font-semibold mb-1">${service.price}</div>
      <div className="text-sm text-gray-500 mb-4">{service.duration} mins</div>
      {onBook && (
        <button
          onClick={onBook}
          className="bg-yellow-600 text-white py-2 px-4 rounded-xl hover:bg-yellow-700 transition"
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default ServiceCard;
