const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const getMP3 = require("./yt");
const Store = require("electron-store");
const isDev = require("electron-is-dev");
// ffmpeg installer
const ffmpeg = require("fluent-ffmpeg");
//Get the paths to the packaged versions of the binaries we want to use
const ffmpegPath = require("ffmpeg-static").replace("app.asar", "app.asar.unpacked");
const ffprobePath = require("ffprobe-static").path.replace(
  "app.asar",
  "app.asar.unpacked"
);
//tell the ffmpeg package where it can find the needed binaries.
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const ffmetadata = require("ffmetadata");
// queues for multithreading for displaying progress
const { Worker, Queue } = require("bullmq");
const RedjsServer = require("redjs");
// redis
// const Redis = require("ioredis");
require("update-electron-app")();

// config schema for electron-store
const schema = {
  directories: {
    type: "array",
  },
};

// store used for directories
const store = new Store({ schema });

// setup redis for queue
new RedjsServer().start(6379);
// const redis = new Redis();
// queue used for downloading songs
export default songQueue = new Queue("Songs", {
  // connection: {
  // host: "http://localhost:6379",
  // port: 6379,
  // },
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  store.clear();
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 500,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    icon: "./public/Music_Tag_v01.png",
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  isDev ? mainWindow.webContents.openDevTools() : 0;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  ipcMain.handle("dialog:openDirectory", handleDirectory);
  ipcMain.handle("yt:getmp3", getMP3);
  ipcMain.handle("preloadDirectories", (event, key) => {
    return store.get(key);
  });
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function handleDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (canceled) {
    return;
  } else {
    // get prior directories
    let directories = store.get("directories");
    if (directories === undefined) directories = [];
    // the directory chosen
    const directory = filePaths[0];
    // checks if the directories dropdown has the chosen directory
    if (!directories.includes(directory)) {
      directories.push(directory);
      store.set("directories", directories);
    }

    return directory;
  }
}

// define the function for the songQueue to use
songQueue.process(async function (job, done) {
  const stream = job.data.stream;
  const fileName = job.data.fileName;
  const metaMap = job.data.metaMap;
  const songName = job.data.songName;

  await new Promise((resolve, reject) => {
    new ffmpeg({ source: stream })
      .format("mp3")
      // .on("start", () => console.log("started"))
      .on("progress", (progress) => {
        console.log("Processing: " + progress.percent + "% done");
        console.log("CurrentKbps: " + progress.currentKbps + "kbps");
        console.log("Target Size: " + progress.targetSize + "MB");
      })
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
        attachments: [`${songName}.png`],
      },
      resolve
    );
  });
});

// spin up a worker to address the queue
const worker = new Worker("Songs", async (job) => {
  // should send information to renderer process about current job
});
