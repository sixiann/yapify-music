import React from "react";
import { login } from "../api";
import Button from "../components/Button";
import BlockContainer from "../components/BlockContainer";

function ErrorPage() {
  return (
    <BlockContainer>
            <p>Session expired, please log in again! </p>
            <Button className="mt-5" text="Login" onClick = {login}></Button>
    </BlockContainer>
  );
}

export default ErrorPage;
