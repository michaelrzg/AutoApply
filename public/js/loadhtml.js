var htmlpage = document.documentElement.innerHTML;

(async () => {
  const response = await chrome.runtime.sendMessage({ html: htmlpage });
  // do something with response here, not outside the function
})();
