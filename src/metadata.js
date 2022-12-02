const ffmetadata = require("ffmetadata");
const { getVideoData } = require("/holo");

// requires ffmpeg to be in PATH

function writeMeta(fileDirectory, data, options) {
  ffmetadata.write(fileDirectory, data, options, function (err) {
    if (err) console.error("Error writing cover art");
    else console.log("Cover art added");
  });
}
