import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import Button from "./components/Button";
import {
  getTokenFromUrl,
} from "./api";


// Default values shown

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
            <Button 
              className="ml-auto mt-2 mr-7 mb-1"
              onClick={logout}
              text="Logout"/>
          </div>

          <ChatsPage token={token} />
        </>
      )}
    </div>
  );
}

export default App;