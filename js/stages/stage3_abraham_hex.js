(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.abraham = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var vfx = root.COG.VFX.createManager();
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
      var startPos = hexCenter(heroHex.c, heroHex.r);
      var heroPos = {
        x: startPos.x, y: startPos.y,
        sx: startPos.x, sy: startPos.y,
        tx: startPos.x, ty: startPos.y,
        prog: 1, moving: false, flipX: false, attackTimer: 0, dustCd: 0
      };
      var pathQueue = [];
      var turn = 1;
      var faith = 40;
      var food = 40;
      var shrinesLit = 0;
      var time = 0;
      var doveFx = null;
      var clashFx = null;

      function isNeighbor(c1, r1, c2, r2) {
        if (c1 === c2 && r1 === r2) return false;
        var p1 = hexCenter(c1, r1);
        var p2 = hexCenter(c2, r2);
        return Math.hypot(p1.x - p2.x, p1.y - p2.y) < 105;
      }

      function findHexPath(sc, sr, tc, tr) {
        if (sc === tc && sr === tr) return [];
        var q = [{ c: sc, r: sr, path: [] }];
        var vis = {};
        vis[sc + ',' + sr] = true;
        while (q.length > 0) {
          var cur = q.shift();
          for (var nr = 0; nr < ROWS; nr++) {
            for (var nc = 0; nc < COLS; nc++) {
              var k = nc + ',' + nr;
              if (!vis[k] && isNeighbor(cur.c, cur.r, nc, nr)) {
                var nextPath = cur.path.concat([{ c: nc, r: nr }]);
                if (nc === tc && nr === tr) return nextPath;
                vis[k] = true;
                q.push({ c: nc, r: nr, path: nextPath });
              }
            }
          }
        }
        return [];
      }

      function renderToolbar() {
        var t = uiT();
        var tb = host.setToolbar('<div class="sim-toolbar">' +
          '<button type="button" class="btn-primary-gold" data-sk="starBolt"' + (faith < 8 ? ' disabled' : '') + '>' + t.skills.starBolt + '</button>' +
          '<button type="button" class="btn-secondary" data-sk="peace"' + (food < 6 ? ' disabled' : '') + '>' + t.skills.peace + '</button>' +
          '</div>');
        if (!tb) return;
        var btns = tb.querySelectorAll('[data-sk]');
        for (var i = 0; i < btns.length; i++) {
          btns[i].addEventListener('click', function () {
            this.blur();
            castStrategySkill(this.getAttribute('data-sk'));
          });
        }
      }

      function findNearestRaider() {
        var best = null, bestD = 9999;
        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var t = tiles[r][c];
            if (t.type === 'raider' && !t.cleared) {
              var p = hexCenter(c, r);
              var d = Math.hypot(p.x - heroPos.x, p.y - heroPos.y);
              if (d < bestD) { bestD = d; best = { tile: t, pos: p }; }
            }
          }
        }
        return best;
      }

      function castStrategySkill(sk) {
        var tgt = findNearestRaider();
        if (!tgt) { host.sfx('hit'); return; }
        heroPos.flipX = tgt.pos.x < heroPos.x;
        heroPos.attackTimer = 0.48;

        if (sk === 'starBolt' && faith >= 8) {
          faith -= 8;
          host.sfx('magic');
          vfx.spawnOrb(heroPos.x, heroPos.y - 24, tgt.pos.x, tgt.pos.y, '#fde047', 0.42, function () {
            tgt.tile.cleared = true;
            clashFx = { x: tgt.pos.x, y: tgt.pos.y, life: 0.45, maxLife: 0.45 };
            host.shake(6, 0.2);
            vfx.spawnRing(tgt.pos.x, tgt.pos.y, '#fde047', 70, 0.4);
            vfx.spawnBurst(tgt.pos.x, tgt.pos.y, '#fde047', 14);
            vfx.addPopup(tgt.pos.x, tgt.pos.y - 20, '+200 ★', '#fde047', 1.15);
            root.COG.State.addStat({ score: 200 });
          });
        } else if (sk === 'peace' && food >= 6) {
          food -= 6;
          host.sfx('chime');
          doveFx = { sx: heroPos.x, sy: heroPos.y - 24, tx: tgt.pos.x, ty: tgt.pos.y - 12, prog: 0, tgt: tgt };
        }
        updateHud();
        renderToolbar();
      }

      function patrolRaiders() {
        if (turn % 2 !== 0) return;
        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var t = tiles[r][c];
            if (t.type === 'raider' && !t.cleared) {
              var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
              for (var i = 0; i < dirs.length; i++) {
                var nc = c + dirs[i][0], nr = r + dirs[i][1];
                if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && isNeighbor(c, r, nc, nr)) {
                  var cand = tiles[nr][nc];
                  if (cand.type === 'plain' && !(heroHex.c === nc && heroHex.r === nr)) {
                    var oldPos = hexCenter(c, r);
                    var newPos = hexCenter(nc, nr);
                    t.type = 'plain';
                    cand.type = 'raider';
                    cand.cleared = false;
                    vfx.spawnDust((oldPos.x + newPos.x) * 0.5, (oldPos.y + newPos.y) * 0.5, 3);
                    return;
                  }
                }
              }
            }
          }
        }
      }

      function beginSingleStep(c, r) {
        if (!isNeighbor(heroHex.c, heroHex.r, c, r)) return;
        heroHex.c = c; heroHex.r = r;
        var dest = hexCenter(c, r);
        heroPos.sx = heroPos.x; heroPos.sy = heroPos.y;
        heroPos.tx = dest.x; heroPos.ty = dest.y;
        heroPos.prog = 0;
        heroPos.moving = true;
        heroPos.flipX = dest.x < heroPos.x;
        host.sfx('click');
      }

      function resolveArrivedTile() {
        var tile = tiles[heroHex.r][heroHex.c];
        var dest = hexCenter(heroHex.c, heroHex.r);
        turn++;
        food = Math.max(5, food - 2);

        if (tile.type === 'shrine' && !tile.cleared) {
          tile.cleared = true;
          pathQueue = [];
          shrinesLit++;
          faith += 15;
          heroPos.attackTimer = 0.45;
          host.sfx('magic');
          vfx.spawnRing(dest.x, dest.y, '#7dd3fc', 70, 0.45);
          vfx.spawnBurst(dest.x, dest.y, '#fde047', 12);
          vfx.addPopup(dest.x, dest.y - 26, '+15 Faith', '#7dd3fc', 1.15);
          root.COG.State.addStat({ faith: 3, score: 150 });
        } else if (tile.type === 'lot' && !tile.cleared) {
          tile.cleared = true;
          pathQueue = [];
          host.openDialogue('abraham_lot', {
            onEffect: function (eff) {
              faith += (eff.faith || 0) * 2;
              root.COG.State.addStat(eff);
            }
          });
        } else if (tile.type === 'raider' && !tile.cleared) {
          tile.cleared = true;
          pathQueue = [];
          heroPos.attackTimer = 0.5;
          clashFx = { x: dest.x, y: dest.y, life: 0.48, maxLife: 0.48 };
          faith += 10;
          food += 10;
          host.sfx('slash');
          host.shake(6, 0.22);
          vfx.spawnBurst(dest.x, dest.y, '#fb7185', 14);
          vfx.addPopup(dest.x, dest.y - 28, 'CLASH! +150', '#fde047', 1.15);
          root.COG.State.addStat({ score: 150 });
        } else if (tile.type === 'moriah') {
          pathQueue = [];
          if (shrinesLit >= 3) {
            host.sfx('win');
            host.win(stageObj.baseScore + faith * 6, 3, {
              faith: 8, wisdom: 5,
              customSummary: host.t('stages.abraham.outro')
            });
            return;
          }
        }
        patrolRaiders();
        updateHud();
        renderToolbar();
      }

      function updateHud() {
        var t = uiT();
        host.setHud(t.turn + ': ' + turn + ' · ' + t.faith + ': ' + faith + ' · ' + t.food + ': ' + food + ' · ' + t.shrines + ': ' + shrinesLit + '/3');
      }
      updateHud();
      renderToolbar();

      host.onPointer('pointerdown', function (x, y) {
        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var p = hexCenter(c, r);
            if (Math.hypot(x - p.x, y - p.y) <= HEX_R - 2) {
              var route = findHexPath(heroHex.c, heroHex.r, c, r);
              if (route.length > 0) {
                pathQueue = route;
                if (!heroPos.moving) {
                  var first = pathQueue.shift();
                  beginSingleStep(first.c, first.r);
                }
              }
              return;
            }
          }
        }
      });

      host.onUpdate(function (dt) {
        time += dt;
        if (heroPos.attackTimer > 0) heroPos.attackTimer = Math.max(0, heroPos.attackTimer - dt);
        if (clashFx) {
          clashFx.life -= dt;
          if (clashFx.life <= 0) clashFx = null;
        }

        if (heroPos.moving) {
          heroPos.prog = Math.min(1, heroPos.prog + dt / 0.34);
          var ease = 1 - Math.pow(1 - heroPos.prog, 2);
          heroPos.x = heroPos.sx + (heroPos.tx - heroPos.sx) * ease;
          heroPos.y = heroPos.sy + (heroPos.ty - heroPos.sy) * ease;
          heroPos.dustCd -= dt;
          if (heroPos.dustCd <= 0) {
            heroPos.dustCd = 0.12;
            vfx.spawnDust(heroPos.x, heroPos.y + 8, 2);
          }
          if (heroPos.prog >= 1) {
            heroPos.moving = false;
            resolveArrivedTile();
            if (pathQueue.length > 0 && heroPos.attackTimer <= 0.1) {
              var nxt = pathQueue.shift();
              beginSingleStep(nxt.c, nxt.r);
            }
          }
        } else if (pathQueue.length > 0 && heroPos.attackTimer <= 0.1) {
          var nxt2 = pathQueue.shift();
          beginSingleStep(nxt2.c, nxt2.r);
        }

        if (doveFx) {
          doveFx.prog += dt * 1.9;
          if (doveFx.prog >= 1) {
            var tgt = doveFx.tgt;
            tgt.tile.cleared = true;
            faith += 12;
            vfx.spawnRing(tgt.pos.x, tgt.pos.y, '#bbf7d0', 75, 0.45);
            vfx.addPopup(tgt.pos.x, tgt.pos.y - 26, 'PEACE! +12 Faith', '#4ade80', 1.15);
            root.COG.State.addStat({ faith: 2, mercy: 3, score: 200 });
            doveFx = null;
            updateHud();
            renderToolbar();
          }
        }

        vfx.update(dt);
      });

      host.onRender(function (ctx) {
        if (!Sp || !Sp.drawCover(ctx, 'bg_abraham', W, H)) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#ddd6fe');
          sky.addColorStop(1, '#fef3c7');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
        }

        var moriahPos = hexCenter(6, 0);

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
            if (t.type === 'shrine') fill = t.cleared ? 'rgba(134, 239, 172, 0.48)' : 'rgba(125, 211, 252, 0.48)';
            else if (t.type === 'lot') fill = 'rgba(254, 215, 170, 0.5)';
            else if (t.type === 'raider') fill = t.cleared ? 'rgba(255, 250, 232, 0.34)' : 'rgba(253, 164, 175, 0.56)';
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
              if (t.cleared) {
                ctx.save();
                ctx.strokeStyle = 'rgba(253, 224, 71, 0.58)';
                ctx.lineWidth = 3;
                ctx.setLineDash([10, 8]);
                ctx.lineDashOffset = -time * 24;
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(moriahPos.x, moriahPos.y); ctx.stroke();
                ctx.restore();
              }
              S.drawStarGem(ctx, p.x, p.y, t.cleared ? '#22c55e' : '#38bdf8', time);
            } else if (t.type === 'lot' && !t.cleared) {
              S.drawCuteAnimal(ctx, p.x, p.y + 10, 'sheep', time, 0.88);
            } else if (t.type === 'raider' && !t.cleared) {
              S.drawCutePharaohOrGuard(ctx, p.x, p.y + 14, false, time, 0.78, { animState: 'run' });
            } else if (t.type === 'moriah') {
              S.drawBuilding(ctx, 'tabernacle', p.x, p.y + 14, {
                height: 76,
                anchorY: 0.78,
                glowColor: 'rgba(250, 204, 21, 0.45)'
              }, time);
              S.drawStarGem(ctx, p.x, p.y - 26, '#facc15', time);
            }
          }
        }

        // Queued multi-step waypoint dots
        if (pathQueue.length > 0) {
          ctx.save();
          ctx.fillStyle = '#fde047';
          pathQueue.forEach(function (step) {
            var sp = hexCenter(step.c, step.r);
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 5, 0, Math.PI * 2); ctx.fill();
          });
          ctx.restore();
        }

        vfx.renderBack(ctx);

        // Defeated Raider knockback flying animation
        if (clashFx) {
          var u = 1 - clashFx.life / clashFx.maxLife;
          S.drawCutePharaohOrGuard(ctx, clashFx.x + u * 55, clashFx.y + 14 - Math.sin(u * Math.PI) * 28, false, time, 0.78, {
            hitFlash: true,
            flipX: true,
            animState: 'attack'
          });
        }

        var atkJump = heroPos.attackTimer > 0 ? Math.sin((heroPos.attackTimer / 0.5) * Math.PI) * 14 : 0;
        S.drawChibiHero(ctx, heroPos.x, heroPos.y + 12, {
          kind: 'abraham',
          moving: heroPos.moving,
          flipX: heroPos.flipX,
          jumpY: atkJump,
          attackTimer: heroPos.attackTimer,
          height: 86,
          lv: root.COG.State.getPlayerLevel()
        }, time);

        if (doveFx) {
          var dx = doveFx.sx + (doveFx.tx - doveFx.sx) * doveFx.prog;
          var dy = doveFx.sy + (doveFx.ty - doveFx.sy) * doveFx.prog - Math.sin(doveFx.prog * Math.PI) * 32;
          S.drawCuteAnimal(ctx, dx, dy, 'dove', time, 1.0);
        }

        vfx.renderFront(ctx);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.abraham;
  }
})(typeof window !== 'undefined' ? window : globalThis);
