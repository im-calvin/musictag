// Buildin with nodejs
const fetch = require("node-fetch").default;
const { rm } = require("node:fs/promises");
const { join, resolve } = require("node:path");
// for interfacing with files
// External modules
// for youtube download
const ytdl = require("ytdl-core");
const Url = require("url-parse");
// for image processing
const sharp = require("sharp");
// get holo_metadata
const getVideoData = require("./holo.js");
const { songQueue } = require("./index.js");
const { mkdir } = require("node:fs");

// the folder where the images are stored (folderName -> songName.png, songName.png, etc)
const folderName = "musictag_images";
// mkdir(join(resolve(), folderName));

/**
 * must have ffmpeg in path: %FFMPEG: xx
 * @param {string} url
 * @param {string} fileDirectory
 * @returns { map }
 * ex:
 * {
 *  "title": ["キュートなカノジョ | Cute Na Kanojo"],
 *  "artist": ["Ceres Fauna"],
 *  "album": ["キュートなカノジョ | syudou"]
 * }
 */
async function getMP3(event, url, fileDirectory) {
  if (fileDirectory.length === 0) {
    throw "Directory not found";
  }
  const url_data = new Url(url);
  const id = url_data.query.substring(3);
  // this might throw an error
  const metaMap = await getVideoData(id);

  const imageURL = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  // creates a cropped image called img.png
  cropImage(imageURL, songName);

  const stream = ytdl(id, {
    quality: "highestaudio",
    filter: "audioonly",
    format: ({ container }) => container === "mp4",
  });

  const songName = metaMap.get("title").replace(/[\\/:*?"<>|]/g, "");
  const fileName = join(fileDirectory, `${songName}.mp3`);

  await songQueue.add(
    songName,
    { stream: stream, fileName: fileName, metaMap: metaMap, songName: songName },
    { removeOnComplete: true, removeOnFail: true }
  );
  return metaMap;
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
    .toFile(`/${folderName}/${songName}.png`);
}

// getMP3("https://www.youtube.com/watch?v=sSIzlmDcywQ", resolve());

module.exports = getMP3;
