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
      g.gain.exponentialRampToValueAtTime(vol || 0.07, t0 + 0.015);
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
        case 'click':
          tone(540, 0.06, 'triangle', 0.04, 0);
          break;
        case 'slash':
          tone(420, 0.11, 'triangle', 0.06, 0, 170);
          break;
        case 'dash':
          tone(280, 0.12, 'sine', 0.05, 0, 620);
          break;
        case 'skill_nova':
          tone(440, 0.25, 'triangle', 0.07, 0, 880);
          tone(659, 0.25, 'sine', 0.06, 0.05);
          break;
        case 'skill_beam':
          tone(740, 0.28, 'sawtooth', 0.05, 0, 320);
          break;
        case 'heal':
          tone(523, 0.16, 'sine', 0.06, 0);
          tone(659, 0.18, 'sine', 0.06, 0.08);
          tone(784, 0.28, 'sine', 0.06, 0.16);
          break;
        case 'hit':
          tone(160, 0.12, 'sawtooth', 0.06, 0, 90);
          break;
        case 'enemy_down':
          tone(330, 0.1, 'triangle', 0.06, 0);
          tone(520, 0.16, 'sine', 0.06, 0.06);
          break;
        case 'boss_roar':
          tone(130, 0.35, 'sawtooth', 0.08, 0, 68);
          break;
        case 'quest_done':
          tone(587, 0.14, 'triangle', 0.07, 0);
          tone(784, 0.16, 'triangle', 0.07, 0.08);
          tone(987, 0.26, 'sine', 0.07, 0.16);
          break;
        case 'levelup':
          tone(523, 0.14, 'triangle', 0.07, 0);
          tone(659, 0.14, 'triangle', 0.07, 0.09);
          tone(784, 0.16, 'triangle', 0.07, 0.18);
          tone(1046, 0.36, 'sine', 0.08, 0.28);
          break;
        case 'dialogue':
          tone(440, 0.07, 'sine', 0.04, 0);
          break;
        case 'choice':
          tone(392, 0.16, 'sine', 0.06, 0);
          tone(587, 0.24, 'triangle', 0.06, 0.09);
          break;
      }
    }
  };

  root.COG.Audio = AudioEngine;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEngine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
