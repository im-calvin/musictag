// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");
const { readFileSync } = require("fs/promises");

// const directories = readFileSync(join(resolve(), "public", "directories.json"));
// for (directory in directories) {
//   const option = document.createElement("option");
//   option.text = directory;
//   dirDropdown.add(option);
// }

contextBridge.exposeInMainWorld("electronAPI", {
  openDirectory: async () => {
    return await ipcRenderer.invoke("dialog:openDirectory");
  },
  getMP3: async (url, fileDirectory) => {
    return await ipcRenderer.invoke("yt:getmp3", url, fileDirectory);
  },
});
