"use client";
import React from "react";

const Hero = () => {
  return (
    <div
      className="relative w-full h-[100vh] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/12.jpg')",
      }}
    >
      {/* ✅ Text Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-100 text-lg md:text-2xl font-light mb-4 tracking-wider">
            Fresh Since 2000
          </p>
          <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-widest uppercase font-serif drop-shadow-lg">
             Barber Saloon
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
