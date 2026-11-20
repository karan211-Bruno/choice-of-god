(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var WIDTH = 960;
  var HEIGHT = 540;

  var rafId = null;
  var activeCleanups = [];
  var activeIntervals = [];
  var activeTimeouts = [];
  var activeUpdateFn = null;
  var activeRenderFn = null;
  var activeItemHandler = null;
  var paused = false;
  var lastTs = 0;

  var keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    action: false,
    actionJustPressed: false
  };

  var canvasEl = null;
  var ctx = null;
  var overlayEl = null;
  var statusHudEl = null;
  var activeCallbacks = null;
  var activeMeta = null;

  function clearRuntimeResources() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    for (var i = 0; i < activeIntervals.length; i++) {
      clearInterval(activeIntervals[i]);
    }
    activeIntervals = [];
    for (var j = 0; j < activeTimeouts.length; j++) {
      clearTimeout(activeTimeouts[j]);
    }
    activeTimeouts = [];
    for (var k = 0; k < activeCleanups.length; k++) {
      try { activeCleanups[k](); } catch (_) {}
    }
    activeCleanups = [];
    activeUpdateFn = null;
    activeRenderFn = null;
    activeItemHandler = null;
    keys.left = false;
    keys.right = false;
    keys.up = false;
    keys.down = false;
    keys.action = false;
    keys.actionJustPressed = false;
    if (overlayEl) {
      overlayEl.innerHTML = '';
      overlayEl.hidden = true;
    }
  }

  function handleKeyDown(e) {
    if (!activeMeta) return;
    // Ignore when typing or inside modal dialog
    if (document.querySelector('dialog[open]')) return;
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') {
      keys.left = true;
      e.preventDefault();
    } else if (k === 'ArrowRight' || k === 'd' || k === 'D') {
      keys.right = true;
      e.preventDefault();
    } else if (k === 'ArrowUp' || k === 'w' || k === 'W') {
      keys.up = true;
      e.preventDefault();
    } else if (k === 'ArrowDown' || k === 's' || k === 'S') {
      keys.down = true;
      e.preventDefault();
    } else if (k === ' ' || k === 'Enter') {
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'SELECT')) {
        return;
      }
      if (!keys.action) {
        keys.actionJustPressed = true;
      }
      keys.action = true;
      e.preventDefault();
    }
  }

  function handleKeyUp(e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
    else if (k === 'ArrowUp' || k === 'w' || k === 'W') keys.up = false;
    else if (k === 'ArrowDown' || k === 's' || k === 'S') keys.down = false;
    else if (k === ' ' || k === 'Enter') keys.action = false;
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  function loop(ts) {
    if (!activeMeta) return;
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
    lastTs = ts;

    if (!paused) {
      if (activeUpdateFn) {
        activeUpdateFn(dt, keys);
      }
      keys.actionJustPressed = false;
      if (activeRenderFn && ctx) {
        ctx.save();
        activeRenderFn(ctx);
        ctx.restore();
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  var Runner = {
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,

    initDom: function (refs) {
      canvasEl = refs.canvas;
      overlayEl = refs.overlay;
      statusHudEl = refs.statusHud;
      if (canvasEl) {
        canvasEl.width = WIDTH;
        canvasEl.height = HEIGHT;
        ctx = canvasEl.getContext('2d');
      }
    },

    mount: function (chapterObj, levelObj, callbacks) {
      clearRuntimeResources();
      paused = false;
      lastTs = 0;
      activeMeta = { chapter: chapterObj, level: levelObj };
      activeCallbacks = callbacks || {};

      var games = root.COG.GAMES || {};
      var gameModule = games[chapterObj.id];
      if (!gameModule || typeof gameModule.start !== 'function') {
        return;
      }

      var host = this.createHostContext(chapterObj, levelObj);
      gameModule.start(host, levelObj);

      if (activeUpdateFn || activeRenderFn) {
        rafId = requestAnimationFrame(loop);
      }
    },

    createHostContext: function (chapterObj, levelObj) {
      var self = this;
      return {
        WIDTH: WIDTH,
        HEIGHT: HEIGHT,
        canvas: canvasEl,
        ctx: ctx,
        overlay: overlayEl,
        keys: keys,
        chapter: chapterObj,
        level: levelObj,
        t: function (key, vars) {
          return root.COG.i18n.t(key, vars);
        },
        pack: function () {
          return root.COG.i18n.pack();
        },
        playSfx: function (kind) {
          root.COG.Audio.play(kind);
        },
        consumeAction: function () {
          if (keys.actionJustPressed) {
            keys.actionJustPressed = false;
            return true;
          }
          return false;
        },
        showOverlay: function (html) {
          if (!overlayEl) return;
          overlayEl.hidden = false;
          if (typeof html === 'string') {
            overlayEl.innerHTML = html;
          }
          return overlayEl;
        },
        hideOverlay: function () {
          if (!overlayEl) return;
          overlayEl.innerHTML = '';
          overlayEl.hidden = true;
        },
        setHud: function (text) {
          if (statusHudEl) statusHudEl.textContent = text;
        },
        onUpdate: function (fn) {
          activeUpdateFn = fn;
        },
        onRender: function (fn) {
          activeRenderFn = fn;
        },
        onItemUse: function (fn) {
          activeItemHandler = fn;
        },
        onCanvasPointer: function (fn) {
          if (!canvasEl) return;
          var handler = function (e) {
            if (paused) return;
            var rect = canvasEl.getBoundingClientRect();
            var sx = WIDTH / rect.width;
            var sy = HEIGHT / rect.height;
            var x = (e.clientX - rect.left) * sx;
            var y = (e.clientY - rect.top) * sy;
            fn(x, y, e);
          };
          canvasEl.addEventListener('pointerdown', handler);
          activeCleanups.push(function () {
            canvasEl.removeEventListener('pointerdown', handler);
          });
        },
        setInterval: function (fn, ms) {
          var id = setInterval(fn, ms);
          activeIntervals.push(id);
          return id;
        },
        setTimeout: function (fn, ms) {
          var id = setTimeout(fn, ms);
          activeTimeouts.push(id);
          return id;
        },
        addCleanup: function (fn) {
          if (typeof fn === 'function') activeCleanups.push(fn);
        },
        pause: function () { paused = true; },
        resume: function () { paused = false; lastTs = 0; },
        win: function (score, stars, extra) {
          self.stopLoop();
          if (activeCallbacks && activeCallbacks.onWin) {
            activeCallbacks.onWin(score, stars, extra);
          }
        },
        fail: function (reason) {
          self.stopLoop();
          if (activeCallbacks && activeCallbacks.onFail) {
            activeCallbacks.onFail(reason);
          }
        },
        openEdenChoice: function (callbacks) {
          self.pause();
          if (activeCallbacks && activeCallbacks.onEdenChoice) {
            activeCallbacks.onEdenChoice(callbacks);
          }
        }
      };
    },

    stopLoop: function () {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      paused = true;
    },

    teardown: function () {
      activeMeta = null;
      clearRuntimeResources();
    },

    pause: function () {
      paused = true;
    },

    resume: function () {
      if (activeMeta) {
        paused = false;
        lastTs = 0;
      }
    },

    setTouchKey: function (dir, pressed) {
      if (dir === 'left' || dir === 'right' || dir === 'up' || dir === 'down') {
        keys[dir] = !!pressed;
      }
    },

    triggerAction: function () {
      if (!activeMeta || paused) return;
      keys.actionJustPressed = true;
      keys.action = true;
      setTimeout(function () { keys.action = false; }, 120);
    },

    useItem: function (itemId) {
      if (!activeMeta) return false;
      if (typeof activeItemHandler === 'function') {
        return !!activeItemHandler(itemId);
      }
      return false;
    },

    isRunning: function () {
      return !!activeMeta;
    }
  };

  root.COG.Runner = Runner;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Runner;
  }
})(typeof window !== 'undefined' ? window : globalThis);
