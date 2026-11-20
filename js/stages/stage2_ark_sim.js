(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.ark = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var uiT = function () { return host.pack().stageUi.ark; };

      var COLS = 6, ROWS = 4;
      var CELL = 88, OX = 216, OY = 128;
      var grid = [];
      for (var r = 0; r < ROWS; r++) {
        grid[r] = [];
        for (var c = 0; c < COLS; c++) grid[r][c] = null;
      }

      var wood = 4;
      var pitch = 2;
      var arkProgress = 0;
      var selectedTool = 'mill';
      var time = 0;
      var tickAcc = 0;
      var popups = [];
      var babyAnimals = [];
      var animalKinds = ['sheep', 'lion', 'elephant', 'dove'];

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
                popups.push({ x: 480, y: 80, text: '+25% Ark!', life: 1.0 });
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

      host.onPointer('pointerdown', function (x, y) {
        var c = Math.floor((x - OX) / CELL);
        var r = Math.floor((y - OY) / CELL);
        if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
        var existing = grid[r][c];
        if (!existing) {
          if (selectedTool === 'mill') {
            grid[r][c] = { type: 'mill', bob: 1 };
            wood += 2;
            host.sfx('chime');
            popups.push({ x: x, y: y, text: '+2 Wood', life: 0.7 });
          } else if (selectedTool === 'well' && wood >= 3) {
            wood -= 3;
            grid[r][c] = { type: 'well', bob: 1 };
            pitch += 2;
            host.sfx('chime');
            popups.push({ x: x, y: y, text: '+2 Pitch', life: 0.7 });
          } else if (selectedTool === 'pen' && wood >= 4) {
            wood -= 4;
            grid[r][c] = { type: 'pen', bob: 1 };
            var kind = animalKinds[babyAnimals.length % animalKinds.length];
            babyAnimals.push({ kind: kind, x: x, y: y, tx: 480, ty: 65 });
            host.sfx('magic');
          } else {
            host.sfx('hit');
          }
        } else {
          existing.bob = 1;
          if (existing.type === 'mill') { wood += 2; popups.push({ x: x, y: y, text: '+2 Wood', life: 0.65 }); }
          else if (existing.type === 'well') { pitch += 2; popups.push({ x: x, y: y, text: '+2 Pitch', life: 0.65 }); }
          else if (existing.type === 'pen') { wood += 1; pitch += 1; popups.push({ x: x, y: y, text: '+1/+1', life: 0.65 }); }
          host.sfx('click');
        }
      });

      host.onUpdate(function (dt) {
        time += dt;
        tickAcc += dt;
        if (tickAcc >= 2.6) {
          tickAcc = 0;
          for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
              var b = grid[r][c];
              if (!b) continue;
              if (b.type === 'mill') wood += 2;
              if (b.type === 'well') pitch += 2;
              if (b.type === 'pen') { wood += 1; pitch += 1; }
            }
          }
        }
        babyAnimals.forEach(function (a) {
          a.x += (a.tx - a.x) * Math.min(1, dt * 0.75);
          a.y += (a.ty - a.y) * Math.min(1, dt * 0.75);
        });
        for (var i = popups.length - 1; i >= 0; i--) {
          popups[i].y -= 26 * dt;
          popups[i].life -= dt;
          if (popups[i].life <= 0) popups.splice(i, 1);
        }
        var t = uiT();
        host.setHud(t.timber + ': ' + wood + ' · ' + t.pitch + ': ' + pitch + ' · ' + t.animals + ': ' + babyAnimals.length + ' · ' + t.arkProg + ': ' + arkProgress + '%');
      });

      host.onRender(function (ctx) {
        // Sunny sky & rolling meadow
        var sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#bae6fd');
        sky.addColorStop(0.28, '#fef9c3');
        sky.addColorStop(0.29, '#bbf7d0');
        sky.addColorStop(1, '#86efac');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Rainbow growing with Ark progress
        if (arkProgress > 0) {
          var cols = ['#fb7185', '#fdba74', '#fde047', '#4ade80', '#60a5fa', '#c084fc'];
          ctx.globalAlpha = 0.25 + (arkProgress / 100) * 0.65;
          cols.forEach(function (c, i) {
            ctx.strokeStyle = c; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(480, 120, 180 - i * 6, Math.PI, Math.PI * 2); ctx.stroke();
          });
          ctx.globalAlpha = 1;
        }

        // Cute Ark Hull at Top Center
        ctx.fillStyle = '#b45309'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(395, 62); ctx.lineTo(565, 62); ctx.lineTo(542, 102); ctx.lineTo(418, 102); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        S.roundRect(ctx, 430, 34, 100, 28, 6); ctx.fill(); ctx.stroke();

        // Cozy Noah cheering beside the dock
        S.drawChibiHero(ctx, 130, 270, { kind: 'noah', moving: false }, time);

        // 6x4 Village Grid
        for (var r = 0; r < ROWS; r++) {
          for (var c = 0; c < COLS; c++) {
            var gx = OX + c * CELL;
            var gy = OY + r * CELL;
            ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)';
            ctx.strokeStyle = 'rgba(74, 50, 40, 0.22)';
            ctx.lineWidth = 1.5;
            S.roundRect(ctx, gx + 4, gy + 4, CELL - 8, CELL - 8, 12);
            ctx.fill(); ctx.stroke();

            var b = grid[r][c];
            if (b) {
              var cx = gx + CELL / 2, cy = gy + CELL / 2;
              ctx.strokeStyle = S.INK; ctx.lineWidth = 2;
              if (b.type === 'mill') {
                ctx.fillStyle = '#fbbf24'; S.roundRect(ctx, cx - 22, cy - 12, 44, 30, 8); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#dc2626';
                ctx.beginPath(); ctx.moveTo(cx - 26, cy - 10); ctx.lineTo(cx, cy - 30); ctx.lineTo(cx + 26, cy - 10); ctx.closePath(); ctx.fill(); ctx.stroke();
              } else if (b.type === 'well') {
                ctx.fillStyle = '#94a3b8'; S.roundRect(ctx, cx - 18, cy - 8, 36, 24, 10); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.ellipse(cx, cy - 6, 13, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
              } else if (b.type === 'pen') {
                ctx.fillStyle = '#fde68a'; S.roundRect(ctx, cx - 24, cy - 10, 48, 28, 8); ctx.fill(); ctx.stroke();
                S.drawCuteAnimal(ctx, cx, cy - 4, 'sheep', time, 0.72);
              }
            }
          }
        }

        // Baby animals walking to Ark
        babyAnimals.forEach(function (a) {
          S.drawCuteAnimal(ctx, a.x, a.y, a.kind, time, 0.8);
        });

        ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
        popups.forEach(function (p) {
          ctx.fillStyle = '#92400e';
          ctx.fillText(p.text, p.x, p.y);
        });
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.ark;
  }
})(typeof window !== 'undefined' ? window : globalThis);
