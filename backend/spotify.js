//-------------------------------- spotify api requests ----------------------------//
const axios = require('axios');

//get user's profile information
const getUserProfile = async (token) => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

//get user's current top artists
const getCurrentArtistsFromSpotify = async (token) => {
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
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

//get user's current top tracks
const getCurrentTracksFromSpotify = async (token) => {
  try {
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
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
    return data;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};

//get artists similar to artistId
const getRelatedArtists = async (token, artistId) => {
  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

//get several tracks' audio features
const getSeveralTracksFeatures = async (token, trackIds) => {
  const idsString = trackIds.join(",");
  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/audio-features?ids=${idsString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

module.exports = {
  getUserProfile,
  getCurrentArtistsFromSpotify,
  getCurrentTracksFromSpotify,
  getRelatedArtists,
  getSeveralTracksFeatures,
};
