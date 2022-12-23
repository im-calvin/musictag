const dirButton = document.getElementById("directoryButton");
const filePathElement = document.getElementById("filePath");
const inputText = document.getElementsByClassName("inputText");
const submitButton = document.getElementById("submitButton");

if (!dirButton) throw new Error("ボタンがありません。");

var filePath;
dirButton.addEventListener("click", async () => {
  filePath = await window.electronAPI.openDirectory();
  filePathElement.innerText = filePath;
});

submitButton.addEventListener("click", async () => {
  const text = inputText[0].value;
  const links = text.split("\n");
  for (let link of links) {
    await window.electronAPI.getMP3(link, filePath);
  }
});
