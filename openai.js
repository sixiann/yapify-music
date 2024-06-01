const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    let prompt = `IMPORTANT: No need to greet the fan, no need to say hello, hey etc. Write a message recommending similar artists: ${relatedArtists} to the fan.`;
  
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

  module.exports = {
    getThankYouText,
    getRecommendationsText,
    getSongsPersonalityMessages
  };