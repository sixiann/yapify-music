import React from "react";
import { login } from "./api";


function LoginPage() {

  return (
    <>
      <div className="window bg-white p-44 w-7/12 justify-center text-center">
        <button 
        // className="border-2 p-5 font-serif border-x-slate-500"
        className = "bg-white hover:bg-emerald-300 text-gray-700 font-serif py-2 px-4 border border-gray-400 shadow"
        
        onClick={login}>Login with Spotify</button>

      </div>
      
    </>
  );
}

export default LoginPage;
