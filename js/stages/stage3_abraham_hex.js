(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.abraham = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var uiT = function () { return host.pack().stageUi.abraham; };

      var COLS = 7, ROWS = 5, HEX_R = 46;
      var OX = 185, OY = 115;

      function hexCenter(c, r) {
        var x = OX + c * 92 + (r % 2 === 1 ? 46 : 0);
        var y = OY + r * 78;
        return { x: x, y: y };
      }

      // Build 7x5 Canaan map
      var tiles = [];
      for (var r = 0; r < ROWS; r++) {
        tiles[r] = [];
        for (var c = 0; c < COLS; c++) {
          tiles[r][c] = { c: c, r: r, type: 'plain', cleared: false };
        }
      }
      tiles[4][0].type = 'start';
      tiles[3][2].type = 'lot';
      tiles[2][1].type = 'shrine';
      tiles[1][3].type = 'shrine';
      tiles[3][5].type = 'shrine';
      tiles[2][4].type = 'raider';
      tiles[1][5].type = 'raider';
      tiles[0][6].type = 'moriah';

      var heroHex = { c: 0, r: 4 };
      var turn = 1;
      var faith = 40;
      var food = 40;
      var shrinesLit = 0;
      var time = 0;

      function isNeighbor(c1, r1, c2, r2) {
        if (c1 === c2 && r1 === r2) return false;
        var p1 = hexCenter(c1, r1);
        var p2 = hexCenter(c2, r2);
        var d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        return d < 105;
      }

      function stepTo(c, r) {
        if (!isNeighbor(heroHex.c, heroHex.r, c, r)) return;
        heroHex.c = c; heroHex.r = r;
        turn++;
        food = Math.max(5, food - 2);
        var tile = tiles[r][c];
        host.sfx('click');

        if (tile.type === 'shrine' && !tile.cleared) {
          tile.cleared = true;
          shrinesLit++;
          faith += 15;
          host.sfx('magic');
          root.COG.State.addStat({ faith: 3, score: 150 });
        } else if (tile.type === 'lot' && !tile.cleared) {
          tile.cleared = true;
          host.openDialogue('abraham_lot', {
            onEffect: function (eff) {
              faith += (eff.faith || 0) * 2;
              root.COG.State.addStat(eff);
            }
          });
        } else if (tile.type === 'raider' && !tile.cleared) {
          tile.cleared = true;
          faith += 10;
          food += 10;
          host.sfx('slash');
          root.COG.State.addStat({ score: 150 });
        } else if (tile.type === 'moriah') {
          if (shrinesLit >= 3) {
            host.sfx('win');
            host.win(stageObj.baseScore + faith * 6, 3, {
              faith: 8, wisdom: 5,
              customSummary: host.t('stages.abraham.outro')
            });
            return;
          }
        }
        updateHud();
      }

      function updateHud() {
        var t = uiT();
        host.setHud(t.turn + ': ' + turn + ' · ' + t.faith + ': ' + faith + ' · ' + t.food + ': ' + food + ' · ' + t.shrines + ': ' + shrinesLit + '/3');
      }
      updateHud();

      host.onPointer('pointerdown', function (x, y) {
        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var p = hexCenter(c, r);
            if (Math.hypot(x - p.x, y - p.y) <= HEX_R - 4) {
              stepTo(c, r);
              return;
            }
          }
        }
      });

      host.onUpdate(function (dt) { time += dt; });

      host.onRender(function (ctx) {
        var sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#ddd6fe');
        sky.addColorStop(1, '#fef3c7');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var t = tiles[r][c];
            var p = hexCenter(c, r);
            var adj = isNeighbor(heroHex.c, heroHex.r, c, r);
            var isCur = heroHex.c === c && heroHex.r === r;

            // Draw Hexagon
            ctx.beginPath();
            for (var i = 0; i < 6; i++) {
              var a = (Math.PI / 3) * i - Math.PI / 6;
              var hx = p.x + Math.cos(a) * HEX_R;
              var hy = p.y + Math.sin(a) * HEX_R;
              if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
            }
            ctx.closePath();

            var fill = '#fde68a';
            if (t.type === 'shrine') fill = t.cleared ? '#bbf7d0' : '#bae6fd';
            else if (t.type === 'lot') fill = '#fed7aa';
            else if (t.type === 'raider') fill = t.cleared ? '#fde68a' : '#fecdd3';
            else if (t.type === 'moriah') fill = '#fef08a';

            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = adj ? '#2563eb' : (isCur ? '#ea580c' : S.INK);
            ctx.lineWidth = adj ? 3.5 : 2;
            ctx.stroke();

            if (t.type === 'shrine') {
              S.drawStarGem(ctx, p.x, p.y, t.cleared ? '#22c55e' : '#38bdf8', time);
            } else if (t.type === 'lot' && !t.cleared) {
              S.drawCuteAnimal(ctx, p.x, p.y, 'sheep', time, 0.85);
            } else if (t.type === 'raider' && !t.cleared) {
              S.drawCutePharaohOrGuard(ctx, p.x, p.y + 4, false, time, 0.72);
            } else if (t.type === 'moriah') {
              ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.moveTo(p.x - 22, p.y + 18); ctx.lineTo(p.x, p.y - 20); ctx.lineTo(p.x + 22, p.y + 18); ctx.closePath(); ctx.fill(); ctx.stroke();
              S.drawStarGem(ctx, p.x, p.y - 22, '#facc15', time);
            }
          }
        }

        var hp = hexCenter(heroHex.c, heroHex.r);
        S.drawChibiHero(ctx, hp.x, hp.y - 4, { kind: 'abraham', moving: false }, time);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.abraham;
  }
})(typeof window !== 'undefined' ? window : globalThis);
