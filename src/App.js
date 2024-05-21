import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const CLIENT_ID = "14b349f6603e49d8a89fbf959df2b9d4";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const [token, setToken] = useState("");
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const login = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  };

  const getTokenFromUrl = () => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    return token;
  };

  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);



  return (
    <div className="App">
      <header className="App-header">

        {!token ? (
          <>
          <h1>Spotify React log in to start</h1>
          <button onClick={login}>Login</button>
          </>
        ) : (
<>
          <h1>Log out</h1>
          <button onClick={logout}>Logout</button>
          </>        
        )}
      </header>
    </div>
  );
}

export default App;
