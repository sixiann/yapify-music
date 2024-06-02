import React from "react";
import Button from "../components/Button";
import BlockContainer from "../components/BlockContainer";

function ErrorPage({ logout }) {
  return (
    <BlockContainer>
            <p>Session expired, please log out and log in again! </p>
            <Button className="mt-5" text="Logout" onClick = {logout}></Button>
    </BlockContainer>
  );
}

export default ErrorPage;
