// Buildin with nodejs
const fetch = require("node-fetch");
const { rm } = require("node:fs/promises");
const { join, resolve } = require("node:path");
// External modules
const ffmpeg = require("fluent-ffmpeg");
const ffmetadata = require("ffmetadata");
const ytdl = require("ytdl-core");
const Url = require("url-parse");
// for image processing
const sharp = require("sharp");
// get holo_metadata
const getVideoData = require("./holo.js");

const pngPath = "img.png";

/**
 * must have ffmpeg in path: %FFMPEG: xx
 * @param {string} url
 * @param {string} fileDirectory
 */
async function getMP3(event, url, fileDirectory = resolve()) {
  const url_data = new Url(url);
  const id = url_data.query.substring(3);
  const imageURL = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  // creates a cropped image called src.png
  cropImage(imageURL);
  const metaMap = await getVideoData(id);

  const stream = ytdl(id, {
    quality: "highestaudio",
    filter: "audioonly",
    format: ({ container }) => container === "mp4",
  });

  const songName = metaMap.get("title").replace(/[\\/:*?"<>|]/g, "");
  const fileName = join(fileDirectory, `${songName}.mp3`);

  await new Promise((resolve, reject) => {
    new ffmpeg({ source: stream })
      .format("mp3")
      // .on("start", () => console.log("started"))
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(fileName);
  });

  await new Promise((resolve) => {
    ffmetadata.write(
      fileName,
      {
        artist: metaMap.get("artist"),
        album: metaMap.get("album"),
        title: metaMap.get("title"),
      },
      {
        attachments: [pngPath],
      },
      resolve
    );
  });

  await rm(pngPath);
}

/**
 *
 * @param {string} imageURL is website where it only has the img
 * writes a cropped image to 'pngPath'
 */
async function cropImage(imageURL) {
  const response = await fetch(imageURL);

  await sharp(Buffer.from(await response.arrayBuffer()))
    .resize(720, 720)
    .toFile(pngPath);
}

// getMP3("https://www.youtube.com/watch?v=sSIzlmDcywQ", resolve());

module.exports = getMP3;
