"use client";
import Image from "next/image";
import React from "react";

const Aboutus = () => {
  return (
    <div className="bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* About Us Title */}
<div className="text-center">
  <h1 className="text-4xl md:text-5xl font-bold uppercase text-white tracking-wide border-b-2 border-yellow-500 inline-block pb-2">
    About Us
  </h1>
</div>


        {/* Welcome Intro Section */}
        <div className="text-center max-w-3xl mx-auto mt-10">
          <p className="text-gray-200 text-xl md:text-2xl font-serif leading-relaxed tracking-wide">
            Welcome to <span className="text-yellow-400 font-semibold">Saloon</span>, where style meets sophistication. Since 2000, we’ve delivered top-notch grooming with a touch of luxury. Whether it’s a classic cut, a bold new style, or a relaxing shave, our expert barbers use modern techniques and premium products to give you the perfect finish.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <Image
            src="/images/1.png"
            alt="Our Story"
            width={600}
            height={400}
            className="rounded-2xl shadow-2xl w-full h-auto object-cover"
          />

          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-4">
              Our Story
            </h2>
            <p className="text-gray-300 leading-relaxed text-justify text-lg">
              Since 2000, <span className="text-white font-semibold">Saloon</span> has been a sanctuary of grooming excellence. We blend traditional techniques with modern trends to offer timeless styles and confidence-boosting transformations. Our team is passionate about making every visit feel like a moment of self-care and luxury.
            </p>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed text-justify text-lg">
              At <span className="text-white font-semibold">Saloon</span>, we aim to redefine grooming with precision, style, and excellence. Our mission is to provide each client with top-tier service in a warm, welcoming environment—where they leave not only looking great but feeling their absolute best.
            </p>
          </div>

          {/* Image */}
          <Image
            src="/images/2.png"
            alt="Our Mission"
            width={600}
            height={400}
            className="rounded-2xl shadow-2xl w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
