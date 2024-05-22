/* eslint-disable no-template-curly-in-string */
// import OpenAI from "openai";
require("dotenv").config();

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// defining the server port
const port = 5000;

// initializing installed dependencies
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// listening for port 5000
app.listen(5000, () => console.log(`Server is running on ${port}`));

// ---------------------------- server's endpoint ---------------------------- //
// put all spotify api requests here since the token is passed here
app.post("/get-current-artists", async (req, res) => {
  const { token } = req.body;

  //get the user's top 10 artists
  //   const userCurrentArtistsData = await getCurrentArtistsFromSpotify(token);

  //   //get the relevant variables from artist's data
  // const userCurrentArtists = userCurrentArtistsData.items.map((artist, index) => ({
  //     artistName: artist.name,
  //     artistId: artist.id,
  //     genres: artist.genres,
  //     artistImage: artist.images[0] ? artist.images[0].url : null,
  //     artistLink: artist.external_urls.spotify,
  //     index: index + 1
  // }));

  //get the user's profile
  // const userData = await getUserProfile(token);
  // const userName = userData.display_name;
  // const userImage = userData.images[1].url;
  // const userCountry = userData.country;

  //get the top 3 most similar artists for each artist in top 10
  // const artistId = "0TnOYISbd1XYRBk9myaseg";
  // const relatedArtistsData = await getRelatedArtists(token, artistId);

  // const relatedArtists = relatedArtistsData.artists.slice(0, 3).map((artist) => ({
  //     artistName: artist.name,
  //     artistLink: artist.external_urls.spotify,
  // }));

  //get user's top tracks
  const userCurrentTracksData = await getCurrentTracksFromSpotify(token);
  const userCurrentTracksIds = userCurrentTracksData.items.map(
    (track) => track.id
  );

  const trackFeatures = await getSeveralTracksFeatures(
    token,
    userCurrentTracksIds
  );
  const trackFeatureAverages = await getTrackFeatureAverages(
    trackFeatures.audio_features
  );
  const trackFeatureSummary = await getTrackFeatureSummary(
    trackFeatureAverages
  );

  const songsPersonalityMessages = await getSongsPersonalityMessages(
    trackFeatureSummary
  );
  console.log(songsPersonalityMessages);
  //for each artist:
  //pass userName, artistname, artistIndex, genres to getThankYouText function
  //call getRelated artists
  //pass relatedArtists to the getRecommendationsText function

  //pass list of tracks to getseveraltracks audio features
  //pass results to dataprocessing function
  const data = "hello";
  res.status(200).json(data);
});

//-------------------------------- spotify api requests ----------------------------//

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

// -------------------------- openai api requests -------------------------------//
//GPT wrapper - easily edit this later in case openai changes the format lmao
const getGPTresponse = async (prompt) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
};

//1st message: thank you text
const getThankYouText = async (userName, artistName, genres, index) => {
  const systemPrompt = `You are ${artistName}. Talk like how ${artistName} talks based on their interviews, tweets etc. You are talking to a fan who loves your music. Your genres are an artist in ${genres}, use a tone similar to ${genres}.`;
  let prompt =
    systemPrompt + `Write a short thank you message to ${userName}. `;

  //probability 1/3 that the artist mentions their ranking in the user's top 10
  //this can't happen for every single artist or it's annoying af
  const randomNumber = Math.floor(Math.random() * 3);
  if (randomNumber === 0) {
    prompt += `Cheekily mention being number ${index} in ${userName}'s top 10 Spotify artists.`;
  }

  const response = await getGPTresponse(prompt);
  return response;
};

// 2nd message: artist recommendations
const getRecommendationsText = async (artistName, genres, relatedArtists) => {
  const systemPrompt = `You are ${artistName}. Talk like how ${artistName} talks based on their interviews, tweets etc. You are talking to a fan who loves your music. Your genres are an artist in ${genres}, use a tone similar to ${genres}.`;
  let prompt = `No need to greet the fan. Write a message recommending similar artists: ${relatedArtists} to the fan.`;

  prompt = systemPrompt + prompt;

  const response = await getGPTresponse(prompt);
  return response;
};

// song message: audio features
const getSongsPersonalityMessages = async (trackFeatureSummary) => {
  let prompt =
    "You are the user's FBI agent, it's the meme where you are watching them and analysing them. Use a sarcastic, humorous, and Gen Z sounding tone.";
  prompt += `Based on the user's listening habits: ${trackFeatureSummary}, generate a possible conversation between you and the user where you are roasting them for the features. Mention all the features across 3 messages. Do NOT mention specific artists or songs. Do NOT use characters like *. Do NOT use gendered language. Rephrase the words "above average", "low", "high", "average", etc. `;
  prompt += `Return it in this exact format, with linebreaks between the messages: GPTMessage: _ \n userMessage: _, \n GPTMessage: _, \n userMessage: _, \n GPTMessage:_`;
  prompt += "Include the user's replies to your three messages! Important!";

  const response = await getGPTresponse(prompt);

  //convert to messages format
  let messages = [];
  let listMessages = response.split("\n"); // Split by linebreak
  listMessages.forEach((msg) => {
    let split = msg.split(":");
    if (split[0] !== "") {
      messages.push({ [split[0]]: split[1] });
    }
  });

  return messages;
};

// --------------- helper functions -------------------------- //

//get the average of features
const getTrackFeatureAverages = async (trackFeatures) => {
  let sums = {
    danceability: 0,
    energy: 0,
    loudness: 0,
    speechiness: 0,
    acousticness: 0,
    instrumentalness: 0,
    liveness: 0,
    valence: 0,
  };

  // Iterate over each track and sum up the values
  trackFeatures.forEach((track) => {
    Object.keys(sums).forEach((key) => {
      sums[key] += track[key];
    });
  });

  // Calculate the averages
  const numTracks = trackFeatures.length;
  let averages = {};
  Object.keys(sums).forEach((key) => {
    averages[key] = sums[key] / numTracks;
  });

  return averages;
};

//put features into english words to pass to gpt
const getTrackFeatureSummary = async (trackFeatureAverages) => {
  let summary = "";
  Object.entries(trackFeatureAverages).forEach(([feature, value]) => {
    if (feature !== "loudness" && feature !== "speechiness") {
      let featureString = feature === "valence" ? "happiness" : feature;
      if (value >= 0.75) {
        summary += `very high ${featureString}\n`;
      } else if (value >= 0.5) {
        summary += `above average ${featureString}\n`;
      } else if (value >= 0.25) {
        summary += `average ${featureString}\n`;
      } else {
        summary += `low ${featureString}\n`;
      }
    }
  });
  return summary;
};

// 3. wikimedia api + chatcompletions - fun fact or tell story about life - this the real yapping

// 4. wikimedia api + chatcompletion - most recently what are they up to

//possibly
// 5. reddit api + chatcompletions - sentiment analysis ? on what people are saying about artist
