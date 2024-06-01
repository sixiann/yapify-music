// import "./App.css";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatsPage from "./pages/ChatsPage";
import Button from "./components/Button";

// import Button from "./components/Button";
import {
  getTokenFromUrl,
  getSongsPersonalityMessages,
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

{
  /* 

          <Button
            onClick={() => getUserProfile(token)}
            text="Get user profile"
          ></Button>

          <Button
            onClick={() => getThankYouText("4AK6F7OLvEQ5QYCBNiQWHq")}
            text="Get thank you text"
          ></Button>

          <Button
            onClick={() => getRecommendationsText("4AK6F7OLvEQ5QYCBNiQWHq")}
            text="Get recommendations"
          ></Button>

          <Button
            onClick={() => getSongsPersonalityMessages()}
            text="Get songs messages"
          ></Button> */
}
