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
  //   const usersArtistData = await getCurrentArtistsFromSpotify(token);

  //   //get the relevant variables from artist's data
  // const processedData = usersArtistData.items.map((artist, index) => ({
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

  //get the top 3 most similar artists for each artist in top 10
  // const artistId = "0TnOYISbd1XYRBk9myaseg";
  // const relatedArtistsData = await getRelatedArtists(token, artistId);

  // const relatedArtists = relatedArtistsData.artists.slice(0, 3).map((artist) => ({
  //     artistName: artist.name,
  //     artistLink: artist.external_urls.spotify,
  // }));

  //pass userName, artistname, artistIndex, genres to getThankYouText function
  //pass relatedArtists to the getRecommendationsText function

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
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw error;
  }
};

// getRelatedArtists(token, "0TnOYISbd1XYRBk9myaseg");


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

// getThankYouText('Lexa', 'Drake', ['Hip Hop', 'Rap'], 1).then(() => {
// }).catch((err) => {
//     console.error('Error:', err);
// });

// 2nd message: artist recommendations
const getRecommendationsText = async (artistName, genres, relatedArtists) => {
  const systemPrompt = `You are ${artistName}. Talk like how ${artistName} talks based on their interviews, tweets etc. You are talking to a fan who loves your music. Your genres are an artist in ${genres}, use a tone similar to ${genres}.`;
  let prompt = `No need to greet the fan. Write a short message recommending similar artists: ${relatedArtists} to the fan.`;

  prompt = systemPrompt + prompt;

  const response = await getGPTresponse(prompt);
  return response;
};

// getRecommendationsText('Kanye West', ['hip hop', 'chicago rap'], ['Drake, Nicki Minaj', 'Lil Uzi Vert']);

// 2. get artist recommendations - spotify api endpoint + gpt chatcompletions

// 3. get fun fact - google search + gpt chatcompletions

//can probably do this later, a bit complicated
// 4. upcoming events - get user's location, search songkick for upcoming concerts, check whether they overlap with user's location, return to user + chat completions
//openai api requests
