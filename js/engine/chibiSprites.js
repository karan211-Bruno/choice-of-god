(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var INK = '#3b2416';

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
    ctx.fillStyle = 'rgba(42, 26, 14, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCuteFace(ctx, x, y, eyeSep, blink, angry) {
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

    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (angry) ctx.arc(x, y + 7, 4, Math.PI + 0.3, Math.PI * 2 - 0.3);
    else ctx.arc(x, y + 4, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  function selectFrame(opts, t) {
    if (typeof opts.frame === 'number') return opts.frame;
    if (opts.attackTimer > 0 || opts.animState === 'attack') return 3;
    if (opts.moving || opts.animState === 'run') return (Math.floor(t * 9.5) % 2 === 0 ? 1 : 2);
    return 0;
  }

  function drawSlashRibbon(ctx, x, y, facingAngle, attackTimer, comboIdx) {
    var prog = 1 - Math.min(1, attackTimer / 0.24);
    var col = comboIdx === 3 ? '#fb7185' : (comboIdx === 2 ? '#facc15' : '#fde047');
    var rev = comboIdx === 2 ? -1 : 1;
    var r = comboIdx === 3 ? 66 : 54;

    ctx.save();
    ctx.translate(x, y - 26);
    ctx.rotate(facingAngle || 0);
    ctx.scale(1, rev);

    ctx.globalAlpha = Math.max(0.18, 1 - prog * 0.65);
    ctx.strokeStyle = col;
    ctx.lineWidth = (comboIdx === 3 ? 15 : 11) * (1 - prog * 0.45);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, r, -1.1 + prog * 0.38, 1.0 + prog * 0.28);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4.5 * (1 - prog * 0.4);
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, -0.92 + prog * 0.38, 0.85 + prog * 0.28);
    ctx.stroke();
    ctx.restore();
  }

  function drawChibiHero(ctx, x, y, opts, t) {
    opts = opts || {};
    var kind = opts.kind || 'adam_eve';
    var scale = opts.scale || 1;
    var Sp = root.COG.Sprites;
    var keyMap = {
      adam_eve: 'hero_adam',
      noah: 'hero_noah',
      abraham: 'hero_abraham',
      moses: 'hero_moses',
      aaron: 'hero_aaron',
      miriam: 'unit_miriam',
      knight: 'unit_knight'
    };
    var spriteKey = keyMap[kind] || 'hero_adam';
    var sheetKey = spriteKey + '_sheet';
    var frame = selectFrame(opts, t);
    var targetH = (opts.height || 92) * scale;
    var isRun = (opts.moving || opts.animState === 'run') && frame !== 3;
    var bob = frame === 3 ? 4 : (isRun ? Math.abs(Math.sin(t * 14)) * 5 : Math.sin(t * 3.5) * 1.2);
    var flipX = typeof opts.flipX === 'boolean'
      ? opts.flipX
      : (typeof opts.facingAngle === 'number' && Math.cos(opts.facingAngle) < -0.15);
    var squashY = frame === 3
      ? 1.04
      : (isRun ? (1 + Math.sin(t * 28) * 0.04) : (1 + Math.sin(t * 3.8) * 0.022));
    var squashX = 1 / squashY;
    var alpha = (opts.invuln > 0 && Math.floor(t * 16) % 2 === 0) ? 0.52 : 1;

    var drawOpts = {
      height: targetH,
      anchorY: 0.94,
      bob: bob,
      flipX: flipX,
      squashX: squashX,
      squashY: squashY,
      rot: opts.rot || (isRun ? Math.sin(t * 14) * 0.045 : 0),
      alpha: alpha,
      hitFlash: opts.hitFlash,
      glowColor: opts.glowColor
    };

    var rendered = false;
    if (Sp && Sp.drawAnimFrame && Sp.drawAnimFrame(ctx, sheetKey, frame, x, y, drawOpts)) {
      rendered = true;
    } else if (Sp && Sp.drawSprite(ctx, spriteKey, x, y, {
      height: targetH,
      anchorY: 0.88,
      bob: bob,
      flipX: flipX,
      squashX: squashX,
      squashY: squashY,
      rot: drawOpts.rot,
      alpha: alpha,
      hitFlash: opts.hitFlash,
      glowColor: opts.glowColor
    })) {
      rendered = true;
    }

    if (rendered) {
      if (opts.attackTimer > 0) {
        drawSlashRibbon(ctx, x, y, opts.facingAngle || 0, opts.attackTimer, opts.comboIdx || 1);
      }
      if (opts.lv && Sp.drawLevelBadge) {
        Sp.drawLevelBadge(ctx, x, y - targetH * 1.0 - bob, 'Lv.' + opts.lv, '#fde047');
      }
      return;
    }

    // Procedural fallback before image load
    var blink = (t % 4.2) > 4.08;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 22, 18, 6);
    ctx.fillStyle = '#a7f3d0';
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    roundRect(ctx, -14, -4 - bob, 28, 22, 11); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fde6cd';
    ctx.beginPath(); ctx.arc(0, -18 - bob, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCuteFace(ctx, 0, -16 - bob, 6.5, blink, false);
    if (opts.attackTimer > 0) drawSlashRibbon(ctx, 0, 20, opts.facingAngle || 0, opts.attackTimer, opts.comboIdx || 1);
    ctx.restore();
  }

  function drawCuteAngel(ctx, x, y, color, t, scale, opts) {
    scale = scale || 1;
    opts = opts || {};
    var Sp = root.COG.Sprites;
    var floatY = Math.sin(t * 4.8) * 5;
    var targetH = (opts.height || 78) * scale;
    var frame = typeof opts.frame === 'number'
      ? opts.frame
      : ((opts.attackTimer > 0 || opts.animState === 'attack') ? 3 : ((Math.floor(t * 6.5) % 2 === 0) ? 1 : 2));

    var sheetOk = Sp && Sp.drawAnimFrame && Sp.drawAnimFrame(ctx, 'unit_angel_sheet', frame, x, y + floatY, {
      height: targetH,
      anchorY: 0.92,
      squashY: 1 + Math.sin(t * 4.5) * 0.03,
      shadowY: 16 - floatY,
      flipX: opts.flipX,
      glowColor: 'rgba(186, 230, 253, 0.42)'
    });

    if (sheetOk || (Sp && Sp.drawSprite(ctx, 'unit_angel', x, y + floatY, {
      height: targetH,
      anchorY: 0.85,
      squashY: 1 + Math.sin(t * 4.5) * 0.03,
      shadowY: 16 - floatY,
      flipX: opts.flipX,
      glowColor: 'rgba(186, 230, 253, 0.42)'
    }))) {
      return;
    }

    var flap = Math.sin(t * 10) * 6;
    ctx.save();
    ctx.translate(x, y + floatY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, -30, 11, 4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-18, -4 + flap * 0.4, 12, 7, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(18, -4 + flap * 0.4, 12, 7, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e0f2fe';
    roundRect(ctx, -11, -6, 22, 19, 9); ctx.fill(); ctx.stroke();
    drawCuteFace(ctx, 0, -15, 5, false, false);
    ctx.restore();
  }

  function drawCuteAnimal(ctx, x, y, kind, t, scale, opts) {
    scale = scale || 1;
    opts = opts || {};
    var hop = Math.abs(Math.sin(t * 5.2 + x * 0.08)) * 5;
    var Sp = root.COG.Sprites;

    if (kind !== 'dove' && Sp) {
      var animalKey = kind === 'lion' ? 'animal_lion' : 'animal_sheep';
      var th = (opts.height || 58) * scale;
      if (Sp.drawSprite(ctx, animalKey, x, y, {
        height: th,
        anchorY: 0.88,
        bob: hop,
        flipX: opts.flipX,
        squashY: 1 + Math.sin(t * 5.2) * 0.045
      })) {
        return;
      }
    }

    ctx.save();
    ctx.translate(x, y - hop);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 14 + hop, 14, 5);
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    if (kind === 'dove') {
      var wing = Math.sin(t * 14 + x) * 5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(0, 0, 12, 8.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-2, -6 + wing * 0.4, 9, 4.5, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(9, -6, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fb923c';
      ctx.beginPath(); ctx.moveTo(14, -6); ctx.lineTo(20, -4); ctx.lineTo(14, -2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.ellipse(18, -1, 5, 2.5, 0.3, 0, Math.PI * 2); ctx.fill();
    } else if (kind === 'lion') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath(); ctx.arc(0, -4, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawCuteFace(ctx, 0, -5, 4.5, false, false);
    } else {
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath(); ctx.arc(0, -2, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      drawCuteFace(ctx, 0, -3, 4, false, false);
    }
    ctx.restore();
  }

  function drawCuteSerpent(ctx, x, y, t, scale, isBoss, opts) {
    scale = scale || 1;
    opts = opts || {};
    var Sp = root.COG.Sprites;
    var targetH = (opts.height || (isBoss ? 114 : 74)) * scale;
    var slither = Math.sin(t * 5.2 + x * 0.05) * 3;
    var frame = selectFrame(opts, t);

    var rendered = Sp && Sp.drawAnimFrame && Sp.drawAnimFrame(ctx, 'boss_serpent_sheet', frame, x, y, {
      height: targetH,
      anchorY: 0.92,
      bob: Math.abs(slither),
      flipX: opts.flipX,
      squashY: 1 + Math.sin(t * 5 + x) * 0.04,
      hitFlash: opts.hitFlash,
      glowColor: opts.glowColor || (isBoss ? 'rgba(192, 132, 252, 0.45)' : null)
    });

    if (rendered || (Sp && Sp.drawSprite(ctx, 'boss_serpent', x, y, {
      height: targetH,
      anchorY: 0.88,
      bob: Math.abs(slither),
      flipX: opts.flipX,
      squashY: 1 + Math.sin(t * 5 + x) * 0.04,
      hitFlash: opts.hitFlash,
      glowColor: opts.glowColor || (isBoss ? 'rgba(192, 132, 252, 0.45)' : null)
    }))) {
      if (isBoss && Sp.drawLevelBadge) {
        Sp.drawLevelBadge(ctx, x, y - targetH * 0.98, 'BOSS', '#fb7185');
      }
      return;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 18, isBoss ? 28 : 14, 6);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    ctx.fillStyle = isBoss ? '#9333ea' : '#a855f7';
    ctx.beginPath(); ctx.ellipse(-10, 8 + Math.sin(t * 6) * 2, 13, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c084fc';
    ctx.beginPath(); ctx.arc(0, -6, isBoss ? 18 : 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCuteFace(ctx, 0, -8, isBoss ? 7 : 5, false, true);
    ctx.restore();
  }

  function drawCutePharaohOrGuard(ctx, x, y, isBoss, t, scale, opts) {
    scale = scale || 1;
    opts = opts || {};
    var Sp = root.COG.Sprites;
    var key = isBoss ? 'boss_pharaoh' : 'enemy_magician';
    var targetH = (opts.height || (isBoss ? 104 : 88)) * scale;
    var dx = opts.lungeX || 0;
    var frame = selectFrame(opts, t);

    var rendered = Sp && Sp.drawAnimFrame && Sp.drawAnimFrame(ctx, key + '_sheet', frame, x + dx, y, {
      height: targetH,
      anchorY: 0.94,
      squashY: 1 + Math.sin(t * 3.6 + (isBoss ? 0 : 1.2)) * 0.028,
      flipX: opts.flipX,
      hitFlash: opts.hitFlash,
      glowColor: opts.glowColor || (isBoss ? 'rgba(251, 191, 36, 0.34)' : null)
    });

    if (rendered || (Sp && Sp.drawSprite(ctx, key, x + dx, y, {
      height: targetH,
      anchorY: 0.88,
      squashY: 1 + Math.sin(t * 3.6 + (isBoss ? 0 : 1.2)) * 0.028,
      flipX: opts.flipX,
      hitFlash: opts.hitFlash,
      glowColor: opts.glowColor || (isBoss ? 'rgba(251, 191, 36, 0.34)' : null)
    }))) {
      if (opts.lv && Sp.drawLevelBadge) {
        Sp.drawLevelBadge(ctx, x + dx, y - targetH * 1.0, opts.lv, '#fb7185');
      }
      return;
    }

    var bob = Math.sin(t * 4) * 3;
    ctx.save();
    ctx.translate(x + dx, y + bob);
    ctx.scale(scale, scale);
    drawShadow(ctx, 0, 22 - bob, 18, 6);
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.fillStyle = isBoss ? '#facc15' : '#94a3b8';
    ctx.beginPath(); ctx.moveTo(-19, -20); ctx.lineTo(0, -34); ctx.lineTo(19, -20); ctx.lineTo(22, -2); ctx.lineTo(-22, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f6d5b0';
    ctx.beginPath(); ctx.arc(0, -16, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawCuteFace(ctx, 0, -16, 5.5, false, true);
    ctx.restore();
  }

  function drawChariot(ctx, x, y, t, isBoss, opts) {
    opts = opts || {};
    var Sp = root.COG.Sprites;
    var jolt = Math.abs(Math.sin(t * 16 + x * 0.05)) * 3.5;
    var targetH = opts.height || (isBoss ? 108 : 78);

    if (Sp && Sp.drawSprite(ctx, 'enemy_chariot', x, y, {
      height: targetH,
      anchorY: 0.86,
      bob: jolt,
      flipX: opts.flipX,
      rot: Math.sin(t * 16) * 0.03,
      squashY: 1 + Math.sin(t * 16) * 0.04,
      hitFlash: opts.hitFlash,
      glowColor: isBoss ? 'rgba(244, 63, 94, 0.44)' : null
    })) {
      // Animated spinning golden wheel gleam markers
      ctx.save();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
      ctx.lineWidth = 2.2;
      var ang = -t * 12;
      var wy = y - 10 - jolt;
      [x - 16, x + 16].forEach(function (wx) {
        ctx.beginPath();
        ctx.arc(wx, wy, 7, ang, ang + 1.4);
        ctx.stroke();
      });
      ctx.restore();

      if (isBoss && Sp.drawLevelBadge) {
        Sp.drawLevelBadge(ctx, x, y - targetH * 0.94, 'BOSS', '#fb7185');
      }
      return;
    }

    ctx.save();
    ctx.translate(x, y + jolt);
    drawShadow(ctx, 0, 18, isBoss ? 34 : 22, 7);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    ctx.fillStyle = isBoss ? '#e11d48' : '#d97706';
    roundRect(ctx, -20, -14, 40, 22, 8); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawBuilding(ctx, kind, x, y, opts, t) {
    opts = opts || {};
    var Sp = root.COG.Sprites;
    var map = {
      ark: 'bld_ark',
      mill: 'bld_mill',
      well: 'bld_well',
      pen: 'bld_pen',
      tabernacle: 'bld_tabernacle'
    };
    var key = map[kind];
    var h = opts.height || 86;
    var pop = opts.bob > 0 ? (1 + Math.sin(opts.bob * Math.PI) * 0.18) : 1;

    if (key && Sp && Sp.drawSprite(ctx, key, x, y, {
      height: h,
      anchorY: opts.anchorY || 0.78,
      squashX: pop,
      squashY: pop,
      shadowRx: h * 0.42,
      shadowRy: h * 0.16,
      shadowY: 4,
      glowColor: opts.glowColor,
      glowRadius: opts.glowRadius
    })) {
      if (opts.level && Sp.drawLevelBadge) {
        Sp.drawLevelBadge(ctx, x, y - h * 0.72, 'Lv.' + opts.level, '#fde047');
      }
      if (opts.canUpgrade && Sp.drawUpgradeArrow) {
        Sp.drawUpgradeArrow(ctx, x + h * 0.34, y - h * 0.56, t || 0);
      }
      return;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(pop, pop);
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.fillStyle = '#fbbf24';
    roundRect(ctx, -24, -22, 48, 30, 8); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawLandmark(ctx, kind, x, y, opts, t) {
    opts = opts || {};
    var Sp = root.COG.Sprites;
    var key = kind === 'tree_forb' ? 'prop_tree_forb' : 'prop_tree_life';
    var h = opts.height || 145;
    var sway = Math.sin((t || 0) * 2.1 + x * 0.04) * 0.014;

    if (Sp && Sp.drawSprite(ctx, key, x, y, {
      height: h,
      anchorY: 0.9,
      squashX: 1 + sway,
      squashY: 1 - sway,
      shadowRx: h * 0.34,
      shadowRy: h * 0.12,
      glowColor: opts.glow
    })) {
      return;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = kind === 'tree_forb' ? '#d8b4fe' : '#34d399';
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, -45, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawFlower(ctx, x, y, col, t) {
    var sway = Math.sin(t * 2.5 + x * 0.1) * 2;
    ctx.save();
    ctx.translate(x + sway, y);
    ctx.fillStyle = col || '#ffffff';
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 4.5, Math.sin(a) * 4.5, 2.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, Math.PI * 2); ctx.fill();
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
    ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
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
    selectFrame: selectFrame,
    drawChibiHero: drawChibiHero,
    drawCuteAngel: drawCuteAngel,
    drawCuteAnimal: drawCuteAnimal,
    drawCuteSerpent: drawCuteSerpent,
    drawCutePharaohOrGuard: drawCutePharaohOrGuard,
    drawChariot: drawChariot,
    drawBuilding: drawBuilding,
    drawLandmark: drawLandmark,
    drawFlower: drawFlower,
    drawButterfly: drawButterfly,
    drawStarGem: drawStarGem
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.ChibiSprites;
  }
})(typeof window !== 'undefined' ? window : globalThis);
