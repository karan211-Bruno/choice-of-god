(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var INK = '#4a3228';

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawShadow(ctx, x, y, rx, ry) {
    ctx.fillStyle = 'rgba(74, 50, 40, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCuteFace(ctx, x, y, eyeSep, blink, angry) {
    // Rosy blush cheeks
    ctx.fillStyle = 'rgba(251, 146, 160, 0.65)';
    ctx.beginPath(); ctx.ellipse(x - eyeSep - 3, y + 4, 4.2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + eyeSep + 3, y + 4, 4.2, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    if (blink) {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - eyeSep - 3, y); ctx.lineTo(x - eyeSep + 3, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + eyeSep - 3, y); ctx.lineTo(x + eyeSep + 3, y); ctx.stroke();
    } else {
      [-eyeSep, eyeSep].forEach(function (dx) {
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(x + dx, y, 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x + dx - 1.1, y - 1.2, 1.4, 0, Math.PI * 2); ctx.fill();
      });
    }

    // Smile or mischievous grin
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (angry) {
      ctx.arc(x, y + 7, 4, Math.PI + 0.3, Math.PI * 2 - 0.3);
    } else {
      ctx.arc(x, y + 4, 4, 0.2, Math.PI - 0.2);
    }
    ctx.stroke();
  }

  function drawChibiHero(ctx, x, y, opts, t) {
    opts = opts || {};
    var kind = opts.kind || 'adam_eve';
    var scale = opts.scale || 1;
    var bob = opts.moving ? Math.abs(Math.sin(t * 14)) * 5 : Math.sin(t * 3.5) * 2;
    var blink = (t % 4.2) > 4.08;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 22, 18, 6);

    var colors = {
      adam_eve: { tunic: '#a7f3d0', trim: '#10b981', hair: '#92400e', band: '#facc15' },
      noah: { tunic: '#93c5fd', trim: '#2563eb', hair: '#f8fafc', band: '#a16207' },
      abraham: { tunic: '#fde68a', trim: '#d97706', hair: '#f8fafc', band: '#b45309' },
      moses: { tunic: '#fed7aa', trim: '#ea580c', hair: '#78350f', band: '#facc15' },
      aaron: { tunic: '#e9d5ff', trim: '#9333ea', hair: '#cbd5e1', band: '#fbbf24' },
      miriam: { tunic: '#a5f3fc', trim: '#0891b2', hair: '#78350f', band: '#fde047' },
      knight: { tunic: '#bae6fd', trim: '#0284c7', hair: '#94a3b8', band: '#facc15' }
    }[kind] || { tunic: '#a7f3d0', trim: '#10b981', hair: '#92400e', band: '#facc15' };

    // Little rounded feet
    var stride = opts.moving ? Math.sin(t * 14) * 5 : 0;
    ctx.fillStyle = '#854d0e';
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-7, 17 + stride * 0.35, 5.5, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(7, 17 - stride * 0.35, 5.5, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Cute rounded body
    ctx.fillStyle = colors.tunic;
    roundRect(ctx, -14, -4 - bob, 28, 22, 11);
    ctx.fill();
    ctx.stroke();

    // Trim / Scarf
    ctx.fillStyle = colors.trim;
    roundRect(ctx, -13, -4 - bob, 26, 7, 4);
    ctx.fill();

    // Big Chibi Head
    ctx.fillStyle = '#fde6cd';
    ctx.beginPath(); ctx.arc(0, -18 - bob, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Fluffy Hair dome
    ctx.fillStyle = colors.hair;
    ctx.beginPath(); ctx.arc(0, -22 - bob, 17.5, Math.PI * 0.92, Math.PI * 2.08); ctx.fill(); ctx.stroke();

    // Headband / Crown
    ctx.fillStyle = colors.band;
    roundRect(ctx, -15, -26 - bob, 30, 4.5, 2);
    ctx.fill();

    // Beard for Noah / Abraham / Moses
    if (kind === 'noah' || kind === 'abraham' || kind === 'moses') {
      ctx.fillStyle = kind === 'moses' ? '#78350f' : '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-10, -10 - bob);
      ctx.quadraticCurveTo(0, 1 - bob, 10, -10 - bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    drawCuteFace(ctx, 0, -16 - bob, 6.5, blink, false);

    // Held Weapon / Staff
    if (opts.weapon !== 'none') {
      var ang = opts.facingAngle || 0;
      var swing = opts.attackTimer > 0 ? Math.sin((1 - opts.attackTimer / 0.22) * Math.PI) * 1.5 - 0.75 : 0;
      var wa = ang + swing;
      var wx = Math.cos(wa) * 14;
      var wy = -2 - bob + Math.sin(wa) * 14;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx + Math.cos(wa) * 24, wy + Math.sin(wa) * 24);
      ctx.stroke();
      // Star tip
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(wx + Math.cos(wa) * 24, wy + Math.sin(wa) * 24, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (opts.attackTimer > 0) {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.78)';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, -4, 48, (opts.facingAngle || 0) - 0.9, (opts.facingAngle || 0) + 0.9);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawCuteAngel(ctx, x, y, color, t, scale) {
    scale = scale || 1;
    var floatY = Math.sin(t * 4.5) * 5;
    var flap = Math.sin(t * 10) * 6;
    ctx.save();
    ctx.translate(x, y + floatY);
    ctx.scale(scale, scale);

    // Halo
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, -30, 11, 4, 0, 0, Math.PI * 2); ctx.stroke();

    // Fluffy Wings
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-18, -4 + flap * 0.4, 12, 7, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(18, -4 + flap * 0.4, 12, 7, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Robe
    ctx.fillStyle = '#e0f2fe';
    roundRect(ctx, -11, -6, 22, 19, 9);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = color || '#38bdf8';
    roundRect(ctx, -5, -5, 10, 17, 4);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fde6cd';
    ctx.beginPath(); ctx.arc(0, -16, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -19, 13.5, Math.PI, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCuteFace(ctx, 0, -15, 5, false, false);
    ctx.restore();
  }

  function drawCuteAnimal(ctx, x, y, kind, t, scale) {
    scale = scale || 1;
    var hop = Math.abs(Math.sin(t * 5 + x)) * 4;
    ctx.save();
    ctx.translate(x, y - hop);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 14 + hop, 14, 5);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;

    if (kind === 'dove') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(0, 0, 12, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(8, -7, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fb923c';
      ctx.beginPath(); ctx.moveTo(14, -7); ctx.lineTo(20, -5); ctx.lineTo(14, -3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.ellipse(18, -2, 5, 2.5, 0.3, 0, Math.PI * 2); ctx.fill();
    } else if (kind === 'lion') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath(); ctx.arc(0, -4, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath(); ctx.arc(0, -4, 10, 0, Math.PI * 2); ctx.fill();
      drawCuteFace(ctx, 0, -5, 4.5, false, false);
    } else if (kind === 'elephant') {
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath(); ctx.ellipse(-12, -4, 7, 10, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(12, -4, 7, 10, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -3, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawCuteFace(ctx, 0, -5, 4.5, false, false);
      ctx.fillStyle = '#60a5fa';
      roundRect(ctx, -3, 0, 6, 11, 3); ctx.fill(); ctx.stroke();
    } else {
      // Fluffy Sheep
      ctx.fillStyle = '#fffbeb';
      [[-8, -6], [8, -6], [-10, 2], [10, 2], [0, -10], [0, 3]].forEach(function (o) {
        ctx.beginPath(); ctx.arc(o[0], o[1], 7.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      ctx.fillStyle = '#fde6cd';
      ctx.beginPath(); ctx.arc(0, -2, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawCuteFace(ctx, 0, -3, 4, false, false);
    }
    ctx.restore();
  }

  function drawCuteSerpent(ctx, x, y, t, scale, isBoss) {
    scale = scale || 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 18, isBoss ? 28 : 14, 6);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;

    // Coils
    ctx.fillStyle = isBoss ? '#9333ea' : '#a855f7';
    ctx.beginPath(); ctx.ellipse(-10, 8 + Math.sin(t * 6) * 2, 13, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c084fc';
    ctx.beginPath(); ctx.ellipse(6, 10 + Math.cos(t * 6) * 2, 11, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Cute Big Head
    ctx.fillStyle = isBoss ? '#a855f7' : '#c084fc';
    ctx.beginPath(); ctx.arc(0, -6, isBoss ? 18 : 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Rosy tummy spot
    ctx.fillStyle = '#fda4af';
    ctx.beginPath(); ctx.ellipse(0, 6, 7, 5, 0, 0, Math.PI * 2); ctx.fill();

    drawCuteFace(ctx, 0, -8, isBoss ? 7 : 5, false, true);
    if (isBoss) {
      // Cute tiny royal crown on boss serpent
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-10, -22); ctx.lineTo(-7, -32); ctx.lineTo(0, -26);
      ctx.lineTo(7, -32); ctx.lineTo(10, -22); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawCutePharaohOrGuard(ctx, x, y, isBoss, t, scale) {
    scale = scale || 1;
    var bob = Math.sin(t * 4) * 3;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 22 - bob, 18, 6);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;

    // Nemes headdress stripes
    ctx.fillStyle = isBoss ? '#facc15' : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-19, -20); ctx.lineTo(0, -34); ctx.lineTo(19, -20);
    ctx.lineTo(22, -2); ctx.lineTo(-22, -2); ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Body
    ctx.fillStyle = isBoss ? '#fb7185' : '#cbd5e1';
    roundRect(ctx, -13, -4, 26, 22, 10); ctx.fill(); ctx.stroke();

    // Face
    ctx.fillStyle = '#f6d5b0';
    ctx.beginPath(); ctx.arc(0, -16, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCuteFace(ctx, 0, -16, 5.5, false, true);
    ctx.restore();
  }

  function drawChariot(ctx, x, y, t, isBoss) {
    var jolt = Math.sin(t * 16 + x) * 2;
    ctx.save();
    ctx.translate(x, y + jolt);
    drawShadow(ctx, 0, 18, isBoss ? 34 : 22, 7);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;

    // Chariot Body
    ctx.fillStyle = isBoss ? '#e11d48' : '#d97706';
    roundRect(ctx, -20, -14, 40, 22, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-16, -6, 32, 5);

    // Chibi Driver Head
    ctx.fillStyle = '#f6d5b0';
    ctx.beginPath(); ctx.arc(4, -22, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCuteFace(ctx, 4, -22, 4, false, true);

    // Wheels
    [-12, 12].forEach(function (wx) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(wx, 11, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(wx, 11, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  function drawFlower(ctx, x, y, col, t) {
    var sway = Math.sin(t * 2.5 + x * 0.1) * 2;
    ctx.save();
    ctx.translate(x + sway, y);
    ctx.fillStyle = col || '#ffffff';
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 5, Math.sin(a) * 5, 3.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawButterfly(ctx, x, y, col, t) {
    var wing = Math.abs(Math.sin(t * 14 + x)) * 5 + 2;
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 4 + x) * 4);
    ctx.fillStyle = col || '#f472b6';
    ctx.beginPath(); ctx.ellipse(-4, 0, wing, 5, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, 0, wing, 5, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawStarGem(ctx, x, y, col, t) {
    var bob = Math.sin(t * 4 + x) * 4;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = col || '#facc15';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var r = i % 2 === 0 ? 13 : 5.5;
      var a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  root.COG.ChibiSprites = {
    INK: INK,
    roundRect: roundRect,
    drawShadow: drawShadow,
    drawCuteFace: drawCuteFace,
    drawChibiHero: drawChibiHero,
    drawCuteAngel: drawCuteAngel,
    drawCuteAnimal: drawCuteAnimal,
    drawCuteSerpent: drawCuteSerpent,
    drawCutePharaohOrGuard: drawCutePharaohOrGuard,
    drawChariot: drawChariot,
    drawFlower: drawFlower,
    drawButterfly: drawButterfly,
    drawStarGem: drawStarGem
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.ChibiSprites;
  }
})(typeof window !== 'undefined' ? window : globalThis);
