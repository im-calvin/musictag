const dirButton = document.getElementById("directoryButton");
const dirDropdown = document.getElementsByClassName("dirDropdown");
const inputText = document.getElementsByClassName("inputText");
const submitButton = document.getElementById("submitButton");
const downloadsTable = document.getElementById("downloadsTable");

// initialize the dropdown with the proper data
const directories = window.electronAPI.preloadDirectories();
for (directory of directories) {
  const option = document.createElement("option");
  option.text = directory;
  dirDropdown[0].appendChild(option);
}

// choose directory
dirButton.addEventListener("click", async () => {
  let dir = await window.electronAPI.openDirectory();
  let option = document.createElement("option");
  option.text = dir;
  // check if dropdown already contains the chosen dir
  if (dirDropdown[0].textContent.includes(dir) || dir === undefined) {
    return;
  }
  dirDropdown[0].prepend(option);
  dirDropdown[0].selectedIndex = option;
});

var numDownloads = 0;
// get download
submitButton.addEventListener("click", async () => {
  const text = inputText[0].value;
  const links = text.split("\n");
  // refresh table
  console.log(numDownloads);
  for (let i = 0; i < numDownloads; i++) {
    downloadsTable.removeChild(downloadsTable.lastChild);
    numDownloads = 0;
  }

  for (let link of links) {
    const dir = dirDropdown[0].value;
    try {
      var metaMap = await window.electronAPI.getMP3(link, dir);
    } catch (e) {
      // theoretically this should not download anything but that's not current behaviour
      window.alert("Invalid link / directory!");
      return;
    }
    // add values to tables
    const row = document.createElement("tr");
    const title = document.createElement("td");
    const artist = document.createElement("td");
    const album = document.createElement("td");
    title.textContent = metaMap.get("title");
    artist.textContent = metaMap.get("artist");
    album.textContent = metaMap.get("album");
    title.className = "border small-text";
    artist.className = "border small-text";
    album.className = "border small-text";
    row.appendChild(title);
    row.appendChild(artist);
    row.appendChild(album);
    // add it to the downloads table
    downloadsTable.appendChild(row);
    numDownloads++;
  }

  window.alert("Your downloads are done!");
});
