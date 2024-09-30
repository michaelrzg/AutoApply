// main driver for AutoApply Extension

// initilize some elements to variables for easier access and add
function init() {
  uploadButton = document.getElementById("UploadResumeButton");
  inputdatabutton = document.getElementById("inputdatabutton");
  home = document.getElementById("brute");
  uploadPage = document.getElementById("upload");
  uploadPage.style.display = "none";
  bodytag = document.getElementById("body");
  html = document.getElementById("html");
  // set onClick functionality for our upload button:
  uploadButton.onclick = function () {
    // make upload tile visible
    document.getElementById("upload").style.display = "block";
    document.getElementById("brute").style.display = "none";
    // initilize file uploader code
    initUploader();
  };
  inputdatabutton.onclick = () => {
    window.open("/templates/inputdata.html");
  };

  console.log("initilization complete");
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
  const file = data.files[0];
  console.log(file);
  resume = file;

  // placeholder:
  uploadPage.style.display = "none";
  home.style.display = "block";
};

function submit() {
  // get all text inputs
  document
    .getElementById("form")
    .querySelectorAll("input")
    .forEach((e) => {
      if (e.name == "current") {
        userdata.set(e.name, e.checked);
      } else {
        userdata.set(e.name, e.value);
      }
    });
  //get all drop down select inputs
  document
    .getElementById("form")
    .querySelectorAll("select")
    .forEach((e) => {
      if (e.value != "none") {
        userdata.set(e.name, e.value);
      } else {
        userdata.set(e.name, "");
      }
    });
  //get all textarea (job description boxes)
  document
    .getElementById("form")
    .querySelectorAll("textarea")
    .forEach((e) => {
      if (e.value != "none") {
        userdata.set(e.name, e.value);
      } else {
        userdata.set(e.name, "");
      }
    });
  console.log(userdata);
}

// MAIN:
//html tags
var bodytag;
var html;
// variable holds the resume file
var resume;
// upload button on home page
var uploadButton;
// inputdata button
var inputdatabutton;
// home page tile
var home;
// upload page tile
var uploadPage;

const userdata = new Map();
//submit button

// initilize our variables
if (window.location.pathname == "/index.html") {
  init();
} else {
  document.getElementById("exp1end").style.display = "none";
  document.getElementById("exp1label").style.display = "none";
  document.getElementById("submitbtn").addEventListener("click", () => {
    submit();
  });
  document.getElementById("current").addEventListener("click", () => {
    switch (document.getElementById("current").checked) {
      case false:
        document.getElementById("exp1end").style.display = "block";
        document.getElementById("exp1label").style.display = "block";
        break;
      case true:
        document.getElementById("exp1end").style.display = "none";
        document.getElementById("exp1label").style.display = "none";
    }
  });
}
