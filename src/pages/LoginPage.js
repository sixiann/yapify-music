import React from "react";
import { login } from "../api";
import Button from "../components/Button";
import { TypeAnimation } from "react-type-animation";
import BlockContainer from "../components/BlockContainer";

function LoginPage() {
  return (
    <BlockContainer>
            <TypeAnimation
              sequence={[
                "Wanna get roasted for your impeccable music taste and yap with your favourite artists? Log in to spotify and come yap!",
              ]}
              speed={60}
            />
            <Button className="mt-5" text="Login" onClick = {login}></Button>
    </BlockContainer>
  );
}

export default LoginPage;
