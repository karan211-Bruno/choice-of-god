(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.sinai = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var vfx = root.COG.VFX.createManager();
      var uiT = function () { return host.pack().stageUi.sinai; };

      var aim = { x: W / 2, y: H / 2 };
      var mannaGot = 0;
      var shadowsPurified = 0;
      var combo = 0;
      var timeLeft = 45;
      var time = 0;
      var recoil = 0;
      var sunburstCd = 0;
      var sunburstSweepX = -1;
      var calfChoiceDone = false;

      var targets = [];
      var bolts = [];
      var guardianBoss = null; // Spawns at 4 shadows purified!
      var spawnCd = 0.6;

      function renderToolbar() {
        var t = uiT();
        var dis = sunburstCd > 0 ? ' disabled' : '';
        var lbl = t.skills.sunburst + (sunburstCd > 0 ? ' (' + sunburstCd.toFixed(1) + 's)' : '');
        var tb = host.setToolbar('<div class="sim-toolbar"><button type="button" class="btn-primary-gold" data-sk="sun"' + dis + '>' + lbl + '</button></div>');
        if (!tb) return;
        var btn = tb.querySelector('[data-sk="sun"]');
        if (btn) btn.addEventListener('click', triggerSunburst);
      }

      function triggerSunburst() {
        if (sunburstCd > 0) return;
        sunburstCd = 9.0;
        recoil = 1;
        sunburstSweepX = 0;
        host.sfx('magic');
        host.shake(10, 0.35);
        vfx.spawnRing(480, 260, '#fde047', 160, 0.5);

        for (var i = targets.length - 1; i >= 0; i--) {
          if (targets[i].kind === 'shadow') {
            shadowsPurified = Math.min(8, shadowsPurified + 1);
            vfx.spawnBurst(targets[i].x, targets[i].y, '#fde047', 12, 130);
            vfx.addPopup(targets[i].x, targets[i].y, 'PURIFY!', '#fde047', 1.15);
            targets.splice(i, 1);
            combo++;
          }
        }
        if (guardianBoss) {
          guardianBoss.hp = Math.max(0, guardianBoss.hp - 50);
          guardianBoss.hitFlash = 0.25;
          vfx.addPopup(guardianBoss.x, guardianBoss.y - 45, '-50 SUNBURST!', '#fde047', 1.3);
          checkGuardianDefeated();
        }
        maybeSpawnBossAndChoice();
        renderToolbar();
      }

      function maybeSpawnBossAndChoice() {
        if (shadowsPurified >= 4 && !calfChoiceDone) {
          calfChoiceDone = true;
          host.openDialogue('sinai_calf', {
            onEffect: function (eff) { root.COG.State.addStat(eff); },
            onClose: function () {
              if (!guardianBoss) {
                guardianBoss = { x: 480, y: 170, vx: 135, hp: 140, maxHp: 140, hitFlash: 0, atkTimer: 0 };
                vfx.spawnRing(480, 170, '#c084fc', 120, 0.6);
              }
            }
          });
        }
      }

      function checkGuardianDefeated() {
        if (guardianBoss && guardianBoss.hp <= 0) {
          vfx.spawnRing(guardianBoss.x, guardianBoss.y, '#fde047', 140, 0.6);
          vfx.spawnBurst(guardianBoss.x, guardianBoss.y, '#fde047', 24, 180);
          vfx.addPopup(guardianBoss.x, guardianBoss.y - 30, 'PURIFIED!', '#4ade80', 1.4);
          shadowsPurified = 8;
          guardianBoss = null;
          host.sfx('win');
        }
      }

      host.onKeyDown(function (key) {
        if (key === 'Shift') triggerSunburst();
      });
      host.onPointer('pointermove', function (x, y) { aim.x = x; aim.y = y; });
      host.onPointer('pointerdown', function (x, y) { aim.x = x; aim.y = y; fireBolt(); });

      function fireBolt() {
        host.sfx('magic');
        recoil = 1;
        var sx = W - 180, sy = H - 70;
        var baseA = Math.atan2(aim.y - sy, aim.x - sx);
        var spread = combo >= 4 ? [-0.15, 0, 0.15] : [0];
        spread.forEach(function (off) {
          var a = baseA + off;
          bolts.push({ x: sx, y: sy, vx: Math.cos(a) * 720, vy: Math.sin(a) * 720, life: 1.4 });
        });
      }

      renderToolbar();

      host.onUpdate(function (dt, keys) {
        time += dt;
        timeLeft -= dt;
        if (recoil > 0) recoil = Math.max(0, recoil - dt * 5.5);
        var prevReady = sunburstCd <= 0;
        if (sunburstCd > 0) sunburstCd = Math.max(0, sunburstCd - dt);
        if (Math.floor((sunburstCd + dt) * 2) !== Math.floor(sunburstCd * 2) || (!prevReady && sunburstCd <= 0)) {
          renderToolbar();
        }
        if (sunburstSweepX >= 0) {
          sunburstSweepX += 1600 * dt;
          if (sunburstSweepX > W + 80) sunburstSweepX = -1;
        }

        if (keys.left) aim.x -= 330 * dt;
        if (keys.right) aim.x += 330 * dt;
        if (keys.up) aim.y -= 330 * dt;
        if (keys.down) aim.y += 330 * dt;
        aim.x = Math.max(40, Math.min(W - 40, aim.x));
        aim.y = Math.max(40, Math.min(H - 60, aim.y));

        if (host.consumeAction()) fireBolt();

        spawnCd -= dt;
        if (spawnCd <= 0 && targets.length < 7) {
          spawnCd = 0.85;
          var needManna = mannaGot < 8;
          var needShadow = shadowsPurified < 8;
          var kind = (needManna && (!needShadow || Math.random() < 0.5)) ? 'manna' : 'shadow';
          targets.push({
            kind: kind,
            x: 110 + Math.random() * (W - 220),
            y: kind === 'manna' ? 30 : (140 + Math.random() * 210),
            vx: (Math.random() - 0.5) * 95,
            vy: kind === 'manna' ? (58 + Math.random() * 35) : ((Math.random() - 0.5) * 68)
          });
        }

        if (guardianBoss) {
          guardianBoss.x += guardianBoss.vx * dt;
          guardianBoss.y = 175 + Math.sin(time * 2.5) * 42;
          if (guardianBoss.x < 130 || guardianBoss.x > W - 130) guardianBoss.vx *= -1;
          if (guardianBoss.hitFlash > 0) guardianBoss.hitFlash = Math.max(0, guardianBoss.hitFlash - dt);
          if (guardianBoss.atkTimer > 0) guardianBoss.atkTimer = Math.max(0, guardianBoss.atkTimer - dt);
        }

        for (var ti = targets.length - 1; ti >= 0; ti--) {
          var tg = targets[ti];
          tg.x += tg.vx * dt; tg.y += tg.vy * dt;
          if (tg.x < 70 || tg.x > W - 70) tg.vx *= -1;
          if (tg.kind === 'shadow' && (tg.y < 100 || tg.y > 380)) tg.vy *= -1;
          if (tg.y > H) targets.splice(ti, 1);
        }

        for (var bi = bolts.length - 1; bi >= 0; bi--) {
          var b = bolts[bi];
          b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
          var hit = false;

          if (guardianBoss && Math.hypot(b.x - guardianBoss.x, b.y - guardianBoss.y) < 54) {
            guardianBoss.hp -= 20;
            guardianBoss.hitFlash = 0.16;
            guardianBoss.atkTimer = 0.25;
            combo++;
            host.sfx('slash');
            host.shake(5, 0.14);
            vfx.spawnBurst(b.x, b.y, '#c084fc', 10, 130);
            vfx.addPopup(b.x, b.y - 24, '-20 CRIT!', '#fde047', 1.1);
            checkGuardianDefeated();
            hit = true;
          }

          if (!hit) {
            for (var j = targets.length - 1; j >= 0; j--) {
              if (Math.hypot(b.x - targets[j].x, b.y - targets[j].y) < 40) {
                combo++;
                if (targets[j].kind === 'manna') {
                  mannaGot = Math.min(8, mannaGot + 1);
                  vfx.spawnBurst(targets[j].x, targets[j].y, '#fef08a', 12, 130);
                  vfx.addPopup(targets[j].x, targets[j].y - 14, '+1 MANNA!', '#fde047', 1.05);
                  host.sfx('chime');
                } else {
                  shadowsPurified = Math.min(8, shadowsPurified + 1);
                  vfx.spawnBurst(targets[j].x, targets[j].y, '#c084fc', 12, 130);
                  vfx.addPopup(targets[j].x, targets[j].y - 14, 'PURIFY!', '#bbf7d0', 1.05);
                  host.sfx('slash');
                  host.shake(4, 0.12);
                  maybeSpawnBossAndChoice();
                }
                targets.splice(j, 1);
                hit = true;
                break;
              }
            }
          }

          if (b.life <= 0) {
            combo = 0;
            bolts.splice(bi, 1);
          } else if (hit) {
            bolts.splice(bi, 1);
          }
        }

        vfx.update(dt);

        var t = uiT();
        host.setHud(t.manna + ': ' + mannaGot + '/8 · ' + t.purified + ': ' + shadowsPurified + '/8 · ' +
          (combo >= 4 ? t.fever + ' · ' : '') + t.time + ': ' + Math.max(0, Math.ceil(timeLeft)) + 's');

        if (mannaGot >= 8 && shadowsPurified >= 8 && !guardianBoss) {
          host.sfx('win');
          host.win(stageObj.baseScore + Math.round(timeLeft * 15) + combo * 25, 3, {
            faith: 10, wisdom: 8, mercy: 6, triggerEnding: true,
            customSummary: host.t('stages.sinai.outro')
          });
          return;
        }
        if (timeLeft <= 0) {
          host.sfx('fail');
          host.fail();
        }
      });

      host.onRender(function (ctx) {
        if (!Sp || !Sp.drawCover(ctx, 'bg_sinai', W, H)) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#bae6fd');
          sky.addColorStop(1, '#fed7aa');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
        }

        S.drawBuilding(ctx, 'tabernacle', 480, 415, {
          height: 138,
          anchorY: 0.85,
          glowColor: 'rgba(250, 204, 21, 0.45)',
          glowRadius: 90
        }, time);

        targets.forEach(function (tg) {
          if (tg.kind === 'manna') {
            S.drawStarGem(ctx, tg.x, tg.y, '#fef08a', time);
          } else {
            S.drawCuteSerpent(ctx, tg.x, tg.y + 24, time, 0.9, false, { flipX: tg.vx > 0, moving: true });
          }
        });

        if (guardianBoss) {
          S.drawCuteSerpent(ctx, guardianBoss.x, guardianBoss.y + 40, time, 1.15, true, {
            flipX: guardianBoss.vx > 0,
            moving: true,
            attackTimer: guardianBoss.atkTimer,
            hitFlash: guardianBoss.hitFlash > 0
          });
          if (Sp && Sp.drawGlossyBar) {
            Sp.drawGlossyBar(ctx, guardianBoss.x - 55, guardianBoss.y - 82, 110, 12, guardianBoss.hp / guardianBoss.maxHp, '#c084fc', '#1c1917');
          }
        }

        if (sunburstSweepX >= 0) {
          var grad = ctx.createLinearGradient(sunburstSweepX - 55, 0, sunburstSweepX + 55, 0);
          grad.addColorStop(0, 'rgba(254, 240, 138, 0)');
          grad.addColorStop(0.5, 'rgba(254, 240, 138, 0.9)');
          grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(sunburstSweepX - 55, 0, 110, H);
        }

        bolts.forEach(function (b) {
          ctx.save();
          ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
          ctx.beginPath(); ctx.arc(b.x, b.y, 18, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath(); ctx.arc(b.x, b.y, 10, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
          ctx.restore();
        });

        vfx.renderFront(ctx);

        // First-person Golden Shepherd Staff with recoil
        var sx = W - 150, sy = H + 20;
        var ang = Math.atan2(aim.y - sy, aim.x - sx);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(ang);
        ctx.translate(-recoil * 18, 0);
        ctx.fillStyle = '#b45309'; ctx.strokeStyle = S.INK; ctx.lineWidth = 3;
        S.roundRect(ctx, 0, -9, 175, 18, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
        ctx.beginPath(); ctx.arc(178, 0, 28, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(178, 0, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();

        // Crosshair
        ctx.save();
        ctx.strokeStyle = combo >= 4 ? '#facc15' : '#ea580c'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(aim.x, aim.y, combo >= 4 ? 28 : 22, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(aim.x - 30, aim.y); ctx.lineTo(aim.x - 10, aim.y);
        ctx.moveTo(aim.x + 10, aim.y); ctx.lineTo(aim.x + 30, aim.y);
        ctx.moveTo(aim.x, aim.y - 30); ctx.lineTo(aim.x, aim.y - 10);
        ctx.moveTo(aim.x, aim.y + 10); ctx.lineTo(aim.x, aim.y + 30);
        ctx.stroke();
        ctx.restore();

        if (combo >= 4 && Sp && Sp.drawLevelBadge) {
          Sp.drawLevelBadge(ctx, 90, 34, uiT().fever, '#fde047');
        }
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.sinai;
  }
})(typeof window !== 'undefined' ? window : globalThis);
