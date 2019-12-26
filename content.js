Element.prototype.serializeWithStyles = (function() {
  // Styles inherited from style sheets will not be rendered for elements with these tag names
  const noStyleTags = [
    'BASE',
    'HEAD',
    'HTML',
    'META',
    'NOFRAME',
    'NOSCRIPT',
    'PARAM',
    'SCRIPT',
    'STYLE',
    'TITLE'
  ];

  // This list determines which css default values lookup tables are precomputed at load time
  // Lookup tables for other tag names will be automatically built at runtime if needed
  const tagNames = ['A', 'ABBR', 'ADDRESS', 'AREA', 'ARTICLE', 'ASIDE', 'AUDIO', 'B', 'BASE', 'BDI', 'BDO', 'BLOCKQUOTE', 'BODY', 'BR', 'BUTTON', 'CANVAS', 'CAPTION', 'CENTER', 'CITE', 'CODE', 'COL', 'COLGROUP', 'COMMAND', 'DATALIST', 'DD', 'DEL', 'DETAILS', 'DFN', 'DIV', 'DL', 'DT', 'EM', 'EMBED', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FONT', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEAD', 'HEADER', 'HGROUP', 'HR', 'HTML', 'I', 'IFRAME', 'IMG', 'INPUT', 'INS', 'KBD', 'KEYGEN', 'LABEL', 'LEGEND', 'LI', 'LINK', 'MAP', 'MARK', 'MATH', 'MENU', 'META', 'METER', 'NAV', 'NOBR', 'NOSCRIPT', 'OBJECT', 'OL', 'OPTION', 'OPTGROUP', 'OUTPUT', 'P', 'PARAM', 'PRE', 'PROGRESS', 'Q', 'RP', 'RT', 'RUBY', 'S', 'SAMP', 'SCRIPT', 'SECTION', 'SELECT', 'SMALL', 'SOURCE', 'SPAN', 'STRONG', 'STYLE', 'SUB', 'SUMMARY', 'SUP', 'SVG', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH', 'THEAD', 'TIME', 'TITLE', 'TR', 'TRACK', 'U', 'UL', 'VAR', 'VIDEO', 'WBR'];
  const bodyStyleMap = document.body.computedStyleMap();
  const styleKeys = Array.from(bodyStyleMap.keys());

  let iframe;

  function getDefaultStyleMapByTagName(tagName) {
    if (!iframe) {
      iframe = document.body.appendChild(document.createElement('IFRAME'));
      iframe.setAttribute('style', 'position: fixed; opacity: 0; pointer-events: none;');
    }

    const element = document.createElement(tagName);

    iframe.contentDocument.body.appendChild(element);
    return element.computedStyleMap();
  }

  function getStyleValueFromStyleMap(styleMap, styleKey) {
    const styleCSSValue = styleMap.get(styleKey);

    return styleCSSValue && styleCSSValue.toString();
  }

  function computeDefaultStyleByTagName(tagName) {
    const styleMap = getDefaultStyleMapByTagName(tagName);

    return styleKeys.reduce((defaultStyle = {}, styleKey) => {
      defaultStyle[styleKey] = getStyleValueFromStyleMap(styleMap, styleKey);

      return defaultStyle;
    }, {});
  }

  const defaultStylesByTagName = tagNames.reduce((res = {}, tagName) => {
    const noStyle = noStyleTags.includes(tagName);

    if (!noStyle) {
      res[tagName] = computeDefaultStyleByTagName(tagName);
    }

    return res;
  }, {});

  function getDefaultStyleByTagName(tagName) {
    tagName = tagName.toUpperCase();
    if (!defaultStylesByTagName[tagName]) {
      defaultStylesByTagName[tagName] = computeDefaultStyleByTagName(tagName);
    }
    return defaultStylesByTagName[tagName];
  }

  function getElements(root, cloned = false) {
    root = cloned ? root.cloneNode(true) : root;
    const children = Array.from(root.querySelectorAll('*'));

    return [root, ...children];
  };

  return function serializeWithStyles() {
    if (this.nodeType !== Node.ELEMENT_NODE) {
      throw new TypeError();
    }

    const elements = getElements(this);
    const clonedElements = getElements(this, true);
    const [clonedRoot] = clonedElements;

    elements.forEach((element, index) => {
      const { tagName, style = {} } = element;
      const clonedElement = clonedElements[index];
      const noStyle = noStyleTags.includes(tagName);

      if (noStyle) {
        return;
      }

      const styleMap = element.computedStyleMap();
      const defaultStyle = getDefaultStyleByTagName(tagName);

      styleKeys.forEach((styleKey) => {
        const styleValue = getStyleValueFromStyleMap(styleMap, styleKey);

        if (styleKey === 'box-sizing') {
          clonedElement.style[styleKey] = styleValue;
        } else if (styleValue !== defaultStyle[styleKey]) {
          clonedElement.style[styleKey] = styleValue;
        }
      });
    });

    return clonedRoot.outerHTML;
  }
})();
