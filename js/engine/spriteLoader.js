(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var MANIFEST = {
    bg_eden: './assets/bg/bg_eden.jpg',
    bg_ark: './assets/bg/bg_ark.jpg',
    bg_abraham: './assets/bg/bg_abraham.jpg',
    bg_plagues: './assets/bg/bg_plagues.jpg',
    bg_redsea: './assets/bg/bg_redsea.jpg',
    bg_sinai: './assets/bg/bg_sinai.jpg',

    hero_adam: './assets/sprites/hero_adam.png',
    hero_noah: './assets/sprites/hero_noah.png',
    hero_abraham: './assets/sprites/hero_abraham.png',
    hero_moses: './assets/sprites/hero_moses.png',
    hero_aaron: './assets/sprites/hero_aaron.png',
    unit_angel: './assets/sprites/unit_angel.png',
    unit_knight: './assets/sprites/unit_knight.png',
    unit_miriam: './assets/sprites/unit_miriam.png',

    boss_serpent: './assets/sprites/boss_serpent.png',
    boss_pharaoh: './assets/sprites/boss_pharaoh.png',
    enemy_magician: './assets/sprites/enemy_magician.png',
    enemy_chariot: './assets/sprites/enemy_chariot.png',
    animal_sheep: './assets/sprites/animal_sheep.png',
    animal_lion: './assets/sprites/animal_lion.png',

    bld_ark: './assets/sprites/bld_ark.png',
    bld_mill: './assets/sprites/bld_mill.png',
    bld_well: './assets/sprites/bld_well.png',
    bld_pen: './assets/sprites/bld_pen.png',
    prop_tree_life: './assets/sprites/prop_tree_life.png',
    prop_tree_forb: './assets/sprites/prop_tree_forb.png',
    bld_tabernacle: './assets/sprites/bld_tabernacle.png'
  };

  var cache = {};

  function preloadAll() {
    if (typeof Image === 'undefined') return;
    var keys = Object.keys(MANIFEST);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (cache[k]) continue;
      var img = new Image();
      img.decoding = 'async';
      img.src = MANIFEST[k];
      cache[k] = img;
    }
  }

  preloadAll();

  function get(key) {
    var img = cache[key];
    if (img && img.complete && img.naturalWidth > 0) return img;
    return null;
  }

  function getStats() {
    var keys = Object.keys(MANIFEST);
    var loaded = 0;
    var missing = [];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (get(k)) loaded++;
      else missing.push(k);
    }
    return { total: keys.length, loaded: loaded, missing: missing };
  }

  function drawCover(ctx, key, W, H) {
    var img = get(key);
    if (!img) return false;
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var scale = Math.max(W / iw, H / ih);
    var dw = iw * scale;
    var dh = ih * scale;
    var dx = (W - dw) * 0.5;
    var dy = (H - dh) * 0.5;
    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  }

  function drawSprite(ctx, key, x, y, opts) {
    var img = get(key);
    if (!img) return false;
    opts = opts || {};

    var targetH = opts.height || 88;
    var aspect = img.naturalWidth / img.naturalHeight;
    var targetW = opts.width || (targetH * aspect);
    var anchorY = typeof opts.anchorY === 'number' ? opts.anchorY : 0.88;
    var bob = opts.bob || 0;
    var sx = opts.squashX || 1;
    var sy = opts.squashY || 1;

    ctx.save();
    if (typeof opts.alpha === 'number') ctx.globalAlpha = opts.alpha;

    if (!opts.noShadow) {
      var srx = opts.shadowRx || Math.max(14, targetW * 0.3);
      var sry = opts.shadowRy || Math.max(5, targetW * 0.1);
      var syPos = y + (opts.shadowY || 2);
      ctx.fillStyle = 'rgba(34, 22, 12, 0.28)';
      ctx.beginPath();
      ctx.ellipse(x, syPos, srx, sry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (opts.glowColor) {
      var gr = opts.glowRadius || targetH * 0.55;
      var grad = ctx.createRadialGradient(x, y - targetH * 0.42, 4, x, y - targetH * 0.42, gr);
      grad.addColorStop(0, opts.glowColor);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y - targetH * 0.42, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.translate(x, y - bob);
    if (opts.rot) ctx.rotate(opts.rot);
    ctx.scale((opts.flipX ? -1 : 1) * sx, sy);

    if (opts.hitFlash) {
      ctx.filter = 'brightness(1.45) contrast(1.08)';
    }

    ctx.drawImage(img, -targetW * 0.5, -targetH * anchorY, targetW, targetH);
    ctx.restore();
    return true;
  }

  function drawLevelBadge(ctx, x, y, label, fillColor) {
    ctx.save();
    ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var textW = Math.max(38, ctx.measureText(label).width + 14);
    ctx.fillStyle = 'rgba(28, 19, 10, 0.56)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x - textW * 0.5, y - 10, textW, 20, 10);
    else ctx.rect(x - textW * 0.5, y - 10, textW, 20);
    ctx.fill();

    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#291709';
    ctx.strokeText(label, x, y);
    ctx.fillStyle = fillColor || '#fde047';
    ctx.fillText(label, x, y);
    ctx.restore();
  }

  function drawGlossyBar(ctx, x, y, w, h, ratio, fillColor, bgColor) {
    var r = Math.max(0, Math.min(1, ratio));
    var rad = Math.min(h * 0.5, 7);
    ctx.save();
    ctx.fillStyle = bgColor || '#1e1b18';
    ctx.strokeStyle = '#291709';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, rad);
    else ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();

    if (r > 0.01) {
      var fw = Math.max(4, (w - 4) * r);
      ctx.fillStyle = fillColor || '#22c55e';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x + 2, y + 2, fw, h - 4, Math.max(2, rad - 2));
      else ctx.rect(x + 2, y + 2, fw, h - 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.36)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x + 3, y + 2.5, Math.max(2, fw - 2), Math.max(2, (h - 4) * 0.42), 2);
      else ctx.rect(x + 3, y + 2.5, Math.max(2, fw - 2), Math.max(2, (h - 4) * 0.42));
      ctx.fill();
    }
    ctx.restore();
  }

  function drawUpgradeArrow(ctx, x, y, t) {
    var bounce = Math.sin(t * 7) * 4;
    ctx.save();
    ctx.translate(x, y + bounce);
    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 2.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -11);
    ctx.lineTo(10, 0);
    ctx.lineTo(4, 0);
    ctx.lineTo(4, 10);
    ctx.lineTo(-4, 10);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  root.COG.Sprites = {
    MANIFEST: MANIFEST,
    preloadAll: preloadAll,
    get: get,
    getStats: getStats,
    drawCover: drawCover,
    drawSprite: drawSprite,
    drawLevelBadge: drawLevelBadge,
    drawGlossyBar: drawGlossyBar,
    drawUpgradeArrow: drawUpgradeArrow
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.Sprites;
  }
})(typeof window !== 'undefined' ? window : globalThis);
