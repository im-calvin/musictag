// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");
const { readFileSync } = require("node:fs");
const { join, resolve } = require("path");

contextBridge.exposeInMainWorld("electronAPI", {
  openDirectory: async () => {
    return await ipcRenderer.invoke("dialog:openDirectory");
  },
  getMP3: async (url, fileDirectory) => {
    return await ipcRenderer.invoke("yt:getmp3", url, fileDirectory);
  },
  // no return type
  preloadDirectories: () => {
    return JSON.parse(readFileSync(join(__dirname, "directories.json")));
  },
});
