import React from 'react';

const Button = ({ className, text, onClick }) => {
  return (
    <button
      className={`btn bg-indigo-200 hover:bg-indigo-500 hover:text-white ${className}`} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;