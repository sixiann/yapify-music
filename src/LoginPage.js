import React from "react";

function LoginPage() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = [
    "user-library-read",
    "user-top-read",
    "user-read-recently-played",
  ];
  const login = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=${RESPONSE_TYPE}&show_dialog=true`;
  };
  return (
    <>
      <h1>Spotify React log in to start</h1>
      <button onClick={login}>Login</button>
    </>
  );
}

export default LoginPage;
