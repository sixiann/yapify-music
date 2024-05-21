/* eslint-disable no-template-curly-in-string */
// import OpenAI from "openai";
require("dotenv").config();

const OpenAI = require("openai");
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

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

// server's endpoints
app.post("/get-current-artists", async (req, res) => {
  //get artists data
  const { token } = req.body;

  //testing 
//   const UsersArtistData = await getCurrentArtistsFromSpotify(token);

  //get the relevant variables from data
//   const processedData = data.items.map((artist) => ({
//     artistName: artist.name,
//     id: artist.id,
//     genres: artist.genres,
//     artistImage: artist.images[0] ? artist.images[0].url : null,
//   }));
//   console.log(processedData);
  
    // const userData = await getUserProfile(token);
    // const userName = userData.display_name;
    // const userImage = userData.images[1].url;

  //remember to add the try catch stuff later
    

    const data = "hello";
  res.status(200).json(data);
});

//spotify api requests

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

//get user's profile information
const getUserProfile = async (token) => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );    
      return data;
    } catch (error) {
      console.error("Error fetching top artists:", error);
      throw error;
    }
  };


//GPT wrapper - easily edit this later in case openai changes the format lmao 
const getGPTresponse = async(systemPrompt) =>{
    const completion = await openai.chat.completions.create({
        messages: [{"role": "system", 
        "content": systemPrompt}],
        model: "gpt-3.5-turbo",
      });
    
    return completion.choices[0].message.content;
}

const getThankYouText = async(userName, artistName, genres, index) =>{
    let systemPrompt = `You are ${artistName}. Talk like how ${artistName} talks based on their interviews, tweets etc. You are talking to a fan who loves your music. Draft a short thank you message to ${userName}. Your genres are an artist in ${genres}, use a tone similar to ${genres}.`
    
    //probability 1/3 that the artist mentions their ranking in the user's top 10 
    //this can't happen for every single artist or it's annoying af 
    const randomNumber = Math.floor(Math.random() * 3);
    if (randomNumber === 0) {
        systemPrompt += `Cheekily mention being ${index} in ${userName}'s top 10 Spotify artists.`
    } 
    
    const response = await getGPTresponse(systemPrompt);
    console.log(response)
    return response;
}


// getThankYouText('Lexa', 'Drake', ['Hip Hop', 'Rap'], 1).then(() => {
// }).catch((err) => {
//     console.error('Error:', err);
// });

// 1. thank you text - pass in genres and index, for 3 random artists mention 
// something about their ranking in the user's list --> gpt chatcompletions

// 2. get artist recommendations - spotify api endpoint + gpt chatcompletions

// 3. get fun fact - google search + gpt chatcompletions 


//can probably do this later, a bit complicated 
// 4. upcoming events - get user's location, search songkick for upcoming concerts, check whether they overlap with user's location, return to user + chat completions 
//openai api requests