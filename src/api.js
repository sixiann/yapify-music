import axios from "axios";

//login
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3001";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-library-read",
  "user-top-read",
  "user-read-recently-played",
];

//leave this on frontend, i realized u can't hide ur client_id anyway since it's in the url
const login = () => {
  window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
    "%20"
  )}&response_type=${RESPONSE_TYPE}&show_dialog=true`;
};

// authorization functions
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

const getCurrentArtists = async (token) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/get-current-artists",
      {
        token,
      }
    );

    console.log("get current artists success");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};


export { login, getTokenFromUrl, getCurrentArtists };
