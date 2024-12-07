import React from "react";
import { Link } from "react-router-dom";

const Button = ({ text, bgColor, textColor, category }) => {
  return (
    <Link to={`/search?category=${category}`}>
      <button
        className={`${bgColor} ${textColor} cursor-pointer hover:scale-105 duration-300 px-5 py-2 bgColor rounded-full z-50`}
      >
        {text}
      </button>
    </Link>
  );
};

export default Button;