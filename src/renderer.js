const dirButton = document.getElementById("directoryButton");
const dirDropdown = document.getElementsByClassName("dirDropdown");
const inputText = document.getElementsByClassName("inputText");
const submitButton = document.getElementById("submitButton");

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

submitButton.addEventListener("click", async () => {
  const text = inputText[0].value;
  const links = text.split("\n");
  for (let link of links) {
    const dir = dirDropdown[0].value;
    await window.electronAPI.getMP3(link, dir);
  }
  window.alert("Your downloads are done!");
});
