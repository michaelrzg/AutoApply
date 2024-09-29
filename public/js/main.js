// main driver for AutoApply Extension

// initilize some elements to variables for easier access and add
function init() {
  uploadButton = document.getElementById("UploadResumeButton");
  home = document.getElementById("brute");
  uploadPage = document.getElementById("upload");
  uploadPage.style.display = "none";
  // set onClick functionality for our upload button:
  uploadButton.onclick = function () {
    // make upload tile visible
    document.getElementById("upload").style.display = "block";
    document.getElementById("brute").style.display = "none";
    // initilize file uploader code
    initUploader();
  };
}
// this function sets up the uploader
function initUploader() {
  // init drop area and manual uplpad button
  const droparea = document.getElementById("header");
  const uploadManually = document.getElementById("file");
  const beforestate = droparea.innerHTML;
  // DEFINE states for drop area
  // active = a file is currently hovering above the drop zone
  const active = () => {
    document.getElementById("cloudsvg").style.display = "none";
    document.getElementById("feedme").style.display = "block";
    document.getElementById("headerptext").innerHTML = "FEED ME";
  };
  // a file is hovering on screen, but is not over teh drop zone
  const inactive = () => {
    droparea.style.borderColor = "black";
    droparea.innerHTML = beforestate;
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
    resume = file;
    // placeholder:
    uploadPage.style.display = "none";
    home.style.display = "block";
  });
}
const handleDrop = (e) => {
  const data = e.dataTransfer;
  const file = data.files;
  console.log(file);
  resume = file;

  // placeholder:
  uploadPage.style.display = "none";
  home.style.display = "block";
};

// MAIN:

// variable holds the resume file
var resume;
// upload button on home page
var uploadButton;
// home page tile
var home;
// upload page tile
var uploadPage;

// initilize our variables
init();
