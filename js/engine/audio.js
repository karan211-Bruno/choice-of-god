(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var ctx = null;
  var enabled = true;

  function ensureCtx() {
    if (!enabled || typeof window === 'undefined') return null;
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      try { ctx = new AudioCtx(); } catch (_) { return null; }
    }
    if (ctx.state === 'suspended') {
      try { ctx.resume(); } catch (_) {}
    }
    return ctx;
  }

  function tone(freq, dur, type, vol, delay, slideTo) {
    var ac = ensureCtx();
    if (!ac) return;
    try {
      var t0 = ac.currentTime + (delay || 0);
      var osc = ac.createOscillator();
      var g = ac.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.065, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch (_) {}
  }

  var AudioEngine = {
    setEnabled: function (v) { enabled = !!v; },
    isEnabled: function () { return enabled; },
    play: function (kind) {
      if (!enabled) return;
      switch (kind) {
        case 'click': tone(660, 0.06, 'sine', 0.045, 0); break;
        case 'chime':
          tone(587.33, 0.12, 'sine', 0.06, 0);
          tone(880, 0.2, 'sine', 0.05, 0.06);
          break;
        case 'slash': tone(520, 0.1, 'triangle', 0.055, 0, 220); break;
        case 'dash': tone(340, 0.11, 'sine', 0.05, 0, 740); break;
        case 'magic':
          tone(523.25, 0.14, 'triangle', 0.06, 0);
          tone(783.99, 0.18, 'sine', 0.06, 0.06);
          tone(1046.5, 0.24, 'sine', 0.05, 0.12);
          break;
        case 'hit': tone(190, 0.12, 'triangle', 0.055, 0, 110); break;
        case 'choice':
          tone(440, 0.14, 'sine', 0.055, 0);
          tone(659.25, 0.22, 'sine', 0.055, 0.08);
          break;
        case 'win':
          tone(523.25, 0.14, 'triangle', 0.07, 0);
          tone(659.25, 0.14, 'triangle', 0.07, 0.09);
          tone(783.99, 0.16, 'triangle', 0.07, 0.18);
          tone(1046.5, 0.36, 'sine', 0.08, 0.28);
          break;
        case 'fail':
          tone(349.23, 0.18, 'triangle', 0.06, 0);
          tone(261.63, 0.28, 'sine', 0.06, 0.14);
          break;
      }
    }
  };

  root.COG.Audio = AudioEngine;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEngine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
