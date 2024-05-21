// spotifyAuth.js

export const CLIENT_ID = "14b349f6603e49d8a89fbf959df2b9d4";
export const REDIRECT_URI = "http://localhost:3000";
export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const RESPONSE_TYPE = "token";

export const logout = () => {
  window.localStorage.removeItem("token");
};

export const login = () => {
  window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
};

export const getTokenFromUrl = () => {
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
