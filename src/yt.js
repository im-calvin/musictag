// Buildin with nodejs
import { rm } from "node:fs/promises";
import { join, resolve } from "node:path";
// External modules
import ffmpeg from "fluent-ffmpeg";
import ffmetadata from "ffmetadata";
import ytdl from "ytdl-core";
import Url from "url-parse";
// for image processing
import sharp from "sharp";
// get holo_metadata
import getVideoData from "./holo.js";

const pngPath = "img.png";

/**
 * must have ffmpeg in path: %FFMPEG: xx
 * @param {,} url
 * @param {*} fileDirectory
 */
async function getMP3(url, fileDirectory) {
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
      .on("start", () => console.log("started"))
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

  sharp(Buffer.from(await response.arrayBuffer()))
    .resize(720, 720)
    .toFile(pngPath);
}

getMP3("https://www.youtube.com/watch?v=sSIzlmDcywQ", resolve());
