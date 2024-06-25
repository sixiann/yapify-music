# Yapify 🎵

Wanna get roasted for your impeccable music taste and yap with your favourite artists? Log in to Spotify and come yap!

** currently in dev mode, demo only works for registered users **
See the <a href="https://yapify-music.vercel.app/" target="_blank">live demo</a> here!


## Overview

This project provides a fun chat interface where users can log in with their Spotify account to see their current top artists and listening habits in a chat interface. The chat interface uses OpenAI to generate responses, creating a unique and interactive experience. Not a real chat, you can't actually talk to your favourite artists, but you can be delulu and pretend. 


## Technologies Used

- Frontend:
  - React ([CRA](https://create-react-app.dev/))
  - Tailwind CSS
  - [Blocks.css](https://thesephist.github.io/blocks.css/)
  - [chat-ui-kit-react](https://github.com/chatscope/chat-ui-kit-react?tab=readme-ov-file)

- Backend:
  - Express

## Installation

### Requirements
- Node.js and npm (Node Package Manager) installed globally on your machine.

### Steps
1. Clone the repository and navigate to directory:
   ```sh
   git clone https://github.com/sixiann/yapify-music/
   cd yapify-music
2. Install dependencies:
   ```sh
   npm install
3. Set up environment variables:
- Create a .env file in the root directory
- Add the following environment variables:
  ```sh
  REACT_APP_CLIENT_ID=your_spotify_client_id
  OPENAI_API_KEY=your_openai_api_key
4. Start the development server:
  ```sh
  npm run start
  ```
5. Open the app in your browser:
   ```sh
   http://localhost:3000
   ```
   You may have to change the REDIRECT_URI in src/api.js to http://localhost:3000 or whichever port it runs on.


  
   
