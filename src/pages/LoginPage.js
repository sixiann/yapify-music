import React from "react";
import { login } from "../api";
import Button from "../components/Button";
import { TypeAnimation } from "react-type-animation";

function LoginPage() {
  return (
    <>
    <div className = "h-screen flex items-center justify-center lg:px-28 xl:px-60 px-3">
      <div className="block p-0 fixed relative container border-[#dfe2e4] border ">
          <div className=" bg-[#c7e3fa] py-3">
            
            <p className="text-center font-bold text-3xl">♫⋆｡ Welcome to Yapify  ₊˚♬ ﾟ</p>
          </div>

          <div className="flex flex-col justify-center text-center items-center py-24 md:px-20 px-5 text-xl">
            <TypeAnimation
              sequence={[
                "Wanna get roasted for your impeccable music taste and yap with your favourite artists? Log in to spotify and come yap!",
              ]}
              speed={60}
            />
            <Button className="mt-5" text="Login" onClick = {login}></Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
