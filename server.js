/* eslint-disable no-template-curly-in-string */
require("dotenv").config();

// defining the server port
const port = 5000;

// initializing installed dependencies
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// listening for port 5000
app.listen(5000, () => console.log(`Server is running on ${port}`));

//import spotify functions
const {
  getUserProfile,
  getCurrentArtistsFromSpotify,
  getCurrentTracksFromSpotify,
  getRelatedArtists,
  getSeveralTracksFeatures,
} = require("./spotify");

//import openai functions
const {
  getThankYouText,
  getRecommendationsText,
  getSongsPersonalityMessages,
} = require("./openai");

//import helper functions
const {
  getTrackFeatureAverages,
  getTrackFeatureSummary,
} = require("./helpers");

let artistsData = {};
let userData = {};
let userToken = "";

//these two will run on pressing log in
app.post("/get-current-artists", async (req, res) => {
  const { token } = req.body;

  //store token for later use
  userToken = token;

  try {
    // const userCurrentArtistsData = await getCurrentArtistsFromSpotify(token);
    const userCurrentArtistsData = {
      items: [
        {
          name: "Dummy Artist 1",
          id: "dummy1",
          genres: ["pop", "rock"],
          images: [{ url: "https://example.com/dummy1.jpg" }],
          external_urls: { spotify: "https://open.spotify.com/artist/dummy1" }
        },
        {
          name: "Dummy Artist 2",
          id: "dummy2",
          genres: ["jazz", "blues"],
          images: [{ url: "https://example.com/dummy2.jpg" }],
          external_urls: { spotify: "https://open.spotify.com/artist/dummy2" }
        }
      ]
    };
    const userCurrentArtists = [];

    userCurrentArtistsData.items.forEach((artist, index) => {
      const artistInfo = {
        artistName: artist.name,
        artistId: artist.id,
        genres: artist.genres,
        artistImage: artist.images[0] ? artist.images[0].url : null,
        artistLink: artist.external_urls.spotify,
        index: index + 1,
      };

      artistsData[artist.id] = artistInfo;
      userCurrentArtists.push(artistInfo); //send the frontend back a list
    });

    res.status(200).json({ success: true, data: userCurrentArtists });
  } catch (error) {
    console.error("Error fetching artists from Spotify:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching artists from Spotify" });
  }
});

app.post("/get-user-profile", async (req, res) => {
  const { token } = req.body;
  try {
    const userSpotifyData = await getUserProfile(token);
    userData = {
      userName: userSpotifyData.display_name,
      userImage: userSpotifyData.images[0]
        ? userSpotifyData.images[0].url
        : null,
    };

    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user profile from Spotify:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile from Spotify",
    });
  }
});

//run when click artist name on sidebar
app.post("/get-thankyou-text", async (req, res) => {
  const { artistId } = req.body;
  const artistName = artistsData[artistId].artistName;
  const artistGenres = artistsData[artistId].genres;
  const artistIndex = artistsData[artistId].index;
  const userName = userData.userName;

  try {
    // const response = await getThankYouText(
    //   userName,
    //   artistName,
    //   artistGenres,
    //   artistIndex
    // );
    const response = "yep this works";
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error fetching artists from Spotify:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching artists from Spotify" });
  }
});

//run when user clicks option when chatting
app.post("/get-recommendations-text", async (req, res) => {
  // const { artistId } = req.body;

  // const artistName = artistsData[artistId].artistName;
  // const artistGenres = artistsData[artistId].genres;
  // const relatedArtistsData = await getRelatedArtists(userToken, artistId);
  // const relatedArtists = relatedArtistsData.artists
  //   .slice(0, 3)
  //   .map((artist) => artist.name);

  try {
    // const response = await getRecommendationsText(
    //   artistName,
    //   artistGenres,
    //   relatedArtists
    // );
    const response = "yep this works";
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error getting recommendations text:", error);
    res
      .status(500)
      .json({ success: false, message: "Error getting recommendations text" });
  }
});

app.get("/get-songs-personality-messages", async (req, res) => {
  const userCurrentTracksData = await getCurrentTracksFromSpotify(userToken);
  const userCurrentTracksIds = userCurrentTracksData.items.map(
    (track) => track.id
  );

  const trackFeatures = await getSeveralTracksFeatures(
    userToken,
    userCurrentTracksIds
  );
  const trackFeatureAverages = await getTrackFeatureAverages(
    trackFeatures.audio_features
  );
  const trackFeatureSummary = await getTrackFeatureSummary(
    trackFeatureAverages
  );

  const response = await getSongsPersonalityMessages(trackFeatureSummary);
  res.status(200).json({ success: true, data: response });
});

// 3. wikimedia api + chatcompletions - fun fact or tell story about life - this the real yapping

// 4. wikimedia api + chatcompletion - most recently what are they up to
