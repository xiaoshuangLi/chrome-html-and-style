Element.prototype.serializeWithStyles = (function() {
  // Mapping between tag names and css default values lookup tables. This allows to exclude default values in the result.
  var defaultStylesByTagName = {};

  // Styles inherited from style sheets will not be rendered for elements with these tag names
  var noStyleTags = {
    'BASE': true,
    'HEAD': true,
    'HTML': true,
    'META': true,
    'NOFRAME': true,
    'NOSCRIPT': true,
    'PARAM': true,
    'SCRIPT': true,
    'STYLE': true,
    'TITLE': true
  };

  // This list determines which css default values lookup tables are precomputed at load time
  // Lookup tables for other tag names will be automatically built at runtime if needed
  var tagNames = ['A', 'ABBR', 'ADDRESS', 'AREA', 'ARTICLE', 'ASIDE', 'AUDIO', 'B', 'BASE', 'BDI', 'BDO', 'BLOCKQUOTE', 'BODY', 'BR', 'BUTTON', 'CANVAS', 'CAPTION', 'CENTER', 'CITE', 'CODE', 'COL', 'COLGROUP', 'COMMAND', 'DATALIST', 'DD', 'DEL', 'DETAILS', 'DFN', 'DIV', 'DL', 'DT', 'EM', 'EMBED', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FONT', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEAD', 'HEADER', 'HGROUP', 'HR', 'HTML', 'I', 'IFRAME', 'IMG', 'INPUT', 'INS', 'KBD', 'KEYGEN', 'LABEL', 'LEGEND', 'LI', 'LINK', 'MAP', 'MARK', 'MATH', 'MENU', 'META', 'METER', 'NAV', 'NOBR', 'NOSCRIPT', 'OBJECT', 'OL', 'OPTION', 'OPTGROUP', 'OUTPUT', 'P', 'PARAM', 'PRE', 'PROGRESS', 'Q', 'RP', 'RT', 'RUBY', 'S', 'SAMP', 'SCRIPT', 'SECTION', 'SELECT', 'SMALL', 'SOURCE', 'SPAN', 'STRONG', 'STYLE', 'SUB', 'SUMMARY', 'SUP', 'SVG', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH', 'THEAD', 'TIME', 'TITLE', 'TR', 'TRACK', 'U', 'UL', 'VAR', 'VIDEO', 'WBR'];

  // Precompute the lookup tables.
  for (var i = 0; i < tagNames.length; i++) {
    if (!noStyleTags[tagNames[i]]) {
      defaultStylesByTagName[tagNames[i]] = computeDefaultStyleByTagName(tagNames[i]);
    }
  }

  var iframe;

  function computeDefaultStyleByTagName(tagName) {
    if (!iframe) {
      iframe = document.body.appendChild(document.createElement('IFRAME'));
      iframe.setAttribute('style', 'position: fixed; opacity: 0; pointer-events: none;');
    }

    var defaultStyle = {};
    var element = iframe.contentDocument.body.appendChild(document.createElement(tagName));
    var computedStyle = getComputedStyle(element);
    for (var i = 0; i < computedStyle.length; i++) {
      defaultStyle[computedStyle[i]] = computedStyle[computedStyle[i]];
    }
    return defaultStyle;
  }

  function getDefaultStyleByTagName(tagName) {
    tagName = tagName.toUpperCase();
    if (!defaultStylesByTagName[tagName]) {
      defaultStylesByTagName[tagName] = computeDefaultStyleByTagName(tagName);
    }
    return defaultStylesByTagName[tagName];
  }

  return function serializeWithStyles() {
    if (this.nodeType !== Node.ELEMENT_NODE) {
      throw new TypeError();
    }
    var cssTexts = [];
    var children = Array.from(this.querySelectorAll('*'));
    var elements = children.concat(this);

    var clonedRoot = this.cloneNode(true);
    var clonedChildren = Array.from(clonedRoot.querySelectorAll('*'));
    var clonedElements = clonedChildren.concat(clonedRoot);

    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];
      var clonedE = clonedElements[i];

      if (!noStyleTags[e.tagName]) {
        var computedStyle = getComputedStyle(e);
        var defaultStyle = getDefaultStyleByTagName(e.tagName);

        cssTexts[i] = e.style.cssText;

        for (var ii = 0; ii < computedStyle.length; ii++) {
          var cssPropName = computedStyle[ii];

          if (cssPropName === 'width' || cssPropName === 'height') {
            var styleMap = e.computedStyleMap() || {};
            var styleValue = styleMap.get(cssPropName) || {};

            if (styleValue.value !== 'auto') {
              clonedE.style[cssPropName] = computedStyle[cssPropName];
            }
          } else if (cssPropName === 'box-sizing') {
            clonedE.style[cssPropName] = computedStyle[cssPropName];
          } else if (computedStyle[cssPropName] !== defaultStyle[cssPropName]) {
            clonedE.style[cssPropName] = computedStyle[cssPropName];
          }
        }
      }
    }
    var result = clonedRoot.outerHTML;
    for (var i = 0; i < clonedElements.length; i++) {
      clonedElements[i].style.cssText = cssTexts[i];
    }

    return result;
  }
})();
