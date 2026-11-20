(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var SUPPORTED = ['ko', 'en', 'ja', 'es', 'zh'];
  var currentLang = 'ko';
  var listeners = [];

  function resolvePath(obj, path) {
    if (!obj || !path) return undefined;
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function format(str, vars) {
    if (typeof str !== 'string') return str;
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (_, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : '{' + k + '}';
    });
  }

  var I18n = {
    SUPPORTED: SUPPORTED,

    init: function (savedLang) {
      var lang = savedLang;
      if (!lang) {
        try {
          lang = root.localStorage ? root.localStorage.getItem('cog_lang') : null;
        } catch (_) {}
      }
      if (!lang || SUPPORTED.indexOf(lang) === -1) {
        lang = 'ko';
      }
      this.setLang(lang, true);
      return currentLang;
    },

    getLang: function () {
      return currentLang;
    },

    pack: function (langCode) {
      var code = langCode || currentLang;
      var packs = (root.COG && root.COG.I18N) || {};
      return packs[code] || packs.ko || packs.en || {};
    },

    setLang: function (langCode, silent) {
      if (SUPPORTED.indexOf(langCode) === -1) {
        langCode = 'ko';
      }
      currentLang = langCode;
      try {
        if (root.localStorage) {
          root.localStorage.setItem('cog_lang', langCode);
        }
      } catch (_) {}

      if (typeof document !== 'undefined') {
        document.documentElement.lang = langCode;
        var p = this.pack(langCode);
        if (p && p.metaTitle) {
          document.title = p.metaTitle;
        }
        this.applyDom(document);
      }

      if (!silent) {
        for (var i = 0; i < listeners.length; i++) {
          try {
            listeners[i](langCode);
          } catch (_) {}
        }
      }
    },

    t: function (path, vars) {
      var packs = (root.COG && root.COG.I18N) || {};
      var val = resolvePath(packs[currentLang], path);
      if (val === undefined) {
        val = resolvePath(packs.en, path);
      }
      if (val === undefined) {
        val = resolvePath(packs.ko, path);
      }
      if (val === undefined) return path;
      return format(val, vars);
    },

    applyDom: function (container) {
      if (!container || !container.querySelectorAll) return;
      var nodes = container.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var key = el.getAttribute('data-i18n');
        var txt = this.t(key);
        if (typeof txt === 'string') {
          el.textContent = txt;
        }
      }
      var ariaNodes = container.querySelectorAll('[data-i18n-aria]');
      for (var j = 0; j < ariaNodes.length; j++) {
        var ael = ariaNodes[j];
        var akey = ael.getAttribute('data-i18n-aria');
        var atxt = this.t(akey);
        if (typeof atxt === 'string') {
          ael.setAttribute('aria-label', atxt);
        }
      }
    },

    onChange: function (fn) {
      if (typeof fn === 'function') {
        listeners.push(fn);
      }
    }
  };

  root.COG.i18n = I18n;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
  }
})(typeof window !== 'undefined' ? window : globalThis);
