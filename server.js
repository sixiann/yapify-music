// defining the server port
const port = 5000;

// initializing installed dependencies
const express = require("express");
require("dotenv").config();
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());


// listening for port 5000
app.listen(5000, () => console.log(`Server is running on ${port}`));

// API request

app.post("/get-current-artists", async (req, res) => {
  const { token } = req.body;

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
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching top artists:", error);
    res.status(500).json({ error: "Error fetching top artists" });
  }
});
