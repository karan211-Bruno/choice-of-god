(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

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

  root.COG.STAGES.eden = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var uiT = function () { return host.pack().stageUi.eden; };
      var bonus = root.COG.State.getPowerBonus();

      var hero = {
        x: 480, y: 390, r: 20, speed: 255, hp: 7 + Math.floor(bonus.hp / 25), maxHp: 7 + Math.floor(bonus.hp / 25),
        facingAngle: -Math.PI / 2, moving: false, attackTimer: 0, attackCd: 0, dashTimer: 0, dashCd: 0, dashVx: 0, dashVy: 0, invuln: 0
      };
      var angelPos = { x: 432, y: 356 };
      var time = 0;
      var talkedCherubim = false;
      var crossroadsDone = false;

      var stars = [
        { x: 280, y: 140, got: false },
        { x: 690, y: 135, got: false },
        { x: 260, y: 420, got: false },
        { x: 685, y: 420, got: false },
        { x: 480, y: 115, got: false }
      ];
      var enemies = [
        { x: 240, y: 190, hp: 36, maxHp: 36, spd: 56, isBoss: false, cd: 0, hitFlash: 0 },
        { x: 710, y: 200, hp: 36, maxHp: 36, spd: 56, isBoss: false, cd: 0, hitFlash: 0 },
        { x: 255, y: 355, hp: 36, maxHp: 36, spd: 56, isBoss: false, cd: 0, hitFlash: 0 },
        { x: 175, y: 270, hp: 155, maxHp: 155, spd: 68, isBoss: true, cd: 0, hitFlash: 0 }
      ];
      var flowers = [];
      for (var f = 0; f < 16; f++) {
        flowers.push({
          x: 90 + ((f * 137) % 780),
          y: 85 + ((f * 223) % 380),
          col: ['#ffffff', '#fbcfe8', '#fde047', '#bae6fd'][f % 4]
        });
      }
      var butterflies = [
        { x: 360, y: 220, col: '#f472b6' },
        { x: 600, y: 320, col: '#fde047' },
        { x: 460, y: 160, col: '#60a5fa' }
      ];
      var sparkles = [];
      var burstParticles = [];

      var treeLife = { x: 480, y: 260 };
      var treeForb = { x: 115, y: 270 };
      var npcCherubim = { x: 825, y: 270 };

      function spawnBurst(x, y, col, count) {
        for (var i = 0; i < (count || 8); i++) {
          var a = (i / (count || 8)) * Math.PI * 2 + Math.random() * 0.4;
          var sp = 60 + Math.random() * 90;
          burstParticles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, col: col, life: 0.42, maxLife: 0.42 });
        }
      }

      function slashAttack() {
        if (hero.attackCd > 0) return;
        hero.attackTimer = 0.22;
        hero.attackCd = 0.28;
        host.sfx('slash');
        var dmg = 20 + bonus.atk;
        for (var i = enemies.length - 1; i >= 0; i--) {
          var en = enemies[i];
          var d = dist(hero.x, hero.y, en.x, en.y);
          if (d <= 82) {
            en.hp -= dmg;
            en.hitFlash = 0.14;
            var a = Math.atan2(en.y - hero.y, en.x - hero.x);
            en.x = Math.max(50, Math.min(W - 50, en.x + Math.cos(a) * 26));
            en.y = Math.max(50, Math.min(H - 50, en.y + Math.sin(a) * 26));
            sparkles.push({ x: en.x, y: en.y - 24, life: 0.45, text: '-' + dmg, col: '#fde047' });
            spawnBurst(en.x, en.y - 14, '#fef08a', 7);

            if (en.isBoss && en.hp > 0 && en.hp <= en.maxHp * 0.5 && !crossroadsDone) {
              triggerCrossroads();
              return;
            }
            if (en.hp <= 0) {
              var wasBoss = en.isBoss;
              spawnBurst(en.x, en.y - 16, '#c084fc', 14);
              enemies.splice(i, 1);
              host.sfx('chime');
              if (wasBoss) {
                root.COG.State.setEdenRoute('preserved');
                host.sfx('win');
                host.win(stageObj.baseScore + hero.hp * 80, 3, {
                  faith: 10, wisdom: 6,
                  customSummary: host.t('stages.eden.outroPreserved')
                });
                return;
              }
            }
          }
        }
      }

      function triggerCrossroads() {
        crossroadsDone = true;
        host.openDialogue('eden_crossroads', {
          onEffect: function (eff) {
            if (eff.heal) hero.hp = hero.maxHp;
            if (eff.edenRoute === 'fallen') {
              root.COG.State.setEdenRoute('fallen');
              host.sfx('choice');
              host.win(stageObj.baseScore, 2, {
                mercy: 6, wisdom: 6,
                customSummary: host.t('stages.eden.outroFallen')
              });
            }
          }
        });
      }

      function tryInteract() {
        if (dist(hero.x, hero.y, npcCherubim.x, npcCherubim.y) < 75) {
          talkedCherubim = true;
          host.openDialogue('eden_cherubim', {
            onEffect: function (eff) {
              if (eff.heal) hero.hp = hero.maxHp;
              root.COG.State.addStat(eff);
            }
          });
          return true;
        }
        if (dist(hero.x, hero.y, treeForb.x, treeForb.y) < 78) {
          triggerCrossroads();
          return true;
        }
        return false;
      }

      host.onPointer('pointerdown', function (x, y) {
        if (dist(x, y, npcCherubim.x, npcCherubim.y) < 65 && dist(hero.x, hero.y, npcCherubim.x, npcCherubim.y) < 110) {
          tryInteract();
          return;
        }
        if (dist(x, y, treeForb.x, treeForb.y) < 65 && dist(hero.x, hero.y, treeForb.x, treeForb.y) < 110) {
          triggerCrossroads();
          return;
        }
        hero.facingAngle = Math.atan2(y - hero.y, x - hero.x);
        slashAttack();
      });

      host.onUpdate(function (dt, keys) {
        time += dt;
        if (hero.attackTimer > 0) hero.attackTimer = Math.max(0, hero.attackTimer - dt);
        if (hero.attackCd > 0) hero.attackCd = Math.max(0, hero.attackCd - dt);
        if (hero.dashCd > 0) hero.dashCd = Math.max(0, hero.dashCd - dt);
        if (hero.invuln > 0) hero.invuln = Math.max(0, hero.invuln - dt);

        if (host.consumeDash() && hero.dashCd <= 0) {
          hero.dashTimer = 0.2; hero.dashCd = 0.85; hero.invuln = 0.35;
          hero.dashVx = Math.cos(hero.facingAngle) * 520;
          hero.dashVy = Math.sin(hero.facingAngle) * 520;
          host.sfx('dash');
          spawnBurst(hero.x, hero.y, '#bae6fd', 6);
        }

        if (hero.dashTimer > 0) {
          hero.dashTimer -= dt;
          hero.x += hero.dashVx * dt;
          hero.y += hero.dashVy * dt;
          hero.moving = true;
        } else {
          var dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
          var dy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
          if (dx || dy) {
            var l = Math.sqrt(dx * dx + dy * dy);
            hero.x += (dx / l) * hero.speed * dt;
            hero.y += (dy / l) * hero.speed * dt;
            hero.facingAngle = Math.atan2(dy, dx);
            hero.moving = true;
          } else {
            hero.moving = false;
          }
        }
        hero.x = Math.max(40, Math.min(W - 40, hero.x));
        hero.y = Math.max(45, Math.min(H - 40, hero.y));

        angelPos.x += (hero.x - 46 - angelPos.x) * Math.min(1, dt * 5);
        angelPos.y += (hero.y - 36 - angelPos.y) * Math.min(1, dt * 5);

        if (host.consumeAction()) {
          if (!tryInteract()) slashAttack();
        }

        var gotStars = 0;
        stars.forEach(function (st) {
          if (!st.got && dist(hero.x, hero.y, st.x, st.y) < 36) {
            st.got = true;
            host.sfx('chime');
            sparkles.push({ x: st.x, y: st.y - 10, life: 0.5, text: '+100', col: '#fde047' });
            spawnBurst(st.x, st.y, '#fde047', 10);
            root.COG.State.addStat({ score: 100, faith: 1 });
          }
          if (st.got) gotStars++;
        });

        var boss = null;
        enemies.forEach(function (en) {
          if (en.isBoss) boss = en;
          if (en.cd > 0) en.cd -= dt;
          if (en.hitFlash > 0) en.hitFlash = Math.max(0, en.hitFlash - dt);
          var d = dist(hero.x, hero.y, en.x, en.y);
          if (d < 245 && d > 26) {
            var a = Math.atan2(hero.y - en.y, hero.x - en.x);
            en.x += Math.cos(a) * en.spd * dt;
            en.y += Math.sin(a) * en.spd * dt;
          }
          if (d < 32 && hero.invuln <= 0) {
            hero.hp--;
            hero.invuln = 1.5;
            host.sfx('hit');
            sparkles.push({ x: hero.x, y: hero.y - 30, life: 0.45, text: '-1 ♥', col: '#fb7185' });
            if (hero.hp <= 0) {
              host.sfx('fail');
              host.fail();
              return;
            }
          }
        });

        for (var si = sparkles.length - 1; si >= 0; si--) {
          sparkles[si].y -= 32 * dt;
          sparkles[si].life -= dt;
          if (sparkles[si].life <= 0) sparkles.splice(si, 1);
        }
        for (var bi = burstParticles.length - 1; bi >= 0; bi--) {
          var p = burstParticles[bi];
          p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
          if (p.life <= 0) burstParticles.splice(bi, 1);
        }

        var t = uiT();
        host.setHud(t.stars + ': ' + gotStars + '/5 · ' + t.hearts + ': ' + hero.hp + '/' + hero.maxHp +
          (boss ? ' · ' + t.bossHp + ': ' + Math.max(0, boss.hp) : ''));
      });

      host.onRender(function (ctx) {
        if (!Sp || !Sp.drawCover(ctx, 'bg_eden', W, H)) {
          var bg = ctx.createLinearGradient(0, 0, 0, H);
          bg.addColorStop(0, '#bef264');
          bg.addColorStop(1, '#86efac');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, W, H);
        }

        // Subtle sunlit Eden motes & wildflowers
        flowers.forEach(function (fl) { S.drawFlower(ctx, fl.x, fl.y, fl.col, time); });
        butterflies.forEach(function (bf, idx) {
          S.drawButterfly(ctx, bf.x + Math.sin(time + idx) * 28, bf.y + Math.cos(time * 1.4 + idx) * 18, bf.col, time);
        });

        stars.forEach(function (st) {
          if (!st.got) S.drawStarGem(ctx, st.x, st.y, '#facc15', time);
        });

        // Y-sorted isometric entities (trees, NPC, enemies, hero)
        var drawQueue = [];
        drawQueue.push({
          y: treeLife.y + 34,
          fn: function () {
            S.drawLandmark(ctx, 'tree_life', treeLife.x, treeLife.y + 34, { height: 156, glow: 'rgba(134, 239, 172, 0.34)' }, time);
          }
        });
        drawQueue.push({
          y: treeForb.y + 32,
          fn: function () {
            S.drawLandmark(ctx, 'tree_forb', treeForb.x, treeForb.y + 32, { height: 140, glow: 'rgba(244, 114, 182, 0.32)' }, time);
          }
        });
        drawQueue.push({
          y: npcCherubim.y + 18,
          fn: function () {
            S.drawCuteAngel(ctx, npcCherubim.x, npcCherubim.y + 8, '#38bdf8', time, 1.0, { flipX: true });
            if (!talkedCherubim) {
              var bobY = npcCherubim.y - 68 + Math.sin(time * 5) * 4;
              ctx.fillStyle = '#fef08a'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2.4;
              ctx.beginPath(); ctx.arc(npcCherubim.x, bobY, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
              ctx.fillStyle = '#9a3412'; ctx.font = '900 14px sans-serif'; ctx.textAlign = 'center';
              ctx.fillText('!', npcCherubim.x, bobY + 5);
            }
          }
        });

        enemies.forEach(function (en) {
          drawQueue.push({
            y: en.y + 16,
            fn: function () {
              S.drawCuteSerpent(ctx, en.x, en.y + 16, time, en.isBoss ? 1.05 : 0.92, en.isBoss, {
                flipX: hero.x > en.x,
                hitFlash: en.hitFlash > 0
              });
              if (en.hp < en.maxHp) {
                var barY = en.y - (en.isBoss ? 92 : 62);
                if (Sp && Sp.drawGlossyBar) {
                  Sp.drawGlossyBar(ctx, en.x - 24, barY, 48, 8, en.hp / en.maxHp, '#fb7185', '#1c1917');
                }
              }
            }
          });
        });

        drawQueue.push({
          y: hero.y + 18,
          fn: function () {
            S.drawChibiHero(ctx, hero.x, hero.y + 18, {
              kind: 'adam_eve',
              facingAngle: hero.facingAngle,
              moving: hero.moving,
              attackTimer: hero.attackTimer,
              invuln: hero.invuln,
              height: 92,
              lv: root.COG.State.getPlayerLevel()
            }, time);
            S.drawCuteAngel(ctx, angelPos.x, angelPos.y + 6, '#38bdf8', time, 0.72);
          }
        });

        drawQueue.sort(function (a, b) { return a.y - b.y; });
        for (var q = 0; q < drawQueue.length; q++) drawQueue[q].fn();

        // Sparkle & burst particles
        burstParticles.forEach(function (p) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
          ctx.fillStyle = p.col;
          ctx.beginPath(); ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });

        sparkles.forEach(function (sp) {
          drawStrokeText(ctx, sp.text, sp.x, sp.y, sp.col || '#fde047', '900 16px sans-serif');
        });
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.eden;
  }
})(typeof window !== 'undefined' ? window : globalThis);
