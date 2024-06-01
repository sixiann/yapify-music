import React from 'react';

const Button = ({ className, text, onClick }) => {
  return (
    <button
      className={`border-[#eff2f5] border  text-black bg-[#c7e3fa] py-2 px-7 hover:bg-[#71aad7] font-semibold ${className}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;