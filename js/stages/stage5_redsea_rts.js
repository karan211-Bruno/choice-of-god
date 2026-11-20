(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.redsea = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var uiT = function () { return host.pack().stageUi.redsea; };
      var bonus = root.COG.State.getPowerBonus();

      var lanesY = [195, 295, 395];
      var selectedLane = 1;
      var mana = 45;
      var baseHp = 5;
      var enemiesDefeated = 0;
      var totalEnemiesToSpawn = 10;
      var spawnedCount = 0;
      var spawnCd = 1.1;
      var time = 0;

      var allies = [];
      var foes = [];
      var waveAnim = 0;
      var fish = [
        { x: 180, y: 55, spd: 32, col: '#fde047' },
        { x: 640, y: 78, spd: -28, col: '#fb7185' },
        { x: 420, y: 495, spd: 35, col: '#f472b6' },
        { x: 780, y: 485, spd: -30, col: '#fde047' }
      ];

      function renderToolbar() {
        var t = uiT();
        var laneBtns = t.lanes.map(function (lbl, idx) {
          return '<button type="button" class="' + (selectedLane === idx ? 'btn-primary-gold' : 'btn-ghost') + '" data-lane="' + idx + '">' + lbl + '</button>';
        }).join('');
        var unitBtns = t.units.map(function (u) {
          return '<button type="button" class="btn-secondary" data-unit="' + u.id + '">' + u.name + '</button>';
        }).join('');
        var tb = host.setToolbar('<div class="sim-toolbar">' + laneBtns + ' | ' + unitBtns + '</div>');
        if (!tb) return;

        var lb = tb.querySelectorAll('[data-lane]');
        for (var i = 0; i < lb.length; i++) {
          lb[i].addEventListener('click', function () {
            selectedLane = Number(this.getAttribute('data-lane'));
            host.sfx('click');
            renderToolbar();
          });
        }
        var ub = tb.querySelectorAll('[data-unit]');
        for (var j = 0; j < ub.length; j++) {
          ub[j].addEventListener('click', function () {
            summon(this.getAttribute('data-unit'));
          });
        }
      }

      function summon(unitId) {
        var u = uiT().units.find(function (x) { return x.id === unitId; });
        if (!u || mana < u.cost) { host.sfx('hit'); return; }
        mana -= u.cost;
        if (unitId === 'wave') {
          waveAnim = 1.0;
          host.sfx('magic');
          for (var i = foes.length - 1; i >= 0; i--) {
            foes[i].hp -= (45 + bonus.atk);
            foes[i].x += 90;
            if (foes[i].hp <= 0) { foes.splice(i, 1); enemiesDefeated++; }
          }
          checkWin();
          return;
        }
        host.sfx('chime');
        allies.push({
          kind: unitId,
          lane: selectedLane,
          x: 130,
          hp: unitId === 'knight' ? 110 : 65,
          atk: (unitId === 'angel' ? 24 : (unitId === 'knight' ? 16 : 8)) + Math.round(bonus.atk * 0.4),
          spd: unitId === 'miriam' ? 36 : 62,
          cd: 0
        });
      }

      function checkWin() {
        if (enemiesDefeated >= totalEnemiesToSpawn && foes.length === 0) {
          host.sfx('win');
          host.win(stageObj.baseScore + baseHp * 120, baseHp >= 4 ? 3 : 2, {
            faith: 8, mercy: 5,
            customSummary: host.t('stages.redsea.outro')
          });
        }
      }

      host.onPointer('pointerdown', function (x, y) {
        if (y < 245) selectedLane = 0;
        else if (y < 345) selectedLane = 1;
        else selectedLane = 2;
        renderToolbar();
      });

      renderToolbar();

      host.onUpdate(function (dt) {
        time += dt;
        mana = Math.min(100, mana + 10.5 * dt);
        if (waveAnim > 0) waveAnim = Math.max(0, waveAnim - dt * 1.4);

        if (spawnedCount < totalEnemiesToSpawn) {
          spawnCd -= dt;
          if (spawnCd <= 0) {
            spawnCd = 2.6;
            spawnedCount++;
            var isBoss = spawnedCount === totalEnemiesToSpawn;
            foes.push({
              lane: Math.floor(Math.random() * 3),
              x: W - 40,
              hp: isBoss ? 140 : 52,
              maxHp: isBoss ? 140 : 52,
              spd: isBoss ? 48 : 56,
              atk: isBoss ? 22 : 14,
              isBoss: isBoss,
              cd: 0
            });
          }
        }

        // Update allies
        for (var ai = allies.length - 1; ai >= 0; ai--) {
          var a = allies[ai];
          if (a.cd > 0) a.cd -= dt;
          if (a.kind === 'miriam' && a.cd <= 0) {
            a.cd = 1.6;
            allies.forEach(function (other) { other.hp = Math.min(110, other.hp + 10); });
          }
          var blocked = false;
          for (var fi = foes.length - 1; fi >= 0; fi--) {
            var f = foes[fi];
            if (f.lane === a.lane && Math.abs(f.x - a.x) < 42) {
              blocked = true;
              if (a.cd <= 0) {
                a.cd = 0.65;
                f.hp -= a.atk;
                host.sfx('slash');
                if (f.hp <= 0) {
                  foes.splice(fi, 1);
                  enemiesDefeated++;
                  checkWin();
                }
              }
              break;
            }
          }
          if (!blocked && a.x < W - 80) a.x += a.spd * dt;
        }

        // Update foes
        for (var i = foes.length - 1; i >= 0; i--) {
          var e = foes[i];
          if (e.cd > 0) e.cd -= dt;
          var hitAlly = allies.find(function (al) { return al.lane === e.lane && Math.abs(al.x - e.x) < 42; });
          if (hitAlly) {
            if (e.cd <= 0) {
              e.cd = 0.8;
              hitAlly.hp -= e.atk;
              if (hitAlly.hp <= 0) allies.splice(allies.indexOf(hitAlly), 1);
            }
          } else {
            e.x -= e.spd * dt;
            if (e.x < 75) {
              foes.splice(i, 1);
              baseHp--;
              host.sfx('hit');
              if (baseHp <= 0) { host.sfx('fail'); host.fail(); return; }
              enemiesDefeated++;
              checkWin();
            }
          }
        }

        var t = uiT();
        host.setHud(t.mana + ': ' + Math.floor(mana) + ' · ' + t.wave + ': ' + enemiesDefeated + '/' + totalEnemiesToSpawn + ' · ' + t.baseHp + ': ' + '❤️'.repeat(baseHp));
      });

      host.onRender(function (ctx) {
        // Dry Sandy Seabed
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 120, W, 330);

        // Towering Turquoise Water Walls Top & Bottom with swimming cute fish!
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, 0, W, 125);
        ctx.fillRect(0, 445, W, 95);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(0, 125); ctx.lineTo(W, 125); ctx.moveTo(0, 445); ctx.lineTo(W, 445); ctx.stroke();

        fish.forEach(function (fs) {
          var fx = (fs.x + time * fs.spd + W * 4) % W;
          ctx.fillStyle = fs.col; ctx.strokeStyle = S.INK; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(fx, fs.y, 11, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });

        // 3 Lanes with active highlight
        lanesY.forEach(function (ly, idx) {
          ctx.fillStyle = idx === selectedLane ? 'rgba(250, 204, 21, 0.25)' : 'rgba(255,255,255,0.22)';
          S.roundRect(ctx, 60, ly - 38, W - 90, 76, 14);
          ctx.fill();
        });

        // Moses cheering on left shore
        S.drawChibiHero(ctx, 56, 295, { kind: 'moses', moving: false }, time);

        // Allies & Foes
        allies.forEach(function (a) {
          var ay = lanesY[a.lane];
          if (a.kind === 'angel') S.drawCuteAngel(ctx, a.x, ay, '#38bdf8', time, 0.9);
          else if (a.kind === 'miriam') S.drawChibiHero(ctx, a.x, ay, { kind: 'miriam', moving: true, weapon: 'none' }, time);
          else S.drawChibiHero(ctx, a.x, ay, { kind: 'knight', moving: true }, time);
        });

        foes.forEach(function (f) {
          var fy = lanesY[f.lane];
          S.drawChariot(ctx, f.x, fy, time, f.isBoss);
          ctx.fillStyle = '#fff'; ctx.fillRect(f.x - 18, fy - 40, 36, 5);
          ctx.fillStyle = '#ef4444'; ctx.fillRect(f.x - 18, fy - 40, 36 * (f.hp / f.maxHp), 5);
        });

        // Tidal Wave Ult Sweep
        if (waveAnim > 0) {
          var wx = (1 - waveAnim) * W;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
          ctx.fillRect(wx - 45, 125, 90, 320);
        }
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.redsea;
  }
})(typeof window !== 'undefined' ? window : globalThis);
