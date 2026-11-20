(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var ctx = null;
  var enabled = true;

  function ensureCtx() {
    if (!enabled) return null;
    if (typeof window === 'undefined') return null;
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      try {
        ctx = new AudioCtx();
      } catch (_) {
        return null;
      }
    }
    if (ctx.state === 'suspended') {
      try { ctx.resume(); } catch (_) {}
    }
    return ctx;
  }

  function playTone(freq, duration, type, volume, delay) {
    var ac = ensureCtx();
    if (!ac) return;
    try {
      var t0 = ac.currentTime + (delay || 0);
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(volume || 0.08, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    } catch (_) {}
  }

  var AudioEngine = {
    setEnabled: function (v) {
      enabled = !!v;
    },

    isEnabled: function () {
      return enabled;
    },

    play: function (kind) {
      if (!enabled) return;
      switch (kind) {
        case 'click':
          playTone(523.25, 0.08, 'triangle', 0.05, 0);
          break;
        case 'chime':
          playTone(587.33, 0.14, 'sine', 0.07, 0);
          playTone(880, 0.22, 'sine', 0.06, 0.07);
          break;
        case 'light':
          playTone(440, 0.15, 'triangle', 0.06, 0);
          playTone(659.25, 0.2, 'sine', 0.07, 0.05);
          playTone(880, 0.25, 'sine', 0.05, 0.1);
          break;
        case 'hit':
          playTone(170, 0.18, 'sawtooth', 0.06, 0);
          playTone(120, 0.22, 'triangle', 0.06, 0.06);
          break;
        case 'choice':
          playTone(392, 0.22, 'sine', 0.06, 0);
          playTone(493.88, 0.24, 'sine', 0.06, 0.1);
          playTone(587.33, 0.34, 'triangle', 0.07, 0.2);
          break;
        case 'win':
          playTone(523.25, 0.18, 'triangle', 0.07, 0);
          playTone(659.25, 0.18, 'triangle', 0.07, 0.1);
          playTone(783.99, 0.22, 'triangle', 0.08, 0.2);
          playTone(1046.5, 0.42, 'sine', 0.08, 0.32);
          break;
        case 'fail':
          playTone(329.63, 0.2, 'triangle', 0.07, 0);
          playTone(261.63, 0.25, 'triangle', 0.07, 0.14);
          playTone(196, 0.35, 'sine', 0.07, 0.28);
          break;
      }
    }
  };

  root.COG.Audio = AudioEngine;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEngine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
