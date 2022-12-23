// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openDirectory: async () => {
    return await ipcRenderer.invoke("dialog:openDirectory");
  },
  getMP3: async (url, fileDirectory) => {
    console.log("bridge\n" + url + fileDirectory);
    return await ipcRenderer.invoke("yt:getmp3", url, fileDirectory);
  },
});
