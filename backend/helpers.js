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

  module.exports = {
    getTrackFeatureAverages, 
    getTrackFeatureSummary
  }