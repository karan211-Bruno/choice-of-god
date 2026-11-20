(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.abraham = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var uiT = function () { return host.pack().stageUi.abraham; };

      var COLS = 7, ROWS = 5, HEX_R = 46;
      var OX = 185, OY = 115;

      function hexCenter(c, r) {
        var x = OX + c * 92 + (r % 2 === 1 ? 46 : 0);
        var y = OY + r * 78;
        return { x: x, y: y };
      }

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
        if (!Sp || !Sp.drawCover(ctx, 'bg_abraham', W, H)) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#ddd6fe');
          sky.addColorStop(1, '#fef3c7');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
        }

        // Translucent 2.5D Hex Tiles over painted Canaan desert vista
        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var t = tiles[r][c];
            var p = hexCenter(c, r);
            var adj = isNeighbor(heroHex.c, heroHex.r, c, r);
            var isCur = heroHex.c === c && heroHex.r === r;

            ctx.beginPath();
            for (var i = 0; i < 6; i++) {
              var a = (Math.PI / 3) * i - Math.PI / 6;
              var hx = p.x + Math.cos(a) * HEX_R;
              var hy = p.y + Math.sin(a) * HEX_R;
              if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
            }
            ctx.closePath();

            var fill = 'rgba(255, 250, 232, 0.36)';
            if (t.type === 'shrine') fill = t.cleared ? 'rgba(134, 239, 172, 0.45)' : 'rgba(125, 211, 252, 0.48)';
            else if (t.type === 'lot') fill = 'rgba(254, 215, 170, 0.5)';
            else if (t.type === 'raider') fill = t.cleared ? 'rgba(255, 250, 232, 0.34)' : 'rgba(253, 164, 175, 0.52)';
            else if (t.type === 'moriah') fill = 'rgba(254, 240, 138, 0.58)';

            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = adj ? '#38bdf8' : (isCur ? '#f59e0b' : 'rgba(74, 50, 40, 0.45)');
            ctx.lineWidth = adj ? 3.5 : (isCur ? 3.5 : 1.8);
            ctx.stroke();

            if (adj) {
              ctx.save();
              ctx.globalAlpha = 0.45 + Math.sin(time * 6) * 0.25;
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.restore();
            }

            if (t.type === 'shrine') {
              S.drawStarGem(ctx, p.x, p.y, t.cleared ? '#22c55e' : '#38bdf8', time);
            } else if (t.type === 'lot' && !t.cleared) {
              S.drawCuteAnimal(ctx, p.x, p.y + 10, 'sheep', time, 0.88);
            } else if (t.type === 'raider' && !t.cleared) {
              S.drawCutePharaohOrGuard(ctx, p.x, p.y + 14, false, time, 0.78);
            } else if (t.type === 'moriah') {
              S.drawBuilding(ctx, 'tabernacle', p.x, p.y + 14, {
                height: 76,
                anchorY: 0.78,
                glowColor: 'rgba(250, 204, 21, 0.42)'
              }, time);
              S.drawStarGem(ctx, p.x, p.y - 26, '#facc15', time);
            }
          }
        }

        var hp = hexCenter(heroHex.c, heroHex.r);
        S.drawChibiHero(ctx, hp.x, hp.y + 12, {
          kind: 'abraham',
          moving: false,
          height: 86,
          lv: root.COG.State.getPlayerLevel()
        }, time);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.abraham;
  }
})(typeof window !== 'undefined' ? window : globalThis);
