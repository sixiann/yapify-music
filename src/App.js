import "./App.css";
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
    <div className="App 
    bg-[url('https://images.unsplash.com/photo-1584968203528-00005749189c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
     bg-cover">
      <header className="App-header">
        {!token ? (
          <LoginPage />
        ) : (
          <>
            <h1>Log out</h1>
            <button onClick={logout}>Logout</button>
            
            <button onClick={() => getCurrentArtists(token)}>Get current Artists</button>


          </>
        )}
      </header>
    </div>
  );
}

export default App;
