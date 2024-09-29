(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})(
  {
    1: [
      function (require, module, exports) {
        const Fs = require("fs");
        const Pdf = require("./lib/pdf-parse.js");
        window.require = require;
        module.exports = Pdf;

        let isDebugMode = !module.parent;

        //process.env.AUTO_KENT_DEBUG

        //for testing purpose
        if (isDebugMode) {
          let PDF_FILE = "./test/data/05-versions-space.pdf";
          let dataBuffer = Fs.readFileSync(PDF_FILE);
          Pdf(dataBuffer)
            .then(function (data) {
              Fs.writeFileSync(`${PDF_FILE}.txt`, data.text, {
                encoding: "utf8",
                flag: "w",
              });
              debugger;
            })
            .catch(function (err) {
              debugger;
            });
        }
      },
      { "./lib/pdf-parse.js": 2, fs: 4 },
    ],
    2: [
      function (require, module, exports) {
        var PDFJS = null;

        function render_page(pageData) {
          //check documents https://mozilla.github.io/pdf.js/
          //ret.text = ret.text ? ret.text : "";

          let render_options = {
            //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
            normalizeWhitespace: false,
            //do not attempt to combine same line TextItem's. The default value is `false`.
            disableCombineTextItems: false,
          };

          return pageData
            .getTextContent(render_options)
            .then(function (textContent) {
              let lastY,
                text = "";
              //https://github.com/mozilla/pdf.js/issues/8963
              //https://github.com/mozilla/pdf.js/issues/2140
              //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
              //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
              for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                  text += item.str;
                } else {
                  text += "\n" + item.str;
                }
                lastY = item.transform[5];
              }
              //let strings = textContent.items.map(item => item.str);
              //let text = strings.join("\n");
              //text = text.replace(/[ ]+/ig," ");
              //ret.text = `${ret.text} ${text} \n\n`;
              return text;
            });
        }

        const DEFAULT_OPTIONS = {
          pagerender: render_page,
          max: 0,
          //check https://mozilla.github.io/pdf.js/getting_started/
          version: "v1.10.100",
        };

        async function PDF(dataBuffer, options) {
          var isDebugMode = false;

          let ret = {
            numpages: 0,
            numrender: 0,
            info: null,
            metadata: null,
            text: "",
            version: null,
          };

          if (typeof options == "undefined") options = DEFAULT_OPTIONS;
          if (typeof options.pagerender != "function")
            options.pagerender = DEFAULT_OPTIONS.pagerender;
          if (typeof options.max != "number") options.max = DEFAULT_OPTIONS.max;
          if (typeof options.version != "string")
            options.version = DEFAULT_OPTIONS.version;
          if (options.version == "default")
            options.version = DEFAULT_OPTIONS.version;

          PDFJS = PDFJS
            ? PDFJS
            : require(`./pdf.js/${options.version}/build/pdf.js`);

          ret.version = PDFJS.version;

          // Disable workers to avoid yet another cross-origin issue (workers need
          // the URL of the script to be loaded, and dynamically loading a cross-origin
          // script does not work).
          PDFJS.disableWorker = true;
          let doc = await PDFJS.getDocument(dataBuffer);
          ret.numpages = doc.numPages;

          let metaData = await doc.getMetadata().catch(function (err) {
            return null;
          });

          ret.info = metaData ? metaData.info : null;
          ret.metadata = metaData ? metaData.metadata : null;

          let counter = options.max <= 0 ? doc.numPages : options.max;
          counter = counter > doc.numPages ? doc.numPages : counter;

          ret.text = "";

          for (var i = 1; i <= counter; i++) {
            let pageText = await doc
              .getPage(i)
              .then((pageData) => options.pagerender(pageData))
              .catch((err) => {
                // todo log err using debug
                debugger;
                return "";
              });

            ret.text = `${ret.text}\n\n${pageText}`;
          }

          ret.numrender = counter;
          doc.destroy();

          return ret;
        }

        module.exports = PDF;
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        // main driver for AutoApply Extension
        const parser = require("pdf-parse"); // initilize some elements to variables for easier access and add
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

          ["dragenter", "dragover", "dragleave", "drop"].forEach(
            (eventName) => {
              droparea.addEventListener(eventName, prevents);
            }
          );

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

          const formdata = new FormData();
          formdata.append("resume", file);
          parsePDF(formdata);
          // placeholder:
          uploadPage.style.display = "none";
          home.style.display = "block";
        };

        async function parsePDF(pdf) {
          // parse pdf and return json of data
        }
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
      },
      { "pdf-parse": 1 },
    ],
    4: [function (require, module, exports) {}, {}],
  },
  {},
  [3]
);
