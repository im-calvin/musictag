const { dialog } = require("electron");

function getDirectory() {
  console.log(dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] }));
}

module.exports = getDirectory;
