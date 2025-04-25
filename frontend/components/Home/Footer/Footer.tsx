import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Section: Salon Name & Social Icons */}
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-bold">HODOR SALON</h2>
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="bg-gray-700 p-3 rounded-full">
              <FaFacebookF className="text-white" />
            </Link>
            <Link href="#" className="bg-gray-700 p-3 rounded-full">
              <FaTwitter className="text-white" />
            </Link>
            <Link href="#" className="bg-gray-700 p-3 rounded-full">
              <FaInstagram className="text-white" />
            </Link>
            <Link href="#" className="bg-gray-700 p-3 rounded-full">
              <FaGoogle className="text-white" />
            </Link>
          </div>
          <p className="text-gray-400 mt-4 max-w-sm">
            Experience luxury hair and beauty treatments at Hodor Salon. Your style, our passion!
          </p>
        </div>

        {/* Middle Section: Address */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center w-64">
          <FaMapMarkerAlt className="text-white text-2xl mb-2" />
          <h3 className="text-lg font-bold">Visit Us</h3>
          <p className="text-gray-400 text-center">123 Main Street, Downtown, NY 10001</p>
        </div>

        {/* Right Section: Contact & Email */}
        <div className="flex gap-6">
          {/* Contact Card */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center w-64">
            <FaPhone className="text-white text-2xl mb-2" />
            <h3 className="text-lg font-bold">Call Us</h3>
            <p className="text-gray-400">+1 813-644-6006</p>
          </div>

          {/* Email Card */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center w-64">
            <FaEnvelope className="text-white text-2xl mb-2" />
            <h3 className="text-lg font-bold">Email Us</h3>
            <p className="text-gray-400">info@hodorsalon.com</p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center mt-8 text-gray-500 text-sm">
      Copyright© 2025 MakeItViral Media. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
