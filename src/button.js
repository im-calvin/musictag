const { dialog } = require("electron");

export default function getDirectory() {
  console.log(dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] }));
}
