chrome.runtime.onConnect.addListener(function(port) {
  if (port.name = 'chrome-html-and-style-devtools'){
    port.onMessage.addListener(function(data){
      if (data.type === 'inject'){
        chrome.tabs.executeScript(data.tabId, {
          file: './inject.js',
          allFrames: true,
        });
      }
    });
  }
});
