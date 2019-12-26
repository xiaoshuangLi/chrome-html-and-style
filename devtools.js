(function() {
  chrome.devtools.panels.elements.createSidebarPane('HTML and Style', function(sidebar) {
    var root = null;
    var textDom = null;
    var inputDom = null;

    function onClickText() {
      inputDom.select();
      textDom.classList.add('copied');
      root.document.execCommand('copy');
    };

    sidebar.setPage('sidebar.html');

    sidebar.onShown.addListener(function(contentWindow) {
      root = contentWindow;
      textDom = root.document.getElementById('text');
      inputDom = root.document.getElementById('input');

      textDom.addEventListener('click', onClickText);
    });

    sidebar.onHidden.addListener(function() {
      textDom.removeEventListener('click', onClickText);
      
      root = null;
      textDom = null;
      inputDom = null;
    });

    chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
      if (!root) {
        return;
      }

      chrome.devtools.inspectedWindow.eval('$0.serializeWithStyles()', function(html = '') {
        inputDom.value = html;
        textDom.innerText = html;
        textDom.classList.remove('copied');
      });
    });
  });
})()
