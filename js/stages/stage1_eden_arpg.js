(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  root.COG.STAGES.eden = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var vfx = root.COG.VFX.createManager();
      var uiT = function () { return host.pack().stageUi.eden; };
      var bonus = root.COG.State.getPowerBonus();

      var hero = {
        x: 480, y: 390, r: 20, speed: 275,
        hp: 7 + Math.floor(bonus.hp / 25), maxHp: 7 + Math.floor(bonus.hp / 25),
        facingAngle: -Math.PI / 2, moving: false, jumpY: 0,
        attackTimer: 0, attackCd: 0, comboIdx: 0, comboReset: 0, comboHits: 0,
        dashTimer: 0, dashCd: 0, dashVx: 0, dashVy: 0, invuln: 0, dustCd: 0, ghostCd: 0
      };
      var angel = { x: 430, y: 356, atkTimer: 0, autoCd: 2.0, burstCd: 0 };
      var spinCd = 0;
      var time = 0;
      var talkedCherubim = false;
      var crossroadsDone = false;
      var autoBattle = false;

      var moveTarget = null; // { x, y, kind: 'ground'|'enemy'|'npc'|'tree', ref }
      var pointerHeld = false;
      var clickRipples = [];

      var stars = [
        { x: 280, y: 140, got: false },
        { x: 690, y: 135, got: false },
        { x: 260, y: 420, got: false },
        { x: 685, y: 420, got: false },
        { x: 480, y: 115, got: false }
      ];
      var enemies = [
        { x: 240, y: 190, hp: 38, maxHp: 38, spd: 58, isBoss: false, cd: 0, hitFlash: 0, moving: true, atkTimer: 0 },
        { x: 710, y: 200, hp: 38, maxHp: 38, spd: 58, isBoss: false, cd: 0, hitFlash: 0, moving: true, atkTimer: 0 },
        { x: 255, y: 355, hp: 38, maxHp: 38, spd: 58, isBoss: false, cd: 0, hitFlash: 0, moving: true, atkTimer: 0 },
        {
          x: 175, y: 270, hp: 185, maxHp: 185, spd: 68, isBoss: true,
          cd: 0, hitFlash: 0, moving: true, atkTimer: 0,
          aiCd: 2.6, mode: 'stalk', windup: 0, dashTimer: 0, dashAng: 0, patternIdx: 0
        }
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
      var heroWaves = [];
      var bossOrbs = [];

      var treeLife = { x: 480, y: 260 };
      var treeForb = { x: 115, y: 270 };
      var npcCherubim = { x: 825, y: 270 };

      function renderToolbar() {
        var t = uiT();
        var s1Dis = spinCd > 0 ? ' disabled' : '';
        var s2Dis = angel.burstCd > 0 ? ' disabled' : '';
        var s1Txt = t.skills.spin + (spinCd > 0 ? ' (' + spinCd.toFixed(1) + 's)' : '');
        var s2Txt = t.skills.angelBurst + (angel.burstCd > 0 ? ' (' + angel.burstCd.toFixed(1) + 's)' : '');
        var autoCls = autoBattle ? 'btn-primary-gold' : 'btn-secondary';
        var autoTxt = autoBattle ? t.autoOn : t.autoOff;
        var tb = host.setToolbar('<div class="sim-toolbar">' +
          '<button type="button" class="' + autoCls + '" data-sk="auto">' + autoTxt + '</button>' +
          '<button type="button" class="btn-primary-gold" data-sk="spin"' + s1Dis + '>' + s1Txt + '</button>' +
          '<button type="button" class="btn-secondary" data-sk="angel"' + s2Dis + '>' + s2Txt + '</button>' +
          '</div>');
        if (!tb) return;
        var btns = tb.querySelectorAll('[data-sk]');
        for (var i = 0; i < btns.length; i++) {
          btns[i].addEventListener('click', function () {
            var k = this.getAttribute('data-sk');
            this.blur();
            if (k === 'auto') {
              autoBattle = !autoBattle;
              if (autoBattle) moveTarget = null;
              host.sfx('click');
              renderToolbar();
            } else if (k === 'spin') triggerSpinSkill();
            else triggerAngelBurst();
          });
        }
      }

      function damageEnemy(en, dmg, knock, isCrit) {
        en.hp -= dmg;
        en.hitFlash = 0.16;
        var a = Math.atan2(en.y - hero.y, en.x - hero.x);
        en.x = clamp(en.x + Math.cos(a) * knock, 46, W - 46);
        en.y = clamp(en.y + Math.sin(a) * knock, 46, H - 46);
        hero.comboHits++;
        hero.comboReset = 2.6;
        vfx.spawnBurst(en.x, en.y - 12, isCrit ? '#fb7185' : '#fef08a', isCrit ? 14 : 8, isCrit ? 160 : 110);
        vfx.addPopup(en.x, en.y - 26, (isCrit ? 'CRIT! -' : '-') + dmg, isCrit ? '#fb7185' : '#fde047', isCrit ? 1.25 : 1.0);

        if (en.isBoss && en.hp > 0 && en.hp <= en.maxHp * 0.5 && !crossroadsDone) {
          triggerCrossroads();
          return 'dialogue';
        }
        if (en.hp <= 0) {
          var wasBoss = en.isBoss;
          vfx.spawnBurst(en.x, en.y - 16, '#c084fc', 16, 150);
          vfx.spawnRing(en.x, en.y - 10, '#c084fc', 75, 0.45);
          var idx = enemies.indexOf(en);
          if (idx !== -1) enemies.splice(idx, 1);
          if (moveTarget && moveTarget.ref === en) moveTarget = null;
          host.sfx('chime');
          if (wasBoss) {
            root.COG.State.setEdenRoute('preserved');
            host.sfx('win');
            host.win(stageObj.baseScore + hero.hp * 80 + hero.comboHits * 15, 3, {
              faith: 10, wisdom: 6,
              customSummary: host.t('stages.eden.outroPreserved')
            });
            return 'win';
          }
        }
        return 'ok';
      }

      function slashAttack() {
        if (hero.attackCd > 0) return;
        hero.comboIdx = (hero.comboIdx % 3) + 1;
        hero.comboReset = 1.1;
        hero.attackTimer = 0.26;
        hero.attackCd = hero.comboIdx === 3 ? 0.34 : 0.24;
        host.sfx('slash');

        // Noticeable forward micro-lunge + hop on every sword swing!
        hero.x = clamp(hero.x + Math.cos(hero.facingAngle) * 14, 42, W - 42);
        hero.y = clamp(hero.y + Math.sin(hero.facingAngle) * 14, 48, H - 42);
        vfx.spawnDust(hero.x, hero.y + 14, 2);

        var isFinisher = hero.comboIdx === 3;
        var dmg = (isFinisher ? 30 : 20) + bonus.atk;
        var reach = isFinisher ? 98 : 84;

        if (isFinisher) {
          heroWaves.push({
            x: hero.x + Math.cos(hero.facingAngle) * 24,
            y: hero.y - 12 + Math.sin(hero.facingAngle) * 24,
            vx: Math.cos(hero.facingAngle) * 440,
            vy: Math.sin(hero.facingAngle) * 440,
            ang: hero.facingAngle,
            life: 0.48,
            dmg: Math.round((24 + bonus.atk) * 0.9)
          });
          vfx.spawnRing(hero.x, hero.y - 10, '#facc15', 75, 0.32);
        }

        for (var oi = bossOrbs.length - 1; oi >= 0; oi--) {
          var orb = bossOrbs[oi];
          if (!orb.reflected && dist(hero.x, hero.y, orb.x, orb.y) < 76) {
            orb.reflected = true;
            orb.vx = Math.cos(hero.facingAngle) * 420;
            orb.vy = Math.sin(hero.facingAngle) * 420;
            orb.life = 1.0;
            vfx.spawnBurst(orb.x, orb.y, '#fde047', 8);
            vfx.addPopup(orb.x, orb.y - 16, 'DEFLECT!', '#7dd3fc', 1.05);
            host.sfx('chime');
          }
        }

        for (var i = enemies.length - 1; i >= 0; i--) {
          var en = enemies[i];
          if (dist(hero.x, hero.y, en.x, en.y) <= reach) {
            if (isFinisher) { host.shake(6, 0.16); host.hitstop(0.05); }
            else host.shake(3, 0.08);
            var res = damageEnemy(en, dmg, isFinisher ? 36 : 22, isFinisher);
            if (res !== 'ok') return;
          }
        }
      }

      function triggerSpinSkill() {
        if (spinCd > 0) return;
        spinCd = 4.5;
        hero.attackTimer = 0.38;
        hero.comboIdx = 3;
        hero.invuln = Math.max(hero.invuln, 0.45);
        host.sfx('magic');
        host.shake(8, 0.24);
        host.hitstop(0.06);
        vfx.spawnRing(hero.x, hero.y - 10, '#fde047', 120, 0.42);
        vfx.spawnBurst(hero.x, hero.y - 12, '#fde047', 16, 180);
        for (var i = enemies.length - 1; i >= 0; i--) {
          var en = enemies[i];
          if (dist(hero.x, hero.y, en.x, en.y) <= 125) {
            if (damageEnemy(en, 34 + bonus.atk, 44, true) !== 'ok') return;
          }
        }
        renderToolbar();
      }

      function triggerAngelBurst() {
        if (angel.burstCd > 0) return;
        angel.burstCd = 8.0;
        angel.atkTimer = 0.55;
        hero.hp = Math.min(hero.maxHp, hero.hp + 1);
        host.sfx('chime');
        vfx.spawnRing(angel.x, angel.y, '#7dd3fc', 85, 0.45);
        vfx.addPopup(hero.x, hero.y - 34, '+1 ♥ HEAL!', '#4ade80', 1.1);
        var targets = enemies.slice(0, 3);
        targets.forEach(function (target) {
          vfx.spawnOrb(angel.x, angel.y - 14, target.x, target.y - 10, '#7dd3fc', 0.42, function () {
            if (enemies.indexOf(target) !== -1) {
              damageEnemy(target, 28 + Math.round(bonus.atk * 0.8), 18, true);
              host.shake(4, 0.12);
            }
          });
        });
        renderToolbar();
      }

      host.onKeyDown(function (key) {
        if (key === 'q' || key === 'Q' || key === '1') triggerSpinSkill();
        else if (key === 'r' || key === 'R' || key === '2') triggerAngelBurst();
      });

      function triggerCrossroads() {
        crossroadsDone = true;
        moveTarget = null;
        pointerHeld = false;
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

      function openCherubimDialogue() {
        talkedCherubim = true;
        moveTarget = null;
        pointerHeld = false;
        host.openDialogue('eden_cherubim', {
          onEffect: function (eff) {
            if (eff.heal) hero.hp = hero.maxHp;
            root.COG.State.addStat(eff);
          }
        });
      }

      function tryInteract() {
        if (dist(hero.x, hero.y, npcCherubim.x, npcCherubim.y) < 82) {
          openCherubimDialogue();
          return true;
        }
        if (dist(hero.x, hero.y, treeForb.x, treeForb.y) < 82) {
          triggerCrossroads();
          return true;
        }
        return false;
      }

      host.onPointer('pointerdown', function (x, y) {
        clickRipples.push({ x: x, y: y, life: 0.45, maxLife: 0.45 });

        if (dist(x, y, npcCherubim.x, npcCherubim.y) < 58) {
          if (dist(hero.x, hero.y, npcCherubim.x, npcCherubim.y) < 82) { openCherubimDialogue(); return; }
          moveTarget = { kind: 'npc', x: npcCherubim.x - 44, y: npcCherubim.y + 8 };
          return;
        }
        if (dist(x, y, treeForb.x, treeForb.y) < 62) {
          if (dist(hero.x, hero.y, treeForb.x, treeForb.y) < 82) { triggerCrossroads(); return; }
          moveTarget = { kind: 'tree', x: treeForb.x + 56, y: treeForb.y + 10 };
          return;
        }

        // Check if clicking an enemy
        var clickedEnemy = null;
        var bestED = 56;
        enemies.forEach(function (en) {
          var dd = dist(x, y, en.x, en.y);
          if (dd < bestED) { bestED = dd; clickedEnemy = en; }
        });
        if (clickedEnemy) {
          moveTarget = { kind: 'enemy', ref: clickedEnemy, x: clickedEnemy.x, y: clickedEnemy.y };
          if (dist(hero.x, hero.y, clickedEnemy.x, clickedEnemy.y) <= 78) {
            hero.facingAngle = Math.atan2(clickedEnemy.y - hero.y, clickedEnemy.x - hero.x);
            slashAttack();
          }
          return;
        }

        // Otherwise run directly to clicked spot & hold-to-steer!
        pointerHeld = true;
        moveTarget = { kind: 'ground', x: clamp(x, 42, W - 42), y: clamp(y, 50, H - 42) };
      });

      host.onPointer('pointermove', function (x, y) {
        if (pointerHeld) {
          moveTarget = { kind: 'ground', x: clamp(x, 42, W - 42), y: clamp(y, 50, H - 42) };
        }
      });
      host.onPointer('pointerup', function () { pointerHeld = false; });
      host.onPointer('pointerleave', function () { pointerHeld = false; });

      renderToolbar();

      host.onUpdate(function (dt, keys) {
        time += dt;
        var prevSpinReady = spinCd <= 0;
        var prevAngelReady = angel.burstCd <= 0;
        if (spinCd > 0) spinCd = Math.max(0, spinCd - dt);
        if (angel.burstCd > 0) angel.burstCd = Math.max(0, angel.burstCd - dt);
        if (Math.floor((spinCd + dt) * 2) !== Math.floor(spinCd * 2) || (!prevSpinReady && spinCd <= 0) || (!prevAngelReady && angel.burstCd <= 0)) {
          renderToolbar();
        }

        if (hero.attackTimer > 0) hero.attackTimer = Math.max(0, hero.attackTimer - dt);
        if (hero.attackCd > 0) hero.attackCd = Math.max(0, hero.attackCd - dt);
        if (hero.dashCd > 0) hero.dashCd = Math.max(0, hero.dashCd - dt);
        if (hero.invuln > 0) hero.invuln = Math.max(0, hero.invuln - dt);
        if (hero.comboReset > 0) {
          hero.comboReset -= dt;
          if (hero.comboReset <= 0) { hero.comboIdx = 0; hero.comboHits = 0; }
        }
        hero.jumpY = hero.attackTimer > 0 ? Math.sin((hero.attackTimer / 0.26) * Math.PI) * 10 : 0;

        if (host.consumeDash() && hero.dashCd <= 0) {
          hero.dashTimer = 0.22; hero.dashCd = 0.85; hero.invuln = 0.38;
          hero.dashVx = Math.cos(hero.facingAngle) * 540;
          hero.dashVy = Math.sin(hero.facingAngle) * 540;
          host.sfx('dash');
          vfx.spawnBurst(hero.x, hero.y, '#bae6fd', 8, 90);
        }

        // Autonomous idle/auto-battle target selection when Auto-Action is ON
        if (autoBattle && !moveTarget) {
          var nextStar = stars.find(function (st) { return !st.got; });
          if (nextStar) {
            moveTarget = { kind: 'ground', x: nextStar.x, y: nextStar.y };
          } else if (enemies.length > 0) {
            var nearestE = enemies[0], bestDistE = dist(hero.x, hero.y, nearestE.x, nearestE.y);
            enemies.forEach(function (e) {
              var de = dist(hero.x, hero.y, e.x, e.y);
              if (de < bestDistE) { bestDistE = de; nearestE = e; }
            });
            moveTarget = { kind: 'enemy', ref: nearestE, x: nearestE.x, y: nearestE.y };
          }
        }

        if (hero.dashTimer > 0) {
          hero.dashTimer -= dt;
          hero.x += hero.dashVx * dt;
          hero.y += hero.dashVy * dt;
          hero.moving = true;
          hero.ghostCd -= dt;
          if (hero.ghostCd <= 0) {
            hero.ghostCd = 0.05;
            vfx.addAfterimage('hero_adam_sheet', 1, hero.x, hero.y + 18, {
              height: 92, flipX: Math.cos(hero.facingAngle) < -0.15, duration: 0.24
            });
          }
        } else {
          var dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
          var dy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
          if (dx || dy) {
            // Manual keyboard steering cancels click target
            moveTarget = null;
            pointerHeld = false;
            var l = Math.sqrt(dx * dx + dy * dy);
            hero.x += (dx / l) * hero.speed * dt;
            hero.y += (dy / l) * hero.speed * dt;
            hero.facingAngle = Math.atan2(dy, dx);
            hero.moving = true;
          } else if (moveTarget) {
            if (moveTarget.kind === 'enemy') {
              if (enemies.indexOf(moveTarget.ref) === -1) {
                moveTarget = null;
                hero.moving = false;
              } else {
                moveTarget.x = moveTarget.ref.x;
                moveTarget.y = moveTarget.ref.y;
                var ed = dist(hero.x, hero.y, moveTarget.x, moveTarget.y);
                hero.facingAngle = Math.atan2(moveTarget.y - hero.y, moveTarget.x - hero.x);
                if (ed <= 68) {
                  hero.moving = false;
                  if (autoBattle && spinCd <= 0 && ed <= 95) triggerSpinSkill();
                  else slashAttack();
                } else {
                  hero.x += ((moveTarget.x - hero.x) / ed) * hero.speed * dt;
                  hero.y += ((moveTarget.y - hero.y) / ed) * hero.speed * dt;
                  hero.moving = true;
                }
              }
            } else {
              var td = dist(hero.x, hero.y, moveTarget.x, moveTarget.y);
              if (td <= 14) {
                var reachedKind = moveTarget.kind;
                moveTarget = null;
                hero.moving = false;
                if (reachedKind === 'npc') openCherubimDialogue();
                else if (reachedKind === 'tree') triggerCrossroads();
              } else {
                hero.facingAngle = Math.atan2(moveTarget.y - hero.y, moveTarget.x - hero.x);
                hero.x += ((moveTarget.x - hero.x) / td) * hero.speed * dt;
                hero.y += ((moveTarget.y - hero.y) / td) * hero.speed * dt;
                hero.moving = true;
              }
            }
          } else {
            hero.moving = false;
          }
        }

        if (hero.moving) {
          hero.dustCd -= dt;
          if (hero.dustCd <= 0) {
            hero.dustCd = 0.14;
            vfx.spawnDust(hero.x, hero.y + 16, 2);
          }
        }

        hero.x = clamp(hero.x, 40, W - 40);
        hero.y = clamp(hero.y, 45, H - 40);

        angel.x += (hero.x - 48 - angel.x) * Math.min(1, dt * 5);
        angel.y += (hero.y - 36 - angel.y) * Math.min(1, dt * 5);
        if (angel.atkTimer > 0) angel.atkTimer = Math.max(0, angel.atkTimer - dt);
        angel.autoCd -= dt;
        if (angel.autoCd <= 0 && enemies.length > 0) {
          var nearest = null, bestD = 290;
          enemies.forEach(function (en) {
            var dd = dist(angel.x, angel.y, en.x, en.y);
            if (dd < bestD) { bestD = dd; nearest = en; }
          });
          if (nearest) {
            angel.autoCd = 2.2;
            angel.atkTimer = 0.35;
            vfx.spawnOrb(angel.x, angel.y - 10, nearest.x, nearest.y - 10, '#fde047', 0.36, function () {
              if (enemies.indexOf(nearest) !== -1) damageEnemy(nearest, 10, 10, false);
            });
          } else {
            angel.autoCd = 0.6;
          }
        }

        if (host.consumeAction()) {
          if (!tryInteract()) slashAttack();
        }

        for (var ri = clickRipples.length - 1; ri >= 0; ri--) {
          clickRipples[ri].life -= dt;
          if (clickRipples[ri].life <= 0) clickRipples.splice(ri, 1);
        }

        for (var wi = heroWaves.length - 1; wi >= 0; wi--) {
          var wv = heroWaves[wi];
          wv.x += wv.vx * dt; wv.y += wv.vy * dt; wv.life -= dt;
          vfx.spawnDust(wv.x, wv.y, 1);
          for (var ei = enemies.length - 1; ei >= 0; ei--) {
            var tgt = enemies[ei];
            if (dist(wv.x, wv.y, tgt.x, tgt.y) < 38) {
              damageEnemy(tgt, wv.dmg, 24, true);
              wv.life = 0;
              break;
            }
          }
          if (wv.life <= 0) heroWaves.splice(wi, 1);
        }

        for (var bi = bossOrbs.length - 1; bi >= 0; bi--) {
          var o = bossOrbs[bi];
          o.x += o.vx * dt; o.y += o.vy * dt; o.life -= dt;
          if (o.reflected) {
            for (var ej = enemies.length - 1; ej >= 0; ej--) {
              if (dist(o.x, o.y, enemies[ej].x, enemies[ej].y) < 34) {
                damageEnemy(enemies[ej], 26, 20, true);
                o.life = 0;
                break;
              }
            }
          } else if (dist(o.x, o.y, hero.x, hero.y) < 26 && hero.invuln <= 0) {
            hero.hp--; hero.invuln = 1.4;
            host.sfx('hit'); host.shake(5, 0.16);
            vfx.addPopup(hero.x, hero.y - 30, '-1 ♥', '#fb7185', 1.1);
            o.life = 0;
            if (hero.hp <= 0) { host.sfx('fail'); host.fail(); return; }
          }
          if (o.life <= 0) bossOrbs.splice(bi, 1);
        }

        var gotStars = 0;
        stars.forEach(function (st) {
          if (!st.got && dist(hero.x, hero.y, st.x, st.y) < 38) {
            st.got = true;
            if (moveTarget && dist(moveTarget.x, moveTarget.y, st.x, st.y) < 28) moveTarget = null;
            host.sfx('chime');
            vfx.addPopup(st.x, st.y - 12, '+100 ★', '#fde047', 1.15);
            vfx.spawnBurst(st.x, st.y, '#fde047', 12, 120);
            root.COG.State.addStat({ score: 100, faith: 1 });
          }
          if (st.got) gotStars++;
        });

        var boss = null;
        enemies.forEach(function (en) {
          if (en.cd > 0) en.cd -= dt;
          if (en.hitFlash > 0) en.hitFlash = Math.max(0, en.hitFlash - dt);
          if (en.atkTimer > 0) en.atkTimer = Math.max(0, en.atkTimer - dt);
          var d = dist(hero.x, hero.y, en.x, en.y);

          if (en.isBoss) {
            boss = en;
            if (en.mode === 'windup') {
              en.windup -= dt;
              en.moving = false;
              if (en.windup <= 0) {
                en.mode = 'dash';
                en.dashTimer = 0.42;
                en.atkTimer = 0.42;
                host.sfx('dash');
              }
            } else if (en.mode === 'dash') {
              en.dashTimer -= dt;
              en.x = clamp(en.x + Math.cos(en.dashAng) * 340 * dt, 50, W - 50);
              en.y = clamp(en.y + Math.sin(en.dashAng) * 340 * dt, 50, H - 50);
              vfx.addAfterimage('boss_serpent_sheet', 3, en.x, en.y + 16, {
                height: 118, flipX: hero.x > en.x, duration: 0.18
              });
              if (en.dashTimer <= 0) en.mode = 'stalk';
            } else {
              en.aiCd -= dt;
              if (d < 340 && en.aiCd <= 0) {
                en.aiCd = 3.2;
                en.patternIdx = (en.patternIdx + 1) % 2;
                if (en.patternIdx === 0) {
                  en.mode = 'windup';
                  en.windup = 0.72;
                  en.dashAng = Math.atan2(hero.y - en.y, hero.x - en.x);
                } else {
                  en.atkTimer = 0.4;
                  var baseA = Math.atan2(hero.y - en.y, hero.x - en.x);
                  [-0.28, 0, 0.28].forEach(function (off) {
                    bossOrbs.push({
                      x: en.x, y: en.y - 10,
                      vx: Math.cos(baseA + off) * 210, vy: Math.sin(baseA + off) * 210,
                      life: 2.3, reflected: false
                    });
                  });
                }
              } else if (d < 280 && d > 28) {
                var ba = Math.atan2(hero.y - en.y, hero.x - en.x);
                en.x += Math.cos(ba) * en.spd * dt;
                en.y += Math.sin(ba) * en.spd * dt;
                en.moving = true;
              } else {
                en.moving = false;
              }
            }
          } else {
            if (d < 255 && d > 26) {
              var a = Math.atan2(hero.y - en.y, hero.x - en.x);
              en.x += Math.cos(a) * en.spd * dt;
              en.y += Math.sin(a) * en.spd * dt;
              en.moving = true;
            } else {
              en.moving = false;
            }
          }

          if (d < 34 && hero.invuln <= 0) {
            hero.hp--;
            hero.invuln = 1.5;
            en.atkTimer = 0.35;
            host.sfx('hit');
            host.shake(5, 0.16);
            vfx.addPopup(hero.x, hero.y - 30, '-1 ♥', '#fb7185', 1.1);
            if (hero.hp <= 0) {
              host.sfx('fail');
              host.fail();
              return;
            }
          }
        });

        vfx.update(dt);

        var t = uiT();
        host.setHud(t.stars + ': ' + gotStars + '/5 · ' + t.hearts + ': ' + hero.hp + '/' + hero.maxHp +
          (hero.comboHits >= 2 ? ' · ' + t.combo + ': x' + hero.comboHits : '') +
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

        flowers.forEach(function (fl) { S.drawFlower(ctx, fl.x, fl.y, fl.col, time); });
        butterflies.forEach(function (bf, idx) {
          S.drawButterfly(ctx, bf.x + Math.sin(time + idx) * 28, bf.y + Math.cos(time * 1.4 + idx) * 18, bf.col, time);
        });

        // Click-to-move ground ripples & active lock-on indicator
        clickRipples.forEach(function (rp) {
          var p = 1 - rp.life / rp.maxLife;
          ctx.save();
          ctx.globalAlpha = 1 - p;
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.ellipse(rp.x, rp.y, 10 + p * 26, 5 + p * 12, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        });
        if (moveTarget) {
          ctx.save();
          ctx.strokeStyle = moveTarget.kind === 'enemy' ? '#fb7185' : '#fde047';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(moveTarget.x, moveTarget.y + 8, 18 + Math.sin(time * 8) * 3, 8, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        enemies.forEach(function (en) {
          if (en.isBoss && en.mode === 'windup') {
            ctx.save();
            ctx.translate(en.x, en.y);
            ctx.rotate(en.dashAng);
            ctx.fillStyle = 'rgba(244, 63, 94, ' + (0.22 + Math.abs(Math.sin(time * 18)) * 0.25) + ')';
            ctx.strokeStyle = '#fb7185';
            ctx.lineWidth = 2;
            ctx.fillRect(0, -20, 190, 40);
            ctx.strokeRect(0, -20, 190, 40);
            ctx.restore();
          }
        });

        vfx.renderBack(ctx);

        stars.forEach(function (st) {
          if (!st.got) S.drawStarGem(ctx, st.x, st.y, '#facc15', time);
        });

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
                moving: en.moving,
                attackTimer: en.atkTimer,
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
              jumpY: hero.jumpY,
              attackTimer: hero.attackTimer,
              comboIdx: hero.comboIdx,
              invuln: hero.invuln,
              height: 92,
              lv: root.COG.State.getPlayerLevel()
            }, time);
            S.drawCuteAngel(ctx, angel.x, angel.y + 6, '#38bdf8', time, 0.72, {
              attackTimer: angel.atkTimer,
              flipX: Math.cos(hero.facingAngle) < -0.15
            });
          }
        });

        drawQueue.sort(function (a, b) { return a.y - b.y; });
        for (var q = 0; q < drawQueue.length; q++) drawQueue[q].fn();

        heroWaves.forEach(function (wv) {
          ctx.save();
          ctx.translate(wv.x, wv.y);
          ctx.rotate(wv.ang);
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 8;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.arc(0, 0, 26, -1.0, 1.0); ctx.stroke();
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(2, 0, 24, -0.8, 0.8); ctx.stroke();
          ctx.restore();
        });

        bossOrbs.forEach(function (o) {
          ctx.save();
          ctx.fillStyle = o.reflected ? '#7dd3fc' : '#a855f7';
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(o.x, o.y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.restore();
        });

        vfx.renderFront(ctx);

        if (hero.comboHits >= 2 && Sp && Sp.drawLevelBadge) {
          Sp.drawLevelBadge(ctx, W - 92, 34, hero.comboHits + ' HIT!', '#fde047');
        }
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.eden;
  }
})(typeof window !== 'undefined' ? window : globalThis);
