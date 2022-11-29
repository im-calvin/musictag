const { HolodexApiClient } = require("holodex.js");

require("dotenv").config();

const holodexClient = new HolodexApiClient({
  apiKey: process.env.HOLODEX_API_KEY,
});

/**
 *
 * @param {string} videoID id of video to get song metadata from
 * @returns map where val is a list where order is the order of songs that come in
 * {
 *  "title": ["キュートなカノジョ | Cute Na Kanojo"],
 *  "artist": ["Ceres Fauna"],
 *  "album": ["キュートなカノジョ | syudou"]
 * }
 */
async function getVideoData(videoID) {
  const res = new Map([
    ["title", []],
    ["artist", []],
    ["album", []],
  ]);
  const { songs, channel } = await holodexClient.getVideo(videoID);
  // should only be 1 song
  for (const song of songs) {
    // console.log(song.artist); // syudou
    // console.log(song.name); // キュートなカノジョ / Cute Na Kanojo
    // console.log(channel.name); // Ceres Fauna Ch. hololive-EN
    // console.log(channel.englishName); // Ceres Fauna
    // console.log(title); // キュートなカノジョ - Ceres Fauna 【COVER】

    const titleList = res.get("title");
    titleList.push(song.name.replace("/", "|"));
    res.set("title", titleList);

    var parsedName = engToJap.get(channel.englishName);
    if (parsedName === undefined) parsedName = channel.englishName;
    const artistList = res.get("artist");
    artistList.push(parsedName);
    res.set("artist", artistList);

    const albumList = res.get("album");
    if (song.name.indexOf("/") === -1) {
      albumList.push(song.name);
      res.set("album", albumList);
    } else {
      var albumName = song.name.substring(0, song.name.indexOf("/")).trim();
      albumName = albumName.concat(` | ${song.artist}`);
      albumList.push(albumName);
      res.set("album", albumList);
    }
  }
  return res;
}

getVideoData("s2wIscd82QE");

module.exports = getVideoData;

const engToJap = new Map([
  ["Tokino Sora", "ときのそら"],
  ["AZKi", "AZKi"],
  ["Roboco-san", "ロボ子さん"],
  ["Sakura Miko", "さくらみこ"],
  ["Shirakami Fubuki", "白上フブキ"],
  ["Natsuiro Matsuri", "夏色まつり"],
  ["Aki Rosenthal", "アキ・ローゼンタール"],
  ["Akai Haato", "赤井はあと"],
  ["Minato Aqua", "湊あくあ"],
  ["Murasaki Shion", "紫咲シオン"],
  ["Nakiri Ayame", "百鬼あやめ"],
  ["Yuzuki Choco", "癒月ちょこ"],
  ["Oozora Subaru", "大空スバル"],
  ["Ookami Mio", "大神ミオ"],
  ["Nekomata Okayu", "猫又おかゆ"],
  ["Inugami Korone", "戌神ころね"],
  ["Hoshimachi Suisei", "星街すいせい"],
  ["Usada Pekora", "兎田ぺこら"],
  ["Shiranui Flare", "不知火フレア"],
  ["Shirogane Noel", "白銀ノエル"],
  ["Houshou Marine", "宝鐘マリン"],
  ["Amane Kanata", "天音かなた"],
  ["Tsunomaki Watame", "角巻わため"],
  ["Tokoyami Towa", "常闇トワ"],
  ["Himemori Luna", "姫森ルーナ"],
  ["Yukihana Lamy", "雪花ラミィ"],
  ["Momosuzu Nene", "桃鈴ねね"],
  ["Shishiro Botan", "獅白ぼたん"],
  ["Omaru Polka", "尾丸ポルカ"],
  ["La+ Darknesss", "ラプラス・ダークネス"],
  ["Takane Lui", "鷹嶺ルイ"],
  ["Hakui Koyori", "博衣こより"],
  ["Sakamata Chloe", "沙花叉クロヱ"],
  ["Kazama Iroha", "風真いろは"],
  ["Kiryu Coco", "桐生ココ"],
]);
