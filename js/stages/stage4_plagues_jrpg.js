(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  function drawStrokeText(ctx, text, x, y, fill, font) {
    ctx.save();
    ctx.font = font || '900 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = '#291709';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill || '#fde047';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  root.COG.STAGES.plagues = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
      var Sp = root.COG.Sprites;
      var vfx = root.COG.VFX.createManager();
      var uiT = function () { return host.pack().stageUi.plagues; };
      var bonus = root.COG.State.getPowerBonus();

      var partyHp = 135 + bonus.hp;
      var partyMaxHp = partyHp;
      var partyMp = 65;
      var partyMaxMp = 65;
      var enemyHp = 195;
      var enemyMaxHp = 195;
      var shieldOn = false;
      var playerTurn = true;
      var time = 0;

      // Choreography & Boss Intent states
      var mosesHomeX = 225, mosesX = 225, mosesAnim = 'idle', mosesAtk = 0;
      var aaronAtk = 0;
      var pharaohHomeX = 700, pharaohX = 700, pharaohAnim = 'idle', pharaohAtk = 0;
      var partyHit = 0, enemyHit = 0;
      var pharaohIntent = 'attack'; // 'attack' | 'charge' | 'guard'
      var turnCount = 1;
      var skillCost = { nile: 0, frogs: 15, hail: 24, shield: 12, passover: 32 };

      // Custom skill cinematic state
      var cinema = null; // { id, t, dur, items }

      function pickNextIntent() {
        var mod = turnCount % 3;
        if (mod === 1) pharaohIntent = 'charge';
        else if (mod === 2) pharaohIntent = 'guard';
        else pharaohIntent = 'attack';
      }

      function renderToolbar() {
        var t = uiT();
        var btns = t.skills.map(function (sk) {
          var cost = skillCost[sk.id] || 0;
          var dis = !playerTurn || partyMp < cost;
          return '<button type="button" class="btn-secondary jrpg-btn" data-sk="' + sk.id + '"' + (dis ? ' disabled' : '') + '>' +
            '<strong>' + sk.name + '</strong> <small>' + sk.desc + '</small></button>';
        }).join('');
        var tb = host.setToolbar('<div class="sim-toolbar">' + btns + '</div>');
        if (!tb) return;
        var all = tb.querySelectorAll('[data-sk]');
        for (var i = 0; i < all.length; i++) {
          all[i].addEventListener('click', function () {
            castSkill(this.getAttribute('data-sk'));
          });
        }
      }

      function launchSkillCinema(id) {
        if (id === 'nile') {
          cinema = { id: 'nile', t: 0, dur: 0.72, x: 260 };
        } else if (id === 'frogs') {
          var frogs = [];
          for (var i = 0; i < 8; i++) {
            frogs.push({
              x: 270 - i * 28,
              vx: 520 + (i % 3) * 40,
              phase: i * 0.55
            });
          }
          cinema = { id: 'frogs', t: 0, dur: 0.85, frogs: frogs };
        } else if (id === 'hail') {
          var shards = [];
          for (var j = 0; j < 14; j++) {
            shards.push({ x: 560 + Math.random() * 250, y: -40 - j * 38, hit: false });
          }
          cinema = { id: 'hail', t: 0, dur: 0.85, shards: shards };
        } else if (id === 'shield') {
          cinema = { id: 'shield', t: 0, dur: 0.75 };
        } else if (id === 'passover') {
          cinema = { id: 'passover', t: 0, dur: 0.9 };
        }
      }

      function castSkill(id) {
        if (!playerTurn) return;
        var cost = skillCost[id] || 0;
        if (partyMp < cost) return;
        partyMp -= cost;
        playerTurn = false;
        host.sfx('magic');
        renderToolbar();

        // Phase 1: Moses sprints forward with golden afterimage
        mosesAnim = 'run';
        var dashIv = 0;
        var moveTime = 0;
        var stepTimer = null;

        var rawDmg = 0;
        var heal = 0;
        if (id === 'nile') rawDmg = 28 + Math.round(bonus.atk * 0.6);
        else if (id === 'frogs') rawDmg = 42 + Math.round(bonus.atk * 0.7);
        else if (id === 'hail') rawDmg = 48 + Math.round(bonus.atk * 0.8);
        else if (id === 'shield') { heal = 35; shieldOn = true; }
        else if (id === 'passover') { rawDmg = 65 + bonus.atk; heal = 25; shieldOn = true; }

        launchSkillCinema(id);

        // Animate Moses rush & strike cleanly across frames via host.setTimeout choreography
        mosesX = 435;
        mosesAnim = 'attack';
        mosesAtk = 0.55;
        aaronAtk = 0.55;
        vfx.addAfterimage('hero_moses_sheet', 1, 310, 408, { height: 132, duration: 0.25 });
        vfx.addAfterimage('hero_moses_sheet', 2, 375, 408, { height: 132, duration: 0.28 });

        if (rawDmg > 0) {
          var isBreak = (pharaohIntent === 'charge' && (id === 'frogs' || id === 'hail' || id === 'passover'));
          var isGuarded = (pharaohIntent === 'guard' && id !== 'passover');
          var finalDmg = isBreak ? Math.round(rawDmg * 1.5) : (isGuarded ? Math.round(rawDmg * 0.6) : rawDmg);
          enemyHp = Math.max(0, enemyHp - finalDmg);
          enemyHit = 0.35;

          if (isBreak) {
            pharaohIntent = 'attack';
            host.shake(10, 0.3);
            host.hitstop(0.07);
            vfx.addPopup(705, 165, 'BREAK! -' + finalDmg, '#fde047', 1.35);
          } else {
            host.shake(id === 'passover' ? 10 : 6, 0.24);
            if (id === 'passover') host.hitstop(0.07);
            vfx.addPopup(705, 185, '-' + finalDmg + (isGuarded ? ' (WARD)' : ''), isGuarded ? '#cbd5e1' : '#fb7185', 1.2);
          }
          vfx.spawnRing(710, 345, id === 'passover' ? '#fde047' : '#38bdf8', 110, 0.55);
          vfx.spawnBurst(710, 345, '#fde047', 14, 150);
        }
        if (heal > 0) {
          partyHp = Math.min(partyMaxHp, partyHp + heal);
          vfx.spawnRing(260, 355, '#4ade80', 95, 0.55);
          vfx.spawnBurst(260, 340, '#4ade80', 12, 120);
          vfx.addPopup(260, 185, '+' + heal + ' HP', '#4ade80', 1.2);
        }

        updateHud();

        host.setTimeout(function () {
          mosesX = mosesHomeX;
          mosesAnim = 'idle';
          if (enemyHp <= 0) {
            host.sfx('win');
            host.win(stageObj.baseScore + partyHp * 4, partyHp >= 80 ? 3 : 2, {
              faith: 8, wisdom: 5,
              customSummary: host.t('stages.plagues.outro')
            });
            return;
          }
          enemyTurn();
        }, 780);
      }

      function enemyTurn() {
        var mult = pharaohIntent === 'charge' ? 1.55 : 1.0;
        var raw = Math.round((20 + Math.floor(Math.random() * 8)) * mult);
        var dmg = shieldOn ? Math.round(raw * 0.3) : raw;
        dmg = Math.max(5, dmg - Math.round(bonus.def * 0.4));
        shieldOn = false;

        pharaohX = 520;
        pharaohAnim = 'attack';
        pharaohAtk = 0.45;
        vfx.addAfterimage('boss_pharaoh_sheet', 1, 610, 408, { height: 142, duration: 0.24 });

        partyHp = Math.max(0, partyHp - dmg);
        partyMp = Math.min(partyMaxMp, partyMp + 14);
        partyHit = 0.28;
        host.sfx('hit');
        host.shake(mult > 1 ? 9 : 5, 0.22);
        vfx.spawnRing(265, 355, '#f43f5e', 90, 0.45);
        vfx.spawnBurst(265, 355, '#fb7185', 12, 130);
        vfx.addPopup(265, 185, '-' + dmg, '#fb7185', 1.2);

        host.setTimeout(function () {
          pharaohX = pharaohHomeX;
          pharaohAnim = 'idle';
          if (partyHp <= 0) {
            host.sfx('fail');
            host.fail();
            return;
          }
          turnCount++;
          pickNextIntent();
          playerTurn = true;
          updateHud();
          renderToolbar();
        }, 520);
      }

      function updateHud() {
        var t = uiT();
        host.setHud(t.mosesParty + ' HP:' + partyHp + ' MP:' + partyMp + ' · ' + t.enemyParty + ' HP:' + enemyHp +
          ' · ' + (playerTurn ? t.turnPlayer : t.turnEnemy));
      }

      pickNextIntent();
      updateHud();
      renderToolbar();

      host.onUpdate(function (dt) {
        time += dt;
        if (mosesAtk > 0) mosesAtk = Math.max(0, mosesAtk - dt);
        if (aaronAtk > 0) aaronAtk = Math.max(0, aaronAtk - dt);
        if (pharaohAtk > 0) pharaohAtk = Math.max(0, pharaohAtk - dt);
        if (partyHit > 0) partyHit = Math.max(0, partyHit - dt);
        if (enemyHit > 0) enemyHit = Math.max(0, enemyHit - dt);

        if (cinema) {
          cinema.t += dt;
          if (cinema.id === 'nile') {
            cinema.x += 580 * dt;
            vfx.spawnBurst(cinema.x, 380, '#fb7185', 2, 70);
          } else if (cinema.id === 'frogs') {
            cinema.frogs.forEach(function (f) { f.x += f.vx * dt; });
          } else if (cinema.id === 'hail') {
            cinema.shards.forEach(function (s) {
              s.x -= 110 * dt;
              s.y += 580 * dt;
              if (!s.hit && s.y >= 340) {
                s.hit = true;
                vfx.spawnBurst(s.x, 360, '#7dd3fc', 4, 80);
              }
            });
          }
          if (cinema.t >= cinema.dur) cinema = null;
        }

        vfx.update(dt);
      });

      host.onRender(function (ctx) {
        if (!Sp || !Sp.drawCover(ctx, 'bg_plagues', W, H)) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#fed7aa');
          sky.addColorStop(1, '#fcd34d');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
        }

        if (shieldOn) {
          ctx.save();
          var g = ctx.createRadialGradient(270, 365, 25, 270, 365, 102);
          g.addColorStop(0, 'rgba(254, 240, 138, 0.08)');
          g.addColorStop(1, 'rgba(250, 204, 21, 0.44)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(270, 365, 102, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3.5; ctx.stroke();
          ctx.restore();
        }

        vfx.renderBack(ctx);

        // Party: Moses & Aaron (with animation frames!)
        S.drawChibiHero(ctx, mosesX, 408, {
          kind: 'moses',
          height: 132,
          animState: mosesAnim,
          attackTimer: mosesAtk,
          hitFlash: partyHit > 0,
          lv: root.COG.State.getPlayerLevel()
        }, time);
        S.drawChibiHero(ctx, 325, 438, {
          kind: 'aaron',
          height: 112,
          attackTimer: aaronAtk,
          hitFlash: partyHit > 0
        }, time);

        // Enemies: Pharaoh & Magician
        S.drawCutePharaohOrGuard(ctx, pharaohX, 408, true, time, 1, {
          height: 142,
          animState: pharaohAnim,
          attackTimer: pharaohAtk,
          hitFlash: enemyHit > 0,
          lv: 'BOSS'
        });
        S.drawCutePharaohOrGuard(ctx, 795, 438, false, time, 1, {
          height: 112,
          attackTimer: pharaohAtk * 0.7,
          hitFlash: enemyHit > 0
        });

        // Pharaoh Next-Move Intent Banner
        var t = uiT();
        var intLabel = t.intents[pharaohIntent] || t.intents.attack;
        var intCol = pharaohIntent === 'charge' ? '#fb7185' : (pharaohIntent === 'guard' ? '#7dd3fc' : '#fde047');
        drawStrokeText(ctx, intLabel, 722, 165, intCol, '900 13px sans-serif');

        // Glossy Overhead HP/MP Gauges
        if (Sp && Sp.drawGlossyBar) {
          Sp.drawGlossyBar(ctx, 185, 245, 175, 14, partyHp / partyMaxHp, '#22c55e', '#1c1917');
          Sp.drawGlossyBar(ctx, 185, 263, 175, 9, partyMp / partyMaxMp, '#38bdf8', '#1c1917');
          Sp.drawGlossyBar(ctx, 635, 245, 175, 14, enemyHp / enemyMaxHp, '#fb7185', '#1c1917');
        }
        drawStrokeText(ctx, 'HP ' + partyHp + '/' + partyMaxHp, 272, 238, '#bbf7d0', '900 13px sans-serif');
        drawStrokeText(ctx, 'HP ' + enemyHp + '/' + enemyMaxHp, 722, 238, '#fecdd3', '900 13px sans-serif');

        // 5 Unique Animated Miracle Cinematics!
        if (cinema) {
          ctx.save();
          if (cinema.id === 'nile') {
            var grad = ctx.createLinearGradient(cinema.x - 50, 0, cinema.x + 50, 0);
            grad.addColorStop(0, 'rgba(225, 29, 72, 0)');
            grad.addColorStop(0.5, 'rgba(244, 63, 94, 0.78)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
            ctx.fillStyle = grad;
            ctx.fillRect(cinema.x - 50, 260, 100, 200);
          } else if (cinema.id === 'frogs') {
            cinema.frogs.forEach(function (f) {
              var fy = 400 - Math.abs(Math.sin(cinema.t * 14 + f.phase)) * 85;
              ctx.fillStyle = '#4ade80'; ctx.strokeStyle = '#14532d'; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.ellipse(f.x, fy, 15, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
              ctx.fillStyle = '#fff';
              ctx.beginPath(); ctx.arc(f.x + 6, fy - 7, 4, 0, Math.PI * 2); ctx.fill();
            });
          } else if (cinema.id === 'hail') {
            cinema.shards.forEach(function (s) {
              ctx.fillStyle = '#7dd3fc'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - 10, s.y - 26); ctx.lineTo(s.x + 6, s.y - 18);
              ctx.closePath(); ctx.fill(); ctx.stroke();
            });
          } else if (cinema.id === 'shield') {
            ctx.strokeStyle = '#fde047'; ctx.lineWidth = 4;
            ctx.translate(275, 360); ctx.rotate(time * 4);
            ctx.strokeRect(-72, -72, 144, 144);
          } else if (cinema.id === 'passover') {
            var pGrad = ctx.createLinearGradient(650, 0, 770, 0);
            pGrad.addColorStop(0, 'rgba(253, 224, 71, 0)');
            pGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.88)');
            pGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
            ctx.fillStyle = pGrad;
            ctx.fillRect(650, 0, 120, H);
          }
          ctx.restore();
        }

        vfx.renderFront(ctx);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.plagues;
  }
})(typeof window !== 'undefined' ? window : globalThis);
