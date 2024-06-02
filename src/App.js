import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import Button from "./components/Button";
import { getTokenFromUrl } from "./api";

// Default values shown

function App() {
  const [token, setToken] = useState("");
  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);

  return (
    <div className="">
      {!token ? (
        <LoginPage />
      ) : (
        <>
          <ChatsPage token={token} setToken={setToken} />
        </>
      )}
    </div>
  );
}

export default App;
