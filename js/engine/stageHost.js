(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var WIDTH = 960;
  var HEIGHT = 540;

  var rafId = null;
  var activeCleanups = [];
  var activeTimers = [];
  var keyDownListeners = [];
  var activeUpdateFn = null;
  var activeRenderFn = null;
  var paused = false;
  var lastTs = 0;
  var shakeAmp = 0;
  var shakeTimer = 0;
  var hitstopTimer = 0;

  var keys = { left: false, right: false, up: false, down: false, action: false, actionJustPressed: false, dashJustPressed: false };
  var canvasEl = null;
  var ctx = null;
  var overlayEl = null;
  var toolbarEl = null;
  var hudTextEl = null;
  var activeMeta = null;
  var activeCallbacks = null;

  function clearAll() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    for (var i = 0; i < activeTimers.length; i++) {
      clearTimeout(activeTimers[i]);
      clearInterval(activeTimers[i]);
    }
    activeTimers = [];
    for (var j = 0; j < activeCleanups.length; j++) {
      try { activeCleanups[j](); } catch (_) {}
    }
    activeCleanups = [];
    keyDownListeners = [];
    activeUpdateFn = null;
    activeRenderFn = null;
    shakeAmp = 0;
    shakeTimer = 0;
    hitstopTimer = 0;
    keys.left = false; keys.right = false; keys.up = false; keys.down = false;
    keys.action = false; keys.actionJustPressed = false; keys.dashJustPressed = false;
    if (overlayEl) { overlayEl.innerHTML = ''; overlayEl.hidden = true; }
    if (toolbarEl) { toolbarEl.innerHTML = ''; toolbarEl.hidden = true; }
  }

  function onKeyDown(e) {
    if (!activeMeta || paused) return;
    if (document.querySelector('dialog[open]')) return;
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.left = true; e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.right = true; e.preventDefault(); }
    else if (k === 'ArrowUp' || k === 'w' || k === 'W') { keys.up = true; e.preventDefault(); }
    else if (k === 'ArrowDown' || k === 's' || k === 'S') { keys.down = true; e.preventDefault(); }
    else if (k === 'Shift' || k === 'k' || k === 'K') { keys.dashJustPressed = true; e.preventDefault(); }
    else if (k === ' ' || k === 'Enter' || k === 'e' || k === 'E') {
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT')) return;
      if (!keys.action) keys.actionJustPressed = true;
      keys.action = true;
      e.preventDefault();
    }

    for (var i = 0; i < keyDownListeners.length; i++) {
      try { keyDownListeners[i](k, e); } catch (_) {}
    }
  }

  function onKeyUp(e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
    else if (k === 'ArrowUp' || k === 'w' || k === 'W') keys.up = false;
    else if (k === 'ArrowDown' || k === 's' || k === 'S') keys.down = false;
    else if (k === ' ' || k === 'Enter' || k === 'e' || k === 'E') keys.action = false;
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  }

  function tick(ts) {
    if (!activeMeta) return;
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
    lastTs = ts;

    if (!paused) {
      if (shakeTimer > 0) shakeTimer = Math.max(0, shakeTimer - dt);
      if (hitstopTimer > 0) {
        hitstopTimer = Math.max(0, hitstopTimer - dt);
      } else {
        if (activeUpdateFn) activeUpdateFn(dt, keys);
        keys.actionJustPressed = false;
        keys.dashJustPressed = false;
      }
    }
    if (activeRenderFn && ctx) {
      ctx.save();
      if (!paused && shakeTimer > 0 && shakeAmp > 0) {
        var ox = (Math.random() - 0.5) * 2 * shakeAmp;
        var oy = (Math.random() - 0.5) * 2 * shakeAmp;
        ctx.translate(ox, oy);
      }
      activeRenderFn(ctx);
      ctx.restore();
    }
    rafId = requestAnimationFrame(tick);
  }

  var StageHost = {
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,

    initDom: function (refs) {
      canvasEl = refs.canvas;
      overlayEl = refs.overlay;
      toolbarEl = refs.toolbar;
      hudTextEl = refs.statusHud;
      if (canvasEl) {
        canvasEl.width = WIDTH;
        canvasEl.height = HEIGHT;
        ctx = canvasEl.getContext('2d');
      }
    },

    mount: function (stageObj, callbacks) {
      clearAll();
      paused = false;
      lastTs = 0;
      activeMeta = stageObj;
      activeCallbacks = callbacks || {};

      var mod = (root.COG.STAGES || {})[stageObj.id];
      if (!mod || typeof mod.start !== 'function') return;

      mod.start(this.createHost(stageObj), stageObj);
      if (activeUpdateFn || activeRenderFn) {
        rafId = requestAnimationFrame(tick);
      }
    },

    createHost: function (stageObj) {
      var self = this;
      return {
        WIDTH: WIDTH,
        HEIGHT: HEIGHT,
        stage: stageObj,
        keys: keys,
        t: function (k, v) { return root.COG.i18n.t(k, v); },
        pack: function () { return root.COG.i18n.pack(); },
        sfx: function (kind) { root.COG.Audio.play(kind); },
        shake: function (amp, dur) {
          shakeAmp = Math.max(shakeAmp, amp || 6);
          shakeTimer = Math.max(shakeTimer, dur || 0.22);
        },
        hitstop: function (dur) {
          hitstopTimer = Math.max(hitstopTimer, dur || 0.06);
        },
        onKeyDown: function (fn) {
          if (typeof fn === 'function') keyDownListeners.push(fn);
        },
        consumeAction: function () {
          if (keys.actionJustPressed) { keys.actionJustPressed = false; return true; }
          return false;
        },
        consumeDash: function () {
          if (keys.dashJustPressed) { keys.dashJustPressed = false; return true; }
          return false;
        },
        setHud: function (txt) {
          if (hudTextEl) hudTextEl.textContent = txt;
        },
        showOverlay: function (html) {
          if (!overlayEl) return null;
          overlayEl.hidden = false;
          overlayEl.innerHTML = html;
          return overlayEl;
        },
        hideOverlay: function () {
          if (!overlayEl) return;
          overlayEl.innerHTML = '';
          overlayEl.hidden = true;
        },
        setToolbar: function (html) {
          if (!toolbarEl) return null;
          toolbarEl.hidden = !html;
          toolbarEl.innerHTML = html || '';
          return toolbarEl;
        },
        onUpdate: function (fn) { activeUpdateFn = fn; },
        onRender: function (fn) { activeRenderFn = fn; },
        onPointer: function (type, fn) {
          if (!canvasEl) return;
          var h = function (e) {
            if (paused) return;
            var r = canvasEl.getBoundingClientRect();
            var x = (e.clientX - r.left) * (WIDTH / r.width);
            var y = (e.clientY - r.top) * (HEIGHT / r.height);
            fn(x, y, e);
          };
          canvasEl.addEventListener(type, h);
          activeCleanups.push(function () { canvasEl.removeEventListener(type, h); });
        },
        setTimeout: function (fn, ms) {
          var id = setTimeout(fn, ms);
          activeTimers.push(id);
          return id;
        },
        openDialogue: function (dialogueId, cbs) {
          self.pause();
          if (activeCallbacks && activeCallbacks.onDialogue) {
            activeCallbacks.onDialogue(dialogueId, {
              onEffect: cbs && cbs.onEffect,
              onClose: function () {
                self.resume();
                if (cbs && cbs.onClose) cbs.onClose();
              }
            });
          }
        },
        win: function (score, stars, extra) {
          paused = true;
          if (activeCallbacks && activeCallbacks.onWin) activeCallbacks.onWin(score, stars, extra);
        },
        fail: function () {
          paused = true;
          if (activeCallbacks && activeCallbacks.onFail) activeCallbacks.onFail();
        }
      };
    },

    pause: function () {
      paused = true;
      keys.left = false; keys.right = false; keys.up = false; keys.down = false;
    },

    resume: function () {
      if (activeMeta) { paused = false; lastTs = 0; }
    },

    teardown: function () {
      activeMeta = null;
      clearAll();
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

    triggerDash: function () {
      if (!activeMeta || paused) return;
      keys.dashJustPressed = true;
    },

    isRunning: function () { return !!activeMeta; }
  };

  root.COG.StageHost = StageHost;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StageHost;
  }
})(typeof window !== 'undefined' ? window : globalThis);
