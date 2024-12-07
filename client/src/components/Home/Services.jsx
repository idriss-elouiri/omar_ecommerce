import React from "react";
import {
  FaCarSide,
  FaCheckCircle,
  FaHeadphonesAlt,
  FaWallet,
} from "react-icons/fa";

const servicesData = [
  {
    id: 1,
    icon: <FaCarSide className="text-4xl md:text-5xl text-emerald-600" />,
    title: "Free Shipping",
    description: "Free Shipping On All Orders",
  },
  {
    id: 2,
    icon: <FaCheckCircle className="text-4xl md:text-5xl text-emerald-600" />,
    title: "Save Money",
    description: "30 Days Money Back Guarantee",
  },
  {
    id: 3,
    icon: <FaWallet className="text-4xl md:text-5xl text-emerald-600" />,
    title: "Secure Payment",
    description: "100% Secure Payments",
  },
  {
    id: 4,
    icon: <FaHeadphonesAlt className="text-4xl md:text-5xl text-emerald-600" />,
    title: "Online Support 24/7",
    description: "Technical Support Available 24/7",
  },
];

const ServiceItem = ({ icon, title, description }) => (
  <div className="flex flex-col items-start sm:flex-row gap-4">
    {icon}
    <div>
      <h2 className="lg:text-xl font-bold">{title}</h2>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const Services = () => {
  return (
    <div className="w-[90%] mx-auto my-14 md:my-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
        {servicesData.map(({ id, icon, title, description }) => (
          <ServiceItem
            key={id}
            icon={icon}
            title={title}
            description={description}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
