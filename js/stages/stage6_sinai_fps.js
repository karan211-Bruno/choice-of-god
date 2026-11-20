(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.sinai = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var uiT = function () { return host.pack().stageUi.sinai; };

      var aim = { x: W / 2, y: H / 2 };
      var mannaGot = 0;
      var shadowsPurified = 0;
      var timeLeft = 45;
      var time = 0;
      var calfChoiceDone = false;

      var targets = [];
      var bolts = [];
      var spawnCd = 0.6;

      host.onPointer('pointermove', function (x, y) { aim.x = x; aim.y = y; });
      host.onPointer('pointerdown', function (x, y) { aim.x = x; aim.y = y; fireBolt(); });

      function fireBolt() {
        host.sfx('magic');
        var sx = W - 180, sy = H - 70;
        var a = Math.atan2(aim.y - sy, aim.x - sx);
        bolts.push({ x: sx, y: sy, vx: Math.cos(a) * 680, vy: Math.sin(a) * 680, life: 1.4 });
      }

      host.onUpdate(function (dt, keys) {
        time += dt;
        timeLeft -= dt;

        // Keyboard aiming support
        if (keys.left) aim.x -= 320 * dt;
        if (keys.right) aim.x += 320 * dt;
        if (keys.up) aim.y -= 320 * dt;
        if (keys.down) aim.y += 320 * dt;
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
            vx: (Math.random() - 0.5) * 90,
            vy: kind === 'manna' ? (58 + Math.random() * 35) : ((Math.random() - 0.5) * 65)
          });
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
          for (var j = targets.length - 1; j >= 0; j--) {
            if (Math.hypot(b.x - targets[j].x, b.y - targets[j].y) < 34) {
              if (targets[j].kind === 'manna') {
                mannaGot = Math.min(8, mannaGot + 1);
                host.sfx('chime');
              } else {
                shadowsPurified = Math.min(8, shadowsPurified + 1);
                host.sfx('slash');
                if (shadowsPurified === 4 && !calfChoiceDone) {
                  calfChoiceDone = true;
                  host.openDialogue('sinai_calf', {
                    onEffect: function (eff) { root.COG.State.addStat(eff); }
                  });
                }
              }
              targets.splice(j, 1);
              hit = true;
              break;
            }
          }
          if (hit || b.life <= 0) bolts.splice(bi, 1);
        }

        var t = uiT();
        host.setHud(t.manna + ': ' + mannaGot + '/8 · ' + t.purified + ': ' + shadowsPurified + '/8 · ' + t.time + ': ' + Math.max(0, Math.ceil(timeLeft)) + 's');

        if (mannaGot >= 8 && shadowsPurified >= 8) {
          host.sfx('win');
          host.win(stageObj.baseScore + Math.round(timeLeft * 15), 3, {
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
        // First-Person View of Sunlit Mount Sinai & Golden Tabernacle!
        var sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#bae6fd');
        sky.addColorStop(0.55, '#fef3c7');
        sky.addColorStop(1, '#fed7aa');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Mount Sinai Peaks
        ctx.fillStyle = '#d97706'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(0, 390); ctx.lineTo(240, 145); ctx.lineTo(480, 340); ctx.lineTo(740, 130); ctx.lineTo(W, 380); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Tabernacle Horizon Center
        ctx.fillStyle = '#fffbeb';
        S.roundRect(ctx, 410, 330, 140, 68, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.moveTo(400, 330); ctx.lineTo(480, 290); ctx.lineTo(560, 330); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Targets (Manna stars & Shadow wisps)
        targets.forEach(function (tg) {
          if (tg.kind === 'manna') {
            S.drawStarGem(ctx, tg.x, tg.y, '#fef08a', time);
          } else {
            S.drawCuteSerpent(ctx, tg.x, tg.y, time, 1.0, false);
          }
        });

        // Light Bolts
        bolts.forEach(function (b) {
          ctx.fillStyle = '#fde047';
          ctx.beginPath(); ctx.arc(b.x, b.y, 11, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
        });

        // First-Person Golden Shepherd Staff tracking crosshair (bottom-right!)
        var sx = W - 150, sy = H + 20;
        var ang = Math.atan2(aim.y - sy, aim.x - sx);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(ang);
        ctx.fillStyle = '#b45309'; ctx.strokeStyle = S.INK; ctx.lineWidth = 3;
        S.roundRect(ctx, 0, -9, 175, 18, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(178, 0, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();

        // Aim Crosshair
        ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(aim.x, aim.y, 20, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(aim.x - 28, aim.y); ctx.lineTo(aim.x - 10, aim.y);
        ctx.moveTo(aim.x + 10, aim.y); ctx.lineTo(aim.x + 28, aim.y);
        ctx.moveTo(aim.x, aim.y - 28); ctx.lineTo(aim.x, aim.y - 10);
        ctx.moveTo(aim.x, aim.y + 10); ctx.lineTo(aim.x, aim.y + 28);
        ctx.stroke();
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.sinai;
  }
})(typeof window !== 'undefined' ? window : globalThis);
