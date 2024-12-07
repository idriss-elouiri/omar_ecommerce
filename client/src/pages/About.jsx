// src/About.js

import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">About Us</h1>
        <div className="bg-white shadow-md rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At [Your Company Name], our mission is to provide the best electronic products with exceptional customer service. We are dedicated to delivering high-quality and innovative gadgets that enhance your everyday life.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li>Wide selection of top-brand electronics</li>
            <li>Competitive prices and special offers</li>
            <li>Expert support and advice from our team</li>
            <li>Fast and reliable shipping</li>
          </ul>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Have questions or need assistance? Reach out to us and our friendly customer support team will be happy to help.
          </p>
          <p className="text-gray-800 font-semibold">Email: support@yourcompany.com</p>
          <p className="text-gray-800 font-semibold">Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default About;
