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
  // turns droparea green and updates image to ee image
  const active = () => {
    document.getElementById("cloudsvg").style.display = "none";
    document.getElementById("feedme").style.display = "block";
    document.getElementById("headerptext").innerHTML = "FEED ME";
  };
  // inactive =a file is hovering on screen, but is not over teh drop zone
  const inactive = () => {
    droparea.style.borderColor = "black";
    droparea.innerHTML = beforestate;
  };
  // default
  const prevents = (e) => e.preventDefault();

  // add prevents (defualt handling) to drag events over the drop area
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    droparea.addEventListener(eventName, prevents);
  });
  // add  drag-enter and drag-over events to drop-area and callback active function
  ["dragenter", "dragover"].forEach((eventName) => {
    droparea.addEventListener(eventName, active);
  });
  // add drag-leave and drop events to drop-area and callback inactive function
  ["dragleave", "drop"].forEach((eventName) => {
    droparea.addEventListener(eventName, inactive);
  });

  // handle when the file is dropped into the drop-area
  droparea.addEventListener("drop", handleDrop);
  // called when user clicks on upload to open a file explorer and manually upload, rather than drag and drop
  uploadManually.addEventListener("change", (e) => {
    const file = e.target.files;
    console.log(file);
    resume = file;
    // placeholder:
    uploadPage.style.display = "none";
    home.style.display = "block";
  });
}
// handle when user drops a file over the drop-area
const handleDrop = (e) => {
  const data = e.dataTransfer;
  const file = data.files[0];
  console.log(file);
  resume = file;

  // placeholder:
  uploadPage.style.display = "none";
  home.style.display = "block";
};

// handle submit button pressed on data entry page
// this function grabs all data entered on page and puts it into Map
function submit() {
  // get all text inputs
  document
    .getElementById("form")
    .querySelectorAll("input")
    .forEach((e) => {
      if (e.name == "current") {
        userdata.set(e.name, e.checked);
        setCookie(e.name, e.checked);
      } else {
        userdata.set(e.name, e.value);
        setCookie(e.name, e.value);
      }
    });
  //get all drop down select inputs
  document
    .getElementById("form")
    .querySelectorAll("select")
    .forEach((e) => {
      if (e.value != "none") {
        userdata.set(e.name, e.value);
        setCookie(e.name, e.value);
      } else {
        userdata.set(e.name, "");
        setCookie(e.name, "");
      }
    });
  //get all textarea (job description boxes)
  document
    .getElementById("form")
    .querySelectorAll("textarea")
    .forEach((e) => {
      if (e.value != "none") {
        userdata.set(e.name, e.value);
        setCookie(e.name, e.value);
      } else {
        userdata.set(e.name, "");
        setCookie(e.name, "");
      }
    });
  // debug
  console.log(userdata);
}
// function to set a browser cookie
function setCookie(name, value) {
  var expires = "";
  var date = new Date();
  date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
  expires = "; expires=" + date.toUTCString();

  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// initilize the input page (only runs when input page calls this script on launch, popup page can not access these values)
function initInputPage() {
  //add experience button
  addExperienceButton = document.getElementById("addExperience");
  document.getElementById("submitbtn").addEventListener("click", () => {
    submit();
  });
  // make theh 'current position' checkbox enable and disable the end date input  based on checked status
  document.getElementById("current").addEventListener("click", updateCurrent);
  // add experience button populates a new experience set of feilds on the screen
  addExperienceButton.addEventListener("click", () => {
    addExperienceCount++;
    switch (addExperienceCount) {
      case 2:
        document.getElementById("experience2").style.display = "block";
        break;
      case 3:
        document.getElementById("experience3").style.display = "block";
        addExperienceButton.style.display = "none";
        break;
      default:
        console.log("add experinece pressed: " + addExperienceCount);
    }
  });
  prefillFromCookies();
}
function updateCurrent() {
  switch (document.getElementById("current").checked) {
    case false:
      document.getElementById("exp1end").style.display = "block";
      document.getElementById("exp1endlabel").style.display = "block";
      break;
    case true:
      document.getElementById("exp1end").style.display = "none";
      document.getElementById("exp1endlabel").style.display = "none";
  }
}
// prefill inputs of input page based on previous inputs
function prefillFromCookies() {
  document
    .getElementById("form")
    .querySelectorAll("input")
    .forEach((e) => {
      if (e.name == "current") {
        e.checked = getCookie(e.name);
      } else {
        e.value = getCookie(e.name);
      }
    });
  //get all drop down select inputs
  document
    .getElementById("form")
    .querySelectorAll("select")
    .forEach((e) => {
      for (var i = 0; i < e.options.length; i++) {
        if (e.options[i].value == getCookie(e.name)) {
          e.options.selectedIndex = i;
        }
      }
    });
  //get all textarea (job description boxes)
  document
    .getElementById("form")
    .querySelectorAll("textarea")
    .forEach((e) => {
      if (e.value != "none") {
        e.value = getCookie(e.name);
      }
    });
  updateCurrent();
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
//experience section
var addExperienceSection;

var addExperienceButton;
var addExperienceCount = 1;

const userdata = new Map();
//submit button

// determine flow based on who called main.js script
if (window.location.pathname == "/index.html") {
  init();
} else {
  initInputPage();
}
console.log(document.cookie);
