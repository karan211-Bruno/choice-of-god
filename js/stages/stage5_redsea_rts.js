(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.redsea = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var uiT = function () { return host.pack().stageUi.redsea; };
      var bonus = root.COG.State.getPowerBonus();

      var lanesY = [205, 295, 385];
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
      var healRings = [];
      var waveAnim = 0;
      var fish = [
        { x: 180, y: 52, spd: 32, col: '#fde047' },
        { x: 640, y: 76, spd: -28, col: '#fb7185' },
        { x: 420, y: 496, spd: 35, col: '#f472b6' },
        { x: 780, y: 486, spd: -30, col: '#fde047' }
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
            foes[i].hitFlash = 0.2;
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
          x: 132,
          hp: unitId === 'knight' ? 110 : 65,
          maxHp: unitId === 'knight' ? 110 : 65,
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
        if (y < 250) selectedLane = 0;
        else if (y < 340) selectedLane = 1;
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
              cd: 0,
              hitFlash: 0
            });
          }
        }

        for (var hi = healRings.length - 1; hi >= 0; hi--) {
          healRings[hi].life -= dt;
          if (healRings[hi].life <= 0) healRings.splice(hi, 1);
        }

        for (var ai = allies.length - 1; ai >= 0; ai--) {
          var a = allies[ai];
          if (a.cd > 0) a.cd -= dt;
          if (a.kind === 'miriam' && a.cd <= 0) {
            a.cd = 1.6;
            healRings.push({ x: a.x, y: lanesY[a.lane], life: 0.45 });
            allies.forEach(function (other) { other.hp = Math.min(other.maxHp || 110, other.hp + 10); });
          }
          var blocked = false;
          for (var fi = foes.length - 1; fi >= 0; fi--) {
            var f = foes[fi];
            if (f.lane === a.lane && Math.abs(f.x - a.x) < 48) {
              blocked = true;
              if (a.cd <= 0) {
                a.cd = 0.65;
                f.hp -= a.atk;
                f.hitFlash = 0.14;
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

        for (var i = foes.length - 1; i >= 0; i--) {
          var e = foes[i];
          if (e.cd > 0) e.cd -= dt;
          if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt);
          var hitAlly = allies.find(function (al) { return al.lane === e.lane && Math.abs(al.x - e.x) < 48; });
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
        if (!Sp || !Sp.drawCover(ctx, 'bg_redsea', W, H)) {
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(0, 120, W, 330);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(0, 0, W, 125);
          ctx.fillRect(0, 445, W, 95);
        }

        // Animated sparkling water foam crests + swimming fish silhouettes
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 4;
        ctx.setLineDash([22, 16]);
        ctx.lineDashOffset = -time * 36;
        ctx.beginPath(); ctx.moveTo(0, 128); ctx.lineTo(W, 128); ctx.moveTo(0, 442); ctx.lineTo(W, 442); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        fish.forEach(function (fs) {
          var fx = (fs.x + time * fs.spd + W * 4) % W;
          ctx.fillStyle = fs.col; ctx.strokeStyle = S.INK; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(fx, fs.y, 11, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });

        // 3 Translucent Golden Guide Tracks
        lanesY.forEach(function (ly, idx) {
          var active = idx === selectedLane;
          ctx.fillStyle = active ? 'rgba(250, 204, 21, 0.24)' : 'rgba(255, 255, 255, 0.14)';
          ctx.strokeStyle = active ? 'rgba(250, 204, 21, 0.85)' : 'rgba(255, 255, 255, 0.28)';
          ctx.lineWidth = active ? 2.5 : 1.2;
          S.roundRect(ctx, 84, ly - 38, W - 110, 76, 16);
          ctx.fill(); ctx.stroke();
        });

        // Moses channeling on left shore
        S.drawChibiHero(ctx, 56, 315, {
          kind: 'moses',
          moving: false,
          height: 96,
          lv: root.COG.State.getPlayerLevel()
        }, time);

        // Miriam healing pulses
        healRings.forEach(function (hr) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, hr.life / 0.45);
          ctx.strokeStyle = '#fde047'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(hr.x, hr.y, (0.45 - hr.life) * 140 + 18, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        });

        // Allies & Egyptian Chariots
        allies.forEach(function (a) {
          var ay = lanesY[a.lane] + 18;
          if (a.kind === 'angel') S.drawCuteAngel(ctx, a.x, ay, '#38bdf8', time, 0.92);
          else if (a.kind === 'miriam') S.drawChibiHero(ctx, a.x, ay, { kind: 'miriam', moving: true, height: 74 }, time);
          else S.drawChibiHero(ctx, a.x, ay, { kind: 'knight', moving: true, height: 74 }, time);

          if (Sp && Sp.drawGlossyBar && a.maxHp) {
            Sp.drawGlossyBar(ctx, a.x - 18, ay - 78, 36, 6, a.hp / a.maxHp, '#22c55e', '#1c1917');
          }
        });

        foes.forEach(function (f) {
          var fy = lanesY[f.lane] + 18;
          S.drawChariot(ctx, f.x, fy, time, f.isBoss, { hitFlash: f.hitFlash > 0 });
          if (Sp && Sp.drawGlossyBar) {
            Sp.drawGlossyBar(ctx, f.x - 22, fy - (f.isBoss ? 104 : 80), 44, 7, f.hp / f.maxHp, '#fb7185', '#1c1917');
          }
        });

        if (waveAnim > 0) {
          var wx = (1 - waveAnim) * W;
          var grad = ctx.createLinearGradient(wx - 60, 0, wx + 60, 0);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.72)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.92)');
          ctx.fillStyle = grad;
          ctx.fillRect(wx - 60, 125, 120, 320);
        }
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.redsea;
  }
})(typeof window !== 'undefined' ? window : globalThis);
