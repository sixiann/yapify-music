// import "./App.css";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import Button from "./components/Button";
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
    <div className="">

        {!token ? (
          <LoginPage />
        ) : (
          <>
            <div className="w-full flex">
              <Button className="ml-auto mt-2 mr-2" text="Logout" onClick={logout}></Button>
            </div>

            <ChatsPage/>
            {/* <button onClick={() => getCurrentArtists(token)}>Get current Artists</button> */}


          </>
        )}
    </div>
  );
}

export default App;
