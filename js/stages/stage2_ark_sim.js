(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  function drawStrokeText(ctx, text, x, y, fill, font) {
    ctx.save();
    ctx.font = font || '900 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#291709';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill || '#fde047';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  root.COG.STAGES.ark = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var vfx = root.COG.VFX.createManager();
      var uiT = function () { return host.pack().stageUi.ark; };

      var COLS = 6, ROWS = 4;
      var TW = 104, TH = 52;
      var ORIGIN_X = 455, ORIGIN_Y = 195;

      function isoToScreen(c, r) {
        return {
          x: ORIGIN_X + (c - r) * (TW * 0.5),
          y: ORIGIN_Y + (c + r) * (TH * 0.5)
        };
      }

      function screenToIso(x, y) {
        var dx = x - ORIGIN_X;
        var dy = y - ORIGIN_Y;
        var u = dx / (TW * 0.5);
        var v = dy / (TH * 0.5);
        var c = Math.floor((u + v) * 0.5 + 0.5);
        var r = Math.floor((v - u) * 0.5 + 0.5);
        if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return null;
        return { c: c, r: r };
      }

      var grid = [];
      for (var r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (var c = 0; c < COLS; c++) grid[r][c] = null;
      }

      var wood = 4;
      var pitch = 2;
      var arkProgress = 0;
      var arkBob = 0;
      var selectedTool = 'mill';
      var hoverCell = null;
      var time = 0;
      var tickAcc = 0;
      var eventCd = 9.0;
      var rainTimer = 0;
      var idlePatrolCd = 1.6;
      var driftwood = null;
      var babyAnimals = [];
      var animalKinds = ['sheep', 'lion', 'dove'];

      var noah = {
        x: 155, y: 325, tx: 155, ty: 325,
        speed: 460, moving: false, flipX: false, hammerTimer: 0, dustCd: 0, pending: null
      };

      function executePlotAction(c, r, pos) {
        var existing = grid[r][c];
        noah.hammerTimer = 0.65;
        noah.flipX = pos.x < noah.x;
        idlePatrolCd = 2.0;

        if (!existing) {
          if (selectedTool === 'mill') {
            grid[r][c] = { type: 'mill', lv: 1, bob: 1 };
            wood += 2;
            host.sfx('chime');
            host.shake(4, 0.14);
            vfx.spawnBurst(pos.x, pos.y - 8, '#fde047', 12);
            vfx.spawnOrb(pos.x, pos.y - 16, 480, 105, '#fde047', 0.5);
            vfx.addPopup(pos.x, pos.y - 32, '+2 Wood', '#fde047', 1.0);
          } else if (selectedTool === 'well' && wood >= 3) {
            wood -= 3;
            grid[r][c] = { type: 'well', lv: 1, bob: 1 };
            pitch += 2;
            host.sfx('chime');
            host.shake(4, 0.14);
            vfx.spawnBurst(pos.x, pos.y - 8, '#7dd3fc', 12);
            vfx.spawnOrb(pos.x, pos.y - 16, 480, 105, '#7dd3fc', 0.5);
            vfx.addPopup(pos.x, pos.y - 32, '+2 Pitch', '#7dd3fc', 1.0);
          } else if (selectedTool === 'pen' && wood >= 4) {
            wood -= 4;
            grid[r][c] = { type: 'pen', lv: 1, bob: 1 };
            var kind = animalKinds[babyAnimals.length % animalKinds.length];
            babyAnimals.push({ kind: kind, x: pos.x, y: pos.y, tx: 480, ty: 122 });
            host.sfx('magic');
            host.shake(4, 0.14);
            vfx.spawnBurst(pos.x, pos.y - 8, '#fbbf24', 12);
            vfx.addPopup(pos.x, pos.y - 32, '+Animal!', '#bbf7d0', 1.08);
          } else {
            host.sfx('hit');
          }
        } else {
          existing.bob = 1;
          var yieldAmt = 2 * existing.lv * (rainTimer > 0 && existing.type === 'well' ? 2 : 1);
          if (existing.type === 'mill') {
            wood += yieldAmt;
            vfx.spawnOrb(pos.x, pos.y - 16, 480, 105, '#fde047', 0.45);
            vfx.addPopup(pos.x, pos.y - 30, '+' + yieldAmt + ' Wood', '#fde047', 1.0);
          } else if (existing.type === 'well') {
            pitch += yieldAmt;
            vfx.spawnOrb(pos.x, pos.y - 16, 480, 105, '#7dd3fc', 0.45);
            vfx.addPopup(pos.x, pos.y - 30, '+' + yieldAmt + ' Pitch', '#7dd3fc', 1.0);
          } else if (existing.type === 'pen') {
            wood += existing.lv; pitch += existing.lv;
            vfx.addPopup(pos.x, pos.y - 30, '+' + existing.lv + '/+' + existing.lv, '#bbf7d0', 1.0);
          }

          if (existing.lv < 3 && wood >= 4) {
            wood -= 4;
            existing.lv += 1;
            host.sfx('magic');
            host.shake(5, 0.18);
            vfx.spawnRing(pos.x, pos.y - 14, '#4ade80', 65, 0.42);
            vfx.spawnBurst(pos.x, pos.y - 16, '#4ade80', 12);
            vfx.addPopup(pos.x, pos.y - 54, 'Lv.' + existing.lv + ' UP!', '#4ade80', 1.2);
          } else {
            host.sfx('click');
            vfx.spawnBurst(pos.x, pos.y - 12, '#fde047', 8);
          }
        }
      }

      function renderToolbar() {
        var t = uiT();
        var btns = ['mill', 'well', 'pen', 'buildArk'].map(function (id) {
          var cls = selectedTool === id && id !== 'buildArk' ? 'btn-primary-gold' : 'btn-secondary';
          return '<button type="button" class="' + cls + '" data-tool="' + id + '">' + t.tools[id] + '</button>';
        }).join('');
        var tb = host.setToolbar('<div class="sim-toolbar">' + btns + '</div>');
        if (!tb) return;
        var all = tb.querySelectorAll('[data-tool]');
        for (var i = 0; i < all.length; i++) {
          all[i].addEventListener('click', function () {
            var tool = this.getAttribute('data-tool');
            this.blur();
            if (tool === 'buildArk') {
              if (wood >= 6 && pitch >= 4) {
                wood -= 6;
                pitch -= 4;
                // Noah sprints right up to the Ark dock and hammers it!
                noah.tx = 420;
                noah.ty = 165;
                noah.pending = { kind: 'buildArk' };
                idlePatrolCd = 2.4;
                host.sfx('click');
              } else {
                host.sfx('hit');
              }
            } else {
              selectedTool = tool;
              host.sfx('click');
              renderToolbar();
            }
          });
        }
      }
      renderToolbar();

      host.onPointer('pointermove', function (x, y) {
        hoverCell = screenToIso(x, y);
      });

      host.onPointer('pointerdown', function (x, y) {
        idlePatrolCd = 2.5;
        if (driftwood && Math.hypot(x - driftwood.x, y - driftwood.y) < 52) {
          noah.tx = driftwood.x + 28;
          noah.ty = driftwood.y;
          noah.pending = { kind: 'driftwood' };
          host.sfx('click');
          return;
        }
        var hit = screenToIso(x, y);
        if (!hit) {
          // Clicking open meadow still moves Noah briskly there!
          noah.tx = Math.max(90, Math.min(W - 90, x));
          noah.ty = Math.max(150, Math.min(H - 60, y));
          noah.pending = null;
          return;
        }
        var pos = isoToScreen(hit.c, hit.r);
        noah.tx = pos.x - 24;
        noah.ty = pos.y + 10;
        noah.pending = { kind: 'plot', c: hit.c, r: hit.r, pos: pos };
      });

      host.onUpdate(function (dt) {
        time += dt;
        tickAcc += dt;
        if (noah.hammerTimer > 0) noah.hammerTimer = Math.max(0, noah.hammerTimer - dt);
        if (arkBob > 0) arkBob = Math.max(0, arkBob - dt * 2.4);

        var dx = noah.tx - noah.x;
        var dy = noah.ty - noah.y;
        var distToTarget = Math.hypot(dx, dy);
        if (distToTarget > 8) {
          noah.moving = true;
          noah.flipX = dx < -2;
          var step = Math.min(distToTarget, noah.speed * dt);
          noah.x += (dx / distToTarget) * step;
          noah.y += (dy / distToTarget) * step;
          noah.dustCd -= dt;
          if (noah.dustCd <= 0) {
            noah.dustCd = 0.12;
            vfx.spawnDust(noah.x, noah.y + 6, 2);
          }
        } else {
          noah.moving = false;
          if (noah.pending) {
            var task = noah.pending;
            noah.pending = null;
            if (task.kind === 'driftwood' && driftwood) {
              wood += 4;
              noah.hammerTimer = 0.5;
              host.sfx('chime');
              vfx.spawnBurst(driftwood.x, driftwood.y, '#fde047', 12);
              vfx.addPopup(driftwood.x, driftwood.y - 24, uiT().driftwood, '#fde047', 1.15);
              driftwood = null;
            } else if (task.kind === 'buildArk') {
              arkProgress = Math.min(100, arkProgress + 25);
              arkBob = 1;
              noah.hammerTimer = 0.65;
              noah.flipX = false;
              host.sfx('magic');
              host.shake(7, 0.24);
              vfx.spawnRing(480, 100, '#fde047', 120, 0.55);
              vfx.spawnBurst(480, 96, '#fde047', 18, 160);
              vfx.addPopup(480, 68, '+25% Ark!', '#fde047', 1.25);
              if (arkProgress >= 100) {
                host.sfx('win');
                host.win(stageObj.baseScore + babyAnimals.length * 100, 3, {
                  faith: 6, wisdom: 6,
                  customSummary: host.t('stages.ark.outro')
                });
                return;
              }
            } else if (task.kind === 'patrolInspect' && grid[task.r][task.c]) {
              var pb = grid[task.r][task.c];
              pb.bob = 0.8;
              noah.hammerTimer = 0.45;
              if (pb.type === 'well') {
                pitch += 1;
                vfx.addPopup(task.pos.x, task.pos.y - 26, '+1 Pitch', '#7dd3fc', 0.95);
              } else {
                wood += 1;
                vfx.addPopup(task.pos.x, task.pos.y - 26, '+1 Wood', '#fde047', 0.95);
              }
              vfx.spawnBurst(task.pos.x, task.pos.y - 12, '#fde047', 6);
            } else if (task.kind === 'plot') {
              executePlotAction(task.c, task.r, task.pos);
            }
          } else {
            // Autonomous busy Craftsman Patrol between buildings!
            idlePatrolCd -= dt;
            if (idlePatrolCd <= 0) {
              idlePatrolCd = 2.6;
              var builtList = [];
              for (var r3 = 0; r3 < ROWS; r3++) {
                for (var c3 = 0; c3 < COLS; c3++) {
                  if (grid[r3][c3]) builtList.push({ r: r3, c: c3 });
                }
              }
              if (builtList.length > 0) {
                var pick = builtList[Math.floor(Math.random() * builtList.length)];
                var pp = isoToScreen(pick.c, pick.r);
                noah.tx = pp.x - 24;
                noah.ty = pp.y + 10;
                noah.pending = { kind: 'patrolInspect', r: pick.r, c: pick.c, pos: pp };
              } else {
                noah.tx = noah.x < 300 ? 410 : 155;
                noah.ty = 315;
              }
            }
          }
        }

        if (rainTimer > 0) rainTimer = Math.max(0, rainTimer - dt);
        eventCd -= dt;
        if (eventCd <= 0) {
          eventCd = 13.0;
          rainTimer = 7.5;
          if (!driftwood) {
            driftwood = { x: 185 + Math.random() * 50, y: 170 + Math.random() * 210 };
          }
          vfx.addPopup(480, 60, uiT().rainBoost, '#7dd3fc', 1.15);
        }

        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var cell = grid[r][c];
            if (cell && cell.bob > 0) cell.bob = Math.max(0, cell.bob - dt * 2.5);
          }
        }
        if (tickAcc >= 2.6) {
          tickAcc = 0;
          var rainMult = rainTimer > 0 ? 2 : 1;
          for (var r2 = 0; r2 < ROWS; r2++) {
            for (var c2 = 0; c2 < COLS; c2++) {
              var b = grid[r2][c2];
              if (!b) continue;
              if (b.type === 'mill') wood += 2 * b.lv;
              if (b.type === 'well') pitch += 2 * b.lv * rainMult;
              if (b.type === 'pen') { wood += b.lv; pitch += b.lv; }
            }
          }
        }

        babyAnimals.forEach(function (a, idx) {
          var tx = a.tx + Math.cos(time * 0.9 + idx) * 26;
          var ty = a.ty + Math.sin(time * 0.9 + idx) * 10;
          a.x += (tx - a.x) * Math.min(1, dt * 0.9);
          a.y += (ty - a.y) * Math.min(1, dt * 0.9);
        });

        vfx.update(dt);
        var t = uiT();
        host.setHud(t.timber + ': ' + wood + ' · ' + t.pitch + ': ' + pitch + ' · ' + t.animals + ': ' + babyAnimals.length + ' · ' + t.arkProg + ': ' + arkProgress + '%');
      });

      host.onRender(function (ctx) {
        if (!Sp || !Sp.drawCover(ctx, 'bg_ark', W, H)) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#bae6fd');
          sky.addColorStop(1, '#86efac');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
        }

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (var w = 0; w < 4; w++) {
          var wx = 45 + w * 28 + Math.sin(time * 2.2 + w) * 8;
          var wy = 110 + w * 110;
          ctx.beginPath();
          ctx.arc(wx, wy, 22, 0.2, 1.5);
          ctx.stroke();
        }
        ctx.restore();

        if (rainTimer > 0) {
          ctx.save();
          ctx.strokeStyle = 'rgba(186, 230, 253, 0.62)';
          ctx.lineWidth = 2;
          for (var ri = 0; ri < 28; ri++) {
            var rx = ((ri * 97 + time * 140) % (W + 80)) - 40;
            var ry = ((ri * 131 + time * 420) % H);
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 10, ry + 18); ctx.stroke();
          }
          ctx.restore();
        }

        if (arkProgress > 0) {
          var cols = ['#fb7185', '#fdba74', '#fde047', '#4ade80', '#60a5fa', '#c084fc'];
          ctx.save();
          ctx.globalAlpha = 0.35 + (arkProgress / 100) * 0.55;
          cols.forEach(function (c, i) {
            ctx.strokeStyle = c; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(480, 128, 175 - i * 6, Math.PI, Math.PI * 2); ctx.stroke();
          });
          ctx.restore();
        }

        S.drawBuilding(ctx, 'ark', 480, 128, {
          height: 112 + (arkProgress / 100) * 24,
          anchorY: 0.85,
          bob: arkBob,
          glowColor: arkProgress >= 50 ? 'rgba(253, 224, 71, 0.45)' : null
        }, time);
        if (Sp && Sp.drawGlossyBar) {
          Sp.drawGlossyBar(ctx, 412, 134, 136, 12, arkProgress / 100, '#facc15', '#291709');
        }
        drawStrokeText(ctx, arkProgress + '%', 480, 158, '#fde047', '900 13px sans-serif');

        for (var sum = 0; sum <= COLS + ROWS - 2; sum++) {
          for (var r = 0; r < ROWS; r++) {
            var c = sum - r;
            if (c < 0 || c >= COLS) continue;
            var p = isoToScreen(c, r);
            var isHover = hoverCell && hoverCell.c === c && hoverCell.r === r;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y - TH * 0.5);
            ctx.lineTo(p.x + TW * 0.5, p.y);
            ctx.lineTo(p.x, p.y + TH * 0.5);
            ctx.lineTo(p.x - TW * 0.5, p.y);
            ctx.closePath();

            ctx.fillStyle = isHover
              ? 'rgba(254, 240, 138, 0.48)'
              : ((r + c) % 2 === 0 ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)');
            ctx.fill();
            ctx.strokeStyle = isHover ? '#facc15' : 'rgba(255, 255, 255, 0.42)';
            ctx.lineWidth = isHover ? 3 : 1.5;
            ctx.stroke();

            var b = grid[r][c];
            if (b) {
              S.drawBuilding(ctx, b.type, p.x, p.y + 8, {
                height: 82,
                anchorY: 0.78,
                bob: b.bob,
                level: b.lv,
                canUpgrade: b.lv < 3 && wood >= 4
              }, time);
            }
          }
        }

        if (driftwood) {
          var dbob = Math.sin(time * 4) * 3;
          ctx.save();
          ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
          ctx.beginPath(); ctx.arc(driftwood.x, driftwood.y + dbob, 26, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#b45309'; ctx.strokeStyle = '#291709'; ctx.lineWidth = 2.5;
          S.roundRect(ctx, driftwood.x - 16, driftwood.y - 10 + dbob, 32, 18, 5); ctx.fill(); ctx.stroke();
          drawStrokeText(ctx, '+4 🪵', driftwood.x, driftwood.y - 18 + dbob, '#fde047', '900 13px sans-serif');
          ctx.restore();
        }

        vfx.renderBack(ctx);

        var hammerJump = noah.hammerTimer > 0 ? Math.abs(Math.sin(noah.hammerTimer * 18)) * 14 : 0;
        S.drawChibiHero(ctx, noah.x, noah.y + 8, {
          kind: 'noah',
          moving: noah.moving,
          flipX: noah.flipX,
          jumpY: hammerJump,
          attackTimer: noah.hammerTimer,
          height: 94,
          lv: root.COG.State.getPlayerLevel()
        }, time);

        babyAnimals.forEach(function (a) {
          S.drawCuteAnimal(ctx, a.x, a.y, a.kind, time, 0.85, { flipX: a.tx < a.x });
        });

        vfx.renderFront(ctx);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.ark;
  }
})(typeof window !== 'undefined' ? window : globalThis);
