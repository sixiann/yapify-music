import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import { getTokenFromUrl } from "./api.js";

function App() {
  const [token, setToken] = useState("");
  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);

  return (
    <>
      {!token ? (
        <LoginPage />
      ) : (
        <>
          <ChatsPage token={token} setToken={setToken} />
        </>
      )}
    </>
  );
}

export default App;
