(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  root.COG.STAGES.eden = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var uiT = function () { return host.pack().stageUi.eden; };
      var bonus = root.COG.State.getPowerBonus();

      var hero = {
        x: 480, y: 390, r: 20, speed: 255, hp: 7 + Math.floor(bonus.hp / 25), maxHp: 7 + Math.floor(bonus.hp / 25),
        facingAngle: -Math.PI / 2, moving: false, attackTimer: 0, attackCd: 0, dashTimer: 0, dashCd: 0, dashVx: 0, dashVy: 0, invuln: 0
      };
      var angelPos = { x: 440, y: 360 };
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
        { x: 240, y: 190, hp: 36, maxHp: 36, spd: 56, isBoss: false, cd: 0 },
        { x: 710, y: 200, hp: 36, maxHp: 36, spd: 56, isBoss: false, cd: 0 },
        { x: 255, y: 355, hp: 36, maxHp: 36, spd: 56, isBoss: false, cd: 0 },
        { x: 175, y: 270, hp: 155, maxHp: 155, spd: 68, isBoss: true, cd: 0 }
      ];
      var flowers = [];
      for (var f = 0; f < 22; f++) {
        flowers.push({
          x: 70 + ((f * 137) % 820),
          y: 65 + ((f * 223) % 410),
          col: ['#ffffff', '#fbcfe8', '#fde047', '#bae6fd'][f % 4]
        });
      }
      var butterflies = [
        { x: 360, y: 220, col: '#f472b6' },
        { x: 600, y: 320, col: '#fde047' },
        { x: 460, y: 160, col: '#60a5fa' }
      ];
      var sparkles = [];

      var treeLife = { x: 480, y: 260 };
      var treeForb = { x: 115, y: 270 };
      var npcCherubim = { x: 825, y: 270 };

      function slashAttack() {
        if (hero.attackCd > 0) return;
        hero.attackTimer = 0.22;
        hero.attackCd = 0.28;
        host.sfx('slash');
        var dmg = 20 + bonus.atk;
        for (var i = enemies.length - 1; i >= 0; i--) {
          var en = enemies[i];
          var d = dist(hero.x, hero.y, en.x, en.y);
          if (d <= 78) {
            en.hp -= dmg;
            var a = Math.atan2(en.y - hero.y, en.x - hero.x);
            en.x = Math.max(50, Math.min(W - 50, en.x + Math.cos(a) * 26));
            en.y = Math.max(50, Math.min(H - 50, en.y + Math.sin(a) * 26));
            sparkles.push({ x: en.x, y: en.y, life: 0.35, text: '-' + dmg });

            if (en.isBoss && en.hp > 0 && en.hp <= en.maxHp * 0.5 && !crossroadsDone) {
              triggerCrossroads();
              return;
            }
            if (en.hp <= 0) {
              var wasBoss = en.isBoss;
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

        angelPos.x += (hero.x - 42 - angelPos.x) * Math.min(1, dt * 5);
        angelPos.y += (hero.y - 34 - angelPos.y) * Math.min(1, dt * 5);

        if (host.consumeAction()) {
          if (!tryInteract()) slashAttack();
        }

        // Collect Creation Stars
        var gotStars = 0;
        stars.forEach(function (st) {
          if (!st.got && dist(hero.x, hero.y, st.x, st.y) < 34) {
            st.got = true;
            host.sfx('chime');
            sparkles.push({ x: st.x, y: st.y, life: 0.45, text: '+100' });
            root.COG.State.addStat({ score: 100, faith: 1 });
          }
          if (st.got) gotStars++;
        });

        // Update Cute Serpents
        var boss = null;
        enemies.forEach(function (en) {
          if (en.isBoss) boss = en;
          if (en.cd > 0) en.cd -= dt;
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
            if (hero.hp <= 0) {
              host.sfx('fail');
              host.fail();
              return;
            }
          }
        });

        for (var si = sparkles.length - 1; si >= 0; si--) {
          sparkles[si].y -= 28 * dt;
          sparkles[si].life -= dt;
          if (sparkles[si].life <= 0) sparkles.splice(si, 1);
        }

        var t = uiT();
        host.setHud(t.stars + ': ' + gotStars + '/5 · ' + t.hearts + ': ' + hero.hp + '/' + hero.maxHp +
          (boss ? ' · ' + t.bossHp + ': ' + Math.max(0, boss.hp) : ''));
      });

      host.onRender(function (ctx) {
        // Sunny Pastel Meadow
        var bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#bef264');
        bg.addColorStop(1, '#86efac');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Soft sunlit grass hills
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath(); ctx.ellipse(480, 260, 175, 110, 0, 0, Math.PI * 2); ctx.fill();

        // Four Sparkling Pastel Rivers
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 28;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(treeLife.x, treeLife.y); ctx.quadraticCurveTo(320, 140, 80, 45);
        ctx.moveTo(treeLife.x, treeLife.y); ctx.quadraticCurveTo(640, 140, 890, 50);
        ctx.moveTo(treeLife.x, treeLife.y); ctx.quadraticCurveTo(310, 390, 90, 495);
        ctx.moveTo(treeLife.x, treeLife.y); ctx.quadraticCurveTo(650, 390, 885, 495);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 6;
        ctx.setLineDash([14, 16]);
        ctx.lineDashOffset = -time * 28;
        ctx.stroke();
        ctx.setLineDash([]);

        // Flowers & Butterflies
        flowers.forEach(function (fl) { S.drawFlower(ctx, fl.x, fl.y, fl.col, time); });
        butterflies.forEach(function (bf, idx) {
          S.drawButterfly(ctx, bf.x + Math.sin(time + idx) * 28, bf.y + Math.cos(time * 1.4 + idx) * 18, bf.col, time);
        });

        // Central Tree of Life (fluffy pastel emerald)
        S.drawShadow(ctx, treeLife.x, treeLife.y + 38, 44, 14);
        ctx.fillStyle = '#92400e'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2.5;
        S.roundRect(ctx, treeLife.x - 13, treeLife.y - 10, 26, 48, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#34d399';
        ctx.beginPath(); ctx.arc(treeLife.x, treeLife.y - 34, 42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath(); ctx.arc(treeLife.x - 24, treeLife.y - 18, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(treeLife.x + 24, treeLife.y - 18, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Western Tree of Knowledge (pastel lavender & glowing apples)
        S.drawShadow(ctx, treeForb.x, treeForb.y + 34, 38, 12);
        ctx.fillStyle = '#78350f';
        S.roundRect(ctx, treeForb.x - 10, treeForb.y - 8, 20, 42, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d8b4fe';
        ctx.beginPath(); ctx.arc(treeForb.x, treeForb.y - 28, 34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fb7185';
        [[-14, -22], [12, -32], [2, -16]].forEach(function (ap) {
          ctx.beginPath(); ctx.arc(treeForb.x + ap[0], treeForb.y + ap[1], 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });

        // Creation Stars
        stars.forEach(function (st) {
          if (!st.got) S.drawStarGem(ctx, st.x, st.y, '#facc15', time);
        });

        // Baby Cherubim NPC on right
        S.drawCuteAngel(ctx, npcCherubim.x, npcCherubim.y, '#38bdf8', time, 1.05);
        if (!talkedCherubim) {
          ctx.fillStyle = '#fef08a'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(npcCherubim.x, npcCherubim.y - 46 + Math.sin(time * 5) * 3, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = S.INK; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('!', npcCherubim.x, npcCherubim.y - 42 + Math.sin(time * 5) * 3);
        }

        // Enemies
        enemies.forEach(function (en) {
          S.drawCuteSerpent(ctx, en.x, en.y, time, en.isBoss ? 1.5 : 0.95, en.isBoss);
          if (en.hp < en.maxHp) {
            ctx.fillStyle = '#fff'; ctx.fillRect(en.x - 22, en.y - 38, 44, 6);
            ctx.fillStyle = '#fb7185'; ctx.fillRect(en.x - 22, en.y - 38, 44 * (en.hp / en.maxHp), 6);
          }
        });

        // Hero & Companion
        S.drawChibiHero(ctx, hero.x, hero.y, hero, time);
        var guide = root.COG.State.getActiveGuide();
        S.drawCuteAngel(ctx, angelPos.x, angelPos.y, guide && guide.color, time, 0.72);

        // Popups & Hint
        ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
        sparkles.forEach(function (sp) {
          ctx.fillStyle = '#b45309';
          ctx.fillText(sp.text, sp.x, sp.y);
        });
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.eden;
  }
})(typeof window !== 'undefined' ? window : globalThis);
