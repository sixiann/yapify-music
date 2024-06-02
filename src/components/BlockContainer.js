import React from "react";

const BlockContainer = ({ children }) => {
  return (
    <div className = "h-screen flex items-center justify-center lg:px-28 xl:px-60 px-3">
      <div className="block p-0 fixed relative container border-[#dfe2e4] border ">
          <div className=" bg-[#c7e3fa] py-3">
            
            <p className="text-center font-bold text-3xl">♫⋆｡ Welcome to Yapify  ₊˚♬ ﾟ</p>
          </div>

          <div className="flex flex-col justify-center text-center items-center py-24 md:px-20 px-5 text-xl">
            {children}
          </div>
        </div>
      </div>
  );
};

export default BlockContainer;
