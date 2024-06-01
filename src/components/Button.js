import React from 'react';

const Button = ({ className, text, onClick }) => {
  return (
    <div className={`block p-0  ${className}`}>
    <button
      className="text-black bg-[#c7e3fa] py-2 px-7 font-semibold"
      onClick={onClick}
    >
      {text}
    </button>
    </div>
  );
};

export default Button;