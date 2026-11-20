(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.redsea = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var vfx = root.COG.VFX.createManager();
      var uiT = function () { return host.pack().stageUi.redsea; };
      var bonus = root.COG.State.getPowerBonus();

      var lanesY = [205, 295, 385];
      var selectedLane = 1;
      var mana = 48;
      var baseHp = 5;
      var enemiesDefeated = 0;
      var totalEnemiesToSpawn = 10;
      var spawnedCount = 0;
      var spawnCd = 1.0;
      var time = 0;
      var mosesCastTimer = 0;

      var allies = [];
      var foes = [];
      var spears = [];
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
            this.blur();
            selectedLane = Number(this.getAttribute('data-lane'));
            host.sfx('click');
            renderToolbar();
          });
        }
        var ub = tb.querySelectorAll('[data-unit]');
        for (var j = 0; j < ub.length; j++) {
          ub[j].addEventListener('click', function () {
            this.blur();
            summon(this.getAttribute('data-unit'));
          });
        }
      }

      function summon(unitId) {
        var u = uiT().units.find(function (x) { return x.id === unitId; });
        if (!u || mana < u.cost) { host.sfx('hit'); return; }
        mana -= u.cost;
        mosesCastTimer = 0.5;
        vfx.spawnRing(74, 290, '#fde047', 75, 0.38);

        if (unitId === 'wave') {
          waveAnim = 1.0;
          host.sfx('magic');
          host.shake(9, 0.32);
          for (var i = foes.length - 1; i >= 0; i--) {
            foes[i].hp -= (52 + bonus.atk);
            foes[i].hitFlash = 0.22;
            foes[i].recoilX = 28;
            foes[i].x += 105;
            vfx.spawnBurst(foes[i].x, lanesY[foes[i].lane], '#7dd3fc', 10, 120);
            if (foes[i].hp <= 0) { foes.splice(i, 1); enemiesDefeated++; }
          }
          spears = [];
          checkWin();
          return;
        }
        host.sfx('chime');
        vfx.spawnRing(132, lanesY[selectedLane] + 10, '#fde047', 55, 0.38);
        vfx.spawnBurst(132, lanesY[selectedLane], '#fde047', 10, 110);
        allies.push({
          kind: unitId,
          lane: selectedLane,
          x: 132,
          hp: unitId === 'knight' ? 120 : 72,
          maxHp: unitId === 'knight' ? 120 : 72,
          atk: (unitId === 'angel' ? 24 : (unitId === 'knight' ? 18 : 8)) + Math.round(bonus.atk * 0.4),
          spd: unitId === 'miriam' ? 38 : 66,
          cd: 0,
          atkTimer: 0,
          lungeX: 0,
          dropY: 56,
          dustCd: 0
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

      host.onKeyDown(function (key) {
        if (key === '1') { selectedLane = 0; renderToolbar(); }
        else if (key === '2') { selectedLane = 1; renderToolbar(); }
        else if (key === '3') { selectedLane = 2; renderToolbar(); }
        else if (key === 'q' || key === 'Q') summon('angel');
        else if (key === 'w' || key === 'W') summon('knight');
        else if (key === 'e' || key === 'E') summon('miriam');
        else if (key === 'r' || key === 'R') summon('wave');
      });

      host.onPointer('pointerdown', function (x, y) {
        if (y < 250) selectedLane = 0;
        else if (y < 340) selectedLane = 1;
        else selectedLane = 2;
        renderToolbar();
      });

      renderToolbar();

      host.onUpdate(function (dt) {
        time += dt;
        mana = Math.min(100, mana + 11.0 * dt);
        if (mosesCastTimer > 0) mosesCastTimer = Math.max(0, mosesCastTimer - dt);
        if (waveAnim > 0) waveAnim = Math.max(0, waveAnim - dt * 1.4);

        if (spawnedCount < totalEnemiesToSpawn) {
          spawnCd -= dt;
          if (spawnCd <= 0) {
            spawnCd = 2.5;
            spawnedCount++;
            var isBoss = spawnedCount === totalEnemiesToSpawn;
            var isScout = !isBoss && spawnedCount % 3 === 0;
            foes.push({
              lane: Math.floor(Math.random() * 3),
              x: W - 40,
              hp: isBoss ? 155 : (isScout ? 42 : 62),
              maxHp: isBoss ? 155 : (isScout ? 42 : 62),
              spd: isBoss ? 48 : (isScout ? 76 : 52),
              atk: isBoss ? 22 : 14,
              isBoss: isBoss,
              cd: 0,
              spearCd: 1.8,
              hitFlash: 0,
              recoilX: 0,
              dustCd: 0
            });
          }
        }

        // Update allies with spring lunge + drop-in bounce
        for (var ai = allies.length - 1; ai >= 0; ai--) {
          var a = allies[ai];
          if (a.cd > 0) a.cd -= dt;
          if (a.atkTimer > 0) a.atkTimer = Math.max(0, a.atkTimer - dt);
          if (a.lungeX > 0) a.lungeX = Math.max(0, a.lungeX - dt * 120);
          if (a.dropY > 0) a.dropY = Math.max(0, a.dropY - dt * 260);

          if (a.kind === 'miriam' && a.cd <= 0) {
            a.cd = 1.6;
            a.atkTimer = 0.48;
            vfx.spawnRing(a.x, lanesY[a.lane], '#fde047', 65, 0.42);
            vfx.addPopup(a.x, lanesY[a.lane] - 42, '♪ HEAL', '#4ade80', 0.95);
            allies.forEach(function (other) { other.hp = Math.min(other.maxHp, other.hp + 12); });
          }

          var blocked = false;
          for (var fi = foes.length - 1; fi >= 0; fi--) {
            var f = foes[fi];
            if (f.lane === a.lane && Math.abs(f.x - a.x) < 52) {
              blocked = true;
              if (a.cd <= 0) {
                a.cd = 0.62;
                a.atkTimer = 0.36;
                a.lungeX = 26;
                f.hp -= a.atk;
                f.hitFlash = 0.16;
                f.recoilX = 18;
                if (a.kind === 'knight') f.x += 18;
                host.sfx('slash');
                vfx.spawnBurst(f.x - 10, lanesY[f.lane], '#fde047', 8, 110);
                vfx.addPopup(f.x, lanesY[f.lane] - 32, '-' + a.atk, '#fde047', 0.95);
                if (f.hp <= 0) {
                  vfx.spawnBurst(f.x, lanesY[f.lane], '#fbbf24', 14, 140);
                  foes.splice(fi, 1);
                  enemiesDefeated++;
                  checkWin();
                }
              }
              break;
            }
          }
          if (!blocked && a.x < W - 80) {
            a.x += a.spd * dt;
            a.dustCd -= dt;
            if (a.dustCd <= 0) {
              a.dustCd = 0.22;
              vfx.spawnDust(a.x, lanesY[a.lane] + 16, 1);
            }
          }
        }

        // Update foes with spring recoil
        for (var i = foes.length - 1; i >= 0; i--) {
          var e = foes[i];
          if (e.cd > 0) e.cd -= dt;
          if (e.spearCd > 0) e.spearCd -= dt;
          if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt);
          if (e.recoilX > 0) e.recoilX = Math.max(0, e.recoilX - dt * 95);

          var hitAlly = allies.find(function (al) { return al.lane === e.lane && Math.abs(al.x - e.x) < 52; });
          if (hitAlly) {
            if (e.cd <= 0) {
              e.cd = 0.8;
              hitAlly.hp -= e.atk;
              vfx.spawnBurst(hitAlly.x + 8, lanesY[e.lane], '#fb7185', 5, 80);
              if (hitAlly.hp <= 0) allies.splice(allies.indexOf(hitAlly), 1);
            }
          } else {
            e.x -= e.spd * dt;
            e.dustCd -= dt;
            if (e.dustCd <= 0) {
              e.dustCd = 0.22;
              vfx.spawnDust(e.x + 14, lanesY[e.lane] + 14, 1);
            }
            if (e.spearCd <= 0) {
              var rangedTarget = allies.find(function (al) { return al.lane === e.lane && al.x < e.x && e.x - al.x < 230; });
              if (rangedTarget) {
                e.spearCd = 2.4;
                spears.push({ lane: e.lane, x: e.x - 16, vx: -280, dmg: 10 });
              }
            }
            if (e.x < 75) {
              foes.splice(i, 1);
              baseHp--;
              host.sfx('hit');
              host.shake(7, 0.24);
              if (baseHp <= 0) { host.sfx('fail'); host.fail(); return; }
              enemiesDefeated++;
              checkWin();
            }
          }
        }

        for (var si = spears.length - 1; si >= 0; si--) {
          var sp = spears[si];
          sp.x += sp.vx * dt;
          var struck = allies.find(function (al) { return al.lane === sp.lane && Math.abs(al.x - sp.x) < 24; });
          if (struck) {
            struck.hp -= sp.dmg;
            vfx.spawnBurst(sp.x, lanesY[sp.lane], '#fb7185', 5, 70);
            if (struck.hp <= 0) allies.splice(allies.indexOf(struck), 1);
            spears.splice(si, 1);
          } else if (sp.x < 60) {
            spears.splice(si, 1);
          }
        }

        vfx.update(dt);

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

        lanesY.forEach(function (ly, idx) {
          var active = idx === selectedLane;
          ctx.fillStyle = active ? 'rgba(250, 204, 21, 0.24)' : 'rgba(255, 255, 255, 0.14)';
          ctx.strokeStyle = active ? 'rgba(250, 204, 21, 0.85)' : 'rgba(255, 255, 255, 0.28)';
          ctx.lineWidth = active ? 2.5 : 1.2;
          S.roundRect(ctx, 84, ly - 38, W - 110, 76, 16);
          ctx.fill(); ctx.stroke();
        });

        vfx.renderBack(ctx);

        // Moses lunging slightly forward when casting spells
        var mosesLunge = mosesCastTimer > 0 ? Math.sin((mosesCastTimer / 0.5) * Math.PI) * 18 : 0;
        S.drawChibiHero(ctx, 56 + mosesLunge, 315, {
          kind: 'moses',
          moving: false,
          jumpY: mosesCastTimer > 0 ? 8 : 0,
          attackTimer: mosesCastTimer,
          height: 96,
          lv: root.COG.State.getPlayerLevel()
        }, time);

        allies.forEach(function (a) {
          var ay = lanesY[a.lane] + 18;
          var ax = a.x + a.lungeX;
          var hop = a.dropY + (a.atkTimer > 0 ? Math.sin((a.atkTimer / 0.4) * Math.PI) * 12 : 0);
          if (a.kind === 'angel') {
            S.drawCuteAngel(ctx, ax, ay - hop, '#38bdf8', time, 0.92, { attackTimer: a.atkTimer });
          } else if (a.kind === 'miriam') {
            S.drawChibiHero(ctx, ax, ay, { kind: 'miriam', moving: a.atkTimer <= 0, jumpY: hop, attackTimer: a.atkTimer, height: 74 }, time);
          } else {
            S.drawChibiHero(ctx, ax, ay, { kind: 'knight', moving: a.atkTimer <= 0, jumpY: hop, attackTimer: a.atkTimer, height: 74 }, time);
          }
          if (Sp && Sp.drawGlossyBar && a.maxHp) {
            Sp.drawGlossyBar(ctx, ax - 18, ay - 78 - hop * 0.5, 36, 6, a.hp / a.maxHp, '#22c55e', '#1c1917');
          }
        });

        foes.forEach(function (f) {
          var fy = lanesY[f.lane] + 18;
          var fx = f.x + f.recoilX;
          S.drawChariot(ctx, fx, fy, time, f.isBoss, { hitFlash: f.hitFlash > 0 });
          if (Sp && Sp.drawGlossyBar) {
            Sp.drawGlossyBar(ctx, fx - 22, fy - (f.isBoss ? 104 : 80), 44, 7, f.hp / f.maxHp, '#fb7185', '#1c1917');
          }
        });

        spears.forEach(function (sp) {
          var sy = lanesY[sp.lane] - 6;
          ctx.save();
          ctx.strokeStyle = '#fb7185'; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.moveTo(sp.x - 10, sy); ctx.lineTo(sp.x + 12, sy); ctx.stroke();
          ctx.fillStyle = '#fde047';
          ctx.beginPath(); ctx.moveTo(sp.x - 14, sy); ctx.lineTo(sp.x - 6, sy - 4); ctx.lineTo(sp.x - 6, sy + 4); ctx.closePath(); ctx.fill();
          ctx.restore();
        });

        if (waveAnim > 0) {
          var wx = (1 - waveAnim) * W;
          var grad = ctx.createLinearGradient(wx - 70, 0, wx + 70, 0);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.78)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
          ctx.fillStyle = grad;
          ctx.fillRect(wx - 70, 125, 140, 320);
        }

        vfx.renderFront(ctx);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.redsea;
  }
})(typeof window !== 'undefined' ? window : globalThis);
