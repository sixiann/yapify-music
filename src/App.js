import "./App.css";
import { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import { getTokenFromUrl, getCurrentArtists, getAllTimeArtists } from "./api";

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
    <div className="App">
      <header className="App-header">
        {!token ? (
          <LoginPage />
        ) : (
          <>
            <h1>Log out</h1>
            <button onClick={logout}>Logout</button>
            
            <button onClick={() => getCurrentArtists(token)}>Get current Artists</button>
            <button onClick={() => getAllTimeArtists(token)}>Get all time Artists</button>


          </>
        )}
      </header>
    </div>
  );
}

export default App;
