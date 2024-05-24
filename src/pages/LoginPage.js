import React from "react";
import { login } from "../api";
import Button from "../components/Button";
import { TypeAnimation } from "react-type-animation";

function LoginPage() {
  return (
    <>
    <div className = "h-screen flex items-center justify-center">
      <div className="lg:px-28 xl:px-60 container ">
        <div className="window">
          <div className="title-bar bg-indigo-400">
            <button aria-label="Close" className="clos"></button>
            <h1 className="title">Welcome to Yapify</h1>
            <button aria-label="Resize" disabled className="hidden"></button>
          </div>
          <div className="separator"></div>

          <div className=" window-pane flex flex-col justify-center text-center items-center py-24">
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
      </div>
    </>
  );
}

export default LoginPage;
