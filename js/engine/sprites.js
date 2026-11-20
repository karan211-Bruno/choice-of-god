(function (root) {
  'use strict';
  root.COG = root.COG || {};

  function drawShadow(ctx, x, y, rx, ry) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBiomeGround(ctx, zone, camX, camY, viewW, viewH, time) {
    var biome = zone.biome;
    // Base biome sky/earth gradient
    var palettes = {
      eden: ['#143d30', '#1d5441', '#276b50'],
      ark: ['#1a293d', '#243a54', '#182436'],
      abraham: ['#3d2c14', '#5c411d', '#735326'],
      egypt: ['#543b1d', '#7a5627', '#946b33'],
      redsea: ['#4d381e', '#6e522d', '#856439'],
      sinai: ['#4a2711', '#693918', '#804820']
    };
    var pal = palettes[biome] || palettes.eden;
    ctx.fillStyle = pal[0];
    ctx.fillRect(0, 0, viewW, viewH);

    // Subtle grass/stone tile grid & organic ground patches
    var tile = 96;
    var startCol = Math.floor(camX / tile);
    var endCol = Math.ceil((camX + viewW) / tile);
    var startRow = Math.floor(camY / tile);
    var endRow = Math.ceil((camY + viewH) / tile);

    for (var r = startRow; r <= endRow; r++) {
      for (var c = startCol; c <= endCol; c++) {
        var wx = c * tile;
        var wy = r * tile;
        var sx = wx - camX;
        var sy = wy - camY;
        var hash = ((c * 73856093) ^ (r * 19349663)) & 255;

        ctx.fillStyle = (c + r) % 2 === 0 ? pal[1] : pal[0];
        ctx.fillRect(sx, sy, tile + 1, tile + 1);

        if (hash < 95) {
          ctx.fillStyle = pal[2];
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.ellipse(sx + 48, sy + 48, 28 + (hash % 14), 16 + (hash % 10), 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        // Subtle grass blades / sand ripples
        if (biome === 'eden' && hash > 150) {
          ctx.strokeStyle = 'rgba(110, 231, 183, 0.25)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx + 24, sy + 64); ctx.lineTo(sx + 20, sy + 52);
          ctx.moveTo(sx + 30, sy + 64); ctx.lineTo(sx + 34, sy + 50);
          ctx.stroke();
        } else if ((biome === 'abraham' || biome === 'sinai') && hash > 165) {
          ctx.fillStyle = 'rgba(253, 230, 138, 0.14)';
          ctx.beginPath();
          ctx.arc(sx + 40, sy + 44, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.save();
    ctx.translate(-camX, -camY);

    // Biome-specific environmental geography
    if (biome === 'eden') {
      // Four sparkling rivers radiating from central Tree of Life (960, 600)
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 36;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(960, 600); ctx.quadraticCurveTo(640, 340, 220, 120);
      ctx.moveTo(960, 600); ctx.quadraticCurveTo(1280, 320, 1740, 120);
      ctx.moveTo(960, 600); ctx.quadraticCurveTo(640, 880, 220, 1140);
      ctx.moveTo(960, 600); ctx.quadraticCurveTo(1320, 880, 1740, 1140);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 10;
      ctx.setLineDash([24, 18]);
      ctx.lineDashOffset = -time * 40;
      ctx.stroke();
      ctx.setLineDash([]);

      // Sanctuary stone plaza under Tree of Life
      ctx.fillStyle = 'rgba(251, 246, 233, 0.16)';
      ctx.beginPath();
      ctx.arc(960, 600, 128, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(230, 185, 92, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (biome === 'ark') {
      // Rain streaks & muddy puddles
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.6;
      for (var i = 0; i < 45; i++) {
        var rx = ((i * 197 + time * 260) % 1920);
        var ry = ((i * 313 + time * 420) % 1280);
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 14, ry + 28); ctx.stroke();
      }
      // Rising shoreline water in north-east corner
      ctx.fillStyle = 'rgba(14, 116, 144, 0.6)';
      ctx.beginPath();
      ctx.moveTo(1320, 0); ctx.lineTo(1920, 0); ctx.lineTo(1920, 520);
      ctx.quadraticCurveTo(1600, 360, 1320, 0);
      ctx.fill();
    } else if (biome === 'egypt') {
      // Nile river canal on left-center & paved sandstone courtyard on right
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(1080, 0, 85, 1280);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(1055, 570, 135, 140); // Bridge!
      ctx.fillStyle = 'rgba(217, 119, 6, 0.25)';
      ctx.fillRect(1260, 320, 560, 640);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 4;
      ctx.strokeRect(1260, 320, 560, 640);
    } else if (biome === 'redsea') {
      // Towering animated turquoise Walls of Water on Top & Bottom!
      var topH = 220;
      var botY = 1060;
      var gradTop = ctx.createLinearGradient(0, 0, 0, topH);
      gradTop.addColorStop(0, '#0c4a6e');
      gradTop.addColorStop(0.75, '#0284c7');
      gradTop.addColorStop(1, '#67e8f9');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, 1920, topH);

      var gradBot = ctx.createLinearGradient(0, botY, 0, 1280);
      gradBot.addColorStop(0, '#67e8f9');
      gradBot.addColorStop(0.25, '#0284c7');
      gradBot.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = gradBot;
      ctx.fillRect(0, botY, 1920, 1280 - botY);

      // Foaming wave crests along the water walls
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (var wx = 0; wx <= 1920; wx += 40) {
        var wy1 = topH + Math.sin(wx * 0.03 + time * 4) * 8;
        if (wx === 0) ctx.moveTo(wx, wy1);
        else ctx.lineTo(wx, wy1);
      }
      ctx.stroke();
      ctx.beginPath();
      for (var wx2 = 0; wx2 <= 1920; wx2 += 40) {
        var wy2 = botY + Math.cos(wx2 * 0.03 + time * 4) * 8;
        if (wx2 === 0) ctx.moveTo(wx2, wy2);
        else ctx.lineTo(wx2, wy2);
      }
      ctx.stroke();
    } else if (biome === 'sinai') {
      // Mountain ridge silhouette along northern Sinai
      ctx.fillStyle = '#3b1c0b';
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(1920, 0); ctx.lineTo(1920, 145);
      ctx.lineTo(1480, 95); ctx.lineTo(960, 165); ctx.lineTo(440, 100); ctx.lineTo(0, 150);
      ctx.closePath();
      ctx.fill();
      // Golden Tabernacle perimeter lines
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(810, 460, 300, 240);
    }

    // World outer border glow
    ctx.strokeStyle = 'rgba(230, 185, 92, 0.45)';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, zone.width - 8, zone.height - 8);
    ctx.restore();
  }

  function drawLandmark(ctx, lm, time, extraState) {
    var x = lm.x;
    var y = lm.y;
    ctx.save();
    if (lm.kind === 'tree_of_life') {
      var pulse = 68 + Math.sin(time * 2.5) * 6;
      var gr = ctx.createRadialGradient(x, y - 20, 10, x, y - 20, pulse + 25);
      gr.addColorStop(0, 'rgba(253, 224, 71, 0.55)');
      gr.addColorStop(1, 'rgba(52, 211, 153, 0)');
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(x, y - 20, pulse + 25, 0, Math.PI * 2); ctx.fill();
      drawShadow(ctx, x, y + 36, 46, 16);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x - 14, y - 20, 28, 60);
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(x, y - 42, 48, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#34d399';
      ctx.beginPath(); ctx.arc(x - 24, y - 24, 28, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 24, y - 24, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fef08a';
      for (var i = 0; i < 6; i++) {
        var ang = (i / 6) * Math.PI * 2 + time * 0.4;
        ctx.beginPath();
        ctx.arc(x + Math.cos(ang) * 32, y - 34 + Math.sin(ang) * 20, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (lm.kind === 'forbidden_tree') {
      drawShadow(ctx, x, y + 32, 38, 14);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x - 11, y - 16, 22, 52);
      ctx.fillStyle = '#581c87';
      ctx.beginPath(); ctx.arc(x, y - 34, 40, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(x - 14, y - 26, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 15, y - 38, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 2, y - 18, 6, 0, Math.PI * 2); ctx.fill();
    } else if (lm.kind === 'eden_gate') {
      drawShadow(ctx, x, y + 32, 54, 16);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x - 42, y - 46, 16, 80);
      ctx.fillRect(x + 26, y - 46, 16, 80);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x - 50, y - 60, 100, 18);
    } else if (lm.kind === 'ark_hull') {
      drawShadow(ctx, x, y + 52, 130, 32);
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(x - 135, y - 20);
      ctx.lineTo(x + 135, y - 20);
      ctx.lineTo(x + 100, y + 54);
      ctx.lineTo(x - 100, y + 54);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = '#92400e';
      ctx.fillRect(x - 95, y - 68, 190, 48);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x - 104, y - 78, 208, 14);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x - 16, y - 28, 32, 42);
    } else if (lm.kind === 'rainbow_arch' && extraState && extraState.rainbowActive) {
      var cols = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'];
      cols.forEach(function (c, idx) {
        ctx.strokeStyle = c;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(x, y + 180, 190 - idx * 7, Math.PI, Math.PI * 2);
        ctx.stroke();
      });
    } else if (lm.kind === 'stone_altar') {
      drawShadow(ctx, x, y + 22, 36, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x - 30, y - 12, 60, 32);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x - 36, y - 20, 72, 12);
      ctx.fillStyle = '#fb923c';
      ctx.beginPath(); ctx.arc(x, y - 26, 12 + Math.sin(time * 8) * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(x, y - 26, 6, 0, Math.PI * 2); ctx.fill();
    } else if (lm.kind === 'burning_bush') {
      drawShadow(ctx, x, y + 26, 36, 14);
      ctx.fillStyle = '#15803d';
      ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
      for (var f = 0; f < 5; f++) {
        var fx = x - 16 + f * 8;
        var fh = 22 + Math.sin(time * 9 + f) * 8;
        ctx.beginPath();
        ctx.moveTo(fx - 7, y + 4);
        ctx.lineTo(fx, y - fh);
        ctx.lineTo(fx + 7, y + 4);
        ctx.fill();
      }
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(x, y - 8, 9, 0, Math.PI * 2); ctx.fill();
    } else if (lm.kind === 'obelisk') {
      drawShadow(ctx, x, y + 36, 34, 14);
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(x - 18, y + 36); ctx.lineTo(x - 10, y - 62);
      ctx.lineTo(x, y - 82); ctx.lineTo(x + 10, y - 62); ctx.lineTo(x + 18, y + 36);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath(); ctx.moveTo(x - 10, y - 62); ctx.lineTo(x, y - 82); ctx.lineTo(x + 10, y - 62); ctx.fill();
    } else if (lm.kind === 'pillar_fire') {
      var pf = ctx.createRadialGradient(x, y - 30, 8, x, y - 30, 74);
      pf.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      pf.addColorStop(0.5, 'rgba(249, 115, 22, 0.5)');
      pf.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = pf;
      ctx.beginPath(); ctx.arc(x, y - 30, 74, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(x - 16, y - 78, 32, 100);
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(x - 8, y - 74, 16, 92);
    } else if (lm.kind === 'horeb_rock') {
      drawShadow(ctx, x, y + 30, 48, 18);
      ctx.fillStyle = '#78716c';
      ctx.beginPath();
      ctx.moveTo(x - 45, y + 28); ctx.lineTo(x - 24, y - 34);
      ctx.lineTo(x + 22, y - 28); ctx.lineTo(x + 48, y + 28);
      ctx.closePath(); ctx.fill();
      // Living water stream
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.quadraticCurveTo(x + 18, y + 26, x + 54, y + 54); ctx.stroke();
    } else if (lm.kind === 'tabernacle') {
      drawShadow(ctx, x, y + 40, 88, 28);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(x - 68, y - 36, 136, 72);
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.moveTo(x - 78, y - 36); ctx.lineTo(x, y - 74); ctx.lineTo(x + 78, y - 36);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 68, y - 36, 136, 72);
      if (extraState && extraState.tabernacleLit) {
        var tg = ctx.createRadialGradient(x, y - 30, 10, x, y - 30, 120);
        tg.addColorStop(0, 'rgba(253, 224, 71, 0.75)');
        tg.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(x, y - 30, 120, 0, Math.PI * 2); ctx.fill();
      }
    } else if (lm.kind === 'golden_calf') {
      drawShadow(ctx, x, y + 22, 26, 10);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x - 22, y + 2, 44, 20);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x - 14, y - 18, 28, 20);
      ctx.fillRect(x + 8, y - 28, 12, 14);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 14, y - 18, 28, 20);
    }
    ctx.restore();
  }

  function drawHero(ctx, hero, time) {
    var x = hero.x;
    var y = hero.y;
    var bob = hero.moving ? Math.sin(time * 16) * 3.5 : Math.sin(time * 3) * 1.2;
    var stride = hero.moving ? Math.sin(time * 16) * 6 : 0;

    ctx.save();
    drawShadow(ctx, x, y + 22, 18, 7);

    // Shield aura
    if (hero.shieldTimer > 0 || hero.invuln > 0) {
      ctx.strokeStyle = hero.shieldTimer > 0 ? '#34d399' : '#67e8f9';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.stroke();
    }

    var cloakColors = {
      adam_eve: '#10b981',
      noah: '#2563eb',
      abraham: '#d97706',
      moses: '#b91c1c'
    };
    var tunicColors = {
      adam_eve: '#fef3c7',
      noah: '#cbd5e1',
      abraham: '#fef3c7',
      moses: '#e2e8f0'
    };
    var cCol = cloakColors[hero.heroType] || '#2563eb';
    var tCol = tunicColors[hero.heroType] || '#fef3c7';

    // Legs
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 8, y + 10 + stride * 0.4, 6, 12);
    ctx.fillRect(x + 2, y + 10 - stride * 0.4, 6, 12);

    // Tunic & Flowing Cloak
    ctx.fillStyle = cCol;
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 8 + bob);
    ctx.lineTo(x + 14, y - 8 + bob);
    ctx.lineTo(x + 17, y + 14 + bob);
    ctx.lineTo(x - 17, y + 14 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = tCol;
    ctx.fillRect(x - 8, y - 8 + bob, 16, 20);

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.beginPath(); ctx.arc(x, y - 16 + bob, 11, 0, Math.PI * 2); ctx.fill();
    // Hair / Beard / Crown band
    ctx.fillStyle = hero.heroType === 'adam_eve' ? '#78350f' : '#e2e8f0';
    ctx.beginPath(); ctx.arc(x, y - 19 + bob, 11, Math.PI, Math.PI * 2); ctx.fill();
    if (hero.heroType === 'noah' || hero.heroType === 'abraham' || hero.heroType === 'moses') {
      ctx.beginPath(); ctx.moveTo(x - 7, y - 12 + bob); ctx.lineTo(x, y - 3 + bob); ctx.lineTo(x + 7, y - 12 + bob); ctx.fill();
    }
    // Golden headband
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - 10, y - 22 + bob, 20, 3);

    // Equipped Blade / Staff held at facing angle
    var ang = hero.facingAngle || 0;
    var swingOffset = hero.attackTimer > 0 ? Math.sin((1 - hero.attackTimer / 0.22) * Math.PI) * 1.4 - 0.7 : 0;
    var wAng = ang + swingOffset;
    var wx = x + Math.cos(wAng) * 16;
    var wy = y + Math.sin(wAng) * 16 + bob;
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + Math.cos(wAng) * 26, wy + Math.sin(wAng) * 26);
    ctx.stroke();

    // Slash Arc VFX
    if (hero.attackTimer > 0) {
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.75)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(x, y, 56, ang - 0.95, ang + 0.95);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCompanion(ctx, comp, guide, time) {
    var x = comp.x;
    var y = comp.y + Math.sin(time * 5) * 6;
    var wingFlap = Math.sin(time * 12) * 8;
    ctx.save();
    // Wings
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.beginPath();
    ctx.moveTo(x - 6, y); ctx.lineTo(x - 24, y - 12 + wingFlap); ctx.lineTo(x - 14, y + 6); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 6, y); ctx.lineTo(x + 24, y - 12 + wingFlap); ctx.lineTo(x + 14, y + 6); ctx.closePath(); ctx.fill();
    // Core orb
    ctx.fillStyle = (guide && guide.color) || '#f59e0b';
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawNpc(ctx, npc, time, near) {
    var x = npc.x;
    var y = npc.y;
    ctx.save();
    drawShadow(ctx, x, y + 20, 16, 6);
    if (near) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, 30 + Math.sin(time * 6) * 3, 0, Math.PI * 2); ctx.stroke();
    }
    if (npc.spriteType === 'cherubim' || npc.spriteType === 'angel_lord') {
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x - 24, y - 18); ctx.lineTo(x - 10, y + 6); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x + 24, y - 18); ctx.lineTo(x + 10, y + 6); ctx.fill();
    }
    ctx.fillStyle = npc.spriteType === 'miriam' ? '#0891b2' : '#d97706';
    ctx.fillRect(x - 11, y - 6, 22, 24);
    ctx.fillStyle = '#fde68a';
    ctx.beginPath(); ctx.arc(x, y - 14, 10, 0, Math.PI * 2); ctx.fill();
    // Golden exclamation / speech indicator
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(x, y - 36 + Math.sin(time * 4) * 3, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawInteractable(ctx, node, time, near) {
    var x = node.x;
    var y = node.y + Math.sin(time * 4 + x) * 3;
    ctx.save();
    drawShadow(ctx, node.x, node.y + 18, 15, 5);
    if (near) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(node.x, node.y, 28, 0, Math.PI * 2); ctx.stroke();
    }
    switch (node.kind) {
      case 'crystal':
      case 'star_beacon':
        ctx.fillStyle = node.kind === 'crystal' ? '#fde047' : '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(x, y - 16); ctx.lineTo(x + 12, y); ctx.lineTo(x, y + 16); ctx.lineTo(x - 12, y);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        break;
      case 'timber':
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x - 18, y - 7, 36, 14);
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.strokeRect(x - 18, y - 7, 36, 14);
        break;
      case 'pitch':
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(x, y + 2, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x - 6, y - 13, 12, 6);
        break;
      case 'animal_pair':
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath(); ctx.arc(x - 7, y, 9, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 9, y + 2, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.arc(x - 13, y - 4, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 14, y - 2, 4, 0, Math.PI * 2); ctx.fill();
        break;
      case 'goshen_door':
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x - 16, y - 20, 32, 36);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 12, y - 16, 24, 28);
        break;
      case 'pillar_beacon':
        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.arc(x, y - 4, 15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(x, y - 4, 8, 0, Math.PI * 2); ctx.fill();
        break;
      case 'traveler':
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x - 9, y - 4, 18, 20);
        ctx.fillStyle = '#fde68a';
        ctx.beginPath(); ctx.arc(x, y - 10, 8, 0, Math.PI * 2); ctx.fill();
        break;
      case 'manna':
      default:
        ctx.fillStyle = '#fef9c3';
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.stroke();
        break;
    }
    ctx.restore();
  }

  function drawEnemy(ctx, en, time) {
    var x = en.x;
    var y = en.y;
    ctx.save();
    drawShadow(ctx, x, y + 18, 16, 6);
    var flash = en.flash > 0;
    if (en.kind === 'serpent_minion' || en.kind === 'shadow_wisp') {
      ctx.fillStyle = flash ? '#fff' : (en.kind === 'serpent_minion' ? '#7f1d1d' : '#4c1d95');
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.beginPath(); ctx.arc(x - 5, y - 3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 5, y - 3, 2.5, 0, Math.PI * 2); ctx.fill();
    } else if (en.kind === 'chariot') {
      ctx.fillStyle = flash ? '#fff' : '#92400e';
      ctx.fillRect(x - 20, y - 12, 40, 22);
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x - 14, y + 12, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 14, y + 12, 8, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = flash ? '#fff' : (en.kind === 'storm_wraith' ? '#1e40af' : '#991b1b');
      ctx.fillRect(x - 12, y - 10, 24, 24);
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath(); ctx.arc(x, y - 15, 9, 0, Math.PI * 2); ctx.fill();
    }
    // Enemy HP bar
    if (en.hp < en.maxHp) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 18, y - 32, 36, 5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 18, y - 32, 36 * Math.max(0, en.hp / en.maxHp), 5);
    }
    ctx.restore();
  }

  function drawBoss(ctx, boss, time) {
    var x = boss.x;
    var y = boss.y;
    ctx.save();
    drawShadow(ctx, x, y + 36, 42, 14);
    if (boss.telegraphTimer > 0) {
      var prog = 1 - boss.telegraphTimer / boss.telegraphMax;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(boss.telegraphX, boss.telegraphY, boss.telegraphR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(boss.telegraphX, boss.telegraphY, boss.telegraphR * prog, 0, Math.PI * 2);
      ctx.stroke();
    }

    var bodyCol = boss.flash > 0 ? '#ffffff' : (boss.phase2 ? '#dc2626' : '#7f1d1d');
    if (boss.kind === 'boss_serpent') {
      ctx.fillStyle = bodyCol;
      for (var s = 2; s >= 0; s--) {
        ctx.beginPath();
        ctx.arc(x - s * 18, y + Math.sin(time * 5 + s) * 8, 26 - s * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fde047';
      ctx.beginPath(); ctx.arc(x + 10, y - 6, 4, 0, Math.PI * 2); ctx.fill();
    } else if (boss.kind === 'boss_leviathan') {
      ctx.fillStyle = boss.flash > 0 ? '#fff' : '#1d4ed8';
      ctx.beginPath(); ctx.arc(x, y, 36, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 4; ctx.stroke();
    } else {
      ctx.fillStyle = bodyCol;
      ctx.fillRect(x - 24, y - 22, 48, 52);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(x, y - 28, 17, 0, Math.PI * 2); ctx.fill();
      // Crown / Horns
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(x - 16, y - 38); ctx.lineTo(x - 10, y - 52); ctx.lineTo(x, y - 42);
      ctx.lineTo(x + 10, y - 52); ctx.lineTo(x + 16, y - 38);
      ctx.fill();
    }
    ctx.restore();
  }

  function getPortraitSvg(kind) {
    var cfg = {
      cherubim: { bg: '#1e3a8a', accent: '#fde047', hair: '#fef08a', robe: '#e0f2fe' },
      serpent: { bg: '#450a0a', accent: '#f87171', hair: '#7f1d1d', robe: '#581c87' },
      noah_ally: { bg: '#1e293b', accent: '#60a5fa', hair: '#cbd5e1', robe: '#2563eb' },
      lot: { bg: '#422006', accent: '#fbbf24', hair: '#92400e', robe: '#d97706' },
      burning_bush: { bg: '#431407', accent: '#fb923c', hair: '#fde047', robe: '#15803d' },
      miriam: { bg: '#083344', accent: '#38bdf8', hair: '#1e293b', robe: '#0891b2' },
      golden_calf: { bg: '#451a03', accent: '#facc15', hair: '#94a3b8', robe: '#b45309' }
    }[kind] || { bg: '#1e293b', accent: '#e6b95c', hair: '#fef3c7', robe: '#334155' };

    return '<svg viewBox="0 0 80 80" width="74" height="74" aria-hidden="true">' +
      '<rect width="80" height="80" rx="14" fill="' + cfg.bg + '"/>' +
      '<circle cx="40" cy="40" r="34" fill="none" stroke="' + cfg.accent + '" stroke-width="2" stroke-opacity="0.65"/>' +
      '<path d="M16 74 C16 54 64 54 64 74 Z" fill="' + cfg.robe + '"/>' +
      '<circle cx="40" cy="36" r="15" fill="#fde68a"/>' +
      '<path d="M25 34 A15 15 0 0 1 55 34 Z" fill="' + cfg.hair + '"/>' +
      '<circle cx="35" cy="36" r="2" fill="#0f172a"/><circle cx="45" cy="36" r="2" fill="#0f172a"/>' +
      '</svg>';
  }

  root.COG.Sprites = {
    drawBiomeGround: drawBiomeGround,
    drawLandmark: drawLandmark,
    drawHero: drawHero,
    drawCompanion: drawCompanion,
    drawNpc: drawNpc,
    drawInteractable: drawInteractable,
    drawEnemy: drawEnemy,
    drawBoss: drawBoss,
    getPortraitSvg: getPortraitSvg
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.Sprites;
  }
})(typeof window !== 'undefined' ? window : globalThis);
