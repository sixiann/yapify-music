// import "./App.css";
import { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import { getTokenFromUrl, getCurrentArtists } from "./api";

function App() {
  const [token, setToken] = useState("");
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

        {!token ? (
          <LoginPage />
        ) : (
          <>
            <h1>Log out</h1>
            <button onClick={logout}>Logout</button>
            
            <button onClick={() => getCurrentArtists(token)}>Get current Artists</button>


          </>
        )}
    </div>
  );
}

export default App;
