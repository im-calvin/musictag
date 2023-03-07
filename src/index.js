const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { join, resolve } = require("path");
const getMP3 = require("./yt");
const Store = require("electron-store");
const isDev = require("electron-is-dev");

// config schema for electron-store
const schema = {
  directories: {
    type: "array",
  },
};

const store = new Store({ schema });

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
  // isDev ? mainWindow.webContents.openDevTools() : 0;
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
