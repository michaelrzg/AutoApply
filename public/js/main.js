var uploadButton = document.getElementById("UploadResumeButton");
var home = document.getElementById("brute");
var uploadPage = document.getElementById("upload");
uploadPage.style.display = "none";

uploadButton.onclick = function () {
  document.getElementById("upload").style.display = "block";
  document.getElementById("brute").style.display = "none";
  initUploader();
};

function initUploader() {
  const droparea = document.getElementById("header");
  const uploadManually = document.getElementById("file");
  const active = () => {
    droparea.style.borderColor = "#00ff00";
  };
  const inactive = () => {
    droparea.style.borderColor = "black";
  };
  const prevents = (e) => e.preventDefault();

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    droparea.addEventListener(eventName, prevents);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    droparea.addEventListener(eventName, active);
  });
  ["dragleave", "drop"].forEach((eventName) => {
    droparea.addEventListener(eventName, inactive);
  });
  droparea.addEventListener("drop", handleDrop);
  uploadManually.addEventListener("change", (e) => {
    const file = e.target.files;
    console.log(file);
  });
}
[];
const handleDrop = (e) => {
  const data = e.dataTransfer;
  const file = data.files;
  console.log(file);

  // placeholder:
  uploadPage.style.display = "none";
  home.style.display = "block";
};
