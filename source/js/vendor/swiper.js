const swiper = () => {

  /**
 * Swiper 7.4.1
 * Most modern mobile touch range__slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2021 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: December 24, 2021
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swiper = factory());
}(this, (function () { 'use strict';

  /**
   * SSR Window 4.0.2
   * Better handling for window object in SSR environment
   * https://github.com/nolimits4web/ssr-window
   *
   * Copyright 2021, Vladimir Kharlampidi
   *
   * Licensed under MIT
   *
   * Released on: December 13, 2021
   */

  /* eslint-disable no-param-reassign */
  function isObject$1(obj) {
    return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
  }

  function extend$1(target = {}, src = {}) {
    Object.keys(src).forEach(key => {
      if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
        extend$1(target[key], src[key]);
      }
    });
  }

  const ssrDocument = {
    body: {},

    addEventListener() {},

    removeEventListener() {},

    activeElement: {
      blur() {},

      nodeName: ''
    },

    querySelector() {
      return null;
    },

    querySelectorAll() {
      return [];
    },

    getElementById() {
      return null;
    },

    createEvent() {
      return {
        initEvent() {}

      };
    },

    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},

        setAttribute() {},

        getElementsByTagName() {
          return [];
        }

      };
    },

    createElementNS() {
      return {};
    },

    importNode() {
      return null;
    },

    location: {
      hash: '',
      host: '',
      hostname: '',
      href: '',
      origin: '',
      pathname: '',
      protocol: '',
      search: ''
    }
  };

  function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend$1(doc, ssrDocument);
    return doc;
  }

  const ssrWindow = {
    document: ssrDocument,
    navigator: {
      userAgent: ''
    },
    location: {
      hash: '',
      host: '',
      hostname: '',
      href: '',
      origin: '',
      pathname: '',
      protocol: '',
      search: ''
    },
    history: {
      replaceState() {},

      pushState() {},

      go() {},

      back() {}

    },
    CustomEvent: function CustomEvent() {
      return this;
    },

    addEventListener() {},

    removeEventListener() {},

    getComputedStyle() {
      return {
        getPropertyValue() {
          return '';
        }

      };
    },

    Image() {},

    Date() {},

    screen: {},

    setTimeout() {},

    clearTimeout() {},

    matchMedia() {
      return {};
    },

    requestAnimationFrame(callback) {
      if (typeof setTimeout === 'undefined') {
        callback();
        return null;
      }

      return setTimeout(callback, 0);
    },

    cancelAnimationFrame(id) {
      if (typeof setTimeout === 'undefined') {
        return;
      }

      clearTimeout(id);
    }

  };

  function getWindow() {
    const win = typeof window !== 'undefined' ? window : {};
    extend$1(win, ssrWindow);
    return win;
  }

  /**
   * Dom7 4.0.2
   * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
   * https://framework7.io/docs/dom7.html
   *
   * Copyright 2021, Vladimir Kharlampidi
   *
   * Licensed under MIT
   *
   * Released on: December 13, 2021
   */
  /* eslint-disable no-proto */

  function makeReactive(obj) {
    const proto = obj.__proto__;
    Object.defineProperty(obj, '__proto__', {
      get() {
        return proto;
      },

      set(value) {
        proto.__proto__ = value;
      }

    });
  }

  class Dom7 extends Array {
    constructor(items) {
      super(...(items || []));
      makeReactive(this);
    }

  }

  function arrayFlat(arr = []) {
    const res = [];
    arr.forEach(el => {
      if (Array.isArray(el)) {
        res.push(...arrayFlat(el));
      } else {
        res.push(el);
      }
    });
    return res;
  }

  function arrayFilter(arr, callback) {
    return Array.prototype.filter.call(arr, callback);
  }

  function arrayUnique(arr) {
    const uniqueArray = [];

    for (let i = 0; i < arr.length; i += 1) {
      if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
    }

    return uniqueArray;
  }


  function qsa(selector, context) {
    if (typeof selector !== 'string') {
      return [selector];
    }

    const a = [];
    const res = context.querySelectorAll(selector);

    for (let i = 0; i < res.length; i += 1) {
      a.push(res[i]);
    }

    return a;
  }

  function $(selector, context) {
    const window = getWindow();
    const document = getDocument();
    let arr = [];

    if (!context && selector instanceof Dom7) {
      return selector;
    }

    if (!selector) {
      return new Dom7(arr);
    }

    if (typeof selector === 'string') {
      const html = selector.trim();

      if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
        let toCreate = 'div';
        if (html.indexOf('<li') === 0) toCreate = 'ul';
        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
        if (html.indexOf('<tbody') === 0) toCreate = 'table';
        if (html.indexOf('<option') === 0) toCreate = 'select';
        const tempParent = document.createElement(toCreate);
        tempParent.innerHTML = html;

        for (let i = 0; i < tempParent.childNodes.length; i += 1) {
          arr.push(tempParent.childNodes[i]);
        }
      } else {
        arr = qsa(selector.trim(), context || document);
      } // arr = qsa(selector, document);

    } else if (selector.nodeType || selector === window || selector === document) {
      arr.push(selector);
    } else if (Array.isArray(selector)) {
      if (selector instanceof Dom7) return selector;
      arr = selector;
    }

    return new Dom7(arrayUnique(arr));
  }

  $.fn = Dom7.prototype; // eslint-disable-next-line

  function addClass(...classes) {
    const classNames = arrayFlat(classes.map(c => c.split(' ')));
    this.forEach(el => {
      el.classList.add(...classNames);
    });
    return this;
  }

  function removeClass(...classes) {
    const classNames = arrayFlat(classes.map(c => c.split(' ')));
    this.forEach(el => {
      el.classList.remove(...classNames);
    });
    return this;
  }

  function toggleClass(...classes) {
    const classNames = arrayFlat(classes.map(c => c.split(' ')));
    this.forEach(el => {
      classNames.forEach(className => {
        el.classList.toggle(className);
      });
    });
  }

  function hasClass(...classes) {
    const classNames = arrayFlat(classes.map(c => c.split(' ')));
    return arrayFilter(this, el => {
      return classNames.filter(className => el.classList.contains(className)).length > 0;
    }).length > 0;
  }

  function attr(attrs, value) {
    if (arguments.length === 1 && typeof attrs === 'string') {
      // Get attr
      if (this[0]) return this[0].getAttribute(attrs);
      return undefined;
    } // Set attrs


    for (let i = 0; i < this.length; i += 1) {
      if (arguments.length === 2) {
        // String
        this[i].setAttribute(attrs, value);
      } else {
        // Object
        for (const attrName in attrs) {
          this[i][attrName] = attrs[attrName];
          this[i].setAttribute(attrName, attrs[attrName]);
        }
      }
    }

    return this;
  }

  function removeAttr(attr) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].removeAttribute(attr);
    }

    return this;
  }

  function transform(transform) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].style.transform = transform;
    }

    return this;
  }

  function transition$1(duration) {
    for (let i = 0; i < this.length; i += 1) {
      this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
    }

    return this;
  }

  function on(...args) {
    let [eventType, targetSelector, listener, capture] = args;

    if (typeof args[1] === 'function') {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }

    if (!capture) capture = false;

    function handleLiveEvent(e) {
      const target = e.target;
      if (!target) return;
      const eventData = e.target.dom7EventData || [];

      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }

      if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
        const parents = $(target).parents(); // eslint-disable-line

        for (let k = 0; k < parents.length; k += 1) {
          if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
        }
      }
    }

    function handleEvent(e) {
      const eventData = e && e.target ? e.target.dom7EventData || [] : [];

      if (eventData.indexOf(e) < 0) {
        eventData.unshift(e);
      }

      listener.apply(this, eventData);
    }

    const events = eventType.split(' ');
    let j;

    for (let i = 0; i < this.length; i += 1) {
      const el = this[i];

      if (!targetSelector) {
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7Listeners) el.dom7Listeners = {};
          if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
          el.dom7Listeners[event].push({
            listener,
            proxyListener: handleEvent
          });
          el.addEventListener(event, handleEvent, capture);
        }
      } else {
        // Live events
        for (j = 0; j < events.length; j += 1) {
          const event = events[j];
          if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
          if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
          el.dom7LiveListeners[event].push({
            listener,
            proxyListener: handleLiveEvent
          });
          el.addEventListener(event, handleLiveEvent, capture);
        }
      }
    }

    return this;
  }

  function off(...args) {
    let [eventType, targetSelector, listener, capture] = args;

    if (typeof args[1] === 'function') {
      [eventType, listener, capture] = args;
      targetSelector = undefined;
    }

    if (!capture) capture = false;
    const events = eventType.split(' ');

    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];

      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];
        let handlers;

        if (!targetSelector && el.dom7Listeners) {
          handlers = el.dom7Listeners[event];
        } else if (targetSelector && el.dom7LiveListeners) {
          handlers = el.dom7LiveListeners[event];
        }

        if (handlers && handlers.length) {
          for (let k = handlers.length - 1; k >= 0; k -= 1) {
            const handler = handlers[k];

            if (listener && handler.listener === listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            } else if (!listener) {
              el.removeEventListener(event, handler.proxyListener, capture);
              handlers.splice(k, 1);
            }
          }
        }
      }
    }

    return this;
  }

  function trigger(...args) {
    const window = getWindow();
    const events = args[0].split(' ');
    const eventData = args[1];

    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];

      for (let j = 0; j < this.length; j += 1) {
        const el = this[j];

        if (window.CustomEvent) {
          const evt = new window.CustomEvent(event, {
            detail: eventData,
            bubbles: true,
            cancelable: true
          });
          el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
          el.dispatchEvent(evt);
          el.dom7EventData = [];
          delete el.dom7EventData;
        }
      }
    }

    return this;
  }

  function transitionEnd$1(callback) {
    const dom = this;

    function fireCallBack(e) {
      if (e.target !== this) return;
      callback.call(this, e);
      dom.off('transitionend', fireCallBack);
    }

    if (callback) {
      dom.on('transitionend', fireCallBack);
    }

    return this;
  }

  function outerWidth(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        const styles = this.styles();
        return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
      }

      return this[0].offsetWidth;
    }

    return null;
  }

  function outerHeight(includeMargins) {
    if (this.length > 0) {
      if (includeMargins) {
        const styles = this.styles();
        return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
      }

      return this[0].offsetHeight;
    }

    return null;
  }

  function offset() {
    if (this.length > 0) {
      const window = getWindow();
      const document = getDocument();
      const el = this[0];
      const box = el.getBoundingClientRect();
      const body = document.body;
      const clientTop = el.clientTop || body.clientTop || 0;
      const clientLeft = el.clientLeft || body.clientLeft || 0;
      const scrollTop = el === window ? window.scrollY : el.scrollTop;
      const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
      return {
        top: box.top + scrollTop - clientTop,
        left: box.left + scrollLeft - clientLeft
      };
    }

    return null;
  }

  function styles() {
    const window = getWindow();
    if (this[0]) return window.getComputedStyle(this[0], null);
    return {};
  }

  function css(props, value) {
    const window = getWindow();
    let i;

    if (arguments.length === 1) {
      if (typeof props === 'string') {
        // .css('width')
        if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
      } else {
        // .css({ width: '100px' })
        for (i = 0; i < this.length; i += 1) {
          for (const prop in props) {
            this[i].style[prop] = props[prop];
          }
        }

        return this;
      }
    }

    if (arguments.length === 2 && typeof props === 'string') {
      // .css('width', '100px')
      for (i = 0; i < this.length; i += 1) {
        this[i].style[props] = value;
      }

      return this;
    }

    return this;
  }

  function each(callback) {
    if (!callback) return this;
    this.forEach((el, index) => {
      callback.apply(el, [el, index]);
    });
    return this;
  }

  function filter(callback) {
    const result = arrayFilter(this, callback);
    return $(result);
  }

  function html(html) {
    if (typeof html === 'undefined') {
      return this[0] ? this[0].innerHTML : null;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].innerHTML = html;
    }

    return this;
  }

  function text(text) {
    if (typeof text === 'undefined') {
      return this[0] ? this[0].textContent.trim() : null;
    }

    for (let i = 0; i < this.length; i += 1) {
      this[i].textContent = text;
    }

    return this;
  }

  function is(selector) {
    const window = getWindow();
    const document = getDocument();
    const el = this[0];
    let compareWith;
    let i;
    if (!el || typeof selector === 'undefined') return false;

    if (typeof selector === 'string') {
      if (el.matches) return el.matches(selector);
      if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
      if (el.msMatchesSelector) return el.msMatchesSelector(selector);
      compareWith = $(selector);

      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }

      return false;
    }

    if (selector === document) {
      return el === document;
    }

    if (selector === window) {
      return el === window;
    }

    if (selector.nodeType || selector instanceof Dom7) {
      compareWith = selector.nodeType ? [selector] : selector;

      for (i = 0; i < compareWith.length; i += 1) {
        if (compareWith[i] === el) return true;
      }

      return false;
    }

    return false;
  }

  function index() {
    let child = this[0];
    let i;

    if (child) {
      i = 0; // eslint-disable-next-line

      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1) i += 1;
      }

      return i;
    }

    return undefined;
  }

  function eq(index) {
    if (typeof index === 'undefined') return this;
    const length = this.length;

    if (index > length - 1) {
      return $([]);
    }

    if (index < 0) {
      const returnIndex = length + index;
      if (returnIndex < 0) return $([]);
      return $([this[returnIndex]]);
    }

    return $([this[index]]);
  }

  function append(...els) {
    let newChild;
    const document = getDocument();

    for (let k = 0; k < els.length; k += 1) {
      newChild = els[k];

      for (let i = 0; i < this.length; i += 1) {
        if (typeof newChild === 'string') {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newChild;

          while (tempDiv.firstChild) {
            this[i].appendChild(tempDiv.firstChild);
          }
        } else if (newChild instanceof Dom7) {
          for (let j = 0; j < newChild.length; j += 1) {
            this[i].appendChild(newChild[j]);
          }
        } else {
          this[i].appendChild(newChild);
        }
      }
    }

    return this;
  }

  function prepend(newChild) {
    const document = getDocument();
    let i;
    let j;

    for (i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newChild;

        for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
          this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        }
      } else if (newChild instanceof Dom7) {
        for (j = 0; j < newChild.length; j += 1) {
          this[i].insertBefore(newChild[j], this[i].childNodes[0]);
        }
      } else {
        this[i].insertBefore(newChild, this[i].childNodes[0]);
      }
    }

    return this;
  }

  function next(selector) {
    if (this.length > 0) {
      if (selector) {
        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
          return $([this[0].nextElementSibling]);
        }

        return $([]);
      }

      if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
      return $([]);
    }

    return $([]);
  }

  function nextAll(selector) {
    const nextEls = [];
    let el = this[0];
    if (!el) return $([]);

    while (el.nextElementSibling) {
      const next = el.nextElementSibling; // eslint-disable-line

      if (selector) {
        if ($(next).is(selector)) nextEls.push(next);
      } else nextEls.push(next);

      el = next;
    }

    return $(nextEls);
  }

  function prev(selector) {
    if (this.length > 0) {
      const el = this[0];

      if (selector) {
        if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
          return $([el.previousElementSibling]);
        }

        return $([]);
      }

      if (el.previousElementSibling) return $([el.previousElementSibling]);
      return $([]);
    }

    return $([]);
  }

  function prevAll(selector) {
    const prevEls = [];
    let el = this[0];
    if (!el) return $([]);

    while (el.previousElementSibling) {
      const prev = el.previousElementSibling; // eslint-disable-line

      if (selector) {
        if ($(prev).is(selector)) prevEls.push(prev);
      } else prevEls.push(prev);

      el = prev;
    }

    return $(prevEls);
  }

  function parent(selector) {
    const parents = []; // eslint-disable-line

    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode !== null) {
        if (selector) {
          if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else {
          parents.push(this[i].parentNode);
        }
      }
    }

    return $(parents);
  }

  function parents(selector) {
    const parents = []; // eslint-disable-line

    for (let i = 0; i < this.length; i += 1) {
      let parent = this[i].parentNode; // eslint-disable-line

      while (parent) {
        if (selector) {
          if ($(parent).is(selector)) parents.push(parent);
        } else {
          parents.push(parent);
        }

        parent = parent.parentNode;
      }
    }

    return $(parents);
  }

  function closest(selector) {
    let closest = this; // eslint-disable-line

    if (typeof selector === 'undefined') {
      return $([]);
    }

    if (!closest.is(selector)) {
      closest = closest.parents(selector).eq(0);
    }

    return closest;
  }

  function find(selector) {
    const foundElements = [];

    for (let i = 0; i < this.length; i += 1) {
      const found = this[i].querySelectorAll(selector);

      for (let j = 0; j < found.length; j += 1) {
        foundElements.push(found[j]);
      }
    }

    return $(foundElements);
  }

  function children(selector) {
    const children = []; // eslint-disable-line

    for (let i = 0; i < this.length; i += 1) {
      const childNodes = this[i].children;

      for (let j = 0; j < childNodes.length; j += 1) {
        if (!selector || $(childNodes[j]).is(selector)) {
          children.push(childNodes[j]);
        }
      }
    }

    return $(children);
  }

  function remove() {
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
    }

    return this;
  }

  const Methods = {
    addClass,
    removeClass,
    hasClass,
    toggleClass,
    attr,
    removeAttr,
    transform,
    transition: transition$1,
    on,
    off,
    trigger,
    transitionEnd: transitionEnd$1,
    outerWidth,
    outerHeight,
    styles,
    offset,
    css,
    each,
    html,
    text,
    is,
    index,
    eq,
    append,
    prepend,
    next,
    nextAll,
    prev,
    prevAll,
    parent,
    parents,
    closest,
    find,
    children,
    filter,
    remove
  };
  Object.keys(Methods).forEach(methodName => {
    Object.defineProperty($.fn, methodName, {
      value: Methods[methodName],
      writable: true
    });
  });

  function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach(key => {
      try {
        object[key] = null;
      } catch (e) {// no getter for object
      }

      try {
        delete object[key];
      } catch (e) {// something got wrong
      }
    });
  }

  function nextTick(callback, delay = 0) {
    return setTimeout(callback, delay);
  }

  function now() {
    return Date.now();
  }

  function getComputedStyle$1(el) {
    const window = getWindow();
    let style;

    if (window.getComputedStyle) {
      style = window.getComputedStyle(el, null);
    }

    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }

    if (!style) {
      style = el.style;
    }

    return style;
  }

  function getTranslate(el, axis = 'x') {
    const window = getWindow();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle$1(el);

    if (window.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;

      if (curTransform.split(',').length > 6) {
        curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
      } // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case


      transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
      matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
      else curTransform = parseFloat(matrix[4]);
    }

    if (axis === 'y') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
      else curTransform = parseFloat(matrix[5]);
    }

    return curTransform || 0;
  }

  function isObject(o) {
    return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
  }

  function isNode(node) {
    // eslint-disable-next-line
    if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
      return node instanceof HTMLElement;
    }

    return node && (node.nodeType === 1 || node.nodeType === 11);
  }

  function extend(...args) {
    const to = Object(args[0]);
    const noExtend = ['__proto__', 'constructor', 'prototype'];

    for (let i = 1; i < args.length; i += 1) {
      const nextSource = args[i];

      if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

          if (desc !== undefined && desc.enumerable) {
            if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
              to[nextKey] = {};

              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }

    return to;
  }

  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }

  function animateCSSModeScroll({
    swiper,
    targetPosition,
    side
  }) {
    const window = getWindow();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = 'none';
    window.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? 'next' : 'prev';

    const isOutOfBound = (current, target) => {
      return dir === 'next' && current >= target || dir === 'prev' && current <= target;
    };

    const animate = () => {
      time = new Date().getTime();

      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }

      swiper.wrapperEl.scrollTo({
        [side]: currentPosition
      });

      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = 'hidden';
        swiper.wrapperEl.style.scrollSnapType = '';
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = '';
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition
          });
        });
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }

      swiper.cssModeFrameID = window.requestAnimationFrame(animate);
    };

    animate();
  }

  let support;

  function calcSupport() {
    const window = getWindow();
    const document = getDocument();
    return {
      smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
      touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
      passiveListener: function checkPassiveListener() {
        let supportsPassive = false;

        try {
          const opts = Object.defineProperty({}, 'passive', {
            // eslint-disable-next-line
            get() {
              supportsPassive = true;
            }

          });
          window.addEventListener('testPassiveListener', null, opts);
        } catch (e) {// No support
        }

        return supportsPassive;
      }(),
      gestures: function checkGestures() {
        return 'ongesturestart' in window;
      }()
    };
  }

  function getSupport() {
    if (!support) {
      support = calcSupport();
    }

    return support;
  }

  let deviceCached;

  function calcDevice({
    userAgent
  } = {}) {
    const support = getSupport();
    const window = getWindow();
    const platform = window.navigator.platform;
    const ua = userAgent || window.navigator.userAgent;
    const device = {
      ios: false,
      android: false
    };
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === 'Win32';
    let macos = platform === 'MacIntel'; // iPadOs 13 fix

    const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

    if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad) ipad = [0, 1, '13_0_0'];
      macos = false;
    } // Android


    if (android && !windows) {
      device.os = 'android';
      device.android = true;
    }

    if (ipad || iphone || ipod) {
      device.os = 'ios';
      device.ios = true;
    } // Export object


    return device;
  }

  function getDevice(overrides = {}) {
    if (!deviceCached) {
      deviceCached = calcDevice(overrides);
    }

    return deviceCached;
  }

  let browser;

  function calcBrowser() {
    const window = getWindow();

    function isSafari() {
      const ua = window.navigator.userAgent.toLowerCase();
      return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
    }

    return {
      isSafari: isSafari(),
      isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
    };
  }

  function getBrowser() {
    if (!browser) {
      browser = calcBrowser();
    }

    return browser;
  }

  function Resize({
    swiper,
    on,
    emit
  }) {
    const window = getWindow();
    let observer = null;

    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit('beforeResize');
      emit('resize');
    };

    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      observer = new ResizeObserver(entries => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });

        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
      observer.observe(swiper.el);
    };

    const removeObserver = () => {
      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };

    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit('orientationchange');
    };

    on('init', () => {
      if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
        createObserver();
        return;
      }

      window.addEventListener('resize', resizeHandler);
      window.addEventListener('orientationchange', orientationChangeHandler);
    });
    on('destroy', () => {
      removeObserver();
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', orientationChangeHandler);
    });
  }

  function Observer({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const observers = [];
    const window = getWindow();

    const attach = (target, options = {}) => {
      const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
      const observer = new ObserverFunc(mutations => {
        // The observerUpdate event should only be triggered
        // once despite the number of mutations.  Additional
        // triggers are redundant and are very costly
        if (mutations.length === 1) {
          emit('observerUpdate', mutations[0]);
          return;
        }

        const observerUpdate = function observerUpdate() {
          emit('observerUpdate', mutations[0]);
        };

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(observerUpdate);
        } else {
          window.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
        childList: typeof options.childList === 'undefined' ? true : options.childList,
        characterData: typeof options.characterData === 'undefined' ? true : options.characterData
      });
      observers.push(observer);
    };

    const init = () => {
      if (!swiper.params.observer) return;

      if (swiper.params.observeParents) {
        const containerParents = swiper.$el.parents();

        for (let i = 0; i < containerParents.length; i += 1) {
          attach(containerParents[i]);
        }
      } // Observe container


      attach(swiper.$el[0], {
        childList: swiper.params.observerange__slideChildren
      }); // Observe wrapper

      attach(swiper.$wrapperEl[0], {
        attributes: false
      });
    };

    const destroy = () => {
      observers.forEach(observer => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };

    extendParams({
      observer: false,
      observeParents: false,
      observerange__slideChildren: false
    });
    on('init', init);
    on('destroy', destroy);
  }

  /* eslint-disable no-underscore-dangle */
  var eventsEmitter = {
    on(events, handler, priority) {
      const self = this;
      if (typeof handler !== 'function') return self;
      const method = priority ? 'unshift' : 'push';
      events.split(' ').forEach(event => {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event][method](handler);
      });
      return self;
    },

    once(events, handler, priority) {
      const self = this;
      if (typeof handler !== 'function') return self;

      function onceHandler(...args) {
        self.off(events, onceHandler);

        if (onceHandler.__emitterProxy) {
          delete onceHandler.__emitterProxy;
        }

        handler.apply(self, args);
      }

      onceHandler.__emitterProxy = handler;
      return self.on(events, onceHandler, priority);
    },

    onAny(handler, priority) {
      const self = this;
      if (typeof handler !== 'function') return self;
      const method = priority ? 'unshift' : 'push';

      if (self.eventsAnyListeners.indexOf(handler) < 0) {
        self.eventsAnyListeners[method](handler);
      }

      return self;
    },

    offAny(handler) {
      const self = this;
      if (!self.eventsAnyListeners) return self;
      const index = self.eventsAnyListeners.indexOf(handler);

      if (index >= 0) {
        self.eventsAnyListeners.splice(index, 1);
      }

      return self;
    },

    off(events, handler) {
      const self = this;
      if (!self.eventsListeners) return self;
      events.split(' ').forEach(event => {
        if (typeof handler === 'undefined') {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event]) {
          self.eventsListeners[event].forEach((eventHandler, index) => {
            if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
              self.eventsListeners[event].splice(index, 1);
            }
          });
        }
      });
      return self;
    },

    emit(...args) {
      const self = this;
      if (!self.eventsListeners) return self;
      let events;
      let data;
      let context;

      if (typeof args[0] === 'string' || Array.isArray(args[0])) {
        events = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }

      data.unshift(context);
      const eventsArray = Array.isArray(events) ? events : events.split(' ');
      eventsArray.forEach(event => {
        if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
          self.eventsAnyListeners.forEach(eventHandler => {
            eventHandler.apply(context, [event, ...data]);
          });
        }

        if (self.eventsListeners && self.eventsListeners[event]) {
          self.eventsListeners[event].forEach(eventHandler => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self;
    }

  };

  function updateSize() {
    const swiper = this;
    let width;
    let height;
    const $el = swiper.$el;

    if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
      width = swiper.params.width;
    } else {
      width = $el[0].clientWidth;
    }

    if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
      height = swiper.params.height;
    } else {
      height = $el[0].clientHeight;
    }

    if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
      return;
    } // Subtract paddings


    width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
    height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
    if (Number.isNaN(width)) width = 0;
    if (Number.isNaN(height)) height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height
    });
  }

  function updaterange__slides() {
    const swiper = this;

    function getDirectionLabel(property) {
      if (swiper.isHorizontal()) {
        return property;
      } // prettier-ignore


      return {
        'width': 'height',
        'margin-top': 'margin-left',
        'margin-bottom ': 'margin-right',
        'margin-left': 'margin-top',
        'margin-right': 'margin-bottom',
        'padding-left': 'padding-top',
        'padding-right': 'padding-bottom',
        'marginRight': 'marginBottom'
      }[property];
    }

    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
    }

    const params = swiper.params;
    const {
      $wrapperEl,
      size: swiperSize,
      rtlTranslate: rtl,
      wrongRTL
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousrange__slidesLength = isVirtual ? swiper.virtual.range__slides.length : swiper.range__slides.length;
    const range__slides = $wrapperEl.children(`.${swiper.params.range__slideClass}`);
    const range__slidesLength = isVirtual ? swiper.virtual.range__slides.length : range__slides.length;
    let snapGrid = [];
    const range__slidesGrid = [];
    const range__slidesSizesGrid = [];
    let offsetBefore = params.range__slidesOffsetBefore;

    if (typeof offsetBefore === 'function') {
      offsetBefore = params.range__slidesOffsetBefore.call(swiper);
    }

    let offsetAfter = params.range__slidesOffsetAfter;

    if (typeof offsetAfter === 'function') {
      offsetAfter = params.range__slidesOffsetAfter.call(swiper);
    }

    const previousSnapGridLength = swiper.snapGrid.length;
    const previousrange__slidesGridLength = swiper.range__slidesGrid.length;
    let spaceBetween = params.spaceBetween;
    let range__slidePosition = -offsetBefore;
    let prevrange__slideSize = 0;
    let index = 0;

    if (typeof swiperSize === 'undefined') {
      return;
    }

    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
    }

    swiper.virtualSize = -spaceBetween; // reset margins

    if (rtl) range__slides.css({
      marginLeft: '',
      marginBottom: '',
      marginTop: ''
    });else range__slides.css({
      marginRight: '',
      marginBottom: '',
      marginTop: ''
    }); // reset cssMode offsets

    if (params.centeredrange__slides && params.cssMode) {
      setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
      setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
    }

    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

    if (gridEnabled) {
      swiper.grid.initrange__slides(range__slidesLength);
    } // Calc range__slides


    let range__slideSize;
    const shouldResetrange__slideSize = params.range__slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
      return typeof params.breakpoints[key].range__slidesPerView !== 'undefined';
    }).length > 0;

    for (let i = 0; i < range__slidesLength; i += 1) {
      range__slideSize = 0;
      const range__slide = range__slides.eq(i);

      if (gridEnabled) {
        swiper.grid.updaterange__slide(i, range__slide, range__slidesLength, getDirectionLabel);
      }

      if (range__slide.css('display') === 'none') continue; // eslint-disable-line

      if (params.range__slidesPerView === 'auto') {
        if (shouldResetrange__slideSize) {
          range__slides[i].style[getDirectionLabel('width')] = ``;
        }

        const range__slideStyles = getComputedStyle(range__slide[0]);
        const currentTransform = range__slide[0].style.transform;
        const currentWebKitTransform = range__slide[0].style.webkitTransform;

        if (currentTransform) {
          range__slide[0].style.transform = 'none';
        }

        if (currentWebKitTransform) {
          range__slide[0].style.webkitTransform = 'none';
        }

        if (params.roundLengths) {
          range__slideSize = swiper.isHorizontal() ? range__slide.outerWidth(true) : range__slide.outerHeight(true);
        } else {
          // eslint-disable-next-line
          const width = getDirectionPropertyValue(range__slideStyles, 'width');
          const paddingLeft = getDirectionPropertyValue(range__slideStyles, 'padding-left');
          const paddingRight = getDirectionPropertyValue(range__slideStyles, 'padding-right');
          const marginLeft = getDirectionPropertyValue(range__slideStyles, 'margin-left');
          const marginRight = getDirectionPropertyValue(range__slideStyles, 'margin-right');
          const boxSizing = range__slideStyles.getPropertyValue('box-sizing');

          if (boxSizing && boxSizing === 'border-box') {
            range__slideSize = width + marginLeft + marginRight;
          } else {
            const {
              clientWidth,
              offsetWidth
            } = range__slide[0];
            range__slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
          }
        }

        if (currentTransform) {
          range__slide[0].style.transform = currentTransform;
        }

        if (currentWebKitTransform) {
          range__slide[0].style.webkitTransform = currentWebKitTransform;
        }

        if (params.roundLengths) range__slideSize = Math.floor(range__slideSize);
      } else {
        range__slideSize = (swiperSize - (params.range__slidesPerView - 1) * spaceBetween) / params.range__slidesPerView;
        if (params.roundLengths) range__slideSize = Math.floor(range__slideSize);

        if (range__slides[i]) {
          range__slides[i].style[getDirectionLabel('width')] = `${range__slideSize}px`;
        }
      }

      if (range__slides[i]) {
        range__slides[i].swiperrange__slideSize = range__slideSize;
      }

      range__slidesSizesGrid.push(range__slideSize);

      if (params.centeredrange__slides) {
        range__slidePosition = range__slidePosition + range__slideSize / 2 + prevrange__slideSize / 2 + spaceBetween;
        if (prevrange__slideSize === 0 && i !== 0) range__slidePosition = range__slidePosition - swiperSize / 2 - spaceBetween;
        if (i === 0) range__slidePosition = range__slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(range__slidePosition) < 1 / 1000) range__slidePosition = 0;
        if (params.roundLengths) range__slidePosition = Math.floor(range__slidePosition);
        if (index % params.range__slidesPerGroup === 0) snapGrid.push(range__slidePosition);
        range__slidesGrid.push(range__slidePosition);
      } else {
        if (params.roundLengths) range__slidePosition = Math.floor(range__slidePosition);
        if ((index - Math.min(swiper.params.range__slidesPerGroupSkip, index)) % swiper.params.range__slidesPerGroup === 0) snapGrid.push(range__slidePosition);
        range__slidesGrid.push(range__slidePosition);
        range__slidePosition = range__slidePosition + range__slideSize + spaceBetween;
      }

      swiper.virtualSize += range__slideSize + spaceBetween;
      prevrange__slideSize = range__slideSize;
      index += 1;
    }

    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

    if (rtl && wrongRTL && (params.effect === 'range__slide' || params.effect === 'coverflow')) {
      $wrapperEl.css({
        width: `${swiper.virtualSize + params.spaceBetween}px`
      });
    }

    if (params.setWrapperSize) {
      $wrapperEl.css({
        [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
      });
    }

    if (gridEnabled) {
      swiper.grid.updateWrapperSize(range__slideSize, snapGrid, getDirectionLabel);
    } // Remove last grid elements depending on width


    if (!params.centeredrange__slides) {
      const newrange__slidesGrid = [];

      for (let i = 0; i < snapGrid.length; i += 1) {
        let range__slidesGridItem = snapGrid[i];
        if (params.roundLengths) range__slidesGridItem = Math.floor(range__slidesGridItem);

        if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newrange__slidesGrid.push(range__slidesGridItem);
        }
      }

      snapGrid = newrange__slidesGrid;

      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }

    if (snapGrid.length === 0) snapGrid = [0];

    if (params.spaceBetween !== 0) {
      const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
      range__slides.filter((_, range__slideIndex) => {
        if (!params.cssMode) return true;

        if (range__slideIndex === range__slides.length - 1) {
          return false;
        }

        return true;
      }).css({
        [key]: `${spaceBetween}px`
      });
    }

    if (params.centeredrange__slides && params.centeredrange__slidesBounds) {
      let allrange__slidesSize = 0;
      range__slidesSizesGrid.forEach(range__slideSizeValue => {
        allrange__slidesSize += range__slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allrange__slidesSize -= params.spaceBetween;
      const maxSnap = allrange__slidesSize - swiperSize;
      snapGrid = snapGrid.map(snap => {
        if (snap < 0) return -offsetBefore;
        if (snap > maxSnap) return maxSnap + offsetAfter;
        return snap;
      });
    }

    if (params.centerInsufficientrange__slides) {
      let allrange__slidesSize = 0;
      range__slidesSizesGrid.forEach(range__slideSizeValue => {
        allrange__slidesSize += range__slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
      });
      allrange__slidesSize -= params.spaceBetween;

      if (allrange__slidesSize < swiperSize) {
        const allrange__slidesOffset = (swiperSize - allrange__slidesSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allrange__slidesOffset;
        });
        range__slidesGrid.forEach((snap, snapIndex) => {
          range__slidesGrid[snapIndex] = snap + allrange__slidesOffset;
        });
      }
    }

    Object.assign(swiper, {
      range__slides,
      snapGrid,
      range__slidesGrid,
      range__slidesSizesGrid
    });

    if (params.centeredrange__slides && params.cssMode && !params.centeredrange__slidesBounds) {
      setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
      setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - range__slidesSizesGrid[range__slidesSizesGrid.length - 1] / 2}px`);
      const addToSnapGrid = -swiper.snapGrid[0];
      const addTorange__slidesGrid = -swiper.range__slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
      swiper.range__slidesGrid = swiper.range__slidesGrid.map(v => v + addTorange__slidesGrid);
    }

    if (range__slidesLength !== previousrange__slidesLength) {
      swiper.emit('range__slidesLengthChange');
    }

    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow) swiper.checkOverflow();
      swiper.emit('snapGridLengthChange');
    }

    if (range__slidesGrid.length !== previousrange__slidesGridLength) {
      swiper.emit('range__slidesGridLengthChange');
    }

    if (params.watchrange__slidesProgress) {
      swiper.updaterange__slidesOffset();
    }
  }

  function updateAutoHeight(speed) {
    const swiper = this;
    const activerange__slides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i;

    if (typeof speed === 'number') {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }

    const getrange__slideByIndex = index => {
      if (isVirtual) {
        return swiper.range__slides.filter(el => parseInt(el.getAttribute('data-swiper-range__slide-index'), 10) === index)[0];
      }

      return swiper.range__slides.eq(index)[0];
    }; // Find range__slides currently in view


    if (swiper.params.range__slidesPerView !== 'auto' && swiper.params.range__slidesPerView > 1) {
      if (swiper.params.centeredrange__slides) {
        swiper.visiblerange__slides.each(range__slide => {
          activerange__slides.push(range__slide);
        });
      } else {
        for (i = 0; i < Math.ceil(swiper.params.range__slidesPerView); i += 1) {
          const index = swiper.activeIndex + i;
          if (index > swiper.range__slides.length && !isVirtual) break;
          activerange__slides.push(getrange__slideByIndex(index));
        }
      }
    } else {
      activerange__slides.push(getrange__slideByIndex(swiper.activeIndex));
    } // Find new height from highest range__slide in view


    for (i = 0; i < activerange__slides.length; i += 1) {
      if (typeof activerange__slides[i] !== 'undefined') {
        const height = activerange__slides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    } // Update Height


    if (newHeight || newHeight === 0) swiper.$wrapperEl.css('height', `${newHeight}px`);
  }

  function updaterange__slidesOffset() {
    const swiper = this;
    const range__slides = swiper.range__slides;

    for (let i = 0; i < range__slides.length; i += 1) {
      range__slides[i].swiperrange__slideOffset = swiper.isHorizontal() ? range__slides[i].offsetLeft : range__slides[i].offsetTop;
    }
  }

  function updaterange__slidesProgress(translate = this && this.translate || 0) {
    const swiper = this;
    const params = swiper.params;
    const {
      range__slides,
      rtlTranslate: rtl,
      snapGrid
    } = swiper;
    if (range__slides.length === 0) return;
    if (typeof range__slides[0].swiperrange__slideOffset === 'undefined') swiper.updaterange__slidesOffset();
    let offsetCenter = -translate;
    if (rtl) offsetCenter = translate; // Visible range__slides

    range__slides.removeClass(params.range__slideVisibleClass);
    swiper.visiblerange__slidesIndexes = [];
    swiper.visiblerange__slides = [];

    for (let i = 0; i < range__slides.length; i += 1) {
      const range__slide = range__slides[i];
      let range__slideOffset = range__slide.swiperrange__slideOffset;

      if (params.cssMode && params.centeredrange__slides) {
        range__slideOffset -= range__slides[0].swiperrange__slideOffset;
      }

      const range__slideProgress = (offsetCenter + (params.centeredrange__slides ? swiper.minTranslate() : 0) - range__slideOffset) / (range__slide.swiperrange__slideSize + params.spaceBetween);
      const originalrange__slideProgress = (offsetCenter - snapGrid[0] + (params.centeredrange__slides ? swiper.minTranslate() : 0) - range__slideOffset) / (range__slide.swiperrange__slideSize + params.spaceBetween);
      const range__slideBefore = -(offsetCenter - range__slideOffset);
      const range__slideAfter = range__slideBefore + swiper.range__slidesSizesGrid[i];
      const isVisible = range__slideBefore >= 0 && range__slideBefore < swiper.size - 1 || range__slideAfter > 1 && range__slideAfter <= swiper.size || range__slideBefore <= 0 && range__slideAfter >= swiper.size;

      if (isVisible) {
        swiper.visiblerange__slides.push(range__slide);
        swiper.visiblerange__slidesIndexes.push(i);
        range__slides.eq(i).addClass(params.range__slideVisibleClass);
      }

      range__slide.progress = rtl ? -range__slideProgress : range__slideProgress;
      range__slide.originalProgress = rtl ? -originalrange__slideProgress : originalrange__slideProgress;
    }

    swiper.visiblerange__slides = $(swiper.visiblerange__slides);
  }

  function updateProgress(translate) {
    const swiper = this;

    if (typeof translate === 'undefined') {
      const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

      translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
    }

    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let {
      progress,
      isBeginning,
      isEnd
    } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;

    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate - swiper.minTranslate()) / translatesDiff;
      isBeginning = progress <= 0;
      isEnd = progress >= 1;
    }

    Object.assign(swiper, {
      progress,
      isBeginning,
      isEnd
    });
    if (params.watchrange__slidesProgress || params.centeredrange__slides && params.autoHeight) swiper.updaterange__slidesProgress(translate);

    if (isBeginning && !wasBeginning) {
      swiper.emit('reachBeginning toEdge');
    }

    if (isEnd && !wasEnd) {
      swiper.emit('reachEnd toEdge');
    }

    if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
      swiper.emit('fromEdge');
    }

    swiper.emit('progress', progress);
  }

  function updaterange__slidesClasses() {
    const swiper = this;
    const {
      range__slides,
      params,
      $wrapperEl,
      activeIndex,
      realIndex
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    range__slides.removeClass(`${params.range__slideActiveClass} ${params.range__slideNextClass} ${params.range__slidePrevClass} ${params.range__slideDuplicateActiveClass} ${params.range__slideDuplicateNextClass} ${params.range__slideDuplicatePrevClass}`);
    let activerange__slide;

    if (isVirtual) {
      activerange__slide = swiper.$wrapperEl.find(`.${params.range__slideClass}[data-swiper-range__slide-index="${activeIndex}"]`);
    } else {
      activerange__slide = range__slides.eq(activeIndex);
    } // Active classes


    activerange__slide.addClass(params.range__slideActiveClass);

    if (params.loop) {
      // Duplicate to all looped range__slides
      if (activerange__slide.hasClass(params.range__slideDuplicateClass)) {
        $wrapperEl.children(`.${params.range__slideClass}:not(.${params.range__slideDuplicateClass})[data-swiper-range__slide-index="${realIndex}"]`).addClass(params.range__slideDuplicateActiveClass);
      } else {
        $wrapperEl.children(`.${params.range__slideClass}.${params.range__slideDuplicateClass}[data-swiper-range__slide-index="${realIndex}"]`).addClass(params.range__slideDuplicateActiveClass);
      }
    } // Next range__slide


    let nextrange__slide = activerange__slide.nextAll(`.${params.range__slideClass}`).eq(0).addClass(params.range__slideNextClass);

    if (params.loop && nextrange__slide.length === 0) {
      nextrange__slide = range__slides.eq(0);
      nextrange__slide.addClass(params.range__slideNextClass);
    } // Prev range__slide


    let prevrange__slide = activerange__slide.prevAll(`.${params.range__slideClass}`).eq(0).addClass(params.range__slidePrevClass);

    if (params.loop && prevrange__slide.length === 0) {
      prevrange__slide = range__slides.eq(-1);
      prevrange__slide.addClass(params.range__slidePrevClass);
    }

    if (params.loop) {
      // Duplicate to all looped range__slides
      if (nextrange__slide.hasClass(params.range__slideDuplicateClass)) {
        $wrapperEl.children(`.${params.range__slideClass}:not(.${params.range__slideDuplicateClass})[data-swiper-range__slide-index="${nextrange__slide.attr('data-swiper-range__slide-index')}"]`).addClass(params.range__slideDuplicateNextClass);
      } else {
        $wrapperEl.children(`.${params.range__slideClass}.${params.range__slideDuplicateClass}[data-swiper-range__slide-index="${nextrange__slide.attr('data-swiper-range__slide-index')}"]`).addClass(params.range__slideDuplicateNextClass);
      }

      if (prevrange__slide.hasClass(params.range__slideDuplicateClass)) {
        $wrapperEl.children(`.${params.range__slideClass}:not(.${params.range__slideDuplicateClass})[data-swiper-range__slide-index="${prevrange__slide.attr('data-swiper-range__slide-index')}"]`).addClass(params.range__slideDuplicatePrevClass);
      } else {
        $wrapperEl.children(`.${params.range__slideClass}.${params.range__slideDuplicateClass}[data-swiper-range__slide-index="${prevrange__slide.attr('data-swiper-range__slide-index')}"]`).addClass(params.range__slideDuplicatePrevClass);
      }
    }

    swiper.emitrange__slidesClasses();
  }

  function updateActiveIndex(newActiveIndex) {
    const swiper = this;
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      range__slidesGrid,
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;

    if (typeof activeIndex === 'undefined') {
      for (let i = 0; i < range__slidesGrid.length; i += 1) {
        if (typeof range__slidesGrid[i + 1] !== 'undefined') {
          if (translate >= range__slidesGrid[i] && translate < range__slidesGrid[i + 1] - (range__slidesGrid[i + 1] - range__slidesGrid[i]) / 2) {
            activeIndex = i;
          } else if (translate >= range__slidesGrid[i] && translate < range__slidesGrid[i + 1]) {
            activeIndex = i + 1;
          }
        } else if (translate >= range__slidesGrid[i]) {
          activeIndex = i;
        }
      } // Normalize range__slideIndex


      if (params.normalizerange__slideIndex) {
        if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
      }
    }

    if (snapGrid.indexOf(translate) >= 0) {
      snapIndex = snapGrid.indexOf(translate);
    } else {
      const skip = Math.min(params.range__slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.range__slidesPerGroup);
    }

    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

    if (activeIndex === previousIndex) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit('snapIndexChange');
      }

      return;
    } // Get real index


    const realIndex = parseInt(swiper.range__slides.eq(activeIndex).attr('data-swiper-range__slide-index') || activeIndex, 10);
    Object.assign(swiper, {
      snapIndex,
      realIndex,
      previousIndex,
      activeIndex
    });
    swiper.emit('activeIndexChange');
    swiper.emit('snapIndexChange');

    if (previousRealIndex !== realIndex) {
      swiper.emit('realIndexChange');
    }

    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      swiper.emit('range__slideChange');
    }
  }

  function updateClickedrange__slide(e) {
    const swiper = this;
    const params = swiper.params;
    const range__slide = $(e).closest(`.${params.range__slideClass}`)[0];
    let range__slideFound = false;
    let range__slideIndex;

    if (range__slide) {
      for (let i = 0; i < swiper.range__slides.length; i += 1) {
        if (swiper.range__slides[i] === range__slide) {
          range__slideFound = true;
          range__slideIndex = i;
          break;
        }
      }
    }

    if (range__slide && range__slideFound) {
      swiper.clickedrange__slide = range__slide;

      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt($(range__slide).attr('data-swiper-range__slide-index'), 10);
      } else {
        swiper.clickedIndex = range__slideIndex;
      }
    } else {
      swiper.clickedrange__slide = undefined;
      swiper.clickedIndex = undefined;
      return;
    }

    if (params.range__slideToClickedrange__slide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.range__slideToClickedrange__slide();
    }
  }

  var update = {
    updateSize,
    updaterange__slides,
    updateAutoHeight,
    updaterange__slidesOffset,
    updaterange__slidesProgress,
    updateProgress,
    updaterange__slidesClasses,
    updateActiveIndex,
    updateClickedrange__slide
  };

  function getSwiperTranslate(axis = this.isHorizontal() ? 'x' : 'y') {
    const swiper = this;
    const {
      params,
      rtlTranslate: rtl,
      translate,
      $wrapperEl
    } = swiper;

    if (params.virtualTranslate) {
      return rtl ? -translate : translate;
    }

    if (params.cssMode) {
      return translate;
    }

    let currentTranslate = getTranslate($wrapperEl[0], axis);
    if (rtl) currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }

  function setTranslate(translate, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      $wrapperEl,
      wrapperEl,
      progress
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;

    if (swiper.isHorizontal()) {
      x = rtl ? -translate : translate;
    } else {
      y = translate;
    }

    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }

    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
    }

    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate - swiper.minTranslate()) / translatesDiff;
    }

    if (newProgress !== progress) {
      swiper.updateProgress(translate);
    }

    swiper.emit('setTranslate', swiper.translate, byController);
  }

  function minTranslate() {
    return -this.snapGrid[0];
  }

  function maxTranslate() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }

  function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
    const swiper = this;
    const {
      params,
      wrapperEl
    } = swiper;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }

    const minTranslate = swiper.minTranslate();
    const maxTranslate = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

    swiper.updateProgress(newTranslate);

    if (params.cssMode) {
      const isH = swiper.isHorizontal();

      if (speed === 0) {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? 'left' : 'top'
          });
          return true;
        }

        wrapperEl.scrollTo({
          [isH ? 'left' : 'top']: -newTranslate,
          behavior: 'smooth'
        });
      }

      return true;
    }

    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);

      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionEnd');
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);

      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionStart');
      }

      if (!swiper.animating) {
        swiper.animating = true;

        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
            swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;

            if (runCallbacks) {
              swiper.emit('transitionEnd');
            }
          };
        }

        swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
        swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
      }
    }

    return true;
  }

  var translate = {
    getTranslate: getSwiperTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo
  };

  function setTransition(duration, byController) {
    const swiper = this;

    if (!swiper.params.cssMode) {
      swiper.$wrapperEl.transition(duration);
    }

    swiper.emit('setTransition', duration, byController);
  }

  function transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step
  }) {
    const {
      activeIndex,
      previousIndex
    } = swiper;
    let dir = direction;

    if (!dir) {
      if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
    }

    swiper.emit(`transition${step}`);

    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === 'reset') {
        swiper.emit(`range__slideResetTransition${step}`);
        return;
      }

      swiper.emit(`range__slideChangeTransition${step}`);

      if (dir === 'next') {
        swiper.emit(`range__slideNextTransition${step}`);
      } else {
        swiper.emit(`range__slidePrevTransition${step}`);
      }
    }
  }

  function transitionStart(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    if (params.cssMode) return;

    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: 'Start'
    });
  }

  function transitionEnd(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.animating = false;
    if (params.cssMode) return;
    swiper.setTransition(0);
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: 'End'
    });
  }

  var transition = {
    setTransition,
    transitionStart,
    transitionEnd
  };

  function range__slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
    if (typeof index !== 'number' && typeof index !== 'string') {
      throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
    }

    if (typeof index === 'string') {
      /**
       * The `index` argument converted from `string` to `number`.
       * @type {number}
       */
      const indexAsNumber = parseInt(index, 10);
      /**
       * Determines whether the `index` argument is a valid `number`
       * after being converted from the `string` type.
       * @type {boolean}
       */

      const isValidNumber = isFinite(indexAsNumber);

      if (!isValidNumber) {
        throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
      } // Knowing that the converted `index` is a valid number,
      // we can update the original argument's value.


      index = indexAsNumber;
    }

    const swiper = this;
    let range__slideIndex = index;
    if (range__slideIndex < 0) range__slideIndex = 0;
    const {
      params,
      snapGrid,
      range__slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled
    } = swiper;

    if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
      return false;
    }

    const skip = Math.min(swiper.params.range__slidesPerGroupSkip, range__slideIndex);
    let snapIndex = skip + Math.floor((range__slideIndex - skip) / swiper.params.range__slidesPerGroup);
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

    if ((activeIndex || params.initialrange__slide || 0) === (previousIndex || 0) && runCallbacks) {
      swiper.emit('beforerange__slideChangeStart');
    }

    const translate = -snapGrid[snapIndex]; // Update progress

    swiper.updateProgress(translate); // Normalize range__slideIndex

    if (params.normalizerange__slideIndex) {
      for (let i = 0; i < range__slidesGrid.length; i += 1) {
        const normalizedTranslate = -Math.floor(translate * 100);
        const normalizedGrid = Math.floor(range__slidesGrid[i] * 100);
        const normalizedGridNext = Math.floor(range__slidesGrid[i + 1] * 100);

        if (typeof range__slidesGrid[i + 1] !== 'undefined') {
          if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
            range__slideIndex = i;
          } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
            range__slideIndex = i + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          range__slideIndex = i;
        }
      }
    } // Directions locks


    if (swiper.initialized && range__slideIndex !== activeIndex) {
      if (!swiper.allowrange__slideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
        return false;
      }

      if (!swiper.allowrange__slidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== range__slideIndex) return false;
      }
    }

    let direction;
    if (range__slideIndex > activeIndex) direction = 'next';else if (range__slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

    if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
      swiper.updateActiveIndex(range__slideIndex); // Update Height

      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }

      swiper.updaterange__slidesClasses();

      if (params.effect !== 'range__slide') {
        swiper.setTranslate(translate);
      }

      if (direction !== 'reset') {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }

      return false;
    }

    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t = rtl ? translate : -translate;

      if (speed === 0) {
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = 'none';
          swiper._immediateVirtual = true;
        }

        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = '';
            swiper._swiperImmediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: t,
            side: isH ? 'left' : 'top'
          });
          return true;
        }

        wrapperEl.scrollTo({
          [isH ? 'left' : 'top']: t,
          behavior: 'smooth'
        });
      }

      return true;
    }

    swiper.setTransition(speed);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(range__slideIndex);
    swiper.updaterange__slidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);

    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onrange__slideToWrapperTransitionEnd) {
        swiper.onrange__slideToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onrange__slideToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onrange__slideToWrapperTransitionEnd);
          swiper.onrange__slideToWrapperTransitionEnd = null;
          delete swiper.onrange__slideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }

      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onrange__slideToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onrange__slideToWrapperTransitionEnd);
    }

    return true;
  }

  function range__slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    let newIndex = index;

    if (swiper.params.loop) {
      newIndex += swiper.loopedrange__slides;
    }

    return swiper.range__slideTo(newIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function range__slideNext(speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      animating,
      enabled,
      params
    } = swiper;
    if (!enabled) return swiper;
    let perGroup = params.range__slidesPerGroup;

    if (params.range__slidesPerView === 'auto' && params.range__slidesPerGroup === 1 && params.range__slidesPerGroupAuto) {
      perGroup = Math.max(swiper.range__slidesPerViewDynamic('current', true), 1);
    }

    const increment = swiper.activeIndex < params.range__slidesPerGroupSkip ? 1 : perGroup;

    if (params.loop) {
      if (animating && params.loopPreventsrange__slide) return false;
      swiper.loopFix(); // eslint-disable-next-line

      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    }

    if (params.rewind && swiper.isEnd) {
      return swiper.range__slideTo(0, speed, runCallbacks, internal);
    }

    return swiper.range__slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function range__slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      params,
      animating,
      snapGrid,
      range__slidesGrid,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled) return swiper;

    if (params.loop) {
      if (animating && params.loopPreventsrange__slide) return false;
      swiper.loopFix(); // eslint-disable-next-line

      swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
    }

    const translate = rtlTranslate ? swiper.translate : -swiper.translate;

    function normalize(val) {
      if (val < 0) return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }

    const normalizedTranslate = normalize(translate);
    const normalizedSnapGrid = snapGrid.map(val => normalize(val));
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

    if (typeof prevSnap === 'undefined' && params.cssMode) {
      let prevSnapIndex;
      snapGrid.forEach((snap, snapIndex) => {
        if (normalizedTranslate >= snap) {
          // prevSnap = snap;
          prevSnapIndex = snapIndex;
        }
      });

      if (typeof prevSnapIndex !== 'undefined') {
        prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }

    let prevIndex = 0;

    if (typeof prevSnap !== 'undefined') {
      prevIndex = range__slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

      if (params.range__slidesPerView === 'auto' && params.range__slidesPerGroup === 1 && params.range__slidesPerGroupAuto) {
        prevIndex = prevIndex - swiper.range__slidesPerViewDynamic('previous', true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }

    if (params.rewind && swiper.isBeginning) {
      return swiper.range__slideTo(swiper.range__slides.length - 1, speed, runCallbacks, internal);
    }

    return swiper.range__slideTo(prevIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function range__slideReset(speed = this.params.speed, runCallbacks = true, internal) {
    const swiper = this;
    return swiper.range__slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function range__slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
    const swiper = this;
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.range__slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.range__slidesPerGroup);
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

    if (translate >= swiper.snapGrid[snapIndex]) {
      // The current translate is on or after the current snap index, so the choice
      // is between the current index and the one after it.
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];

      if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.range__slidesPerGroup;
      }
    } else {
      // The current translate is before the current snap index, so the choice
      // is between the current index and the one before it.
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];

      if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.range__slidesPerGroup;
      }
    }

    index = Math.max(index, 0);
    index = Math.min(index, swiper.range__slidesGrid.length - 1);
    return swiper.range__slideTo(index, speed, runCallbacks, internal);
  }

  function range__slideToClickedrange__slide() {
    const swiper = this;
    const {
      params,
      $wrapperEl
    } = swiper;
    const range__slidesPerView = params.range__slidesPerView === 'auto' ? swiper.range__slidesPerViewDynamic() : params.range__slidesPerView;
    let range__slideToIndex = swiper.clickedIndex;
    let realIndex;

    if (params.loop) {
      if (swiper.animating) return;
      realIndex = parseInt($(swiper.clickedrange__slide).attr('data-swiper-range__slide-index'), 10);

      if (params.centeredrange__slides) {
        if (range__slideToIndex < swiper.loopedrange__slides - range__slidesPerView / 2 || range__slideToIndex > swiper.range__slides.length - swiper.loopedrange__slides + range__slidesPerView / 2) {
          swiper.loopFix();
          range__slideToIndex = $wrapperEl.children(`.${params.range__slideClass}[data-swiper-range__slide-index="${realIndex}"]:not(.${params.range__slideDuplicateClass})`).eq(0).index();
          nextTick(() => {
            swiper.range__slideTo(range__slideToIndex);
          });
        } else {
          swiper.range__slideTo(range__slideToIndex);
        }
      } else if (range__slideToIndex > swiper.range__slides.length - range__slidesPerView) {
        swiper.loopFix();
        range__slideToIndex = $wrapperEl.children(`.${params.range__slideClass}[data-swiper-range__slide-index="${realIndex}"]:not(.${params.range__slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper.range__slideTo(range__slideToIndex);
        });
      } else {
        swiper.range__slideTo(range__slideToIndex);
      }
    } else {
      swiper.range__slideTo(range__slideToIndex);
    }
  }

  var range__slide = {
    range__slideTo,
    range__slideToLoop,
    range__slideNext,
    range__slidePrev,
    range__slideReset,
    range__slideToClosest,
    range__slideToClickedrange__slide
  };

  function loopCreate() {
    const swiper = this;
    const document = getDocument();
    const {
      params,
      $wrapperEl
    } = swiper; // Remove duplicated range__slides

    const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
    $selector.children(`.${params.range__slideClass}.${params.range__slideDuplicateClass}`).remove();
    let range__slides = $selector.children(`.${params.range__slideClass}`);

    if (params.loopFillGroupWithBlank) {
      const blankrange__slidesNum = params.range__slidesPerGroup - range__slides.length % params.range__slidesPerGroup;

      if (blankrange__slidesNum !== params.range__slidesPerGroup) {
        for (let i = 0; i < blankrange__slidesNum; i += 1) {
          const blankNode = $(document.createElement('div')).addClass(`${params.range__slideClass} ${params.range__slideBlankClass}`);
          $selector.append(blankNode);
        }

        range__slides = $selector.children(`.${params.range__slideClass}`);
      }
    }

    if (params.range__slidesPerView === 'auto' && !params.loopedrange__slides) params.loopedrange__slides = range__slides.length;
    swiper.loopedrange__slides = Math.ceil(parseFloat(params.loopedrange__slides || params.range__slidesPerView, 10));
    swiper.loopedrange__slides += params.loopAdditionalrange__slides;

    if (swiper.loopedrange__slides > range__slides.length) {
      swiper.loopedrange__slides = range__slides.length;
    }

    const prependrange__slides = [];
    const appendrange__slides = [];
    range__slides.each((el, index) => {
      const range__slide = $(el);

      if (index < swiper.loopedrange__slides) {
        appendrange__slides.push(el);
      }

      if (index < range__slides.length && index >= range__slides.length - swiper.loopedrange__slides) {
        prependrange__slides.push(el);
      }

      range__slide.attr('data-swiper-range__slide-index', index);
    });

    for (let i = 0; i < appendrange__slides.length; i += 1) {
      $selector.append($(appendrange__slides[i].cloneNode(true)).addClass(params.range__slideDuplicateClass));
    }

    for (let i = prependrange__slides.length - 1; i >= 0; i -= 1) {
      $selector.prepend($(prependrange__slides[i].cloneNode(true)).addClass(params.range__slideDuplicateClass));
    }
  }

  function loopFix() {
    const swiper = this;
    swiper.emit('beforeLoopFix');
    const {
      activeIndex,
      range__slides,
      loopedrange__slides,
      allowrange__slidePrev,
      allowrange__slideNext,
      snapGrid,
      rtlTranslate: rtl
    } = swiper;
    let newIndex;
    swiper.allowrange__slidePrev = true;
    swiper.allowrange__slideNext = true;
    const snapTranslate = -snapGrid[activeIndex];
    const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

    if (activeIndex < loopedrange__slides) {
      newIndex = range__slides.length - loopedrange__slides * 3 + activeIndex;
      newIndex += loopedrange__slides;
      const range__slideChanged = swiper.range__slideTo(newIndex, 0, false, true);

      if (range__slideChanged && diff !== 0) {
        swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
      }
    } else if (activeIndex >= range__slides.length - loopedrange__slides) {
      // Fix For Positive Oversliding
      newIndex = -range__slides.length + activeIndex + loopedrange__slides;
      newIndex += loopedrange__slides;
      const range__slideChanged = swiper.range__slideTo(newIndex, 0, false, true);

      if (range__slideChanged && diff !== 0) {
        swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
      }
    }

    swiper.allowrange__slidePrev = allowrange__slidePrev;
    swiper.allowrange__slideNext = allowrange__slideNext;
    swiper.emit('loopFix');
  }

  function loopDestroy() {
    const swiper = this;
    const {
      $wrapperEl,
      params,
      range__slides
    } = swiper;
    $wrapperEl.children(`.${params.range__slideClass}.${params.range__slideDuplicateClass},.${params.range__slideClass}.${params.range__slideBlankClass}`).remove();
    range__slides.removeAttr('data-swiper-range__slide-index');
  }

  var loop = {
    loopCreate,
    loopFix,
    loopDestroy
  };

  function setGrabCursor(moving) {
    const swiper = this;
    if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
    const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
    el.style.cursor = 'move';
    el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
    el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
    el.style.cursor = moving ? 'grabbing' : 'grab';
  }

  function unsetGrabCursor() {
    const swiper = this;

    if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
      return;
    }

    swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
  }

  var grabCursor = {
    setGrabCursor,
    unsetGrabCursor
  };

  function closestElement(selector, base = this) {
    function __closestFrom(el) {
      if (!el || el === getDocument() || el === getWindow()) return null;
      if (el.assignedSlot) el = el.assignedSlot;
      const found = el.closest(selector);
      return found || __closestFrom(el.getRootNode().host);
    }

    return __closestFrom(base);
  }

  function onTouchStart(event) {
    const swiper = this;
    const document = getDocument();
    const window = getWindow();
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      enabled
    } = swiper;
    if (!enabled) return;

    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }

    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }

    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    let $targetEl = $(e.target);

    if (params.touchEventsTarget === 'wrapper') {
      if (!$targetEl.closest(swiper.wrapperEl).length) return;
    }

    data.isTouchEvent = e.type === 'touchstart';
    if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
    if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return; // change target el for shadow root component

    const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

    if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
      $targetEl = $(event.path[0]);
    }

    const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

    if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, e.target) : $targetEl.closest(noSwipingSelector)[0])) {
      swiper.allowClick = true;
      return;
    }

    if (params.swipeHandler) {
      if (!$targetEl.closest(params.swipeHandler)[0]) return;
    }

    touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

    const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

    if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
      if (edgeSwipeDetection === 'prevent') {
        event.preventDefault();
      } else {
        return;
      }
    }

    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: undefined,
      startMoving: undefined
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = undefined;
    if (params.threshold > 0) data.allowThresholdMove = false;

    if (e.type !== 'touchstart') {
      let preventDefault = true;
      if ($targetEl.is(data.focusableElements)) preventDefault = false;

      if (document.activeElement && $(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
        document.activeElement.blur();
      }

      const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

      if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
        e.preventDefault();
      }
    }

    swiper.emit('touchStart', e);
  }

  function onTouchMove(event) {
    const document = getDocument();
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      enabled
    } = swiper;
    if (!enabled) return;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;

    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }

      return;
    }

    if (data.isTouchEvent && e.type !== 'touchmove') return;
    const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
    const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
    const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }

    if (!swiper.allowTouchMove) {
      // isMoved = true;
      swiper.allowClick = false;

      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY
        });
        data.touchStartTime = now();
      }

      return;
    }

    if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        // Vertical
        if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
        return;
      }
    }

    if (data.isTouchEvent && document.activeElement) {
      if (e.target === document.activeElement && $(e.target).is(data.focusableElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }

    if (data.allowTouchCallbacks) {
      swiper.emit('touchMove', e);
    }

    if (e.targetTouches && e.targetTouches.length > 1) return;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

    if (typeof data.isScrolling === 'undefined') {
      let touchAngle;

      if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
        data.isScrolling = false;
      } else {
        // eslint-disable-next-line
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
        }
      }
    }

    if (data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }

    if (typeof data.startMoving === 'undefined') {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }

    if (data.isScrolling) {
      data.isTouched = false;
      return;
    }

    if (!data.startMoving) {
      return;
    }

    swiper.allowClick = false;

    if (!params.cssMode && e.cancelable) {
      e.preventDefault();
    }

    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }

    if (!data.isMoved) {
      if (params.loop && !params.cssMode) {
        swiper.loopFix();
      }

      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);

      if (swiper.animating) {
        swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
      }

      data.allowMomentumBounce = false; // Grab Cursor

      if (params.grabCursor && (swiper.allowrange__slideNext === true || swiper.allowrange__slidePrev === true)) {
        swiper.setGrabCursor(true);
      }

      swiper.emit('range__sliderFirstMove', e);
    }

    swiper.emit('range__sliderMove', e);
    data.isMoved = true;
    let diff = swiper.isHorizontal() ? diffX : diffY;
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) diff = -diff;
    swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;

    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }

    if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
    } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
    }

    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    } // Directions locks


    if (!swiper.allowrange__slideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }

    if (!swiper.allowrange__slidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }

    if (!swiper.allowrange__slidePrev && !swiper.allowrange__slideNext) {
      data.currentTranslate = data.startTranslate;
    } // Threshold


    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }

    if (!params.followFinger || params.cssMode) return; // Update active index in free mode

    if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchrange__slidesProgress) {
      swiper.updateActiveIndex();
      swiper.updaterange__slidesClasses();
    }

    if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    } // Update progress


    swiper.updateProgress(data.currentTranslate); // Update translate

    swiper.setTranslate(data.currentTranslate);
  }

  function onTouchEnd(event) {
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      range__slidesGrid,
      enabled
    } = swiper;
    if (!enabled) return;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;

    if (data.allowTouchCallbacks) {
      swiper.emit('touchEnd', e);
    }

    data.allowTouchCallbacks = false;

    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }

      data.isMoved = false;
      data.startMoving = false;
      return;
    } // Return Grab Cursor


    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowrange__slideNext === true || swiper.allowrange__slidePrev === true)) {
      swiper.setGrabCursor(false);
    } // Time diff


    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

    if (swiper.allowClick) {
      const pathTree = e.path || e.composedPath && e.composedPath();
      swiper.updateClickedrange__slide(pathTree && pathTree[0] || e.target);
      swiper.emit('tap click', e);

      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit('doubleTap doubleClick', e);
      }
    }

    data.lastClickTime = now();
    nextTick(() => {
      if (!swiper.destroyed) swiper.allowClick = true;
    });

    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }

    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;

    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }

    if (params.cssMode) {
      return;
    }

    if (swiper.params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos
      });
      return;
    } // Find current range__slide


    let stopIndex = 0;
    let groupSize = swiper.range__slidesSizesGrid[0];

    for (let i = 0; i < range__slidesGrid.length; i += i < params.range__slidesPerGroupSkip ? 1 : params.range__slidesPerGroup) {
      const increment = i < params.range__slidesPerGroupSkip - 1 ? 1 : params.range__slidesPerGroup;

      if (typeof range__slidesGrid[i + increment] !== 'undefined') {
        if (currentPos >= range__slidesGrid[i] && currentPos < range__slidesGrid[i + increment]) {
          stopIndex = i;
          groupSize = range__slidesGrid[i + increment] - range__slidesGrid[i];
        }
      } else if (currentPos >= range__slidesGrid[i]) {
        stopIndex = i;
        groupSize = range__slidesGrid[range__slidesGrid.length - 1] - range__slidesGrid[range__slidesGrid.length - 2];
      }
    } // Find current range__slide size


    const ratio = (currentPos - range__slidesGrid[stopIndex]) / groupSize;
    const increment = stopIndex < params.range__slidesPerGroupSkip - 1 ? 1 : params.range__slidesPerGroup;

    if (timeDiff > params.longSwipesMs) {
      // Long touches
      if (!params.longSwipes) {
        swiper.range__slideTo(swiper.activeIndex);
        return;
      }

      if (swiper.swipeDirection === 'next') {
        if (ratio >= params.longSwipesRatio) swiper.range__slideTo(stopIndex + increment);else swiper.range__slideTo(stopIndex);
      }

      if (swiper.swipeDirection === 'prev') {
        if (ratio > 1 - params.longSwipesRatio) swiper.range__slideTo(stopIndex + increment);else swiper.range__slideTo(stopIndex);
      }
    } else {
      // Short swipes
      if (!params.shortSwipes) {
        swiper.range__slideTo(swiper.activeIndex);
        return;
      }

      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === 'next') {
          swiper.range__slideTo(stopIndex + increment);
        }

        if (swiper.swipeDirection === 'prev') {
          swiper.range__slideTo(stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.range__slideTo(stopIndex + increment);
      } else {
        swiper.range__slideTo(stopIndex);
      }
    }
  }

  function onResize() {
    const swiper = this;
    const {
      params,
      el
    } = swiper;
    if (el && el.offsetWidth === 0) return; // Breakpoints

    if (params.breakpoints) {
      swiper.setBreakpoint();
    } // Save locks


    const {
      allowrange__slideNext,
      allowrange__slidePrev,
      snapGrid
    } = swiper; // Disable locks on resize

    swiper.allowrange__slideNext = true;
    swiper.allowrange__slidePrev = true;
    swiper.updateSize();
    swiper.updaterange__slides();
    swiper.updaterange__slidesClasses();

    if ((params.range__slidesPerView === 'auto' || params.range__slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredrange__slides) {
      swiper.range__slideTo(swiper.range__slides.length - 1, 0, false, true);
    } else {
      swiper.range__slideTo(swiper.activeIndex, 0, false, true);
    }

    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      swiper.autoplay.run();
    } // Return locks after resize


    swiper.allowrange__slidePrev = allowrange__slidePrev;
    swiper.allowrange__slideNext = allowrange__slideNext;

    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }

  function onClick(e) {
    const swiper = this;
    if (!swiper.enabled) return;

    if (!swiper.allowClick) {
      if (swiper.params.preventClicks) e.preventDefault();

      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }

  function onScroll() {
    const swiper = this;
    const {
      wrapperEl,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled) return;
    swiper.previousTranslate = swiper.translate;

    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    } // eslint-disable-next-line


    if (swiper.translate === -0) swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updaterange__slidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }

    if (newProgress !== swiper.progress) {
      swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
    }

    swiper.emit('setTranslate', swiper.translate, false);
  }

  let dummyEventAttached = false;

  function dummyEventListener() {}

  const events = (swiper, method) => {
    const document = getDocument();
    const {
      params,
      touchEvents,
      el,
      wrapperEl,
      device,
      support
    } = swiper;
    const capture = !!params.nested;
    const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
    const swiperMethod = method; // Touch Events

    if (!support.touch) {
      el[domMethod](touchEvents.start, swiper.onTouchStart, false);
      document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
      document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
    } else {
      const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;
      el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
      el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
        passive: false,
        capture
      } : capture);
      el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

      if (touchEvents.cancel) {
        el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
      }
    } // Prevent Links Clicks


    if (params.preventClicks || params.preventClicksPropagation) {
      el[domMethod]('click', swiper.onClick, true);
    }

    if (params.cssMode) {
      wrapperEl[domMethod]('scroll', swiper.onScroll);
    } // Resize handler


    if (params.updateOnWindowResize) {
      swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
    } else {
      swiper[swiperMethod]('observerUpdate', onResize, true);
    }
  };

  function attachEvents() {
    const swiper = this;
    const document = getDocument();
    const {
      params,
      support
    } = swiper;
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);

    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }

    swiper.onClick = onClick.bind(swiper);

    if (support.touch && !dummyEventAttached) {
      document.addEventListener('touchstart', dummyEventListener);
      dummyEventAttached = true;
    }

    events(swiper, 'on');
  }

  function detachEvents() {
    const swiper = this;
    events(swiper, 'off');
  }

  var events$1 = {
    attachEvents,
    detachEvents
  };

  const isGridEnabled = (swiper, params) => {
    return swiper.grid && params.grid && params.grid.rows > 1;
  };

  function setBreakpoint() {
    const swiper = this;
    const {
      activeIndex,
      initialized,
      loopedrange__slides = 0,
      params,
      $el
    } = swiper;
    const breakpoints = params.breakpoints;
    if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

    const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
    if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
    const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled(swiper, params);
    const isMultiRow = isGridEnabled(swiper, breakpointParams);
    const wasEnabled = params.enabled;

    if (wasMultiRow && !isMultiRow) {
      $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      $el.addClass(`${params.containerModifierClass}grid`);

      if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
        $el.addClass(`${params.containerModifierClass}grid-column`);
      }

      swiper.emitContainerClasses();
    }

    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    const needsReLoop = params.loop && (breakpointParams.range__slidesPerView !== params.range__slidesPerView || directionChanged);

    if (directionChanged && initialized) {
      swiper.changeDirection();
    }

    extend(swiper.params, breakpointParams);
    const isEnabled = swiper.params.enabled;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowrange__slideNext: swiper.params.allowrange__slideNext,
      allowrange__slidePrev: swiper.params.allowrange__slidePrev
    });

    if (wasEnabled && !isEnabled) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled) {
      swiper.enable();
    }

    swiper.currentBreakpoint = breakpoint;
    swiper.emit('_beforeBreakpoint', breakpointParams);

    if (needsReLoop && initialized) {
      swiper.loopDestroy();
      swiper.loopCreate();
      swiper.updaterange__slides();
      swiper.range__slideTo(activeIndex - loopedrange__slides + swiper.loopedrange__slides, 0, false);
    }

    swiper.emit('breakpoint', breakpointParams);
  }

  function getBreakpoint(breakpoints, base = 'window', containerEl) {
    if (!breakpoints || base === 'container' && !containerEl) return undefined;
    let breakpoint = false;
    const window = getWindow();
    const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints).map(point => {
      if (typeof point === 'string' && point.indexOf('@') === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point
        };
      }

      return {
        value: point,
        point
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

    for (let i = 0; i < points.length; i += 1) {
      const {
        point,
        value
      } = points[i];

      if (base === 'window') {
        if (window.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }

    return breakpoint || 'max';
  }

  var breakpoints = {
    setBreakpoint,
    getBreakpoint
  };

  function prepareClasses(entries, prefix) {
    const resultClasses = [];
    entries.forEach(item => {
      if (typeof item === 'object') {
        Object.keys(item).forEach(classNames => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === 'string') {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }

  function addClasses() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      $el,
      device,
      support
    } = swiper; // prettier-ignore

    const suffixes = prepareClasses(['initialized', params.direction, {
      'pointer-events': !support.touch
    }, {
      'free-mode': swiper.params.freeMode && params.freeMode.enabled
    }, {
      'autoheight': params.autoHeight
    }, {
      'rtl': rtl
    }, {
      'grid': params.grid && params.grid.rows > 1
    }, {
      'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
    }, {
      'android': device.android
    }, {
      'ios': device.ios
    }, {
      'css-mode': params.cssMode
    }, {
      'centered': params.cssMode && params.centeredrange__slides
    }], params.containerModifierClass);
    classNames.push(...suffixes);
    $el.addClass([...classNames].join(' '));
    swiper.emitContainerClasses();
  }

  function removeClasses() {
    const swiper = this;
    const {
      $el,
      classNames
    } = swiper;
    $el.removeClass(classNames.join(' '));
    swiper.emitContainerClasses();
  }

  var classes = {
    addClasses,
    removeClasses
  };

  function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
    const window = getWindow();
    let image;

    function onReady() {
      if (callback) callback();
    }

    const isPicture = $(imageEl).parent('picture')[0];

    if (!isPicture && (!imageEl.complete || !checkForComplete)) {
      if (src) {
        image = new window.Image();
        image.onload = onReady;
        image.onerror = onReady;

        if (sizes) {
          image.sizes = sizes;
        }

        if (srcset) {
          image.srcset = srcset;
        }

        if (src) {
          image.src = src;
        }
      } else {
        onReady();
      }
    } else {
      // image already loaded...
      onReady();
    }
  }

  function preloadImages() {
    const swiper = this;
    swiper.imagesToLoad = swiper.$el.find('img');

    function onReady() {
      if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
      if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

      if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
        if (swiper.params.updateOnImagesReady) swiper.update();
        swiper.emit('imagesReady');
      }
    }

    for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
      const imageEl = swiper.imagesToLoad[i];
      swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
    }
  }

  var images = {
    loadImage,
    preloadImages
  };

  function checkOverflow() {
    const swiper = this;
    const {
      isLocked: wasLocked,
      params
    } = swiper;
    const {
      range__slidesOffsetBefore
    } = params;

    if (range__slidesOffsetBefore) {
      const lastrange__slideIndex = swiper.range__slides.length - 1;
      const lastrange__slideRightEdge = swiper.range__slidesGrid[lastrange__slideIndex] + swiper.range__slidesSizesGrid[lastrange__slideIndex] + range__slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastrange__slideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }

    if (params.allowrange__slideNext === true) {
      swiper.allowrange__slideNext = !swiper.isLocked;
    }

    if (params.allowrange__slidePrev === true) {
      swiper.allowrange__slidePrev = !swiper.isLocked;
    }

    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }

    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
    }
  }

  var checkOverflow$1 = {
    checkOverflow
  };

  var defaults = {
    init: true,
    direction: 'horizontal',
    touchEventsTarget: 'wrapper',
    initialrange__slide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    resizeObserver: true,
    nested: false,
    createElements: false,
    enabled: true,
    focusableElements: 'input, select, option, textarea, button, video, label',
    // Overrides
    width: null,
    height: null,
    //
    preventInteractionOnTransition: false,
    // ssr
    userAgent: null,
    url: null,
    // To support iOS's swipe-to-go-back gesture (when being used in-app).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,
    // Autoheight
    autoHeight: false,
    // Set wrapper width
    setWrapperSize: false,
    // Virtual Translate
    virtualTranslate: false,
    // Effects
    effect: 'range__slide',
    // 'range__slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
    // Breakpoints
    breakpoints: undefined,
    breakpointsBase: 'window',
    // range__slides grid
    spaceBetween: 0,
    range__slidesPerView: 1,
    range__slidesPerGroup: 1,
    range__slidesPerGroupSkip: 0,
    range__slidesPerGroupAuto: false,
    centeredrange__slides: false,
    centeredrange__slidesBounds: false,
    range__slidesOffsetBefore: 0,
    // in px
    range__slidesOffsetAfter: 0,
    // in px
    normalizerange__slideIndex: true,
    centerInsufficientrange__slides: false,
    // Disable swiper and hide navigation when container not overflow
    watchOverflow: true,
    // Round length
    roundLengths: false,
    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 0,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,
    // Unique Navigation Elements
    uniqueNavElements: true,
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    // Progress
    watchrange__slidesProgress: false,
    // Cursor
    grabCursor: false,
    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    range__slideToClickedrange__slide: false,
    // Images
    preloadImages: true,
    updateOnImagesReady: true,
    // loop
    loop: false,
    loopAdditionalrange__slides: 0,
    loopedrange__slides: null,
    loopFillGroupWithBlank: false,
    loopPreventsrange__slide: true,
    // rewind
    rewind: false,
    // Swiping/no swiping
    allowrange__slidePrev: true,
    allowrange__slideNext: true,
    swipeHandler: null,
    // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: 'swiper-no-swiping',
    noSwipingSelector: null,
    // Passive Listeners
    passiveListeners: true,
    // NS
    containerModifierClass: 'swiper-',
    // NEW
    range__slideClass: 'swiper-range__slide',
    range__slideBlankClass: 'swiper-range__slide-invisible-blank',
    range__slideActiveClass: 'swiper-range__slide-active',
    range__slideDuplicateActiveClass: 'swiper-range__slide-duplicate-active',
    range__slideVisibleClass: 'swiper-range__slide-visible',
    range__slideDuplicateClass: 'swiper-range__slide-duplicate',
    range__slideNextClass: 'swiper-range__slide-next',
    range__slideDuplicateNextClass: 'swiper-range__slide-duplicate-next',
    range__slidePrevClass: 'swiper-range__slide-prev',
    range__slideDuplicatePrevClass: 'swiper-range__slide-duplicate-prev',
    wrapperClass: 'swiper-wrapper',
    // Callbacks
    runCallbacksOnInit: true,
    // Internals
    _emitClasses: false
  };

  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj = {}) {
      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];

      if (typeof moduleParams !== 'object' || moduleParams === null) {
        extend(allModulesParams, obj);
        return;
      }

      if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
        params[moduleParamName] = {
          auto: true
        };
      }

      if (!(moduleParamName in params && 'enabled' in moduleParams)) {
        extend(allModulesParams, obj);
        return;
      }

      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true
        };
      }

      if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
        params[moduleParamName].enabled = true;
      }

      if (!params[moduleParamName]) params[moduleParamName] = {
        enabled: false
      };
      extend(allModulesParams, obj);
    };
  }

  /* eslint no-param-reassign: "off" */
  const prototypes = {
    eventsEmitter,
    update,
    translate,
    transition,
    range__slide,
    loop,
    grabCursor,
    events: events$1,
    breakpoints,
    checkOverflow: checkOverflow$1,
    classes,
    images
  };
  const extendedDefaults = {};

  class Swiper {
    constructor(...args) {
      let el;
      let params;

      if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
        params = args[0];
      } else {
        [el, params] = args;
      }

      if (!params) params = {};
      params = extend({}, params);
      if (el && !params.el) params.el = el;

      if (params.el && $(params.el).length > 1) {
        const swipers = [];
        $(params.el).each(containerEl => {
          const newParams = extend({}, params, {
            el: containerEl
          });
          swipers.push(new Swiper(newParams));
        });
        return swipers;
      } // Swiper Instance


      const swiper = this;
      swiper.__swiper__ = true;
      swiper.support = getSupport();
      swiper.device = getDevice({
        userAgent: params.userAgent
      });
      swiper.browser = getBrowser();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];

      if (params.modules && Array.isArray(params.modules)) {
        swiper.modules.push(...params.modules);
      }

      const allModulesParams = {};
      swiper.modules.forEach(mod => {
        mod({
          swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper)
        });
      }); // Extend defaults with modules params

      const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params

      swiper.params = extend({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = extend({}, swiper.params);
      swiper.passedParams = extend({}, params); // add event listeners

      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach(eventName => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }

      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      } // Save Dom lib


      swiper.$ = $; // Extend Swiper

      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // range__slides
        range__slides: $(),
        range__slidesGrid: [],
        snapGrid: [],
        range__slidesSizesGrid: [],

        // isDirection
        isHorizontal() {
          return swiper.params.direction === 'horizontal';
        },

        isVertical() {
          return swiper.params.direction === 'vertical';
        },

        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        // Locks
        allowrange__slideNext: swiper.params.allowrange__slideNext,
        allowrange__slidePrev: swiper.params.allowrange__slidePrev,
        // Touch Events
        touchEvents: function touchEvents() {
          const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
          const desktop = ['pointerdown', 'pointermove', 'pointerup'];
          swiper.touchEventsTouch = {
            start: touch[0],
            move: touch[1],
            end: touch[2],
            cancel: touch[3]
          };
          swiper.touchEventsDesktop = {
            start: desktop[0],
            move: desktop[1],
            end: desktop[2]
          };
          return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
        }(),
        touchEventsData: {
          isTouched: undefined,
          isMoved: undefined,
          allowTouchCallbacks: undefined,
          touchStartTime: undefined,
          isScrolling: undefined,
          currentTranslate: undefined,
          startTranslate: undefined,
          allowThresholdMove: undefined,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: now(),
          clickTimeout: undefined,
          // Velocities
          velocities: [],
          allowMomentumBounce: undefined,
          isTouchEvent: undefined,
          startMoving: undefined
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0
      });
      swiper.emit('_swiper'); // Init

      if (swiper.params.init) {
        swiper.init();
      } // Return app instance


      return swiper;
    }

    enable() {
      const swiper = this;
      if (swiper.enabled) return;
      swiper.enabled = true;

      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }

      swiper.emit('enable');
    }

    disable() {
      const swiper = this;
      if (!swiper.enabled) return;
      swiper.enabled = false;

      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }

      swiper.emit('disable');
    }

    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updaterange__slidesClasses();
    }

    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const cls = swiper.el.className.split(' ').filter(className => {
        return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
      });
      swiper.emit('_containerClasses', cls.join(' '));
    }

    getrange__slideClasses(range__slideEl) {
      const swiper = this;
      return range__slideEl.className.split(' ').filter(className => {
        return className.indexOf('swiper-range__slide') === 0 || className.indexOf(swiper.params.range__slideClass) === 0;
      }).join(' ');
    }

    emitrange__slidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const updates = [];
      swiper.range__slides.each(range__slideEl => {
        const classNames = swiper.getrange__slideClasses(range__slideEl);
        updates.push({
          range__slideEl,
          classNames
        });
        swiper.emit('_range__slideClass', range__slideEl, classNames);
      });
      swiper.emit('_range__slideClasses', updates);
    }

    range__slidesPerViewDynamic(view = 'current', exact = false) {
      const swiper = this;
      const {
        params,
        range__slides,
        range__slidesGrid,
        range__slidesSizesGrid,
        size: swiperSize,
        activeIndex
      } = swiper;
      let spv = 1;

      if (params.centeredrange__slides) {
        let range__slideSize = range__slides[activeIndex].swiperrange__slideSize;
        let breakLoop;

        for (let i = activeIndex + 1; i < range__slides.length; i += 1) {
          if (range__slides[i] && !breakLoop) {
            range__slideSize += range__slides[i].swiperrange__slideSize;
            spv += 1;
            if (range__slideSize > swiperSize) breakLoop = true;
          }
        }

        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (range__slides[i] && !breakLoop) {
            range__slideSize += range__slides[i].swiperrange__slideSize;
            spv += 1;
            if (range__slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        // eslint-disable-next-line
        if (view === 'current') {
          for (let i = activeIndex + 1; i < range__slides.length; i += 1) {
            const range__slideInView = exact ? range__slidesGrid[i] + range__slidesSizesGrid[i] - range__slidesGrid[activeIndex] < swiperSize : range__slidesGrid[i] - range__slidesGrid[activeIndex] < swiperSize;

            if (range__slideInView) {
              spv += 1;
            }
          }
        } else {
          // previous
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            const range__slideInView = range__slidesGrid[activeIndex] - range__slidesGrid[i] < swiperSize;

            if (range__slideInView) {
              spv += 1;
            }
          }
        }
      }

      return spv;
    }

    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const {
        snapGrid,
        params
      } = swiper; // Breakpoints

      if (params.breakpoints) {
        swiper.setBreakpoint();
      }

      swiper.updateSize();
      swiper.updaterange__slides();
      swiper.updateProgress();
      swiper.updaterange__slidesClasses();

      function setTranslate() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updaterange__slidesClasses();
      }

      let translated;

      if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
        setTranslate();

        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((swiper.params.range__slidesPerView === 'auto' || swiper.params.range__slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredrange__slides) {
          translated = swiper.range__slideTo(swiper.range__slides.length - 1, 0, false, true);
        } else {
          translated = swiper.range__slideTo(swiper.activeIndex, 0, false, true);
        }

        if (!translated) {
          setTranslate();
        }
      }

      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }

      swiper.emit('update');
    }

    changeDirection(newDirection, needUpdate = true) {
      const swiper = this;
      const currentDirection = swiper.params.direction;

      if (!newDirection) {
        // eslint-disable-next-line
        newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
      }

      if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
        return swiper;
      }

      swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.range__slides.each(range__slideEl => {
        if (newDirection === 'vertical') {
          range__slideEl.style.width = '';
        } else {
          range__slideEl.style.height = '';
        }
      });
      swiper.emit('changeDirection');
      if (needUpdate) swiper.update();
      return swiper;
    }

    mount(el) {
      const swiper = this;
      if (swiper.mounted) return true; // Find el

      const $el = $(el || swiper.params.el);
      el = $el[0];

      if (!el) {
        return false;
      }

      el.swiper = swiper;

      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
      };

      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

          res.children = options => $el.children(options);

          return res;
        }

        return $el.children(getWrapperSelector());
      }; // Find Wrapper


      let $wrapperEl = getWrapper();

      if ($wrapperEl.length === 0 && swiper.params.createElements) {
        const document = getDocument();
        const wrapper = document.createElement('div');
        $wrapperEl = $(wrapper);
        wrapper.className = swiper.params.wrapperClass;
        $el.append(wrapper);
        $el.children(`.${swiper.params.range__slideClass}`).each(range__slideEl => {
          $wrapperEl.append(range__slideEl);
        });
      }

      Object.assign(swiper, {
        $el,
        el,
        $wrapperEl,
        wrapperEl: $wrapperEl[0],
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
        rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
        wrongRTL: $wrapperEl.css('display') === '-webkit-box'
      });
      return true;
    }

    init(el) {
      const swiper = this;
      if (swiper.initialized) return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false) return swiper;
      swiper.emit('beforeInit'); // Set breakpoint

      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      } // Add Classes


      swiper.addClasses(); // Create loop

      if (swiper.params.loop) {
        swiper.loopCreate();
      } // Update size


      swiper.updateSize(); // Update range__slides

      swiper.updaterange__slides();

      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      } // Set Grab Cursor


      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }

      if (swiper.params.preloadImages) {
        swiper.preloadImages();
      } // range__slide To Initial range__slide


      if (swiper.params.loop) {
        swiper.range__slideTo(swiper.params.initialrange__slide + swiper.loopedrange__slides, 0, swiper.params.runCallbacksOnInit, false, true);
      } else {
        swiper.range__slideTo(swiper.params.initialrange__slide, 0, swiper.params.runCallbacksOnInit, false, true);
      } // Attach events


      swiper.attachEvents(); // Init Flag

      swiper.initialized = true; // Emit

      swiper.emit('init');
      swiper.emit('afterInit');
      return swiper;
    }

    destroy(deleteInstance = true, cleanStyles = true) {
      const swiper = this;
      const {
        params,
        $el,
        $wrapperEl,
        range__slides
      } = swiper;

      if (typeof swiper.params === 'undefined' || swiper.destroyed) {
        return null;
      }

      swiper.emit('beforeDestroy'); // Init Flag

      swiper.initialized = false; // Detach events

      swiper.detachEvents(); // Destroy loop

      if (params.loop) {
        swiper.loopDestroy();
      } // Cleanup styles


      if (cleanStyles) {
        swiper.removeClasses();
        $el.removeAttr('style');
        $wrapperEl.removeAttr('style');

        if (range__slides && range__slides.length) {
          range__slides.removeClass([params.range__slideVisibleClass, params.range__slideActiveClass, params.range__slideNextClass, params.range__slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-range__slide-index');
        }
      }

      swiper.emit('destroy'); // Detach emitter events

      Object.keys(swiper.eventsListeners).forEach(eventName => {
        swiper.off(eventName);
      });

      if (deleteInstance !== false) {
        swiper.$el[0].swiper = null;
        deleteProps(swiper);
      }

      swiper.destroyed = true;
      return null;
    }

    static extendDefaults(newDefaults) {
      extend(extendedDefaults, newDefaults);
    }

    static get extendedDefaults() {
      return extendedDefaults;
    }

    static get defaults() {
      return defaults;
    }

    static installModule(mod) {
      if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
      const modules = Swiper.prototype.__modules__;

      if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
        modules.push(mod);
      }
    }

    static use(module) {
      if (Array.isArray(module)) {
        module.forEach(m => Swiper.installModule(m));
        return Swiper;
      }

      Swiper.installModule(module);
      return Swiper;
    }

  }

  Object.keys(prototypes).forEach(prototypeGroup => {
    Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
      Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
  });
  Swiper.use([Resize, Observer]);

  function Virtual({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      virtual: {
        enabled: false,
        range__slides: [],
        cache: true,
        renderrange__slide: null,
        renderExternal: null,
        renderExternalUpdate: true,
        addrange__slidesBefore: 0,
        addrange__slidesAfter: 0
      }
    });
    let cssModeTimeout;
    swiper.virtual = {
      cache: {},
      from: undefined,
      to: undefined,
      range__slides: [],
      offset: 0,
      range__slidesGrid: []
    };

    function renderrange__slide(range__slide, index) {
      const params = swiper.params.virtual;

      if (params.cache && swiper.virtual.cache[index]) {
        return swiper.virtual.cache[index];
      }

      const $range__slideEl = params.renderrange__slide ? $(params.renderrange__slide.call(swiper, range__slide, index)) : $(`<div class="${swiper.params.range__slideClass}" data-swiper-range__slide-index="${index}">${range__slide}</div>`);
      if (!$range__slideEl.attr('data-swiper-range__slide-index')) $range__slideEl.attr('data-swiper-range__slide-index', index);
      if (params.cache) swiper.virtual.cache[index] = $range__slideEl;
      return $range__slideEl;
    }

    function update(force) {
      const {
        range__slidesPerView,
        range__slidesPerGroup,
        centeredrange__slides
      } = swiper.params;
      const {
        addrange__slidesBefore,
        addrange__slidesAfter
      } = swiper.params.virtual;
      const {
        from: previousFrom,
        to: previousTo,
        range__slides,
        range__slidesGrid: previousrange__slidesGrid,
        offset: previousOffset
      } = swiper.virtual;

      if (!swiper.params.cssMode) {
        swiper.updateActiveIndex();
      }

      const activeIndex = swiper.activeIndex || 0;
      let offsetProp;
      if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
      let range__slidesAfter;
      let range__slidesBefore;

      if (centeredrange__slides) {
        range__slidesAfter = Math.floor(range__slidesPerView / 2) + range__slidesPerGroup + addrange__slidesAfter;
        range__slidesBefore = Math.floor(range__slidesPerView / 2) + range__slidesPerGroup + addrange__slidesBefore;
      } else {
        range__slidesAfter = range__slidesPerView + (range__slidesPerGroup - 1) + addrange__slidesAfter;
        range__slidesBefore = range__slidesPerGroup + addrange__slidesBefore;
      }

      const from = Math.max((activeIndex || 0) - range__slidesBefore, 0);
      const to = Math.min((activeIndex || 0) + range__slidesAfter, range__slides.length - 1);
      const offset = (swiper.range__slidesGrid[from] || 0) - (swiper.range__slidesGrid[0] || 0);
      Object.assign(swiper.virtual, {
        from,
        to,
        offset,
        range__slidesGrid: swiper.range__slidesGrid
      });

      function onRendered() {
        swiper.updaterange__slides();
        swiper.updateProgress();
        swiper.updaterange__slidesClasses();

        if (swiper.lazy && swiper.params.lazy.enabled) {
          swiper.lazy.load();
        }
      }

      if (previousFrom === from && previousTo === to && !force) {
        if (swiper.range__slidesGrid !== previousrange__slidesGrid && offset !== previousOffset) {
          swiper.range__slides.css(offsetProp, `${offset}px`);
        }

        swiper.updateProgress();
        return;
      }

      if (swiper.params.virtual.renderExternal) {
        swiper.params.virtual.renderExternal.call(swiper, {
          offset,
          from,
          to,
          range__slides: function getrange__slides() {
            const range__slidesToRender = [];

            for (let i = from; i <= to; i += 1) {
              range__slidesToRender.push(range__slides[i]);
            }

            return range__slidesToRender;
          }()
        });

        if (swiper.params.virtual.renderExternalUpdate) {
          onRendered();
        }

        return;
      }

      const prependIndexes = [];
      const appendIndexes = [];

      if (force) {
        swiper.$wrapperEl.find(`.${swiper.params.range__slideClass}`).remove();
      } else {
        for (let i = previousFrom; i <= previousTo; i += 1) {
          if (i < from || i > to) {
            swiper.$wrapperEl.find(`.${swiper.params.range__slideClass}[data-swiper-range__slide-index="${i}"]`).remove();
          }
        }
      }

      for (let i = 0; i < range__slides.length; i += 1) {
        if (i >= from && i <= to) {
          if (typeof previousTo === 'undefined' || force) {
            appendIndexes.push(i);
          } else {
            if (i > previousTo) appendIndexes.push(i);
            if (i < previousFrom) prependIndexes.push(i);
          }
        }
      }

      appendIndexes.forEach(index => {
        swiper.$wrapperEl.append(renderrange__slide(range__slides[index], index));
      });
      prependIndexes.sort((a, b) => b - a).forEach(index => {
        swiper.$wrapperEl.prepend(renderrange__slide(range__slides[index], index));
      });
      swiper.$wrapperEl.children('.swiper-range__slide').css(offsetProp, `${offset}px`);
      onRendered();
    }

    function appendrange__slide(range__slides) {
      if (typeof range__slides === 'object' && 'length' in range__slides) {
        for (let i = 0; i < range__slides.length; i += 1) {
          if (range__slides[i]) swiper.virtual.range__slides.push(range__slides[i]);
        }
      } else {
        swiper.virtual.range__slides.push(range__slides);
      }

      update(true);
    }

    function prependrange__slide(range__slides) {
      const activeIndex = swiper.activeIndex;
      let newActiveIndex = activeIndex + 1;
      let numberOfNewrange__slides = 1;

      if (Array.isArray(range__slides)) {
        for (let i = 0; i < range__slides.length; i += 1) {
          if (range__slides[i]) swiper.virtual.range__slides.unshift(range__slides[i]);
        }

        newActiveIndex = activeIndex + range__slides.length;
        numberOfNewrange__slides = range__slides.length;
      } else {
        swiper.virtual.range__slides.unshift(range__slides);
      }

      if (swiper.params.virtual.cache) {
        const cache = swiper.virtual.cache;
        const newCache = {};
        Object.keys(cache).forEach(cachedIndex => {
          const $cachedEl = cache[cachedIndex];
          const cachedElIndex = $cachedEl.attr('data-swiper-range__slide-index');

          if (cachedElIndex) {
            $cachedEl.attr('data-swiper-range__slide-index', parseInt(cachedElIndex, 10) + numberOfNewrange__slides);
          }

          newCache[parseInt(cachedIndex, 10) + numberOfNewrange__slides] = $cachedEl;
        });
        swiper.virtual.cache = newCache;
      }

      update(true);
      swiper.range__slideTo(newActiveIndex, 0);
    }

    function removerange__slide(range__slidesIndexes) {
      if (typeof range__slidesIndexes === 'undefined' || range__slidesIndexes === null) return;
      let activeIndex = swiper.activeIndex;

      if (Array.isArray(range__slidesIndexes)) {
        for (let i = range__slidesIndexes.length - 1; i >= 0; i -= 1) {
          swiper.virtual.range__slides.splice(range__slidesIndexes[i], 1);

          if (swiper.params.virtual.cache) {
            delete swiper.virtual.cache[range__slidesIndexes[i]];
          }

          if (range__slidesIndexes[i] < activeIndex) activeIndex -= 1;
          activeIndex = Math.max(activeIndex, 0);
        }
      } else {
        swiper.virtual.range__slides.splice(range__slidesIndexes, 1);

        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[range__slidesIndexes];
        }

        if (range__slidesIndexes < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }

      update(true);
      swiper.range__slideTo(activeIndex, 0);
    }

    function removeAllrange__slides() {
      swiper.virtual.range__slides = [];

      if (swiper.params.virtual.cache) {
        swiper.virtual.cache = {};
      }

      update(true);
      swiper.range__slideTo(0, 0);
    }

    on('beforeInit', () => {
      if (!swiper.params.virtual.enabled) return;
      swiper.virtual.range__slides = swiper.params.virtual.range__slides;
      swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
      swiper.params.watchrange__slidesProgress = true;
      swiper.originalParams.watchrange__slidesProgress = true;

      if (!swiper.params.initialrange__slide) {
        update();
      }
    });
    on('setTranslate', () => {
      if (!swiper.params.virtual.enabled) return;

      if (swiper.params.cssMode && !swiper._immediateVirtual) {
        clearTimeout(cssModeTimeout);
        cssModeTimeout = setTimeout(() => {
          update();
        }, 100);
      } else {
        update();
      }
    });
    on('init update resize', () => {
      if (!swiper.params.virtual.enabled) return;

      if (swiper.params.cssMode) {
        setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
      }
    });
    Object.assign(swiper.virtual, {
      appendrange__slide,
      prependrange__slide,
      removerange__slide,
      removeAllrange__slides,
      update
    });
  }

  /* eslint-disable consistent-return */
  function Keyboard({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const document = getDocument();
    const window = getWindow();
    swiper.keyboard = {
      enabled: false
    };
    extendParams({
      keyboard: {
        enabled: false,
        onlyInViewport: true,
        pageUpDown: true
      }
    });

    function handle(event) {
      if (!swiper.enabled) return;
      const {
        rtlTranslate: rtl
      } = swiper;
      let e = event;
      if (e.originalEvent) e = e.originalEvent; // jquery fix

      const kc = e.keyCode || e.charCode;
      const pageUpDown = swiper.params.keyboard.pageUpDown;
      const isPageUp = pageUpDown && kc === 33;
      const isPageDown = pageUpDown && kc === 34;
      const isArrowLeft = kc === 37;
      const isArrowRight = kc === 39;
      const isArrowUp = kc === 38;
      const isArrowDown = kc === 40; // Directions locks

      if (!swiper.allowrange__slideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
        return false;
      }

      if (!swiper.allowrange__slidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
        return false;
      }

      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return undefined;
      }

      if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
        return undefined;
      }

      if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
        let inView = false; // Check that swiper should be inside of visible area of window

        if (swiper.$el.parents(`.${swiper.params.range__slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.range__slideActiveClass}`).length === 0) {
          return undefined;
        }

        const $el = swiper.$el;
        const swiperWidth = $el[0].clientWidth;
        const swiperHeight = $el[0].clientHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const swiperOffset = swiper.$el.offset();
        if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
        const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];

          if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
            if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

            inView = true;
          }
        }

        if (!inView) return undefined;
      }

      if (swiper.isHorizontal()) {
        if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
          if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        }

        if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.range__slideNext();
        if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.range__slidePrev();
      } else {
        if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
          if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        }

        if (isPageDown || isArrowDown) swiper.range__slideNext();
        if (isPageUp || isArrowUp) swiper.range__slidePrev();
      }

      emit('keyPress', kc);
      return undefined;
    }

    function enable() {
      if (swiper.keyboard.enabled) return;
      $(document).on('keydown', handle);
      swiper.keyboard.enabled = true;
    }

    function disable() {
      if (!swiper.keyboard.enabled) return;
      $(document).off('keydown', handle);
      swiper.keyboard.enabled = false;
    }

    on('init', () => {
      if (swiper.params.keyboard.enabled) {
        enable();
      }
    });
    on('destroy', () => {
      if (swiper.keyboard.enabled) {
        disable();
      }
    });
    Object.assign(swiper.keyboard, {
      enable,
      disable
    });
  }

  /* eslint-disable consistent-return */
  function Mousewheel({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const window = getWindow();
    extendParams({
      mousewheel: {
        enabled: false,
        releaseOnEdges: false,
        invert: false,
        forceToAxis: false,
        sensitivity: 1,
        eventsTarget: 'container',
        thresholdDelta: null,
        thresholdTime: null
      }
    });
    swiper.mousewheel = {
      enabled: false
    };
    let timeout;
    let lastScrollTime = now();
    let lastEventBeforeSnap;
    const recentWheelEvents = [];

    function normalize(e) {
      // Reasonable defaults
      const PIXEL_STEP = 10;
      const LINE_HEIGHT = 40;
      const PAGE_HEIGHT = 800;
      let sX = 0;
      let sY = 0; // spinX, spinY

      let pX = 0;
      let pY = 0; // pixelX, pixelY
      // Legacy

      if ('detail' in e) {
        sY = e.detail;
      }

      if ('wheelDelta' in e) {
        sY = -e.wheelDelta / 120;
      }

      if ('wheelDeltaY' in e) {
        sY = -e.wheelDeltaY / 120;
      }

      if ('wheelDeltaX' in e) {
        sX = -e.wheelDeltaX / 120;
      } // side scrolling on FF with DOMMouseScroll


      if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
      }

      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;

      if ('deltaY' in e) {
        pY = e.deltaY;
      }

      if ('deltaX' in e) {
        pX = e.deltaX;
      }

      if (e.shiftKey && !pX) {
        // if user scrolls with shift he wants horizontal scroll
        pX = pY;
        pY = 0;
      }

      if ((pX || pY) && e.deltaMode) {
        if (e.deltaMode === 1) {
          // delta in LINE units
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else {
          // delta in PAGE units
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      } // Fall-back if spin cannot be determined


      if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
      }

      if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
      }

      return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY
      };
    }

    function handleMouseEnter() {
      if (!swiper.enabled) return;
      swiper.mouseEntered = true;
    }

    function handleMouseLeave() {
      if (!swiper.enabled) return;
      swiper.mouseEntered = false;
    }

    function animaterange__slider(newEvent) {
      if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
        // Prevent if delta of wheel scroll delta is below configured threshold
        return false;
      }

      if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
        // Prevent if time between scrolls is below configured threshold
        return false;
      } // If the movement is NOT big enough and
      // if the last time the user scrolled was too close to the current one (avoid continuously triggering the range__slider):
      //   Don't go any further (avoid insignificant scroll movement).


      if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
        // Return false as a default
        return true;
      } // If user is scrolling towards the end:
      //   If the range__slider hasn't hit the latest range__slide or
      //   if the range__slider is a loop and
      //   if the range__slider isn't moving right now:
      //     Go to next range__slide and
      //     emit a scroll event.
      // Else (the user is scrolling towards the beginning) and
      // if the range__slider hasn't hit the first range__slide or
      // if the range__slider is a loop and
      // if the range__slider isn't moving right now:
      //   Go to prev range__slide and
      //   emit a scroll event.


      if (newEvent.direction < 0) {
        if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
          swiper.range__slideNext();
          emit('scroll', newEvent.raw);
        }
      } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
        swiper.range__slidePrev();
        emit('scroll', newEvent.raw);
      } // If you got here is because an animation has been triggered so store the current time


      lastScrollTime = new window.Date().getTime(); // Return false as a default

      return false;
    }

    function releaseScroll(newEvent) {
      const params = swiper.params.mousewheel;

      if (newEvent.direction < 0) {
        if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
          // Return true to animate scroll on edges
          return true;
        }
      } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }

      return false;
    }

    function handle(event) {
      let e = event;
      let disableParentSwiper = true;
      if (!swiper.enabled) return;
      const params = swiper.params.mousewheel;

      if (swiper.params.cssMode) {
        e.preventDefault();
      }

      let target = swiper.$el;

      if (swiper.params.mousewheel.eventsTarget !== 'container') {
        target = $(swiper.params.mousewheel.eventsTarget);
      }

      if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
      if (e.originalEvent) e = e.originalEvent; // jquery fix

      let delta = 0;
      const rtlFactor = swiper.rtlTranslate ? -1 : 1;
      const data = normalize(e);

      if (params.forceToAxis) {
        if (swiper.isHorizontal()) {
          if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
        } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
      } else {
        delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
      }

      if (delta === 0) return true;
      if (params.invert) delta = -delta; // Get the scroll positions

      let positions = swiper.getTranslate() + delta * params.sensitivity;
      if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
      if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
      //     the disableParentSwiper will be true.
      // When loop is false:
      //     if the scroll positions is not on edge,
      //     then the disableParentSwiper will be true.
      //     if the scroll on edge positions,
      //     then the disableParentSwiper will be false.

      disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
      if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

      if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
        // Register the new event in a variable which stores the relevant data
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta),
          raw: event
        }; // Keep the most recent events

        if (recentWheelEvents.length >= 2) {
          recentWheelEvents.shift(); // only store the last N events
        }

        const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
        recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
        //   If direction has changed or
        //   if the scroll is quicker than the previous one:
        //     Animate the range__slider.
        // Else (this is the first time the wheel is moved):
        //     Animate the range__slider.

        if (prevEvent) {
          if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
            animaterange__slider(newEvent);
          }
        } else {
          animaterange__slider(newEvent);
        } // If it's time to release the scroll:
        //   Return now so you don't hit the preventDefault.


        if (releaseScroll(newEvent)) {
          return true;
        }
      } else {
        // Freemode or scrollContainer:
        // If we recently snapped after a momentum scroll, then ignore wheel events
        // to give time for the deceleration to finish. Stop ignoring after 500 msecs
        // or if it's a new scroll (larger delta or inverse sign as last event before
        // an end-of-momentum snap).
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta)
        };
        const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

        if (!ignoreWheelEvents) {
          lastEventBeforeSnap = undefined;

          if (swiper.params.loop) {
            swiper.loopFix();
          }

          let position = swiper.getTranslate() + delta * params.sensitivity;
          const wasBeginning = swiper.isBeginning;
          const wasEnd = swiper.isEnd;
          if (position >= swiper.minTranslate()) position = swiper.minTranslate();
          if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
          swiper.setTransition(0);
          swiper.setTranslate(position);
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updaterange__slidesClasses();

          if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
            swiper.updaterange__slidesClasses();
          }

          if (swiper.params.freeMode.sticky) {
            // When wheel scrolling starts with sticky (aka snap) enabled, then detect
            // the end of a momentum scroll by storing recent (N=15?) wheel events.
            // 1. do all N events have decreasing or same (absolute value) delta?
            // 2. did all N events arrive in the last M (M=500?) msecs?
            // 3. does the earliest event have an (absolute value) delta that's
            //    at least P (P=1?) larger than the most recent event's delta?
            // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
            // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
            // Snap immediately and ignore remaining wheel events in this scroll.
            // See comment above for "remaining wheel events in this scroll" determination.
            // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
            clearTimeout(timeout);
            timeout = undefined;

            if (recentWheelEvents.length >= 15) {
              recentWheelEvents.shift(); // only store the last N events
            }

            const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
            const firstEvent = recentWheelEvents[0];
            recentWheelEvents.push(newEvent);

            if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
              // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
              recentWheelEvents.splice(0);
            } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
              // We're at the end of the deceleration of a momentum scroll, so there's no need
              // to wait for more events. Snap ASAP on the next tick.
              // Also, because there's some remaining momentum we'll bias the snap in the
              // direction of the ongoing scroll because it's better UX for the scroll to snap
              // in the same direction as the scroll instead of reversing to snap.  Therefore,
              // if it's already scrolled more than 20% in the current direction, keep going.
              const snapToThreshold = delta > 0 ? 0.8 : 0.2;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              timeout = nextTick(() => {
                swiper.range__slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
              }, 0); // no delay; move on next tick
            }

            if (!timeout) {
              // if we get here, then we haven't detected the end of a momentum scroll, so
              // we'll consider a scroll "complete" when there haven't been any wheel events
              // for 500ms.
              timeout = nextTick(() => {
                const snapToThreshold = 0.5;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                swiper.range__slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
              }, 500);
            }
          } // Emit event


          if (!ignoreWheelEvents) emit('scroll', e); // Stop autoplay

          if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

          if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
        }
      }

      if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      return false;
    }

    function events(method) {
      let target = swiper.$el;

      if (swiper.params.mousewheel.eventsTarget !== 'container') {
        target = $(swiper.params.mousewheel.eventsTarget);
      }

      target[method]('mouseenter', handleMouseEnter);
      target[method]('mouseleave', handleMouseLeave);
      target[method]('wheel', handle);
    }

    function enable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.removeEventListener('wheel', handle);
        return true;
      }

      if (swiper.mousewheel.enabled) return false;
      events('on');
      swiper.mousewheel.enabled = true;
      return true;
    }

    function disable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.addEventListener(event, handle);
        return true;
      }

      if (!swiper.mousewheel.enabled) return false;
      events('off');
      swiper.mousewheel.enabled = false;
      return true;
    }

    on('init', () => {
      if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
        disable();
      }

      if (swiper.params.mousewheel.enabled) enable();
    });
    on('destroy', () => {
      if (swiper.params.cssMode) {
        enable();
      }

      if (swiper.mousewheel.enabled) disable();
    });
    Object.assign(swiper.mousewheel, {
      enable,
      disable
    });
  }

  function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
    const document = getDocument();

    if (swiper.params.createElements) {
      Object.keys(checkProps).forEach(key => {
        if (!params[key] && params.auto === true) {
          let element = swiper.$el.children(`.${checkProps[key]}`)[0];

          if (!element) {
            element = document.createElement('div');
            element.className = checkProps[key];
            swiper.$el.append(element);
          }

          params[key] = element;
          originalParams[key] = element;
        }
      });
    }

    return params;
  }

  function Navigation({
    swiper,
    extendParams,
    on,
    emit
  }) {
    extendParams({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: false,
        disabledClass: 'swiper-button-disabled',
        hiddenClass: 'swiper-button-hidden',
        lockClass: 'swiper-button-lock'
      }
    });
    swiper.navigation = {
      nextEl: null,
      $nextEl: null,
      prevEl: null,
      $prevEl: null
    };

    function getEl(el) {
      let $el;

      if (el) {
        $el = $(el);

        if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
          $el = swiper.$el.find(el);
        }
      }

      return $el;
    }

    function toggleEl($el, disabled) {
      const params = swiper.params.navigation;

      if ($el && $el.length > 0) {
        $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
        if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

        if (swiper.params.watchOverflow && swiper.enabled) {
          $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
        }
      }
    }

    function update() {
      // Update Navigation Buttons
      if (swiper.params.loop) return;
      const {
        $nextEl,
        $prevEl
      } = swiper.navigation;
      toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
      toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
    }

    function onPrevClick(e) {
      e.preventDefault();
      if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
      swiper.range__slidePrev();
    }

    function onNextClick(e) {
      e.preventDefault();
      if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
      swiper.range__slideNext();
    }

    function init() {
      const params = swiper.params.navigation;
      swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
        nextEl: 'swiper-button-next',
        prevEl: 'swiper-button-prev'
      });
      if (!(params.nextEl || params.prevEl)) return;
      const $nextEl = getEl(params.nextEl);
      const $prevEl = getEl(params.prevEl);

      if ($nextEl && $nextEl.length > 0) {
        $nextEl.on('click', onNextClick);
      }

      if ($prevEl && $prevEl.length > 0) {
        $prevEl.on('click', onPrevClick);
      }

      Object.assign(swiper.navigation, {
        $nextEl,
        nextEl: $nextEl && $nextEl[0],
        $prevEl,
        prevEl: $prevEl && $prevEl[0]
      });

      if (!swiper.enabled) {
        if ($nextEl) $nextEl.addClass(params.lockClass);
        if ($prevEl) $prevEl.addClass(params.lockClass);
      }
    }

    function destroy() {
      const {
        $nextEl,
        $prevEl
      } = swiper.navigation;

      if ($nextEl && $nextEl.length) {
        $nextEl.off('click', onNextClick);
        $nextEl.removeClass(swiper.params.navigation.disabledClass);
      }

      if ($prevEl && $prevEl.length) {
        $prevEl.off('click', onPrevClick);
        $prevEl.removeClass(swiper.params.navigation.disabledClass);
      }
    }

    on('init', () => {
      init();
      update();
    });
    on('toEdge fromEdge lock unlock', () => {
      update();
    });
    on('destroy', () => {
      destroy();
    });
    on('enable disable', () => {
      const {
        $nextEl,
        $prevEl
      } = swiper.navigation;

      if ($nextEl) {
        $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
      }

      if ($prevEl) {
        $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
      }
    });
    on('click', (_s, e) => {
      const {
        $nextEl,
        $prevEl
      } = swiper.navigation;
      const targetEl = e.target;

      if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
        if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
        let isHidden;

        if ($nextEl) {
          isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
        } else if ($prevEl) {
          isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
        }

        if (isHidden === true) {
          emit('navigationShow');
        } else {
          emit('navigationHide');
        }

        if ($nextEl) {
          $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
        }

        if ($prevEl) {
          $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
        }
      }
    });
    Object.assign(swiper.navigation, {
      update,
      init,
      destroy
    });
  }

  function classesToSelector(classes = '') {
    return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
.replace(/ /g, '.')}`;
  }

  function Pagination({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const pfx = 'swiper-pagination';
    extendParams({
      pagination: {
        el: null,
        bulletElement: 'span',
        clickable: false,
        hideOnClick: false,
        renderBullet: null,
        renderProgressbar: null,
        renderFraction: null,
        renderCustom: null,
        progressbarOpposite: false,
        type: 'bullets',
        // 'bullets' or 'progressbar' or 'fraction' or 'custom'
        dynamicBullets: false,
        dynamicMainBullets: 1,
        formatFractionCurrent: number => number,
        formatFractionTotal: number => number,
        bulletClass: `${pfx}-bullet`,
        bulletActiveClass: `${pfx}-bullet-active`,
        modifierClass: `${pfx}-`,
        currentClass: `${pfx}-current`,
        totalClass: `${pfx}-total`,
        hiddenClass: `${pfx}-hidden`,
        progressbarFillClass: `${pfx}-progressbar-fill`,
        progressbarOppositeClass: `${pfx}-progressbar-opposite`,
        clickableClass: `${pfx}-clickable`,
        lockClass: `${pfx}-lock`,
        horizontalClass: `${pfx}-horizontal`,
        verticalClass: `${pfx}-vertical`
      }
    });
    swiper.pagination = {
      el: null,
      $el: null,
      bullets: []
    };
    let bulletSize;
    let dynamicBulletIndex = 0;

    function isPaginationDisabled() {
      return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
    }

    function setSideBullets($bulletEl, position) {
      const {
        bulletActiveClass
      } = swiper.params.pagination;
      $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
    }

    function update() {
      // Render || Update Pagination bullets/items
      const rtl = swiper.rtl;
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      const range__slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.range__slides.length : swiper.range__slides.length;
      const $el = swiper.pagination.$el; // Current/Total

      let current;
      const total = swiper.params.loop ? Math.ceil((range__slidesLength - swiper.loopedrange__slides * 2) / swiper.params.range__slidesPerGroup) : swiper.snapGrid.length;

      if (swiper.params.loop) {
        current = Math.ceil((swiper.activeIndex - swiper.loopedrange__slides) / swiper.params.range__slidesPerGroup);

        if (current > range__slidesLength - 1 - swiper.loopedrange__slides * 2) {
          current -= range__slidesLength - swiper.loopedrange__slides * 2;
        }

        if (current > total - 1) current -= total;
        if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
      } else if (typeof swiper.snapIndex !== 'undefined') {
        current = swiper.snapIndex;
      } else {
        current = swiper.activeIndex || 0;
      } // Types


      if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
        const bullets = swiper.pagination.bullets;
        let firstIndex;
        let lastIndex;
        let midIndex;

        if (params.dynamicBullets) {
          bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
          $el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

          if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
            dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedrange__slides || 0);

            if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
              dynamicBulletIndex = params.dynamicMainBullets - 1;
            } else if (dynamicBulletIndex < 0) {
              dynamicBulletIndex = 0;
            }
          }

          firstIndex = Math.max(current - dynamicBulletIndex, 0);
          lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
          midIndex = (lastIndex + firstIndex) / 2;
        }

        bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

        if ($el.length > 1) {
          bullets.each(bullet => {
            const $bullet = $(bullet);
            const bulletIndex = $bullet.index();

            if (bulletIndex === current) {
              $bullet.addClass(params.bulletActiveClass);
            }

            if (params.dynamicBullets) {
              if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                $bullet.addClass(`${params.bulletActiveClass}-main`);
              }

              if (bulletIndex === firstIndex) {
                setSideBullets($bullet, 'prev');
              }

              if (bulletIndex === lastIndex) {
                setSideBullets($bullet, 'next');
              }
            }
          });
        } else {
          const $bullet = bullets.eq(current);
          const bulletIndex = $bullet.index();
          $bullet.addClass(params.bulletActiveClass);

          if (params.dynamicBullets) {
            const $firstDisplayedBullet = bullets.eq(firstIndex);
            const $lastDisplayedBullet = bullets.eq(lastIndex);

            for (let i = firstIndex; i <= lastIndex; i += 1) {
              bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
            }

            if (swiper.params.loop) {
              if (bulletIndex >= bullets.length) {
                for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                  bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                }

                bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
              } else {
                setSideBullets($firstDisplayedBullet, 'prev');
                setSideBullets($lastDisplayedBullet, 'next');
              }
            } else {
              setSideBullets($firstDisplayedBullet, 'prev');
              setSideBullets($lastDisplayedBullet, 'next');
            }
          }
        }

        if (params.dynamicBullets) {
          const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
          const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
          const offsetProp = rtl ? 'right' : 'left';
          bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
        }
      }

      if (params.type === 'fraction') {
        $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
        $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
      }

      if (params.type === 'progressbar') {
        let progressbarDirection;

        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
        } else {
          progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
        }

        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;

        if (progressbarDirection === 'horizontal') {
          scaleX = scale;
        } else {
          scaleY = scale;
        }

        $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
      }

      if (params.type === 'custom' && params.renderCustom) {
        $el.html(params.renderCustom(swiper, current + 1, total));
        emit('paginationRender', $el[0]);
      } else {
        emit('paginationUpdate', $el[0]);
      }

      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
      }
    }

    function render() {
      // Render Container
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      const range__slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.range__slides.length : swiper.range__slides.length;
      const $el = swiper.pagination.$el;
      let paginationHTML = '';

      if (params.type === 'bullets') {
        let numberOfBullets = swiper.params.loop ? Math.ceil((range__slidesLength - swiper.loopedrange__slides * 2) / swiper.params.range__slidesPerGroup) : swiper.snapGrid.length;

        if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > range__slidesLength) {
          numberOfBullets = range__slidesLength;
        }

        for (let i = 0; i < numberOfBullets; i += 1) {
          if (params.renderBullet) {
            paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
          } else {
            paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
          }
        }

        $el.html(paginationHTML);
        swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
      }

      if (params.type === 'fraction') {
        if (params.renderFraction) {
          paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
        } else {
          paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
        }

        $el.html(paginationHTML);
      }

      if (params.type === 'progressbar') {
        if (params.renderProgressbar) {
          paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
        } else {
          paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
        }

        $el.html(paginationHTML);
      }

      if (params.type !== 'custom') {
        emit('paginationRender', swiper.pagination.$el[0]);
      }
    }

    function init() {
      swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
        el: 'swiper-pagination'
      });
      const params = swiper.params.pagination;
      if (!params.el) return;
      let $el = $(params.el);
      if ($el.length === 0) return;

      if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
        $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

        if ($el.length > 1) {
          $el = $el.filter(el => {
            if ($(el).parents('.swiper')[0] !== swiper.el) return false;
            return true;
          });
        }
      }

      if (params.type === 'bullets' && params.clickable) {
        $el.addClass(params.clickableClass);
      }

      $el.addClass(params.modifierClass + params.type);
      $el.addClass(params.modifierClass + swiper.params.direction);

      if (params.type === 'bullets' && params.dynamicBullets) {
        $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;

        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }

      if (params.type === 'progressbar' && params.progressbarOpposite) {
        $el.addClass(params.progressbarOppositeClass);
      }

      if (params.clickable) {
        $el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
          e.preventDefault();
          let index = $(this).index() * swiper.params.range__slidesPerGroup;
          if (swiper.params.loop) index += swiper.loopedrange__slides;
          swiper.range__slideTo(index);
        });
      }

      Object.assign(swiper.pagination, {
        $el,
        el: $el[0]
      });

      if (!swiper.enabled) {
        $el.addClass(params.lockClass);
      }
    }

    function destroy() {
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      const $el = swiper.pagination.$el;
      $el.removeClass(params.hiddenClass);
      $el.removeClass(params.modifierClass + params.type);
      $el.removeClass(params.modifierClass + swiper.params.direction);
      if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

      if (params.clickable) {
        $el.off('click', classesToSelector(params.bulletClass));
      }
    }

    on('init', () => {
      init();
      render();
      update();
    });
    on('activeIndexChange', () => {
      if (swiper.params.loop) {
        update();
      } else if (typeof swiper.snapIndex === 'undefined') {
        update();
      }
    });
    on('snapIndexChange', () => {
      if (!swiper.params.loop) {
        update();
      }
    });
    on('range__slidesLengthChange', () => {
      if (swiper.params.loop) {
        render();
        update();
      }
    });
    on('snapGridLengthChange', () => {
      if (!swiper.params.loop) {
        render();
        update();
      }
    });
    on('destroy', () => {
      destroy();
    });
    on('enable disable', () => {
      const {
        $el
      } = swiper.pagination;

      if ($el) {
        $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
      }
    });
    on('lock unlock', () => {
      update();
    });
    on('click', (_s, e) => {
      const targetEl = e.target;
      const {
        $el
      } = swiper.pagination;

      if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
        if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
        const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

        if (isHidden === true) {
          emit('paginationShow');
        } else {
          emit('paginationHide');
        }

        $el.toggleClass(swiper.params.pagination.hiddenClass);
      }
    });
    Object.assign(swiper.pagination, {
      render,
      update,
      init,
      destroy
    });
  }

  function Scrollbar({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const document = getDocument();
    let isTouched = false;
    let timeout = null;
    let dragTimeout = null;
    let dragStartPos;
    let dragSize;
    let trackSize;
    let divider;
    extendParams({
      scrollbar: {
        el: null,
        dragSize: 'auto',
        hide: false,
        draggable: false,
        snapOnRelease: true,
        lockClass: 'swiper-scrollbar-lock',
        dragClass: 'swiper-scrollbar-drag'
      }
    });
    swiper.scrollbar = {
      el: null,
      dragEl: null,
      $el: null,
      $dragEl: null
    };

    function setTranslate() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      const {
        scrollbar,
        rtlTranslate: rtl,
        progress
      } = swiper;
      const {
        $dragEl,
        $el
      } = scrollbar;
      const params = swiper.params.scrollbar;
      let newSize = dragSize;
      let newPos = (trackSize - dragSize) * progress;

      if (rtl) {
        newPos = -newPos;

        if (newPos > 0) {
          newSize = dragSize - newPos;
          newPos = 0;
        } else if (-newPos + dragSize > trackSize) {
          newSize = trackSize + newPos;
        }
      } else if (newPos < 0) {
        newSize = dragSize + newPos;
        newPos = 0;
      } else if (newPos + dragSize > trackSize) {
        newSize = trackSize - newPos;
      }

      if (swiper.isHorizontal()) {
        $dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
        $dragEl[0].style.width = `${newSize}px`;
      } else {
        $dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
        $dragEl[0].style.height = `${newSize}px`;
      }

      if (params.hide) {
        clearTimeout(timeout);
        $el[0].style.opacity = 1;
        timeout = setTimeout(() => {
          $el[0].style.opacity = 0;
          $el.transition(400);
        }, 1000);
      }
    }

    function setTransition(duration) {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      swiper.scrollbar.$dragEl.transition(duration);
    }

    function updateSize() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      const {
        scrollbar
      } = swiper;
      const {
        $dragEl,
        $el
      } = scrollbar;
      $dragEl[0].style.width = '';
      $dragEl[0].style.height = '';
      trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
      divider = swiper.size / (swiper.virtualSize + swiper.params.range__slidesOffsetBefore - (swiper.params.centeredrange__slides ? swiper.snapGrid[0] : 0));

      if (swiper.params.scrollbar.dragSize === 'auto') {
        dragSize = trackSize * divider;
      } else {
        dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
      }

      if (swiper.isHorizontal()) {
        $dragEl[0].style.width = `${dragSize}px`;
      } else {
        $dragEl[0].style.height = `${dragSize}px`;
      }

      if (divider >= 1) {
        $el[0].style.display = 'none';
      } else {
        $el[0].style.display = '';
      }

      if (swiper.params.scrollbar.hide) {
        $el[0].style.opacity = 0;
      }

      if (swiper.params.watchOverflow && swiper.enabled) {
        scrollbar.$el[swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
      }
    }

    function getPointerPosition(e) {
      if (swiper.isHorizontal()) {
        return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
      }

      return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
    }

    function setDragPosition(e) {
      const {
        scrollbar,
        rtlTranslate: rtl
      } = swiper;
      const {
        $el
      } = scrollbar;
      let positionRatio;
      positionRatio = (getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
      positionRatio = Math.max(Math.min(positionRatio, 1), 0);

      if (rtl) {
        positionRatio = 1 - positionRatio;
      }

      const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
      swiper.updateProgress(position);
      swiper.setTranslate(position);
      swiper.updateActiveIndex();
      swiper.updaterange__slidesClasses();
    }

    function onDragStart(e) {
      const params = swiper.params.scrollbar;
      const {
        scrollbar,
        $wrapperEl
      } = swiper;
      const {
        $el,
        $dragEl
      } = scrollbar;
      isTouched = true;
      dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
      e.preventDefault();
      e.stopPropagation();
      $wrapperEl.transition(100);
      $dragEl.transition(100);
      setDragPosition(e);
      clearTimeout(dragTimeout);
      $el.transition(0);

      if (params.hide) {
        $el.css('opacity', 1);
      }

      if (swiper.params.cssMode) {
        swiper.$wrapperEl.css('scroll-snap-type', 'none');
      }

      emit('scrollbarDragStart', e);
    }

    function onDragMove(e) {
      const {
        scrollbar,
        $wrapperEl
      } = swiper;
      const {
        $el,
        $dragEl
      } = scrollbar;
      if (!isTouched) return;
      if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      setDragPosition(e);
      $wrapperEl.transition(0);
      $el.transition(0);
      $dragEl.transition(0);
      emit('scrollbarDragMove', e);
    }

    function onDragEnd(e) {
      const params = swiper.params.scrollbar;
      const {
        scrollbar,
        $wrapperEl
      } = swiper;
      const {
        $el
      } = scrollbar;
      if (!isTouched) return;
      isTouched = false;

      if (swiper.params.cssMode) {
        swiper.$wrapperEl.css('scroll-snap-type', '');
        $wrapperEl.transition('');
      }

      if (params.hide) {
        clearTimeout(dragTimeout);
        dragTimeout = nextTick(() => {
          $el.css('opacity', 0);
          $el.transition(400);
        }, 1000);
      }

      emit('scrollbarDragEnd', e);

      if (params.snapOnRelease) {
        swiper.range__slideToClosest();
      }
    }

    function events(method) {
      const {
        scrollbar,
        touchEventsTouch,
        touchEventsDesktop,
        params,
        support
      } = swiper;
      const $el = scrollbar.$el;
      const target = $el[0];
      const activeListener = support.passiveListener && params.passiveListeners ? {
        passive: false,
        capture: false
      } : false;
      const passiveListener = support.passiveListener && params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;
      if (!target) return;
      const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';

      if (!support.touch) {
        target[eventMethod](touchEventsDesktop.start, onDragStart, activeListener);
        document[eventMethod](touchEventsDesktop.move, onDragMove, activeListener);
        document[eventMethod](touchEventsDesktop.end, onDragEnd, passiveListener);
      } else {
        target[eventMethod](touchEventsTouch.start, onDragStart, activeListener);
        target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
        target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
      }
    }

    function enableDraggable() {
      if (!swiper.params.scrollbar.el) return;
      events('on');
    }

    function disableDraggable() {
      if (!swiper.params.scrollbar.el) return;
      events('off');
    }

    function init() {
      const {
        scrollbar,
        $el: $swiperEl
      } = swiper;
      swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
        el: 'swiper-scrollbar'
      });
      const params = swiper.params.scrollbar;
      if (!params.el) return;
      let $el = $(params.el);

      if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
        $el = $swiperEl.find(params.el);
      }

      let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

      if ($dragEl.length === 0) {
        $dragEl = $(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
        $el.append($dragEl);
      }

      Object.assign(scrollbar, {
        $el,
        el: $el[0],
        $dragEl,
        dragEl: $dragEl[0]
      });

      if (params.draggable) {
        enableDraggable();
      }

      if ($el) {
        $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
      }
    }

    function destroy() {
      disableDraggable();
    }

    on('init', () => {
      init();
      updateSize();
      setTranslate();
    });
    on('update resize observerUpdate lock unlock', () => {
      updateSize();
    });
    on('setTranslate', () => {
      setTranslate();
    });
    on('setTransition', (_s, duration) => {
      setTransition(duration);
    });
    on('enable disable', () => {
      const {
        $el
      } = swiper.scrollbar;

      if ($el) {
        $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
      }
    });
    on('destroy', () => {
      destroy();
    });
    Object.assign(swiper.scrollbar, {
      updateSize,
      setTranslate,
      init,
      destroy
    });
  }

  function Parallax({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      parallax: {
        enabled: false
      }
    });

    const setTransform = (el, progress) => {
      const {
        rtl
      } = swiper;
      const $el = $(el);
      const rtlFactor = rtl ? -1 : 1;
      const p = $el.attr('data-swiper-parallax') || '0';
      let x = $el.attr('data-swiper-parallax-x');
      let y = $el.attr('data-swiper-parallax-y');
      const scale = $el.attr('data-swiper-parallax-scale');
      const opacity = $el.attr('data-swiper-parallax-opacity');

      if (x || y) {
        x = x || '0';
        y = y || '0';
      } else if (swiper.isHorizontal()) {
        x = p;
        y = '0';
      } else {
        y = p;
        x = '0';
      }

      if (x.indexOf('%') >= 0) {
        x = `${parseInt(x, 10) * progress * rtlFactor}%`;
      } else {
        x = `${x * progress * rtlFactor}px`;
      }

      if (y.indexOf('%') >= 0) {
        y = `${parseInt(y, 10) * progress}%`;
      } else {
        y = `${y * progress}px`;
      }

      if (typeof opacity !== 'undefined' && opacity !== null) {
        const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
        $el[0].style.opacity = currentOpacity;
      }

      if (typeof scale === 'undefined' || scale === null) {
        $el.transform(`translate3d(${x}, ${y}, 0px)`);
      } else {
        const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
        $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
      }
    };

    const setTranslate = () => {
      const {
        $el,
        range__slides,
        progress,
        snapGrid
      } = swiper;
      $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
        setTransform(el, progress);
      });
      range__slides.each((range__slideEl, range__slideIndex) => {
        let range__slideProgress = range__slideEl.progress;

        if (swiper.params.range__slidesPerGroup > 1 && swiper.params.range__slidesPerView !== 'auto') {
          range__slideProgress += Math.ceil(range__slideIndex / 2) - progress * (snapGrid.length - 1);
        }

        range__slideProgress = Math.min(Math.max(range__slideProgress, -1), 1);
        $(range__slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
          setTransform(el, range__slideProgress);
        });
      });
    };

    const setTransition = (duration = swiper.params.speed) => {
      const {
        $el
      } = swiper;
      $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(parallaxEl => {
        const $parallaxEl = $(parallaxEl);
        let parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
        if (duration === 0) parallaxDuration = 0;
        $parallaxEl.transition(parallaxDuration);
      });
    };

    on('beforeInit', () => {
      if (!swiper.params.parallax.enabled) return;
      swiper.params.watchrange__slidesProgress = true;
      swiper.originalParams.watchrange__slidesProgress = true;
    });
    on('init', () => {
      if (!swiper.params.parallax.enabled) return;
      setTranslate();
    });
    on('setTranslate', () => {
      if (!swiper.params.parallax.enabled) return;
      setTranslate();
    });
    on('setTransition', (_swiper, duration) => {
      if (!swiper.params.parallax.enabled) return;
      setTransition(duration);
    });
  }

  function Zoom({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const window = getWindow();
    extendParams({
      zoom: {
        enabled: false,
        maxRatio: 3,
        minRatio: 1,
        toggle: true,
        containerClass: 'swiper-zoom-container',
        zoomedrange__slideClass: 'swiper-range__slide-zoomed'
      }
    });
    swiper.zoom = {
      enabled: false
    };
    let currentScale = 1;
    let isScaling = false;
    let gesturesEnabled;
    let fakeGestureTouched;
    let fakeGestureMoved;
    const gesture = {
      $range__slideEl: undefined,
      range__slideWidth: undefined,
      range__slideHeight: undefined,
      $imageEl: undefined,
      $imageWrapEl: undefined,
      maxRatio: 3
    };
    const image = {
      isTouched: undefined,
      isMoved: undefined,
      currentX: undefined,
      currentY: undefined,
      minX: undefined,
      minY: undefined,
      maxX: undefined,
      maxY: undefined,
      width: undefined,
      height: undefined,
      startX: undefined,
      startY: undefined,
      touchesStart: {},
      touchesCurrent: {}
    };
    const velocity = {
      x: undefined,
      y: undefined,
      prevPositionX: undefined,
      prevPositionY: undefined,
      prevTime: undefined
    };
    let scale = 1;
    Object.defineProperty(swiper.zoom, 'scale', {
      get() {
        return scale;
      },

      set(value) {
        if (scale !== value) {
          const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
          const range__slideEl = gesture.$range__slideEl ? gesture.$range__slideEl[0] : undefined;
          emit('zoomChange', value, imageEl, range__slideEl);
        }

        scale = value;
      }

    });

    function getDistanceBetweenTouches(e) {
      if (e.targetTouches.length < 2) return 1;
      const x1 = e.targetTouches[0].pageX;
      const y1 = e.targetTouches[0].pageY;
      const x2 = e.targetTouches[1].pageX;
      const y2 = e.targetTouches[1].pageY;
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance;
    } // Events


    function onGestureStart(e) {
      const support = swiper.support;
      const params = swiper.params.zoom;
      fakeGestureTouched = false;
      fakeGestureMoved = false;

      if (!support.gestures) {
        if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
          return;
        }

        fakeGestureTouched = true;
        gesture.scaleStart = getDistanceBetweenTouches(e);
      }

      if (!gesture.$range__slideEl || !gesture.$range__slideEl.length) {
        gesture.$range__slideEl = $(e.target).closest(`.${swiper.params.range__slideClass}`);
        if (gesture.$range__slideEl.length === 0) gesture.$range__slideEl = swiper.range__slides.eq(swiper.activeIndex);
        gesture.$imageEl = gesture.$range__slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
        gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
        gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

        if (gesture.$imageWrapEl.length === 0) {
          gesture.$imageEl = undefined;
          return;
        }
      }

      if (gesture.$imageEl) {
        gesture.$imageEl.transition(0);
      }

      isScaling = true;
    }

    function onGestureChange(e) {
      const support = swiper.support;
      const params = swiper.params.zoom;
      const zoom = swiper.zoom;

      if (!support.gestures) {
        if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
          return;
        }

        fakeGestureMoved = true;
        gesture.scaleMove = getDistanceBetweenTouches(e);
      }

      if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
        if (e.type === 'gesturechange') onGestureStart(e);
        return;
      }

      if (support.gestures) {
        zoom.scale = e.scale * currentScale;
      } else {
        zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
      }

      if (zoom.scale > gesture.maxRatio) {
        zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
      }

      if (zoom.scale < params.minRatio) {
        zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
      }

      gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
    }

    function onGestureEnd(e) {
      const device = swiper.device;
      const support = swiper.support;
      const params = swiper.params.zoom;
      const zoom = swiper.zoom;

      if (!support.gestures) {
        if (!fakeGestureTouched || !fakeGestureMoved) {
          return;
        }

        if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
          return;
        }

        fakeGestureTouched = false;
        fakeGestureMoved = false;
      }

      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
      zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
      gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
      currentScale = zoom.scale;
      isScaling = false;
      if (zoom.scale === 1) gesture.$range__slideEl = undefined;
    }

    function onTouchStart(e) {
      const device = swiper.device;
      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
      if (image.isTouched) return;
      if (device.android && e.cancelable) e.preventDefault();
      image.isTouched = true;
      image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
    }

    function onTouchMove(e) {
      const zoom = swiper.zoom;
      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
      swiper.allowClick = false;
      if (!image.isTouched || !gesture.$range__slideEl) return;

      if (!image.isMoved) {
        image.width = gesture.$imageEl[0].offsetWidth;
        image.height = gesture.$imageEl[0].offsetHeight;
        image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
        image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
        gesture.range__slideWidth = gesture.$range__slideEl[0].offsetWidth;
        gesture.range__slideHeight = gesture.$range__slideEl[0].offsetHeight;
        gesture.$imageWrapEl.transition(0);
      } // Define if we need image drag


      const scaledWidth = image.width * zoom.scale;
      const scaledHeight = image.height * zoom.scale;
      if (scaledWidth < gesture.range__slideWidth && scaledHeight < gesture.range__slideHeight) return;
      image.minX = Math.min(gesture.range__slideWidth / 2 - scaledWidth / 2, 0);
      image.maxX = -image.minX;
      image.minY = Math.min(gesture.range__slideHeight / 2 - scaledHeight / 2, 0);
      image.maxY = -image.minY;
      image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
      image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

      if (!image.isMoved && !isScaling) {
        if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
          image.isTouched = false;
          return;
        }

        if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
          image.isTouched = false;
          return;
        }
      }

      if (e.cancelable) {
        e.preventDefault();
      }

      e.stopPropagation();
      image.isMoved = true;
      image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
      image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

      if (image.currentX < image.minX) {
        image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
      }

      if (image.currentX > image.maxX) {
        image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
      }

      if (image.currentY < image.minY) {
        image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
      }

      if (image.currentY > image.maxY) {
        image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
      } // Velocity


      if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
      if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
      if (!velocity.prevTime) velocity.prevTime = Date.now();
      velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
      velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
      if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
      if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
      velocity.prevPositionX = image.touchesCurrent.x;
      velocity.prevPositionY = image.touchesCurrent.y;
      velocity.prevTime = Date.now();
      gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
    }

    function onTouchEnd() {
      const zoom = swiper.zoom;
      if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

      if (!image.isTouched || !image.isMoved) {
        image.isTouched = false;
        image.isMoved = false;
        return;
      }

      image.isTouched = false;
      image.isMoved = false;
      let momentumDurationX = 300;
      let momentumDurationY = 300;
      const momentumDistanceX = velocity.x * momentumDurationX;
      const newPositionX = image.currentX + momentumDistanceX;
      const momentumDistanceY = velocity.y * momentumDurationY;
      const newPositionY = image.currentY + momentumDistanceY; // Fix duration

      if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
      if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
      const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
      image.currentX = newPositionX;
      image.currentY = newPositionY; // Define if we need image drag

      const scaledWidth = image.width * zoom.scale;
      const scaledHeight = image.height * zoom.scale;
      image.minX = Math.min(gesture.range__slideWidth / 2 - scaledWidth / 2, 0);
      image.maxX = -image.minX;
      image.minY = Math.min(gesture.range__slideHeight / 2 - scaledHeight / 2, 0);
      image.maxY = -image.minY;
      image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
      image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
      gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
    }

    function onTransitionEnd() {
      const zoom = swiper.zoom;

      if (gesture.$range__slideEl && swiper.previousIndex !== swiper.activeIndex) {
        if (gesture.$imageEl) {
          gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
        }

        if (gesture.$imageWrapEl) {
          gesture.$imageWrapEl.transform('translate3d(0,0,0)');
        }

        zoom.scale = 1;
        currentScale = 1;
        gesture.$range__slideEl = undefined;
        gesture.$imageEl = undefined;
        gesture.$imageWrapEl = undefined;
      }
    }

    function zoomIn(e) {
      const zoom = swiper.zoom;
      const params = swiper.params.zoom;

      if (!gesture.$range__slideEl) {
        if (e && e.target) {
          gesture.$range__slideEl = $(e.target).closest(`.${swiper.params.range__slideClass}`);
        }

        if (!gesture.$range__slideEl) {
          if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
            gesture.$range__slideEl = swiper.$wrapperEl.children(`.${swiper.params.range__slideActiveClass}`);
          } else {
            gesture.$range__slideEl = swiper.range__slides.eq(swiper.activeIndex);
          }
        }

        gesture.$imageEl = gesture.$range__slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
        gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
      }

      if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

      if (swiper.params.cssMode) {
        swiper.wrapperEl.style.overflow = 'hidden';
        swiper.wrapperEl.style.touchAction = 'none';
      }

      gesture.$range__slideEl.addClass(`${params.zoomedrange__slideClass}`);
      let touchX;
      let touchY;
      let offsetX;
      let offsetY;
      let diffX;
      let diffY;
      let translateX;
      let translateY;
      let imageWidth;
      let imageHeight;
      let scaledWidth;
      let scaledHeight;
      let translateMinX;
      let translateMinY;
      let translateMaxX;
      let translateMaxY;
      let range__slideWidth;
      let range__slideHeight;

      if (typeof image.touchesStart.x === 'undefined' && e) {
        touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
        touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
      } else {
        touchX = image.touchesStart.x;
        touchY = image.touchesStart.y;
      }

      zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
      currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

      if (e) {
        range__slideWidth = gesture.$range__slideEl[0].offsetWidth;
        range__slideHeight = gesture.$range__slideEl[0].offsetHeight;
        offsetX = gesture.$range__slideEl.offset().left + window.scrollX;
        offsetY = gesture.$range__slideEl.offset().top + window.scrollY;
        diffX = offsetX + range__slideWidth / 2 - touchX;
        diffY = offsetY + range__slideHeight / 2 - touchY;
        imageWidth = gesture.$imageEl[0].offsetWidth;
        imageHeight = gesture.$imageEl[0].offsetHeight;
        scaledWidth = imageWidth * zoom.scale;
        scaledHeight = imageHeight * zoom.scale;
        translateMinX = Math.min(range__slideWidth / 2 - scaledWidth / 2, 0);
        translateMinY = Math.min(range__slideHeight / 2 - scaledHeight / 2, 0);
        translateMaxX = -translateMinX;
        translateMaxY = -translateMinY;
        translateX = diffX * zoom.scale;
        translateY = diffY * zoom.scale;

        if (translateX < translateMinX) {
          translateX = translateMinX;
        }

        if (translateX > translateMaxX) {
          translateX = translateMaxX;
        }

        if (translateY < translateMinY) {
          translateY = translateMinY;
        }

        if (translateY > translateMaxY) {
          translateY = translateMaxY;
        }
      } else {
        translateX = 0;
        translateY = 0;
      }

      gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
      gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
    }

    function zoomOut() {
      const zoom = swiper.zoom;
      const params = swiper.params.zoom;

      if (!gesture.$range__slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.$range__slideEl = swiper.$wrapperEl.children(`.${swiper.params.range__slideActiveClass}`);
        } else {
          gesture.$range__slideEl = swiper.range__slides.eq(swiper.activeIndex);
        }

        gesture.$imageEl = gesture.$range__slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
        gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
      }

      if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

      if (swiper.params.cssMode) {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.style.touchAction = '';
      }

      zoom.scale = 1;
      currentScale = 1;
      gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
      gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
      gesture.$range__slideEl.removeClass(`${params.zoomedrange__slideClass}`);
      gesture.$range__slideEl = undefined;
    } // Toggle Zoom


    function zoomToggle(e) {
      const zoom = swiper.zoom;

      if (zoom.scale && zoom.scale !== 1) {
        // Zoom Out
        zoomOut();
      } else {
        // Zoom In
        zoomIn(e);
      }
    }

    function getListeners() {
      const support = swiper.support;
      const passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;
      const activeListenerWithCapture = support.passiveListener ? {
        passive: false,
        capture: true
      } : true;
      return {
        passiveListener,
        activeListenerWithCapture
      };
    }

    function getrange__slideSelector() {
      return `.${swiper.params.range__slideClass}`;
    }

    function toggleGestures(method) {
      const {
        passiveListener
      } = getListeners();
      const range__slideSelector = getrange__slideSelector();
      swiper.$wrapperEl[method]('gesturestart', range__slideSelector, onGestureStart, passiveListener);
      swiper.$wrapperEl[method]('gesturechange', range__slideSelector, onGestureChange, passiveListener);
      swiper.$wrapperEl[method]('gestureend', range__slideSelector, onGestureEnd, passiveListener);
    }

    function enableGestures() {
      if (gesturesEnabled) return;
      gesturesEnabled = true;
      toggleGestures('on');
    }

    function disableGestures() {
      if (!gesturesEnabled) return;
      gesturesEnabled = false;
      toggleGestures('off');
    } // Attach/Detach Events


    function enable() {
      const zoom = swiper.zoom;
      if (zoom.enabled) return;
      zoom.enabled = true;
      const support = swiper.support;
      const {
        passiveListener,
        activeListenerWithCapture
      } = getListeners();
      const range__slideSelector = getrange__slideSelector(); // Scale image

      if (support.gestures) {
        swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
        swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
      } else if (swiper.touchEvents.start === 'touchstart') {
        swiper.$wrapperEl.on(swiper.touchEvents.start, range__slideSelector, onGestureStart, passiveListener);
        swiper.$wrapperEl.on(swiper.touchEvents.move, range__slideSelector, onGestureChange, activeListenerWithCapture);
        swiper.$wrapperEl.on(swiper.touchEvents.end, range__slideSelector, onGestureEnd, passiveListener);

        if (swiper.touchEvents.cancel) {
          swiper.$wrapperEl.on(swiper.touchEvents.cancel, range__slideSelector, onGestureEnd, passiveListener);
        }
      } // Move image


      swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
    }

    function disable() {
      const zoom = swiper.zoom;
      if (!zoom.enabled) return;
      const support = swiper.support;
      zoom.enabled = false;
      const {
        passiveListener,
        activeListenerWithCapture
      } = getListeners();
      const range__slideSelector = getrange__slideSelector(); // Scale image

      if (support.gestures) {
        swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
        swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
      } else if (swiper.touchEvents.start === 'touchstart') {
        swiper.$wrapperEl.off(swiper.touchEvents.start, range__slideSelector, onGestureStart, passiveListener);
        swiper.$wrapperEl.off(swiper.touchEvents.move, range__slideSelector, onGestureChange, activeListenerWithCapture);
        swiper.$wrapperEl.off(swiper.touchEvents.end, range__slideSelector, onGestureEnd, passiveListener);

        if (swiper.touchEvents.cancel) {
          swiper.$wrapperEl.off(swiper.touchEvents.cancel, range__slideSelector, onGestureEnd, passiveListener);
        }
      } // Move image


      swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
    }

    on('init', () => {
      if (swiper.params.zoom.enabled) {
        enable();
      }
    });
    on('destroy', () => {
      disable();
    });
    on('touchStart', (_s, e) => {
      if (!swiper.zoom.enabled) return;
      onTouchStart(e);
    });
    on('touchEnd', (_s, e) => {
      if (!swiper.zoom.enabled) return;
      onTouchEnd();
    });
    on('doubleTap', (_s, e) => {
      if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
        zoomToggle(e);
      }
    });
    on('transitionEnd', () => {
      if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
        onTransitionEnd();
      }
    });
    on('range__slideChange', () => {
      if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
        onTransitionEnd();
      }
    });
    Object.assign(swiper.zoom, {
      enable,
      disable,
      in: zoomIn,
      out: zoomOut,
      toggle: zoomToggle
    });
  }

  function Lazy({
    swiper,
    extendParams,
    on,
    emit
  }) {
    extendParams({
      lazy: {
        checkInView: false,
        enabled: false,
        loadPrevNext: false,
        loadPrevNextAmount: 1,
        loadOnTransitionStart: false,
        scrollingElement: '',
        elementClass: 'swiper-lazy',
        loadingClass: 'swiper-lazy-loading',
        loadedClass: 'swiper-lazy-loaded',
        preloaderClass: 'swiper-lazy-preloader'
      }
    });
    swiper.lazy = {};
    let scrollHandlerAttached = false;
    let initialImageLoaded = false;

    function loadInrange__slide(index, loadInDuplicate = true) {
      const params = swiper.params.lazy;
      if (typeof index === 'undefined') return;
      if (swiper.range__slides.length === 0) return;
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      const $range__slideEl = isVirtual ? swiper.$wrapperEl.children(`.${swiper.params.range__slideClass}[data-swiper-range__slide-index="${index}"]`) : swiper.range__slides.eq(index);
      const $images = $range__slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);

      if ($range__slideEl.hasClass(params.elementClass) && !$range__slideEl.hasClass(params.loadedClass) && !$range__slideEl.hasClass(params.loadingClass)) {
        $images.push($range__slideEl[0]);
      }

      if ($images.length === 0) return;
      $images.each(imageEl => {
        const $imageEl = $(imageEl);
        $imageEl.addClass(params.loadingClass);
        const background = $imageEl.attr('data-background');
        const src = $imageEl.attr('data-src');
        const srcset = $imageEl.attr('data-srcset');
        const sizes = $imageEl.attr('data-sizes');
        const $pictureEl = $imageEl.parent('picture');
        swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, () => {
          if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

          if (background) {
            $imageEl.css('background-image', `url("${background}")`);
            $imageEl.removeAttr('data-background');
          } else {
            if (srcset) {
              $imageEl.attr('srcset', srcset);
              $imageEl.removeAttr('data-srcset');
            }

            if (sizes) {
              $imageEl.attr('sizes', sizes);
              $imageEl.removeAttr('data-sizes');
            }

            if ($pictureEl.length) {
              $pictureEl.children('source').each(sourceEl => {
                const $source = $(sourceEl);

                if ($source.attr('data-srcset')) {
                  $source.attr('srcset', $source.attr('data-srcset'));
                  $source.removeAttr('data-srcset');
                }
              });
            }

            if (src) {
              $imageEl.attr('src', src);
              $imageEl.removeAttr('data-src');
            }
          }

          $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
          $range__slideEl.find(`.${params.preloaderClass}`).remove();

          if (swiper.params.loop && loadInDuplicate) {
            const range__slideOriginalIndex = $range__slideEl.attr('data-swiper-range__slide-index');

            if ($range__slideEl.hasClass(swiper.params.range__slideDuplicateClass)) {
              const originalrange__slide = swiper.$wrapperEl.children(`[data-swiper-range__slide-index="${range__slideOriginalIndex}"]:not(.${swiper.params.range__slideDuplicateClass})`);
              loadInrange__slide(originalrange__slide.index(), false);
            } else {
              const duplicatedrange__slide = swiper.$wrapperEl.children(`.${swiper.params.range__slideDuplicateClass}[data-swiper-range__slide-index="${range__slideOriginalIndex}"]`);
              loadInrange__slide(duplicatedrange__slide.index(), false);
            }
          }

          emit('lazyImageReady', $range__slideEl[0], $imageEl[0]);

          if (swiper.params.autoHeight) {
            swiper.updateAutoHeight();
          }
        });
        emit('lazyImageLoad', $range__slideEl[0], $imageEl[0]);
      });
    }

    function load() {
      const {
        $wrapperEl,
        params: swiperParams,
        range__slides,
        activeIndex
      } = swiper;
      const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
      const params = swiperParams.lazy;
      let range__slidesPerView = swiperParams.range__slidesPerView;

      if (range__slidesPerView === 'auto') {
        range__slidesPerView = 0;
      }

      function range__slideExist(index) {
        if (isVirtual) {
          if ($wrapperEl.children(`.${swiperParams.range__slideClass}[data-swiper-range__slide-index="${index}"]`).length) {
            return true;
          }
        } else if (range__slides[index]) return true;

        return false;
      }

      function range__slideIndex(range__slideEl) {
        if (isVirtual) {
          return $(range__slideEl).attr('data-swiper-range__slide-index');
        }

        return $(range__slideEl).index();
      }

      if (!initialImageLoaded) initialImageLoaded = true;

      if (swiper.params.watchrange__slidesProgress) {
        $wrapperEl.children(`.${swiperParams.range__slideVisibleClass}`).each(range__slideEl => {
          const index = isVirtual ? $(range__slideEl).attr('data-swiper-range__slide-index') : $(range__slideEl).index();
          loadInrange__slide(index);
        });
      } else if (range__slidesPerView > 1) {
        for (let i = activeIndex; i < activeIndex + range__slidesPerView; i += 1) {
          if (range__slideExist(i)) loadInrange__slide(i);
        }
      } else {
        loadInrange__slide(activeIndex);
      }

      if (params.loadPrevNext) {
        if (range__slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
          const amount = params.loadPrevNextAmount;
          const spv = range__slidesPerView;
          const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), range__slides.length);
          const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next range__slides

          for (let i = activeIndex + range__slidesPerView; i < maxIndex; i += 1) {
            if (range__slideExist(i)) loadInrange__slide(i);
          } // Prev range__slides


          for (let i = minIndex; i < activeIndex; i += 1) {
            if (range__slideExist(i)) loadInrange__slide(i);
          }
        } else {
          const nextrange__slide = $wrapperEl.children(`.${swiperParams.range__slideNextClass}`);
          if (nextrange__slide.length > 0) loadInrange__slide(range__slideIndex(nextrange__slide));
          const prevrange__slide = $wrapperEl.children(`.${swiperParams.range__slidePrevClass}`);
          if (prevrange__slide.length > 0) loadInrange__slide(range__slideIndex(prevrange__slide));
        }
      }
    }

    function checkInViewOnLoad() {
      const window = getWindow();
      if (!swiper || swiper.destroyed) return;
      const $scrollElement = swiper.params.lazy.scrollingElement ? $(swiper.params.lazy.scrollingElement) : $(window);
      const isWindow = $scrollElement[0] === window;
      const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
      const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
      const swiperOffset = swiper.$el.offset();
      const {
        rtlTranslate: rtl
      } = swiper;
      let inView = false;
      if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
      const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

      for (let i = 0; i < swiperCoord.length; i += 1) {
        const point = swiperCoord[i];

        if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
          if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

          inView = true;
        }
      }

      const passiveListener = swiper.touchEvents.start === 'touchstart' && swiper.support.passiveListener && swiper.params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;

      if (inView) {
        load();
        $scrollElement.off('scroll', checkInViewOnLoad, passiveListener);
      } else if (!scrollHandlerAttached) {
        scrollHandlerAttached = true;
        $scrollElement.on('scroll', checkInViewOnLoad, passiveListener);
      }
    }

    on('beforeInit', () => {
      if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
        swiper.params.preloadImages = false;
      }
    });
    on('init', () => {
      if (swiper.params.lazy.enabled) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    });
    on('scroll', () => {
      if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky) {
        load();
      }
    });
    on('scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
      if (swiper.params.lazy.enabled) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    });
    on('transitionStart', () => {
      if (swiper.params.lazy.enabled) {
        if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded) {
          if (swiper.params.lazy.checkInView) {
            checkInViewOnLoad();
          } else {
            load();
          }
        }
      }
    });
    on('transitionEnd', () => {
      if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    });
    on('range__slideChange', () => {
      const {
        lazy,
        cssMode,
        watchrange__slidesProgress,
        touchReleaseOnEdges,
        resistanceRatio
      } = swiper.params;

      if (lazy.enabled && (cssMode || watchrange__slidesProgress && (touchReleaseOnEdges || resistanceRatio === 0))) {
        load();
      }
    });
    Object.assign(swiper.lazy, {
      load,
      loadInrange__slide
    });
  }

  /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
  function Controller({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      controller: {
        control: undefined,
        inverse: false,
        by: 'range__slide' // or 'container'

      }
    });
    swiper.controller = {
      control: undefined
    };

    function LinearSpline(x, y) {
      const binarySearch = function search() {
        let maxIndex;
        let minIndex;
        let guess;
        return (array, val) => {
          minIndex = -1;
          maxIndex = array.length;

          while (maxIndex - minIndex > 1) {
            guess = maxIndex + minIndex >> 1;

            if (array[guess] <= val) {
              minIndex = guess;
            } else {
              maxIndex = guess;
            }
          }

          return maxIndex;
        };
      }();

      this.x = x;
      this.y = y;
      this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
      // (x1,y1) is the known point before given value,
      // (x3,y3) is the known point after given value.

      let i1;
      let i3;

      this.interpolate = function interpolate(x2) {
        if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

        i3 = binarySearch(this.x, x2);
        i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
        // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

        return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
      };

      return this;
    } // xxx: for now i will just save one spline function to to


    function getInterpolateFunction(c) {
      if (!swiper.controller.spline) {
        swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.range__slidesGrid, c.range__slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
      }
    }

    function setTranslate(_t, byController) {
      const controlled = swiper.controller.control;
      let multiplier;
      let controlledTranslate;
      const Swiper = swiper.constructor;

      function setControlledTranslate(c) {
        // this will create an Interpolate function based on the snapGrids
        // x is the Grid of the scrolled scroller and y will be the controlled scroller
        // it makes sense to create this only once and recall it for the interpolation
        // the function does a lot of value caching for performance
        const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

        if (swiper.params.controller.by === 'range__slide') {
          getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
          // but it did not work out

          controlledTranslate = -swiper.controller.spline.interpolate(-translate);
        }

        if (!controlledTranslate || swiper.params.controller.by === 'container') {
          multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
          controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
        }

        if (swiper.params.controller.inverse) {
          controlledTranslate = c.maxTranslate() - controlledTranslate;
        }

        c.updateProgress(controlledTranslate);
        c.setTranslate(controlledTranslate, swiper);
        c.updateActiveIndex();
        c.updaterange__slidesClasses();
      }

      if (Array.isArray(controlled)) {
        for (let i = 0; i < controlled.length; i += 1) {
          if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
            setControlledTranslate(controlled[i]);
          }
        }
      } else if (controlled instanceof Swiper && byController !== controlled) {
        setControlledTranslate(controlled);
      }
    }

    function setTransition(duration, byController) {
      const Swiper = swiper.constructor;
      const controlled = swiper.controller.control;
      let i;

      function setControlledTransition(c) {
        c.setTransition(duration, swiper);

        if (duration !== 0) {
          c.transitionStart();

          if (c.params.autoHeight) {
            nextTick(() => {
              c.updateAutoHeight();
            });
          }

          c.$wrapperEl.transitionEnd(() => {
            if (!controlled) return;

            if (c.params.loop && swiper.params.controller.by === 'range__slide') {
              c.loopFix();
            }

            c.transitionEnd();
          });
        }
      }

      if (Array.isArray(controlled)) {
        for (i = 0; i < controlled.length; i += 1) {
          if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
            setControlledTransition(controlled[i]);
          }
        }
      } else if (controlled instanceof Swiper && byController !== controlled) {
        setControlledTransition(controlled);
      }
    }

    function removeSpline() {
      if (!swiper.controller.control) return;

      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    }

    on('beforeInit', () => {
      swiper.controller.control = swiper.params.controller.control;
    });
    on('update', () => {
      removeSpline();
    });
    on('resize', () => {
      removeSpline();
    });
    on('observerUpdate', () => {
      removeSpline();
    });
    on('setTranslate', (_s, translate, byController) => {
      if (!swiper.controller.control) return;
      swiper.controller.setTranslate(translate, byController);
    });
    on('setTransition', (_s, duration, byController) => {
      if (!swiper.controller.control) return;
      swiper.controller.setTransition(duration, byController);
    });
    Object.assign(swiper.controller, {
      setTranslate,
      setTransition
    });
  }

  function A11y({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      a11y: {
        enabled: true,
        notificationClass: 'swiper-notification',
        prevrange__slideMessage: 'Previous range__slide',
        nextrange__slideMessage: 'Next range__slide',
        firstrange__slideMessage: 'This is the first range__slide',
        lastrange__slideMessage: 'This is the last range__slide',
        paginationBulletMessage: 'Go to range__slide {{index}}',
        range__slideLabelMessage: '{{index}} / {{range__slidesLength}}',
        containerMessage: null,
        containerRoleDescriptionMessage: null,
        itemRoleDescriptionMessage: null,
        range__slideRole: 'group'
      }
    });
    let liveRegion = null;

    function notify(message) {
      const notification = liveRegion;
      if (notification.length === 0) return;
      notification.html('');
      notification.html(message);
    }

    function getRandomNumber(size = 16) {
      const randomChar = () => Math.round(16 * Math.random()).toString(16);

      return 'x'.repeat(size).replace(/x/g, randomChar);
    }

    function makeElFocusable($el) {
      $el.attr('tabIndex', '0');
    }

    function makeElNotFocusable($el) {
      $el.attr('tabIndex', '-1');
    }

    function addElRole($el, role) {
      $el.attr('role', role);
    }

    function addElRoleDescription($el, description) {
      $el.attr('aria-roledescription', description);
    }

    function addElControls($el, controls) {
      $el.attr('aria-controls', controls);
    }

    function addElLabel($el, label) {
      $el.attr('aria-label', label);
    }

    function addElId($el, id) {
      $el.attr('id', id);
    }

    function addElLive($el, live) {
      $el.attr('aria-live', live);
    }

    function disableEl($el) {
      $el.attr('aria-disabled', true);
    }

    function enableEl($el) {
      $el.attr('aria-disabled', false);
    }

    function onEnterOrSpaceKey(e) {
      if (e.keyCode !== 13 && e.keyCode !== 32) return;
      const params = swiper.params.a11y;
      const $targetEl = $(e.target);

      if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
        if (!(swiper.isEnd && !swiper.params.loop)) {
          swiper.range__slideNext();
        }

        if (swiper.isEnd) {
          notify(params.lastrange__slideMessage);
        } else {
          notify(params.nextrange__slideMessage);
        }
      }

      if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
        if (!(swiper.isBeginning && !swiper.params.loop)) {
          swiper.range__slidePrev();
        }

        if (swiper.isBeginning) {
          notify(params.firstrange__slideMessage);
        } else {
          notify(params.prevrange__slideMessage);
        }
      }

      if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
        $targetEl[0].click();
      }
    }

    function updateNavigation() {
      if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
      const {
        $nextEl,
        $prevEl
      } = swiper.navigation;

      if ($prevEl && $prevEl.length > 0) {
        if (swiper.isBeginning) {
          disableEl($prevEl);
          makeElNotFocusable($prevEl);
        } else {
          enableEl($prevEl);
          makeElFocusable($prevEl);
        }
      }

      if ($nextEl && $nextEl.length > 0) {
        if (swiper.isEnd) {
          disableEl($nextEl);
          makeElNotFocusable($nextEl);
        } else {
          enableEl($nextEl);
          makeElFocusable($nextEl);
        }
      }
    }

    function hasPagination() {
      return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
    }

    function hasClickablePagination() {
      return hasPagination() && swiper.params.pagination.clickable;
    }

    function updatePagination() {
      const params = swiper.params.a11y;
      if (!hasPagination()) return;
      swiper.pagination.bullets.each(bulletEl => {
        const $bulletEl = $(bulletEl);

        if (swiper.params.pagination.clickable) {
          makeElFocusable($bulletEl);

          if (!swiper.params.pagination.renderBullet) {
            addElRole($bulletEl, 'button');
            addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
          }
        }

        if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
          $bulletEl.attr('aria-current', 'true');
        } else {
          $bulletEl.removeAttr('aria-current');
        }
      });
    }

    const initNavEl = ($el, wrapperId, message) => {
      makeElFocusable($el);

      if ($el[0].tagName !== 'BUTTON') {
        addElRole($el, 'button');
        $el.on('keydown', onEnterOrSpaceKey);
      }

      addElLabel($el, message);
      addElControls($el, wrapperId);
    };

    function init() {
      const params = swiper.params.a11y;
      swiper.$el.append(liveRegion); // Container

      const $containerEl = swiper.$el;

      if (params.containerRoleDescriptionMessage) {
        addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
      }

      if (params.containerMessage) {
        addElLabel($containerEl, params.containerMessage);
      } // Wrapper


      const $wrapperEl = swiper.$wrapperEl;
      const wrapperId = $wrapperEl.attr('id') || `swiper-wrapper-${getRandomNumber(16)}`;
      const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
      addElId($wrapperEl, wrapperId);
      addElLive($wrapperEl, live); // range__slide

      if (params.itemRoleDescriptionMessage) {
        addElRoleDescription($(swiper.range__slides), params.itemRoleDescriptionMessage);
      }

      addElRole($(swiper.range__slides), params.range__slideRole);
      const range__slidesLength = swiper.params.loop ? swiper.range__slides.filter(el => !el.classList.contains(swiper.params.range__slideDuplicateClass)).length : swiper.range__slides.length;
      swiper.range__slides.each((range__slideEl, index) => {
        const $range__slideEl = $(range__slideEl);
        const range__slideIndex = swiper.params.loop ? parseInt($range__slideEl.attr('data-swiper-range__slide-index'), 10) : index;
        const ariaLabelMessage = params.range__slideLabelMessage.replace(/\{\{index\}\}/, range__slideIndex + 1).replace(/\{\{range__slidesLength\}\}/, range__slidesLength);
        addElLabel($range__slideEl, ariaLabelMessage);
      }); // Navigation

      let $nextEl;
      let $prevEl;

      if (swiper.navigation && swiper.navigation.$nextEl) {
        $nextEl = swiper.navigation.$nextEl;
      }

      if (swiper.navigation && swiper.navigation.$prevEl) {
        $prevEl = swiper.navigation.$prevEl;
      }

      if ($nextEl && $nextEl.length) {
        initNavEl($nextEl, wrapperId, params.nextrange__slideMessage);
      }

      if ($prevEl && $prevEl.length) {
        initNavEl($prevEl, wrapperId, params.prevrange__slideMessage);
      } // Pagination


      if (hasClickablePagination()) {
        swiper.pagination.$el.on('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
      }
    }

    function destroy() {
      if (liveRegion && liveRegion.length > 0) liveRegion.remove();
      let $nextEl;
      let $prevEl;

      if (swiper.navigation && swiper.navigation.$nextEl) {
        $nextEl = swiper.navigation.$nextEl;
      }

      if (swiper.navigation && swiper.navigation.$prevEl) {
        $prevEl = swiper.navigation.$prevEl;
      }

      if ($nextEl) {
        $nextEl.off('keydown', onEnterOrSpaceKey);
      }

      if ($prevEl) {
        $prevEl.off('keydown', onEnterOrSpaceKey);
      } // Pagination


      if (hasClickablePagination()) {
        swiper.pagination.$el.off('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
      }
    }

    on('beforeInit', () => {
      liveRegion = $(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
    });
    on('afterInit', () => {
      if (!swiper.params.a11y.enabled) return;
      init();
      updateNavigation();
    });
    on('toEdge', () => {
      if (!swiper.params.a11y.enabled) return;
      updateNavigation();
    });
    on('fromEdge', () => {
      if (!swiper.params.a11y.enabled) return;
      updateNavigation();
    });
    on('paginationUpdate', () => {
      if (!swiper.params.a11y.enabled) return;
      updatePagination();
    });
    on('destroy', () => {
      if (!swiper.params.a11y.enabled) return;
      destroy();
    });
  }

  function History({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      history: {
        enabled: false,
        root: '',
        replaceState: false,
        key: 'range__slides'
      }
    });
    let initialized = false;
    let paths = {};

    const slugify = text => {
      return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    };

    const getPathValues = urlOverride => {
      const window = getWindow();
      let location;

      if (urlOverride) {
        location = new URL(urlOverride);
      } else {
        location = window.location;
      }

      const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
      const total = pathArray.length;
      const key = pathArray[total - 2];
      const value = pathArray[total - 1];
      return {
        key,
        value
      };
    };

    const setHistory = (key, index) => {
      const window = getWindow();
      if (!initialized || !swiper.params.history.enabled) return;
      let location;

      if (swiper.params.url) {
        location = new URL(swiper.params.url);
      } else {
        location = window.location;
      }

      const range__slide = swiper.range__slides.eq(index);
      let value = slugify(range__slide.attr('data-history'));

      if (swiper.params.history.root.length > 0) {
        let root = swiper.params.history.root;
        if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
        value = `${root}/${key}/${value}`;
      } else if (!location.pathname.includes(key)) {
        value = `${key}/${value}`;
      }

      const currentState = window.history.state;

      if (currentState && currentState.value === value) {
        return;
      }

      if (swiper.params.history.replaceState) {
        window.history.replaceState({
          value
        }, null, value);
      } else {
        window.history.pushState({
          value
        }, null, value);
      }
    };

    const scrollTorange__slide = (speed, value, runCallbacks) => {
      if (value) {
        for (let i = 0, length = swiper.range__slides.length; i < length; i += 1) {
          const range__slide = swiper.range__slides.eq(i);
          const range__slideHistory = slugify(range__slide.attr('data-history'));

          if (range__slideHistory === value && !range__slide.hasClass(swiper.params.range__slideDuplicateClass)) {
            const index = range__slide.index();
            swiper.range__slideTo(index, speed, runCallbacks);
          }
        }
      } else {
        swiper.range__slideTo(0, speed, runCallbacks);
      }
    };

    const setHistoryPopState = () => {
      paths = getPathValues(swiper.params.url);
      scrollTorange__slide(swiper.params.speed, swiper.paths.value, false);
    };

    const init = () => {
      const window = getWindow();
      if (!swiper.params.history) return;

      if (!window.history || !window.history.pushState) {
        swiper.params.history.enabled = false;
        swiper.params.hashNavigation.enabled = true;
        return;
      }

      initialized = true;
      paths = getPathValues(swiper.params.url);
      if (!paths.key && !paths.value) return;
      scrollTorange__slide(0, paths.value, swiper.params.runCallbacksOnInit);

      if (!swiper.params.history.replaceState) {
        window.addEventListener('popstate', setHistoryPopState);
      }
    };

    const destroy = () => {
      const window = getWindow();

      if (!swiper.params.history.replaceState) {
        window.removeEventListener('popstate', setHistoryPopState);
      }
    };

    on('init', () => {
      if (swiper.params.history.enabled) {
        init();
      }
    });
    on('destroy', () => {
      if (swiper.params.history.enabled) {
        destroy();
      }
    });
    on('transitionEnd _freeModeNoMomentumRelease', () => {
      if (initialized) {
        setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    });
    on('range__slideChange', () => {
      if (initialized && swiper.params.cssMode) {
        setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    });
  }

  function HashNavigation({
    swiper,
    extendParams,
    emit,
    on
  }) {
    let initialized = false;
    const document = getDocument();
    const window = getWindow();
    extendParams({
      hashNavigation: {
        enabled: false,
        replaceState: false,
        watchState: false
      }
    });

    const onHashChange = () => {
      emit('hashChange');
      const newHash = document.location.hash.replace('#', '');
      const activerange__slideHash = swiper.range__slides.eq(swiper.activeIndex).attr('data-hash');

      if (newHash !== activerange__slideHash) {
        const newIndex = swiper.$wrapperEl.children(`.${swiper.params.range__slideClass}[data-hash="${newHash}"]`).index();
        if (typeof newIndex === 'undefined') return;
        swiper.range__slideTo(newIndex);
      }
    };

    const setHash = () => {
      if (!initialized || !swiper.params.hashNavigation.enabled) return;

      if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
        window.history.replaceState(null, null, `#${swiper.range__slides.eq(swiper.activeIndex).attr('data-hash')}` || '');
        emit('hashSet');
      } else {
        const range__slide = swiper.range__slides.eq(swiper.activeIndex);
        const hash = range__slide.attr('data-hash') || range__slide.attr('data-history');
        document.location.hash = hash || '';
        emit('hashSet');
      }
    };

    const init = () => {
      if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
      initialized = true;
      const hash = document.location.hash.replace('#', '');

      if (hash) {
        const speed = 0;

        for (let i = 0, length = swiper.range__slides.length; i < length; i += 1) {
          const range__slide = swiper.range__slides.eq(i);
          const range__slideHash = range__slide.attr('data-hash') || range__slide.attr('data-history');

          if (range__slideHash === hash && !range__slide.hasClass(swiper.params.range__slideDuplicateClass)) {
            const index = range__slide.index();
            swiper.range__slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
          }
        }
      }

      if (swiper.params.hashNavigation.watchState) {
        $(window).on('hashchange', onHashChange);
      }
    };

    const destroy = () => {
      if (swiper.params.hashNavigation.watchState) {
        $(window).off('hashchange', onHashChange);
      }
    };

    on('init', () => {
      if (swiper.params.hashNavigation.enabled) {
        init();
      }
    });
    on('destroy', () => {
      if (swiper.params.hashNavigation.enabled) {
        destroy();
      }
    });
    on('transitionEnd _freeModeNoMomentumRelease', () => {
      if (initialized) {
        setHash();
      }
    });
    on('range__slideChange', () => {
      if (initialized && swiper.params.cssMode) {
        setHash();
      }
    });
  }

  /* eslint no-underscore-dangle: "off" */
  function Autoplay({
    swiper,
    extendParams,
    on,
    emit
  }) {
    let timeout;
    swiper.autoplay = {
      running: false,
      paused: false
    };
    extendParams({
      autoplay: {
        enabled: false,
        delay: 3000,
        waitForTransition: true,
        disableOnInteraction: true,
        stopOnLastrange__slide: false,
        reverseDirection: false,
        pauseOnMouseEnter: false
      }
    });

    function run() {
      const $activerange__slideEl = swiper.range__slides.eq(swiper.activeIndex);
      let delay = swiper.params.autoplay.delay;

      if ($activerange__slideEl.attr('data-swiper-autoplay')) {
        delay = $activerange__slideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
      }

      clearTimeout(timeout);
      timeout = nextTick(() => {
        let autoplayResult;

        if (swiper.params.autoplay.reverseDirection) {
          if (swiper.params.loop) {
            swiper.loopFix();
            autoplayResult = swiper.range__slidePrev(swiper.params.speed, true, true);
            emit('autoplay');
          } else if (!swiper.isBeginning) {
            autoplayResult = swiper.range__slidePrev(swiper.params.speed, true, true);
            emit('autoplay');
          } else if (!swiper.params.autoplay.stopOnLastrange__slide) {
            autoplayResult = swiper.range__slideTo(swiper.range__slides.length - 1, swiper.params.speed, true, true);
            emit('autoplay');
          } else {
            stop();
          }
        } else if (swiper.params.loop) {
          swiper.loopFix();
          autoplayResult = swiper.range__slideNext(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.isEnd) {
          autoplayResult = swiper.range__slideNext(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastrange__slide) {
          autoplayResult = swiper.range__slideTo(0, swiper.params.speed, true, true);
          emit('autoplay');
        } else {
          stop();
        }

        if (swiper.params.cssMode && swiper.autoplay.running) run();else if (autoplayResult === false) {
          run();
        }
      }, delay);
    }

    function start() {
      if (typeof timeout !== 'undefined') return false;
      if (swiper.autoplay.running) return false;
      swiper.autoplay.running = true;
      emit('autoplayStart');
      run();
      return true;
    }

    function stop() {
      if (!swiper.autoplay.running) return false;
      if (typeof timeout === 'undefined') return false;

      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }

      swiper.autoplay.running = false;
      emit('autoplayStop');
      return true;
    }

    function pause(speed) {
      if (!swiper.autoplay.running) return;
      if (swiper.autoplay.paused) return;
      if (timeout) clearTimeout(timeout);
      swiper.autoplay.paused = true;

      if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
        swiper.autoplay.paused = false;
        run();
      } else {
        ['transitionend', 'webkitTransitionEnd'].forEach(event => {
          swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
        });
      }
    }

    function onVisibilityChange() {
      const document = getDocument();

      if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
        pause();
      }

      if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
        run();
        swiper.autoplay.paused = false;
      }
    }

    function onTransitionEnd(e) {
      if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
      if (e.target !== swiper.$wrapperEl[0]) return;
      ['transitionend', 'webkitTransitionEnd'].forEach(event => {
        swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
      });
      swiper.autoplay.paused = false;

      if (!swiper.autoplay.running) {
        stop();
      } else {
        run();
      }
    }

    function onMouseEnter() {
      if (swiper.params.autoplay.disableOnInteraction) {
        stop();
      } else {
        pause();
      }

      ['transitionend', 'webkitTransitionEnd'].forEach(event => {
        swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
      });
    }

    function onMouseLeave() {
      if (swiper.params.autoplay.disableOnInteraction) {
        return;
      }

      swiper.autoplay.paused = false;
      run();
    }

    function attachMouseEvents() {
      if (swiper.params.autoplay.pauseOnMouseEnter) {
        swiper.$el.on('mouseenter', onMouseEnter);
        swiper.$el.on('mouseleave', onMouseLeave);
      }
    }

    function detachMouseEvents() {
      swiper.$el.off('mouseenter', onMouseEnter);
      swiper.$el.off('mouseleave', onMouseLeave);
    }

    on('init', () => {
      if (swiper.params.autoplay.enabled) {
        start();
        const document = getDocument();
        document.addEventListener('visibilitychange', onVisibilityChange);
        attachMouseEvents();
      }
    });
    on('beforeTransitionStart', (_s, speed, internal) => {
      if (swiper.autoplay.running) {
        if (internal || !swiper.params.autoplay.disableOnInteraction) {
          swiper.autoplay.pause(speed);
        } else {
          stop();
        }
      }
    });
    on('range__sliderFirstMove', () => {
      if (swiper.autoplay.running) {
        if (swiper.params.autoplay.disableOnInteraction) {
          stop();
        } else {
          pause();
        }
      }
    });
    on('touchEnd', () => {
      if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
        run();
      }
    });
    on('destroy', () => {
      detachMouseEvents();

      if (swiper.autoplay.running) {
        stop();
      }

      const document = getDocument();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    });
    Object.assign(swiper.autoplay, {
      pause,
      run,
      start,
      stop
    });
  }

  function Thumb({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      thumbs: {
        swiper: null,
        multipleActiveThumbs: true,
        autoScrollOffset: 0,
        range__slideThumbActiveClass: 'swiper-range__slide-thumb-active',
        thumbsContainerClass: 'swiper-thumbs'
      }
    });
    let initialized = false;
    let swiperCreated = false;
    swiper.thumbs = {
      swiper: null
    };

    function onThumbClick() {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      const clickedIndex = thumbsSwiper.clickedIndex;
      const clickedrange__slide = thumbsSwiper.clickedrange__slide;
      if (clickedrange__slide && $(clickedrange__slide).hasClass(swiper.params.thumbs.range__slideThumbActiveClass)) return;
      if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
      let range__slideToIndex;

      if (thumbsSwiper.params.loop) {
        range__slideToIndex = parseInt($(thumbsSwiper.clickedrange__slide).attr('data-swiper-range__slide-index'), 10);
      } else {
        range__slideToIndex = clickedIndex;
      }

      if (swiper.params.loop) {
        let currentIndex = swiper.activeIndex;

        if (swiper.range__slides.eq(currentIndex).hasClass(swiper.params.range__slideDuplicateClass)) {
          swiper.loopFix(); // eslint-disable-next-line

          swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
          currentIndex = swiper.activeIndex;
        }

        const prevIndex = swiper.range__slides.eq(currentIndex).prevAll(`[data-swiper-range__slide-index="${range__slideToIndex}"]`).eq(0).index();
        const nextIndex = swiper.range__slides.eq(currentIndex).nextAll(`[data-swiper-range__slide-index="${range__slideToIndex}"]`).eq(0).index();
        if (typeof prevIndex === 'undefined') range__slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') range__slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) range__slideToIndex = nextIndex;else range__slideToIndex = prevIndex;
      }

      swiper.range__slideTo(range__slideToIndex);
    }

    function init() {
      const {
        thumbs: thumbsParams
      } = swiper.params;
      if (initialized) return false;
      initialized = true;
      const SwiperClass = swiper.constructor;

      if (thumbsParams.swiper instanceof SwiperClass) {
        swiper.thumbs.swiper = thumbsParams.swiper;
        Object.assign(swiper.thumbs.swiper.originalParams, {
          watchrange__slidesProgress: true,
          range__slideToClickedrange__slide: false
        });
        Object.assign(swiper.thumbs.swiper.params, {
          watchrange__slidesProgress: true,
          range__slideToClickedrange__slide: false
        });
      } else if (isObject(thumbsParams.swiper)) {
        const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
        Object.assign(thumbsSwiperParams, {
          watchrange__slidesProgress: true,
          range__slideToClickedrange__slide: false
        });
        swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
        swiperCreated = true;
      }

      swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
      swiper.thumbs.swiper.on('tap', onThumbClick);
      return true;
    }

    function update(initial) {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      const range__slidesPerView = thumbsSwiper.params.range__slidesPerView === 'auto' ? thumbsSwiper.range__slidesPerViewDynamic() : thumbsSwiper.params.range__slidesPerView;
      const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
      const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

      if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
        let currentThumbsIndex = thumbsSwiper.activeIndex;
        let newThumbsIndex;
        let direction;

        if (thumbsSwiper.params.loop) {
          if (thumbsSwiper.range__slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.range__slideDuplicateClass)) {
            thumbsSwiper.loopFix(); // eslint-disable-next-line

            thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
            currentThumbsIndex = thumbsSwiper.activeIndex;
          } // Find actual thumbs index to range__slide to


          const prevThumbsIndex = thumbsSwiper.range__slides.eq(currentThumbsIndex).prevAll(`[data-swiper-range__slide-index="${swiper.realIndex}"]`).eq(0).index();
          const nextThumbsIndex = thumbsSwiper.range__slides.eq(currentThumbsIndex).nextAll(`[data-swiper-range__slide-index="${swiper.realIndex}"]`).eq(0).index();

          if (typeof prevThumbsIndex === 'undefined') {
            newThumbsIndex = nextThumbsIndex;
          } else if (typeof nextThumbsIndex === 'undefined') {
            newThumbsIndex = prevThumbsIndex;
          } else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
            newThumbsIndex = thumbsSwiper.params.range__slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
          } else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
            newThumbsIndex = nextThumbsIndex;
          } else {
            newThumbsIndex = prevThumbsIndex;
          }

          direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
        } else {
          newThumbsIndex = swiper.realIndex;
          direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
        }

        if (useOffset) {
          newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
        }

        if (thumbsSwiper.visiblerange__slidesIndexes && thumbsSwiper.visiblerange__slidesIndexes.indexOf(newThumbsIndex) < 0) {
          if (thumbsSwiper.params.centeredrange__slides) {
            if (newThumbsIndex > currentThumbsIndex) {
              newThumbsIndex = newThumbsIndex - Math.floor(range__slidesPerView / 2) + 1;
            } else {
              newThumbsIndex = newThumbsIndex + Math.floor(range__slidesPerView / 2) - 1;
            }
          } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.range__slidesPerGroup === 1) ;

          thumbsSwiper.range__slideTo(newThumbsIndex, initial ? 0 : undefined);
        }
      } // Activate thumbs


      let thumbsToActivate = 1;
      const thumbActiveClass = swiper.params.thumbs.range__slideThumbActiveClass;

      if (swiper.params.range__slidesPerView > 1 && !swiper.params.centeredrange__slides) {
        thumbsToActivate = swiper.params.range__slidesPerView;
      }

      if (!swiper.params.thumbs.multipleActiveThumbs) {
        thumbsToActivate = 1;
      }

      thumbsToActivate = Math.floor(thumbsToActivate);
      thumbsSwiper.range__slides.removeClass(thumbActiveClass);

      if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
        for (let i = 0; i < thumbsToActivate; i += 1) {
          thumbsSwiper.$wrapperEl.children(`[data-swiper-range__slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
        }
      } else {
        for (let i = 0; i < thumbsToActivate; i += 1) {
          thumbsSwiper.range__slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
        }
      }
    }

    on('beforeInit', () => {
      const {
        thumbs
      } = swiper.params;
      if (!thumbs || !thumbs.swiper) return;
      init();
      update(true);
    });
    on('range__slideChange update resize observerUpdate', () => {
      if (!swiper.thumbs.swiper) return;
      update();
    });
    on('setTransition', (_s, duration) => {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;
      thumbsSwiper.setTransition(duration);
    });
    on('beforeDestroy', () => {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper) return;

      if (swiperCreated && thumbsSwiper) {
        thumbsSwiper.destroy();
      }
    });
    Object.assign(swiper.thumbs, {
      init,
      update
    });
  }

  function freeMode({
    swiper,
    extendParams,
    emit,
    once
  }) {
    extendParams({
      freeMode: {
        enabled: false,
        momentum: true,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        momentumVelocityRatio: 1,
        sticky: false,
        minimumVelocity: 0.02
      }
    });

    function onTouchMove() {
      const {
        touchEventsData: data,
        touches
      } = swiper; // Velocity

      if (data.velocities.length === 0) {
        data.velocities.push({
          position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
          time: data.touchStartTime
        });
      }

      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
        time: now()
      });
    }

    function onTouchEnd({
      currentPos
    }) {
      const {
        params,
        $wrapperEl,
        rtlTranslate: rtl,
        snapGrid,
        touchEventsData: data
      } = swiper; // Time diff

      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime;

      if (currentPos < -swiper.minTranslate()) {
        swiper.range__slideTo(swiper.activeIndex);
        return;
      }

      if (currentPos > -swiper.maxTranslate()) {
        if (swiper.range__slides.length < snapGrid.length) {
          swiper.range__slideTo(snapGrid.length - 1);
        } else {
          swiper.range__slideTo(swiper.range__slides.length - 1);
        }

        return;
      }

      if (params.freeMode.momentum) {
        if (data.velocities.length > 1) {
          const lastMoveEvent = data.velocities.pop();
          const velocityEvent = data.velocities.pop();
          const distance = lastMoveEvent.position - velocityEvent.position;
          const time = lastMoveEvent.time - velocityEvent.time;
          swiper.velocity = distance / time;
          swiper.velocity /= 2;

          if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
            swiper.velocity = 0;
          } // this implies that the user stopped moving a finger then released.
          // There would be no events with distance zero, so the last event is stale.


          if (time > 150 || now() - lastMoveEvent.time > 300) {
            swiper.velocity = 0;
          }
        } else {
          swiper.velocity = 0;
        }

        swiper.velocity *= params.freeMode.momentumVelocityRatio;
        data.velocities.length = 0;
        let momentumDuration = 1000 * params.freeMode.momentumRatio;
        const momentumDistance = swiper.velocity * momentumDuration;
        let newPosition = swiper.translate + momentumDistance;
        if (rtl) newPosition = -newPosition;
        let doBounce = false;
        let afterBouncePosition;
        const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
        let needsLoopFix;

        if (newPosition < swiper.maxTranslate()) {
          if (params.freeMode.momentumBounce) {
            if (newPosition + swiper.maxTranslate() < -bounceAmount) {
              newPosition = swiper.maxTranslate() - bounceAmount;
            }

            afterBouncePosition = swiper.maxTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.maxTranslate();
          }

          if (params.loop && params.centeredrange__slides) needsLoopFix = true;
        } else if (newPosition > swiper.minTranslate()) {
          if (params.freeMode.momentumBounce) {
            if (newPosition - swiper.minTranslate() > bounceAmount) {
              newPosition = swiper.minTranslate() + bounceAmount;
            }

            afterBouncePosition = swiper.minTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.minTranslate();
          }

          if (params.loop && params.centeredrange__slides) needsLoopFix = true;
        } else if (params.freeMode.sticky) {
          let nextrange__slide;

          for (let j = 0; j < snapGrid.length; j += 1) {
            if (snapGrid[j] > -newPosition) {
              nextrange__slide = j;
              break;
            }
          }

          if (Math.abs(snapGrid[nextrange__slide] - newPosition) < Math.abs(snapGrid[nextrange__slide - 1] - newPosition) || swiper.swipeDirection === 'next') {
            newPosition = snapGrid[nextrange__slide];
          } else {
            newPosition = snapGrid[nextrange__slide - 1];
          }

          newPosition = -newPosition;
        }

        if (needsLoopFix) {
          once('transitionEnd', () => {
            swiper.loopFix();
          });
        } // Fix duration


        if (swiper.velocity !== 0) {
          if (rtl) {
            momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
          } else {
            momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
          }

          if (params.freeMode.sticky) {
            // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
            // event, then durations can be 20+ seconds to range__slide one (or zero!) range__slides.
            // It's easy to see this when simulating touch with mouse events. To fix this,
            // limit single-range__slide swipes to the default range__slide duration. This also has the
            // nice side effect of matching range__slide speed if the user stopped moving before
            // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
            // For faster swipes, also apply limits (albeit higher ones).
            const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
            const currentrange__slideSize = swiper.range__slidesSizesGrid[swiper.activeIndex];

            if (moveDistance < currentrange__slideSize) {
              momentumDuration = params.speed;
            } else if (moveDistance < 2 * currentrange__slideSize) {
              momentumDuration = params.speed * 1.5;
            } else {
              momentumDuration = params.speed * 2.5;
            }
          }
        } else if (params.freeMode.sticky) {
          swiper.range__slideToClosest();
          return;
        }

        if (params.freeMode.momentumBounce && doBounce) {
          swiper.updateProgress(afterBouncePosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          swiper.animating = true;
          $wrapperEl.transitionEnd(() => {
            if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
            emit('momentumBounce');
            swiper.setTransition(params.speed);
            setTimeout(() => {
              swiper.setTranslate(afterBouncePosition);
              $wrapperEl.transitionEnd(() => {
                if (!swiper || swiper.destroyed) return;
                swiper.transitionEnd();
              });
            }, 0);
          });
        } else if (swiper.velocity) {
          emit('_freeModeNoMomentumRelease');
          swiper.updateProgress(newPosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);

          if (!swiper.animating) {
            swiper.animating = true;
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }
        } else {
          swiper.updateProgress(newPosition);
        }

        swiper.updateActiveIndex();
        swiper.updaterange__slidesClasses();
      } else if (params.freeMode.sticky) {
        swiper.range__slideToClosest();
        return;
      } else if (params.freeMode) {
        emit('_freeModeNoMomentumRelease');
      }

      if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updaterange__slidesClasses();
      }
    }

    Object.assign(swiper, {
      freeMode: {
        onTouchMove,
        onTouchEnd
      }
    });
  }

  function Grid({
    swiper,
    extendParams
  }) {
    extendParams({
      grid: {
        rows: 1,
        fill: 'column'
      }
    });
    let range__slidesNumberEvenToRows;
    let range__slidesPerRow;
    let numFullColumns;

    const initrange__slides = range__slidesLength => {
      const {
        range__slidesPerView
      } = swiper.params;
      const {
        rows,
        fill
      } = swiper.params.grid;
      range__slidesPerRow = range__slidesNumberEvenToRows / rows;
      numFullColumns = Math.floor(range__slidesLength / rows);

      if (Math.floor(range__slidesLength / rows) === range__slidesLength / rows) {
        range__slidesNumberEvenToRows = range__slidesLength;
      } else {
        range__slidesNumberEvenToRows = Math.ceil(range__slidesLength / rows) * rows;
      }

      if (range__slidesPerView !== 'auto' && fill === 'row') {
        range__slidesNumberEvenToRows = Math.max(range__slidesNumberEvenToRows, range__slidesPerView * rows);
      }
    };

    const updaterange__slide = (i, range__slide, range__slidesLength, getDirectionLabel) => {
      const {
        range__slidesPerGroup,
        spaceBetween
      } = swiper.params;
      const {
        rows,
        fill
      } = swiper.params.grid; // Set range__slides order

      let newrange__slideOrderIndex;
      let column;
      let row;

      if (fill === 'row' && range__slidesPerGroup > 1) {
        const groupIndex = Math.floor(i / (range__slidesPerGroup * rows));
        const range__slideIndexInGroup = i - rows * range__slidesPerGroup * groupIndex;
        const columnsInGroup = groupIndex === 0 ? range__slidesPerGroup : Math.min(Math.ceil((range__slidesLength - groupIndex * rows * range__slidesPerGroup) / rows), range__slidesPerGroup);
        row = Math.floor(range__slideIndexInGroup / columnsInGroup);
        column = range__slideIndexInGroup - row * columnsInGroup + groupIndex * range__slidesPerGroup;
        newrange__slideOrderIndex = column + row * range__slidesNumberEvenToRows / rows;
        range__slide.css({
          '-webkit-order': newrange__slideOrderIndex,
          order: newrange__slideOrderIndex
        });
      } else if (fill === 'column') {
        column = Math.floor(i / rows);
        row = i - column * rows;

        if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
          row += 1;

          if (row >= rows) {
            row = 0;
            column += 1;
          }
        }
      } else {
        row = Math.floor(i / range__slidesPerRow);
        column = i - row * range__slidesPerRow;
      }

      range__slide.css(getDirectionLabel('margin-top'), row !== 0 ? spaceBetween && `${spaceBetween}px` : '');
    };

    const updateWrapperSize = (range__slideSize, snapGrid, getDirectionLabel) => {
      const {
        spaceBetween,
        centeredrange__slides,
        roundLengths
      } = swiper.params;
      const {
        rows
      } = swiper.params.grid;
      swiper.virtualSize = (range__slideSize + spaceBetween) * range__slidesNumberEvenToRows;
      swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
      swiper.$wrapperEl.css({
        [getDirectionLabel('width')]: `${swiper.virtualSize + spaceBetween}px`
      });

      if (centeredrange__slides) {
        snapGrid.splice(0, snapGrid.length);
        const newrange__slidesGrid = [];

        for (let i = 0; i < snapGrid.length; i += 1) {
          let range__slidesGridItem = snapGrid[i];
          if (roundLengths) range__slidesGridItem = Math.floor(range__slidesGridItem);
          if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newrange__slidesGrid.push(range__slidesGridItem);
        }

        snapGrid.push(...newrange__slidesGrid);
      }
    };

    swiper.grid = {
      initrange__slides,
      updaterange__slide,
      updateWrapperSize
    };
  }

  function appendrange__slide(range__slides) {
    const swiper = this;
    const {
      $wrapperEl,
      params
    } = swiper;

    if (params.loop) {
      swiper.loopDestroy();
    }

    if (typeof range__slides === 'object' && 'length' in range__slides) {
      for (let i = 0; i < range__slides.length; i += 1) {
        if (range__slides[i]) $wrapperEl.append(range__slides[i]);
      }
    } else {
      $wrapperEl.append(range__slides);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }
  }

  function prependrange__slide(range__slides) {
    const swiper = this;
    const {
      params,
      $wrapperEl,
      activeIndex
    } = swiper;

    if (params.loop) {
      swiper.loopDestroy();
    }

    let newActiveIndex = activeIndex + 1;

    if (typeof range__slides === 'object' && 'length' in range__slides) {
      for (let i = 0; i < range__slides.length; i += 1) {
        if (range__slides[i]) $wrapperEl.prepend(range__slides[i]);
      }

      newActiveIndex = activeIndex + range__slides.length;
    } else {
      $wrapperEl.prepend(range__slides);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }

    swiper.range__slideTo(newActiveIndex, 0, false);
  }

  function addrange__slide(index, range__slides) {
    const swiper = this;
    const {
      $wrapperEl,
      params,
      activeIndex
    } = swiper;
    let activeIndexBuffer = activeIndex;

    if (params.loop) {
      activeIndexBuffer -= swiper.loopedrange__slides;
      swiper.loopDestroy();
      swiper.range__slides = $wrapperEl.children(`.${params.range__slideClass}`);
    }

    const baseLength = swiper.range__slides.length;

    if (index <= 0) {
      swiper.prependrange__slide(range__slides);
      return;
    }

    if (index >= baseLength) {
      swiper.appendrange__slide(range__slides);
      return;
    }

    let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
    const range__slidesBuffer = [];

    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentrange__slide = swiper.range__slides.eq(i);
      currentrange__slide.remove();
      range__slidesBuffer.unshift(currentrange__slide);
    }

    if (typeof range__slides === 'object' && 'length' in range__slides) {
      for (let i = 0; i < range__slides.length; i += 1) {
        if (range__slides[i]) $wrapperEl.append(range__slides[i]);
      }

      newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + range__slides.length : activeIndexBuffer;
    } else {
      $wrapperEl.append(range__slides);
    }

    for (let i = 0; i < range__slidesBuffer.length; i += 1) {
      $wrapperEl.append(range__slidesBuffer[i]);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }

    if (params.loop) {
      swiper.range__slideTo(newActiveIndex + swiper.loopedrange__slides, 0, false);
    } else {
      swiper.range__slideTo(newActiveIndex, 0, false);
    }
  }

  function removerange__slide(range__slidesIndexes) {
    const swiper = this;
    const {
      params,
      $wrapperEl,
      activeIndex
    } = swiper;
    let activeIndexBuffer = activeIndex;

    if (params.loop) {
      activeIndexBuffer -= swiper.loopedrange__slides;
      swiper.loopDestroy();
      swiper.range__slides = $wrapperEl.children(`.${params.range__slideClass}`);
    }

    let newActiveIndex = activeIndexBuffer;
    let indexToRemove;

    if (typeof range__slidesIndexes === 'object' && 'length' in range__slidesIndexes) {
      for (let i = 0; i < range__slidesIndexes.length; i += 1) {
        indexToRemove = range__slidesIndexes[i];
        if (swiper.range__slides[indexToRemove]) swiper.range__slides.eq(indexToRemove).remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      }

      newActiveIndex = Math.max(newActiveIndex, 0);
    } else {
      indexToRemove = range__slidesIndexes;
      if (swiper.range__slides[indexToRemove]) swiper.range__slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      newActiveIndex = Math.max(newActiveIndex, 0);
    }

    if (params.loop) {
      swiper.loopCreate();
    }

    if (!params.observer) {
      swiper.update();
    }

    if (params.loop) {
      swiper.range__slideTo(newActiveIndex + swiper.loopedrange__slides, 0, false);
    } else {
      swiper.range__slideTo(newActiveIndex, 0, false);
    }
  }

  function removeAllrange__slides() {
    const swiper = this;
    const range__slidesIndexes = [];

    for (let i = 0; i < swiper.range__slides.length; i += 1) {
      range__slidesIndexes.push(i);
    }

    swiper.removerange__slide(range__slidesIndexes);
  }

  function Manipulation({
    swiper
  }) {
    Object.assign(swiper, {
      appendrange__slide: appendrange__slide.bind(swiper),
      prependrange__slide: prependrange__slide.bind(swiper),
      addrange__slide: addrange__slide.bind(swiper),
      removerange__slide: removerange__slide.bind(swiper),
      removeAllrange__slides: removeAllrange__slides.bind(swiper)
    });
  }

  function effectInit(params) {
    const {
      effect,
      swiper,
      on,
      setTranslate,
      setTransition,
      overwriteParams,
      perspective
    } = params;
    on('beforeInit', () => {
      if (swiper.params.effect !== effect) return;
      swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);

      if (perspective && perspective()) {
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      }

      const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
      Object.assign(swiper.params, overwriteParamsResult);
      Object.assign(swiper.originalParams, overwriteParamsResult);
    });
    on('setTranslate', () => {
      if (swiper.params.effect !== effect) return;
      setTranslate();
    });
    on('setTransition', (_s, duration) => {
      if (swiper.params.effect !== effect) return;
      setTransition(duration);
    });
  }

  function effectTarget(effectParams, $range__slideEl) {
    if (effectParams.transformEl) {
      return $range__slideEl.find(effectParams.transformEl).css({
        'backface-visibility': 'hidden',
        '-webkit-backface-visibility': 'hidden'
      });
    }

    return $range__slideEl;
  }

  function effectVirtualTransitionEnd({
    swiper,
    duration,
    transformEl,
    allrange__slides
  }) {
    const {
      range__slides,
      activeIndex,
      $wrapperEl
    } = swiper;

    if (swiper.params.virtualTranslate && duration !== 0) {
      let eventTriggered = false;
      let $transitionEndTarget;

      if (allrange__slides) {
        $transitionEndTarget = transformEl ? range__slides.find(transformEl) : range__slides;
      } else {
        $transitionEndTarget = transformEl ? range__slides.eq(activeIndex).find(transformEl) : range__slides.eq(activeIndex);
      }

      $transitionEndTarget.transitionEnd(() => {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        const triggerEvents = ['webkitTransitionEnd', 'transitionend'];

        for (let i = 0; i < triggerEvents.length; i += 1) {
          $wrapperEl.trigger(triggerEvents[i]);
        }
      });
    }
  }

  function EffectFade({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      fadeEffect: {
        crossFade: false,
        transformEl: null
      }
    });

    const setTranslate = () => {
      const {
        range__slides
      } = swiper;
      const params = swiper.params.fadeEffect;

      for (let i = 0; i < range__slides.length; i += 1) {
        const $range__slideEl = swiper.range__slides.eq(i);
        const offset = $range__slideEl[0].swiperrange__slideOffset;
        let tx = -offset;
        if (!swiper.params.virtualTranslate) tx -= swiper.translate;
        let ty = 0;

        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
        }

        const range__slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($range__slideEl[0].progress), 0) : 1 + Math.min(Math.max($range__slideEl[0].progress, -1), 0);
        const $targetEl = effectTarget(params, $range__slideEl);
        $targetEl.css({
          opacity: range__slideOpacity
        }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
      }
    };

    const setTransition = duration => {
      const {
        transformEl
      } = swiper.params.fadeEffect;
      const $transitionElements = transformEl ? swiper.range__slides.find(transformEl) : swiper.range__slides;
      $transitionElements.transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl,
        allrange__slides: true
      });
    };

    effectInit({
      effect: 'fade',
      swiper,
      on,
      setTranslate,
      setTransition,
      overwriteParams: () => ({
        range__slidesPerView: 1,
        range__slidesPerGroup: 1,
        watchrange__slidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  function EffectCube({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      cubeEffect: {
        range__slideShadows: true,
        shadow: true,
        shadowOffset: 20,
        shadowScale: 0.94
      }
    });

    const setTranslate = () => {
      const {
        $el,
        $wrapperEl,
        range__slides,
        width: swiperWidth,
        height: swiperHeight,
        rtlTranslate: rtl,
        size: swiperSize,
        browser
      } = swiper;
      const params = swiper.params.cubeEffect;
      const isHorizontal = swiper.isHorizontal();
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let wrapperRotate = 0;
      let $cubeShadowEl;

      if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
            $wrapperEl.append($cubeShadowEl);
          }

          $cubeShadowEl.css({
            height: `${swiperWidth}px`
          });
        } else {
          $cubeShadowEl = $el.find('.swiper-cube-shadow');

          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
            $el.append($cubeShadowEl);
          }
        }
      }

      for (let i = 0; i < range__slides.length; i += 1) {
        const $range__slideEl = range__slides.eq(i);
        let range__slideIndex = i;

        if (isVirtual) {
          range__slideIndex = parseInt($range__slideEl.attr('data-swiper-range__slide-index'), 10);
        }

        let range__slideAngle = range__slideIndex * 90;
        let round = Math.floor(range__slideAngle / 360);

        if (rtl) {
          range__slideAngle = -range__slideAngle;
          round = Math.floor(-range__slideAngle / 360);
        }

        const progress = Math.max(Math.min($range__slideEl[0].progress, 1), -1);
        let tx = 0;
        let ty = 0;
        let tz = 0;

        if (range__slideIndex % 4 === 0) {
          tx = -round * 4 * swiperSize;
          tz = 0;
        } else if ((range__slideIndex - 1) % 4 === 0) {
          tx = 0;
          tz = -round * 4 * swiperSize;
        } else if ((range__slideIndex - 2) % 4 === 0) {
          tx = swiperSize + round * 4 * swiperSize;
          tz = swiperSize;
        } else if ((range__slideIndex - 3) % 4 === 0) {
          tx = -swiperSize;
          tz = 3 * swiperSize + swiperSize * 4 * round;
        }

        if (rtl) {
          tx = -tx;
        }

        if (!isHorizontal) {
          ty = tx;
          tx = 0;
        }

        const transform = `rotateX(${isHorizontal ? 0 : -range__slideAngle}deg) rotateY(${isHorizontal ? range__slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

        if (progress <= 1 && progress > -1) {
          wrapperRotate = range__slideIndex * 90 + progress * 90;
          if (rtl) wrapperRotate = -range__slideIndex * 90 - progress * 90;
        }

        $range__slideEl.transform(transform);

        if (params.range__slideShadows) {
          // Set shadows
          let shadowBefore = isHorizontal ? $range__slideEl.find('.swiper-range__slide-shadow-left') : $range__slideEl.find('.swiper-range__slide-shadow-top');
          let shadowAfter = isHorizontal ? $range__slideEl.find('.swiper-range__slide-shadow-right') : $range__slideEl.find('.swiper-range__slide-shadow-bottom');

          if (shadowBefore.length === 0) {
            shadowBefore = $(`<div class="swiper-range__slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
            $range__slideEl.append(shadowBefore);
          }

          if (shadowAfter.length === 0) {
            shadowAfter = $(`<div class="swiper-range__slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
            $range__slideEl.append(shadowAfter);
          }

          if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
          if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
        }
      }

      $wrapperEl.css({
        '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
        'transform-origin': `50% 50% -${swiperSize / 2}px`
      });

      if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl.transform(`translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
        } else {
          const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
          const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
          const scale1 = params.shadowScale;
          const scale2 = params.shadowScale / multiplier;
          const offset = params.shadowOffset;
          $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
        }
      }

      const zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
      $wrapperEl.transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
    };

    const setTransition = duration => {
      const {
        $el,
        range__slides
      } = swiper;
      range__slides.transition(duration).find('.swiper-range__slide-shadow-top, .swiper-range__slide-shadow-right, .swiper-range__slide-shadow-bottom, .swiper-range__slide-shadow-left').transition(duration);

      if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
        $el.find('.swiper-cube-shadow').transition(duration);
      }
    };

    effectInit({
      effect: 'cube',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        range__slidesPerView: 1,
        range__slidesPerGroup: 1,
        watchrange__slidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredrange__slides: false,
        virtualTranslate: true
      })
    });
  }

  function createShadow(params, $range__slideEl, side) {
    const shadowClass = `swiper-range__slide-shadow${side ? `-${side}` : ''}`;
    const $shadowContainer = params.transformEl ? $range__slideEl.find(params.transformEl) : $range__slideEl;
    let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

    if (!$shadowEl.length) {
      $shadowEl = $(`<div class="swiper-range__slide-shadow${side ? `-${side}` : ''}"></div>`);
      $shadowContainer.append($shadowEl);
    }

    return $shadowEl;
  }

  function EffectFlip({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      flipEffect: {
        range__slideShadows: true,
        limitRotation: true,
        transformEl: null
      }
    });

    const setTranslate = () => {
      const {
        range__slides,
        rtlTranslate: rtl
      } = swiper;
      const params = swiper.params.flipEffect;

      for (let i = 0; i < range__slides.length; i += 1) {
        const $range__slideEl = range__slides.eq(i);
        let progress = $range__slideEl[0].progress;

        if (swiper.params.flipEffect.limitRotation) {
          progress = Math.max(Math.min($range__slideEl[0].progress, 1), -1);
        }

        const offset = $range__slideEl[0].swiperrange__slideOffset;
        const rotate = -180 * progress;
        let rotateY = rotate;
        let rotateX = 0;
        let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
        let ty = 0;

        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
          rotateX = -rotateY;
          rotateY = 0;
        } else if (rtl) {
          rotateY = -rotateY;
        }

        $range__slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + range__slides.length;

        if (params.range__slideShadows) {
          // Set shadows
          let shadowBefore = swiper.isHorizontal() ? $range__slideEl.find('.swiper-range__slide-shadow-left') : $range__slideEl.find('.swiper-range__slide-shadow-top');
          let shadowAfter = swiper.isHorizontal() ? $range__slideEl.find('.swiper-range__slide-shadow-right') : $range__slideEl.find('.swiper-range__slide-shadow-bottom');

          if (shadowBefore.length === 0) {
            shadowBefore = createShadow(params, $range__slideEl, swiper.isHorizontal() ? 'left' : 'top');
          }

          if (shadowAfter.length === 0) {
            shadowAfter = createShadow(params, $range__slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
          }

          if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
          if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
        }

        const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        const $targetEl = effectTarget(params, $range__slideEl);
        $targetEl.transform(transform);
      }
    };

    const setTransition = duration => {
      const {
        transformEl
      } = swiper.params.flipEffect;
      const $transitionElements = transformEl ? swiper.range__slides.find(transformEl) : swiper.range__slides;
      $transitionElements.transition(duration).find('.swiper-range__slide-shadow-top, .swiper-range__slide-shadow-right, .swiper-range__slide-shadow-bottom, .swiper-range__slide-shadow-left').transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl
      });
    };

    effectInit({
      effect: 'flip',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        range__slidesPerView: 1,
        range__slidesPerGroup: 1,
        watchrange__slidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  function EffectCoverflow({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        scale: 1,
        modifier: 1,
        range__slideShadows: true,
        transformEl: null
      }
    });

    const setTranslate = () => {
      const {
        width: swiperWidth,
        height: swiperHeight,
        range__slides,
        range__slidesSizesGrid
      } = swiper;
      const params = swiper.params.coverflowEffect;
      const isHorizontal = swiper.isHorizontal();
      const transform = swiper.translate;
      const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
      const rotate = isHorizontal ? params.rotate : -params.rotate;
      const translate = params.depth; // Each range__slide offset from center

      for (let i = 0, length = range__slides.length; i < length; i += 1) {
        const $range__slideEl = range__slides.eq(i);
        const range__slideSize = range__slidesSizesGrid[i];
        const range__slideOffset = $range__slideEl[0].swiperrange__slideOffset;
        const offsetMultiplier = (center - range__slideOffset - range__slideSize / 2) / range__slideSize * params.modifier;
        let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
        let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

        let translateZ = -translate * Math.abs(offsetMultiplier);
        let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive range__sliders

        if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
          stretch = parseFloat(params.stretch) / 100 * range__slideSize;
        }

        let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
        let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
        let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

        if (Math.abs(translateX) < 0.001) translateX = 0;
        if (Math.abs(translateY) < 0.001) translateY = 0;
        if (Math.abs(translateZ) < 0.001) translateZ = 0;
        if (Math.abs(rotateY) < 0.001) rotateY = 0;
        if (Math.abs(rotateX) < 0.001) rotateX = 0;
        if (Math.abs(scale) < 0.001) scale = 0;
        const range__slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        const $targetEl = effectTarget(params, $range__slideEl);
        $targetEl.transform(range__slideTransform);
        $range__slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

        if (params.range__slideShadows) {
          // Set shadows
          let $shadowBeforeEl = isHorizontal ? $range__slideEl.find('.swiper-range__slide-shadow-left') : $range__slideEl.find('.swiper-range__slide-shadow-top');
          let $shadowAfterEl = isHorizontal ? $range__slideEl.find('.swiper-range__slide-shadow-right') : $range__slideEl.find('.swiper-range__slide-shadow-bottom');

          if ($shadowBeforeEl.length === 0) {
            $shadowBeforeEl = createShadow(params, $range__slideEl, isHorizontal ? 'left' : 'top');
          }

          if ($shadowAfterEl.length === 0) {
            $shadowAfterEl = createShadow(params, $range__slideEl, isHorizontal ? 'right' : 'bottom');
          }

          if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
          if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
        }
      }
    };

    const setTransition = duration => {
      const {
        transformEl
      } = swiper.params.coverflowEffect;
      const $transitionElements = transformEl ? swiper.range__slides.find(transformEl) : swiper.range__slides;
      $transitionElements.transition(duration).find('.swiper-range__slide-shadow-top, .swiper-range__slide-shadow-right, .swiper-range__slide-shadow-bottom, .swiper-range__slide-shadow-left').transition(duration);
    };

    effectInit({
      effect: 'coverflow',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        watchrange__slidesProgress: true
      })
    });
  }

  function EffectCreative({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      creativeEffect: {
        transformEl: null,
        limitProgress: 1,
        shadowPerProgress: false,
        progressMultiplier: 1,
        perspective: true,
        prev: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1
        },
        next: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1
        }
      }
    });

    const getTranslateValue = value => {
      if (typeof value === 'string') return value;
      return `${value}px`;
    };

    const setTranslate = () => {
      const {
        range__slides,
        $wrapperEl,
        range__slidesSizesGrid
      } = swiper;
      const params = swiper.params.creativeEffect;
      const {
        progressMultiplier: multiplier
      } = params;
      const isCenteredrange__slides = swiper.params.centeredrange__slides;

      if (isCenteredrange__slides) {
        const margin = range__slidesSizesGrid[0] / 2 - swiper.params.range__slidesOffsetBefore || 0;
        $wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
      }

      for (let i = 0; i < range__slides.length; i += 1) {
        const $range__slideEl = range__slides.eq(i);
        const range__slideProgress = $range__slideEl[0].progress;
        const progress = Math.min(Math.max($range__slideEl[0].progress, -params.limitProgress), params.limitProgress);
        let originalProgress = progress;

        if (!isCenteredrange__slides) {
          originalProgress = Math.min(Math.max($range__slideEl[0].originalProgress, -params.limitProgress), params.limitProgress);
        }

        const offset = $range__slideEl[0].swiperrange__slideOffset;
        const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
        const r = [0, 0, 0];
        let custom = false;

        if (!swiper.isHorizontal()) {
          t[1] = t[0];
          t[0] = 0;
        }

        let data = {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          scale: 1,
          opacity: 1
        };

        if (progress < 0) {
          data = params.next;
          custom = true;
        } else if (progress > 0) {
          data = params.prev;
          custom = true;
        } // set translate


        t.forEach((value, index) => {
          t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
        }); // set rotates

        r.forEach((value, index) => {
          r[index] = data.rotate[index] * Math.abs(progress * multiplier);
        });
        $range__slideEl[0].style.zIndex = -Math.abs(Math.round(range__slideProgress)) + range__slides.length;
        const translateString = t.join(', ');
        const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
        const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
        const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
        const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

        if (custom && data.shadow || !custom) {
          let $shadowEl = $range__slideEl.children('.swiper-range__slide-shadow');

          if ($shadowEl.length === 0 && data.shadow) {
            $shadowEl = createShadow(params, $range__slideEl);
          }

          if ($shadowEl.length) {
            const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
            $shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
          }
        }

        const $targetEl = effectTarget(params, $range__slideEl);
        $targetEl.transform(transform).css({
          opacity: opacityString
        });

        if (data.origin) {
          $targetEl.css('transform-origin', data.origin);
        }
      }
    };

    const setTransition = duration => {
      const {
        transformEl
      } = swiper.params.creativeEffect;
      const $transitionElements = transformEl ? swiper.range__slides.find(transformEl) : swiper.range__slides;
      $transitionElements.transition(duration).find('.swiper-range__slide-shadow').transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl,
        allrange__slides: true
      });
    };

    effectInit({
      effect: 'creative',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => swiper.params.creativeEffect.perspective,
      overwriteParams: () => ({
        watchrange__slidesProgress: true,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  function EffectCards({
    swiper,
    extendParams,
    on
  }) {
    extendParams({
      cardsEffect: {
        range__slideShadows: true,
        transformEl: null
      }
    });

    const setTranslate = () => {
      const {
        range__slides,
        activeIndex
      } = swiper;
      const params = swiper.params.cardsEffect;
      const {
        startTranslate,
        isTouched
      } = swiper.touchEventsData;
      const currentTranslate = swiper.translate;

      for (let i = 0; i < range__slides.length; i += 1) {
        const $range__slideEl = range__slides.eq(i);
        const range__slideProgress = $range__slideEl[0].progress;
        const progress = Math.min(Math.max(range__slideProgress, -4), 4);
        let offset = $range__slideEl[0].swiperrange__slideOffset;

        if (swiper.params.centeredrange__slides && !swiper.params.cssMode) {
          swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
        }

        if (swiper.params.centeredrange__slides && swiper.params.cssMode) {
          offset -= range__slides[0].swiperrange__slideOffset;
        }

        let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
        let tY = 0;
        const tZ = -100 * Math.abs(progress);
        let scale = 1;
        let rotate = -2 * progress;
        let tXAdd = 8 - Math.abs(progress) * 0.75;
        const isSwipeToNext = (i === activeIndex || i === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
        const isSwipeToPrev = (i === activeIndex || i === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;

        if (isSwipeToNext || isSwipeToPrev) {
          const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
          rotate += -28 * progress * subProgress;
          scale += -0.5 * subProgress;
          tXAdd += 96 * subProgress;
          tY = `${-25 * subProgress * Math.abs(progress)}%`;
        }

        if (progress < 0) {
          // next
          tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
        } else if (progress > 0) {
          // prev
          tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
        } else {
          tX = `${tX}px`;
        }

        if (!swiper.isHorizontal()) {
          const prevY = tY;
          tY = tX;
          tX = prevY;
        }

        const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
        const transform = `
      translate3d(${tX}, ${tY}, ${tZ}px)
      rotateZ(${rotate}deg)
      scale(${scaleString})
    `;

        if (params.range__slideShadows) {
          // Set shadows
          let $shadowEl = $range__slideEl.find('.swiper-range__slide-shadow');

          if ($shadowEl.length === 0) {
            $shadowEl = createShadow(params, $range__slideEl);
          }

          if ($shadowEl.length) $shadowEl[0].style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
        }

        $range__slideEl[0].style.zIndex = -Math.abs(Math.round(range__slideProgress)) + range__slides.length;
        const $targetEl = effectTarget(params, $range__slideEl);
        $targetEl.transform(transform);
      }
    };

    const setTransition = duration => {
      const {
        transformEl
      } = swiper.params.cardsEffect;
      const $transitionElements = transformEl ? swiper.range__slides.find(transformEl) : swiper.range__slides;
      $transitionElements.transition(duration).find('.swiper-range__slide-shadow').transition(duration);
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformEl
      });
    };

    effectInit({
      effect: 'cards',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        watchrange__slidesProgress: true,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  // Swiper Class
  const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Lazy, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
  Swiper.use(modules);

  return Swiper;

})));
//# sourceMappingURL=swiper-bundle.js.map
};

export default swiper();
