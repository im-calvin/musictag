const fs = require("fs/promises");
// Buildin with nodejs
const readline = require("readline");
// External modules
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const Url = require("url-parse");
// for image processing
const sharp = require("sharp");

async function getMP3(url, fileDirectory) {
  let url_data = new Url(url);
  let id = url_data.query.substring(3);
  let stream = ytdl(id, {
    quality: "highestaudio",
  });

  let start = Date.now();
  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${fileDirectory}/${id}.mp3`)
    .on("progress", (p) => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${p.targetSize}kb downloaded`);
    })
    .on("end", () => {
      console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
    });

  const imageURL = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  cropImage(url);
}

async function cropImage(imageURL) {
  const response = await fetch(imageURL);

  // const buffer = sharp(Buffer.from(await response.arrayBuffer()))
  //   .resize(720, 720)
  //   .toFile(`${__dirname}.png`);
  await fs.writeFile("image.jpg", Buffer.from(await response.arrayBuffer()));
}

getMP3("https://www.youtube.com/watch?v=fREEntfI27c", "../");
