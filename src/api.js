import axios from "axios";


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


//spotify api 
const getCurrentArtists = async (token) => {
  try {
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 10,
          time_range: "short_term",
        },
      }
    );
    console.log("get current artists success");
    console.log(data);
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

const getAllTimeArtists = async (token) => {
  try {
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 10,
          time_range: "long_term",
        },
      }
    );
    console.log("get all time artists success");
    console.log(data);
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};


export { getTokenFromUrl, getCurrentArtists, getAllTimeArtists };
