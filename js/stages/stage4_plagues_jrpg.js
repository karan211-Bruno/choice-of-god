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

      // Smooth 4-phase frame-by-frame choreography state machine
      var mosesX = 225, aaronX = 325, partyJump = 0, partyKnock = 0;
      var mosesAnim = 'idle', aaronAnim = 'idle', partyFlip = false, mosesAtk = 0, aaronAtk = 0;
      var pharaohX = 700, magX = 795, enemyJump = 0, enemyKnock = 0;
      var pharaohAnim = 'idle', magAnim = 'idle', enemyFlip = false, pharaohAtk = 0;
      var partyHit = 0, enemyHit = 0;

      var pharaohIntent = 'attack';
      var turnCount = 1;
      var skillCost = { nile: 0, frogs: 15, hail: 24, shield: 12, passover: 32 };

      var actPhase = 'idle'; // 'idle' | 'p_dash' | 'p_strike' | 'p_return' | 'e_dash' | 'e_strike' | 'e_return'
      var actElapsed = 0;
      var pendingSkill = null;
      var ghostCd = 0;
      var cinema = null;

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
          var dis = !playerTurn || actPhase !== 'idle' || partyMp < cost;
          return '<button type="button" class="btn-secondary jrpg-btn" data-sk="' + sk.id + '"' + (dis ? ' disabled' : '') + '>' +
            '<strong>' + sk.name + '</strong> <small>' + sk.desc + '</small></button>';
        }).join('');
        var tb = host.setToolbar('<div class="sim-toolbar">' + btns + '</div>');
        if (!tb) return;
        var all = tb.querySelectorAll('[data-sk]');
        for (var i = 0; i < all.length; i++) {
          all[i].addEventListener('click', function () {
            this.blur();
            castSkill(this.getAttribute('data-sk'));
          });
        }
      }

      function launchSkillCinema(id) {
        if (id === 'nile') {
          cinema = { id: 'nile', t: 0, dur: 0.65, x: 460 };
        } else if (id === 'frogs') {
          var frogs = [];
          for (var i = 0; i < 8; i++) frogs.push({ x: 420 - i * 24, vx: 520 + (i % 3) * 40, phase: i * 0.55 });
          cinema = { id: 'frogs', t: 0, dur: 0.72, frogs: frogs };
        } else if (id === 'hail') {
          var shards = [];
          for (var j = 0; j < 14; j++) shards.push({ x: 560 + Math.random() * 250, y: -40 - j * 34, hit: false });
          cinema = { id: 'hail', t: 0, dur: 0.72, shards: shards };
        } else if (id === 'shield') {
          cinema = { id: 'shield', t: 0, dur: 0.68 };
        } else if (id === 'passover') {
          cinema = { id: 'passover', t: 0, dur: 0.75 };
        }
      }

      function applySkillImpact(id) {
        var rawDmg = 0;
        var heal = 0;
        if (id === 'nile') rawDmg = 28 + Math.round(bonus.atk * 0.6);
        else if (id === 'frogs') rawDmg = 42 + Math.round(bonus.atk * 0.7);
        else if (id === 'hail') rawDmg = 48 + Math.round(bonus.atk * 0.8);
        else if (id === 'shield') { heal = 35; shieldOn = true; }
        else if (id === 'passover') { rawDmg = 65 + bonus.atk; heal = 25; shieldOn = true; }

        launchSkillCinema(id);
        host.sfx('magic');

        if (rawDmg > 0) {
          var isBreak = (pharaohIntent === 'charge' && (id === 'frogs' || id === 'hail' || id === 'passover'));
          var isGuarded = (pharaohIntent === 'guard' && id !== 'passover');
          var finalDmg = isBreak ? Math.round(rawDmg * 1.5) : (isGuarded ? Math.round(rawDmg * 0.6) : rawDmg);
          enemyHp = Math.max(0, enemyHp - finalDmg);
          enemyHit = 0.35;
          enemyKnock = 46;

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
          vfx.spawnBurst(710, 345, '#fde047', 16, 160);
        }
        if (heal > 0) {
          partyHp = Math.min(partyMaxHp, partyHp + heal);
          vfx.spawnRing(470, 355, '#4ade80', 95, 0.55);
          vfx.spawnBurst(470, 340, '#4ade80', 14, 130);
          vfx.addPopup(470, 185, '+' + heal + ' HP', '#4ade80', 1.2);
        }
        updateHud();
      }

      function applyEnemyImpact() {
        var mult = pharaohIntent === 'charge' ? 1.55 : 1.0;
        var raw = Math.round((20 + Math.floor(Math.random() * 8)) * mult);
        var dmg = shieldOn ? Math.round(raw * 0.3) : raw;
        dmg = Math.max(5, dmg - Math.round(bonus.def * 0.4));
        shieldOn = false;

        partyHp = Math.max(0, partyHp - dmg);
        partyMp = Math.min(partyMaxMp, partyMp + 14);
        partyHit = 0.3;
        partyKnock = 34;
        host.sfx('hit');
        host.shake(mult > 1 ? 9 : 6, 0.24);
        vfx.spawnRing(265, 355, '#f43f5e', 95, 0.45);
        vfx.spawnBurst(265, 355, '#fb7185', 14, 140);
        vfx.addPopup(265, 185, '-' + dmg, '#fb7185', 1.2);
        updateHud();
      }

      function castSkill(id) {
        if (!playerTurn || actPhase !== 'idle') return;
        var cost = skillCost[id] || 0;
        if (partyMp < cost) return;
        partyMp -= cost;
        playerTurn = false;
        pendingSkill = id;
        actPhase = 'p_dash';
        actElapsed = 0;
        ghostCd = 0;
        host.sfx('dash');
        renderToolbar();
        updateHud();
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
        if (partyKnock > 0) partyKnock = Math.max(0, partyKnock - dt * 130);
        if (enemyKnock > 0) enemyKnock = Math.max(0, enemyKnock - dt * 150);

        // Smooth 4-phase action choreography!
        if (actPhase !== 'idle') {
          actElapsed += dt;
          ghostCd -= dt;

          if (actPhase === 'p_dash') {
            var u = Math.min(1, actElapsed / 0.26);
            mosesX = 225 + (495 - 225) * u;
            aaronX = 325 + (425 - 325) * u;
            mosesAnim = 'run'; aaronAnim = 'run'; partyFlip = false;
            if (ghostCd <= 0) {
              ghostCd = 0.06;
              vfx.spawnDust(mosesX - 10, 410, 2);
              vfx.addAfterimage('hero_moses_sheet', 1, mosesX, 408, { height: 132, duration: 0.22 });
            }
            if (actElapsed >= 0.26) {
              actPhase = 'p_strike';
              actElapsed = 0;
              mosesX = 495; aaronX = 425;
              mosesAnim = 'attack'; aaronAnim = 'attack';
              mosesAtk = 0.56; aaronAtk = 0.56;
              applySkillImpact(pendingSkill);
            }
          } else if (actPhase === 'p_strike') {
            var u2 = Math.min(1, actElapsed / 0.56);
            partyJump = Math.sin(u2 * Math.PI) * 28;
            if (actElapsed >= 0.56) {
              partyJump = 0;
              actPhase = 'p_return';
              actElapsed = 0;
            }
          } else if (actPhase === 'p_return') {
            var u3 = Math.min(1, actElapsed / 0.26);
            mosesX = 495 + (225 - 495) * u3;
            aaronX = 425 + (325 - 425) * u3;
            partyJump = Math.sin(u3 * Math.PI) * 18;
            mosesAnim = 'run'; aaronAnim = 'run'; partyFlip = true;
            if (actElapsed >= 0.26) {
              mosesX = 225; aaronX = 325; partyJump = 0;
              mosesAnim = 'idle'; aaronAnim = 'idle'; partyFlip = false;
              vfx.spawnDust(mosesX, 410, 3);
              if (enemyHp <= 0) {
                actPhase = 'idle';
                host.sfx('win');
                host.win(stageObj.baseScore + partyHp * 4, partyHp >= 80 ? 3 : 2, {
                  faith: 8, wisdom: 5,
                  customSummary: host.t('stages.plagues.outro')
                });
                return;
              }
              actPhase = 'e_dash';
              actElapsed = 0;
              ghostCd = 0;
              host.sfx('dash');
            }
          } else if (actPhase === 'e_dash') {
            var e1 = Math.min(1, actElapsed / 0.26);
            pharaohX = 700 + (445 - 700) * e1;
            magX = 795 + (525 - 795) * e1;
            pharaohAnim = 'run'; magAnim = 'run'; enemyFlip = false;
            if (ghostCd <= 0) {
              ghostCd = 0.06;
              vfx.spawnDust(pharaohX + 10, 410, 2);
              vfx.addAfterimage('boss_pharaoh_sheet', 1, pharaohX, 408, { height: 142, duration: 0.22 });
            }
            if (actElapsed >= 0.26) {
              actPhase = 'e_strike';
              actElapsed = 0;
              pharaohX = 445; magX = 525;
              pharaohAnim = 'attack'; magAnim = 'attack';
              pharaohAtk = 0.42;
              applyEnemyImpact();
            }
          } else if (actPhase === 'e_strike') {
            var e2 = Math.min(1, actElapsed / 0.42);
            enemyJump = Math.sin(e2 * Math.PI) * 24;
            if (actElapsed >= 0.42) {
              enemyJump = 0;
              actPhase = 'e_return';
              actElapsed = 0;
            }
          } else if (actPhase === 'e_return') {
            var e3 = Math.min(1, actElapsed / 0.24);
            pharaohX = 445 + (700 - 445) * e3;
            magX = 525 + (795 - 525) * e3;
            enemyJump = Math.sin(e3 * Math.PI) * 16;
            pharaohAnim = 'run'; magAnim = 'run'; enemyFlip = true;
            if (actElapsed >= 0.24) {
              pharaohX = 700; magX = 795; enemyJump = 0;
              pharaohAnim = 'idle'; magAnim = 'idle'; enemyFlip = false;
              vfx.spawnDust(pharaohX, 410, 3);
              actPhase = 'idle';
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
            }
          }
        }

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
          var cx = (mosesX + aaronX) * 0.5;
          var g = ctx.createRadialGradient(cx, 365, 25, cx, 365, 102);
          g.addColorStop(0, 'rgba(254, 240, 138, 0.08)');
          g.addColorStop(1, 'rgba(250, 204, 21, 0.44)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(cx, 365, 102, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3.5; ctx.stroke();
          ctx.restore();
        }

        vfx.renderBack(ctx);

        S.drawChibiHero(ctx, mosesX - partyKnock, 408, {
          kind: 'moses',
          height: 132,
          animState: mosesAnim,
          flipX: partyFlip,
          jumpY: partyJump,
          attackTimer: mosesAtk,
          hitFlash: partyHit > 0,
          lv: root.COG.State.getPlayerLevel()
        }, time);
        S.drawChibiHero(ctx, aaronX - partyKnock * 0.7, 438, {
          kind: 'aaron',
          height: 112,
          animState: aaronAnim,
          flipX: partyFlip,
          jumpY: partyJump * 0.85,
          attackTimer: aaronAtk,
          hitFlash: partyHit > 0
        }, time);

        S.drawCutePharaohOrGuard(ctx, pharaohX + enemyKnock, 408, true, time, 1, {
          height: 142,
          animState: pharaohAnim,
          flipX: enemyFlip,
          jumpY: enemyJump,
          attackTimer: pharaohAtk,
          hitFlash: enemyHit > 0,
          lv: 'BOSS'
        });
        S.drawCutePharaohOrGuard(ctx, magX + enemyKnock * 0.7, 438, false, time, 1, {
          height: 112,
          animState: magAnim,
          flipX: enemyFlip,
          jumpY: enemyJump * 0.85,
          attackTimer: pharaohAtk * 0.7,
          hitFlash: enemyHit > 0
        });

        var t = uiT();
        var intLabel = t.intents[pharaohIntent] || t.intents.attack;
        var intCol = pharaohIntent === 'charge' ? '#fb7185' : (pharaohIntent === 'guard' ? '#7dd3fc' : '#fde047');
        drawStrokeText(ctx, intLabel, 722, 165, intCol, '900 13px sans-serif');

        if (Sp && Sp.drawGlossyBar) {
          Sp.drawGlossyBar(ctx, 185, 245, 175, 14, partyHp / partyMaxHp, '#22c55e', '#1c1917');
          Sp.drawGlossyBar(ctx, 185, 263, 175, 9, partyMp / partyMaxMp, '#38bdf8', '#1c1917');
          Sp.drawGlossyBar(ctx, 635, 245, 175, 14, enemyHp / enemyMaxHp, '#fb7185', '#1c1917');
        }
        drawStrokeText(ctx, 'HP ' + partyHp + '/' + partyMaxHp, 272, 238, '#bbf7d0', '900 13px sans-serif');
        drawStrokeText(ctx, 'HP ' + enemyHp + '/' + enemyMaxHp, 722, 238, '#fecdd3', '900 13px sans-serif');

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
            ctx.translate((mosesX + aaronX) * 0.5, 360); ctx.rotate(time * 4);
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
