(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  function drawStrokeText(ctx, text, x, y, fill, font) {
    ctx.save();
    ctx.font = font || '900 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
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
      var selectedTool = 'mill';
      var hoverCell = null;
      var time = 0;
      var tickAcc = 0;
      var popups = [];
      var bursts = [];
      var babyAnimals = [];
      var animalKinds = ['sheep', 'lion', 'dove'];

      function spawnBurst(x, y, col) {
        for (var i = 0; i < 8; i++) {
          var a = (i / 8) * Math.PI * 2;
          bursts.push({ x: x, y: y, vx: Math.cos(a) * 65, vy: Math.sin(a) * 50, col: col, life: 0.4 });
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
            if (tool === 'buildArk') {
              if (wood >= 6 && pitch >= 4) {
                wood -= 6;
                pitch -= 4;
                arkProgress = Math.min(100, arkProgress + 25);
                host.sfx('magic');
                spawnBurst(480, 92, '#fde047');
                popups.push({ x: 480, y: 74, text: '+25% Ark!', col: '#fde047', life: 1.0 });
                if (arkProgress >= 100) {
                  host.sfx('win');
                  host.win(stageObj.baseScore + babyAnimals.length * 100, 3, {
                    faith: 6, wisdom: 6,
                    customSummary: host.t('stages.ark.outro')
                  });
                }
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
        var hit = screenToIso(x, y);
        if (!hit) return;
        var c = hit.c, r = hit.r;
        var pos = isoToScreen(c, r);
        var existing = grid[r][c];
        if (!existing) {
          if (selectedTool === 'mill') {
            grid[r][c] = { type: 'mill', lv: 1, bob: 1 };
            wood += 2;
            host.sfx('chime');
            spawnBurst(pos.x, pos.y - 10, '#fde047');
            popups.push({ x: pos.x, y: pos.y - 26, text: '+2 Wood', col: '#fde047', life: 0.75 });
          } else if (selectedTool === 'well' && wood >= 3) {
            wood -= 3;
            grid[r][c] = { type: 'well', lv: 1, bob: 1 };
            pitch += 2;
            host.sfx('chime');
            spawnBurst(pos.x, pos.y - 10, '#7dd3fc');
            popups.push({ x: pos.x, y: pos.y - 26, text: '+2 Pitch', col: '#7dd3fc', life: 0.75 });
          } else if (selectedTool === 'pen' && wood >= 4) {
            wood -= 4;
            grid[r][c] = { type: 'pen', lv: 1, bob: 1 };
            var kind = animalKinds[babyAnimals.length % animalKinds.length];
            babyAnimals.push({ kind: kind, x: pos.x, y: pos.y, tx: 480, ty: 122 });
            host.sfx('magic');
            spawnBurst(pos.x, pos.y - 10, '#fbbf24');
            popups.push({ x: pos.x, y: pos.y - 26, text: '+Animal!', col: '#bbf7d0', life: 0.85 });
          } else {
            host.sfx('hit');
          }
        } else {
          existing.bob = 1;
          var yieldAmt = 2 * existing.lv;
          if (existing.type === 'mill') { wood += yieldAmt; popups.push({ x: pos.x, y: pos.y - 28, text: '+' + yieldAmt + ' Wood', col: '#fde047', life: 0.7 }); }
          else if (existing.type === 'well') { pitch += yieldAmt; popups.push({ x: pos.x, y: pos.y - 28, text: '+' + yieldAmt + ' Pitch', col: '#7dd3fc', life: 0.7 }); }
          else if (existing.type === 'pen') { wood += existing.lv; pitch += existing.lv; popups.push({ x: pos.x, y: pos.y - 28, text: '+' + existing.lv + '/+' + existing.lv, col: '#bbf7d0', life: 0.7 }); }

          if (existing.lv < 3 && wood >= 4) {
            wood -= 4;
            existing.lv += 1;
            host.sfx('magic');
            spawnBurst(pos.x, pos.y - 18, '#4ade80');
            popups.push({ x: pos.x, y: pos.y - 48, text: 'Lv.' + existing.lv + ' UP!', col: '#4ade80', life: 0.9 });
          } else {
            host.sfx('click');
          }
        }
      });

      host.onUpdate(function (dt) {
        time += dt;
        tickAcc += dt;
        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var cell = grid[r][c];
            if (cell && cell.bob > 0) cell.bob = Math.max(0, cell.bob - dt * 2.5);
          }
        }
        if (tickAcc >= 2.6) {
          tickAcc = 0;
          for (var r2 = 0; r2 < ROWS; r2++) {
            for (var c2 = 0; c2 < COLS; c2++) {
              var b = grid[r2][c2];
              if (!b) continue;
              if (b.type === 'mill') wood += 2 * b.lv;
              if (b.type === 'well') pitch += 2 * b.lv;
              if (b.type === 'pen') { wood += b.lv; pitch += b.lv; }
            }
          }
        }
        babyAnimals.forEach(function (a) {
          a.x += (a.tx - a.x) * Math.min(1, dt * 0.75);
          a.y += (a.ty - a.y) * Math.min(1, dt * 0.75);
        });
        for (var i = popups.length - 1; i >= 0; i--) {
          popups[i].y -= 28 * dt;
          popups[i].life -= dt;
          if (popups[i].life <= 0) popups.splice(i, 1);
        }
        for (var bi = bursts.length - 1; bi >= 0; bi--) {
          var pt = bursts[bi];
          pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt;
          if (pt.life <= 0) bursts.splice(bi, 1);
        }
        var t = uiT();
        host.setHud(t.timber + ': ' + wood + ' · ' + t.pitch + ': ' + pitch + ' · ' + t.animals + ': ' + babyAnimals.length + ' · ' + t.arkProg + ': ' + arkProgress + '%');
      });

      host.onRender(function (ctx) {
        if (!Sp || !Sp.drawCover(ctx, 'bg_ark', W, H)) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#bae6fd');
          sky.addColorStop(0.28, '#fef9c3');
          sky.addColorStop(0.29, '#bbf7d0');
          sky.addColorStop(1, '#86efac');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
        }

        // Animated shoreline wave ripples along left water edge
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
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

        // Growing rainbow arch with Ark progress
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

        // Isometric Noah's Ark Monument & Progress Bar
        S.drawBuilding(ctx, 'ark', 480, 128, { height: 120, anchorY: 0.85 }, time);
        if (Sp && Sp.drawGlossyBar) {
          Sp.drawGlossyBar(ctx, 412, 134, 136, 12, arkProgress / 100, '#facc15', '#291709');
        }
        drawStrokeText(ctx, arkProgress + '%', 480, 158, '#fde047', '900 13px sans-serif');

        // 2.5D Isometric Diamond Grid + Buildings in strict painter order (c + r)
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

        // Craftsman Noah cheering on sunny shore
        S.drawChibiHero(ctx, 145, 320, { kind: 'noah', moving: false, height: 94, lv: root.COG.State.getPlayerLevel() }, time);

        // Baby animals hopping toward Ark
        babyAnimals.forEach(function (a) {
          S.drawCuteAnimal(ctx, a.x, a.y, a.kind, time, 0.85, { flipX: a.tx < a.x });
        });

        bursts.forEach(function (pt) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, pt.life / 0.4);
          ctx.fillStyle = pt.col;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });

        popups.forEach(function (p) {
          drawStrokeText(ctx, p.text, p.x, p.y, p.col || '#fde047', '900 15px sans-serif');
        });
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.ark;
  }
})(typeof window !== 'undefined' ? window : globalThis);
