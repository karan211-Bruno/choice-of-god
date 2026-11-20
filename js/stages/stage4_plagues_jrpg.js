(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  function drawStrokeText(ctx, text, x, y, fill, font) {
    ctx.save();
    ctx.font = font || '900 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
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
      var uiT = function () { return host.pack().stageUi.plagues; };
      var bonus = root.COG.State.getPowerBonus();

      var partyHp = 135 + bonus.hp;
      var partyMaxHp = partyHp;
      var partyMp = 65;
      var partyMaxMp = 65;
      var enemyHp = 185;
      var enemyMaxHp = 185;
      var shieldOn = false;
      var playerTurn = true;
      var time = 0;
      var partyLunge = 0;
      var enemyLunge = 0;
      var partyHit = 0;
      var enemyHit = 0;
      var vfx = [];
      var popups = [];

      var skillCost = { nile: 0, frogs: 15, hail: 24, shield: 12, passover: 32 };

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

      function castSkill(id) {
        if (!playerTurn) return;
        var cost = skillCost[id] || 0;
        if (partyMp < cost) return;
        partyMp -= cost;
        playerTurn = false;
        partyLunge = 32;
        host.sfx('magic');

        var dmg = 0;
        var heal = 0;
        if (id === 'nile') dmg = 28 + Math.round(bonus.atk * 0.6);
        else if (id === 'frogs') dmg = 42 + Math.round(bonus.atk * 0.7);
        else if (id === 'hail') dmg = 48 + Math.round(bonus.atk * 0.8);
        else if (id === 'shield') { heal = 35; shieldOn = true; }
        else if (id === 'passover') { dmg = 65 + bonus.atk; heal = 25; shieldOn = true; }

        if (dmg > 0) {
          enemyHp = Math.max(0, enemyHp - dmg);
          enemyHit = 0.25;
          vfx.push({ kind: id, x: 705, y: 345, life: 0.72, maxLife: 0.72 });
          popups.push({ x: 705, y: 195, text: '-' + dmg, col: '#fb7185', life: 0.95 });
        }
        if (heal > 0) {
          partyHp = Math.min(partyMaxHp, partyHp + heal);
          vfx.push({ kind: 'heal', x: 255, y: 350, life: 0.65, maxLife: 0.65 });
          popups.push({ x: 255, y: 195, text: '+' + heal + ' HP', col: '#4ade80', life: 0.95 });
        }

        updateHud();
        renderToolbar();

        if (enemyHp <= 0) {
          host.setTimeout(function () {
            host.sfx('win');
            host.win(stageObj.baseScore + partyHp * 4, partyHp >= 80 ? 3 : 2, {
              faith: 8, wisdom: 5,
              customSummary: host.t('stages.plagues.outro')
            });
          }, 650);
          return;
        }

        host.setTimeout(enemyTurn, 850);
      }

      function enemyTurn() {
        var raw = 20 + Math.floor(Math.random() * 10);
        var dmg = shieldOn ? Math.round(raw * 0.35) : raw;
        dmg = Math.max(6, dmg - Math.round(bonus.def * 0.4));
        shieldOn = false;
        partyHp = Math.max(0, partyHp - dmg);
        partyMp = Math.min(partyMaxMp, partyMp + 12);
        enemyLunge = 32;
        partyHit = 0.25;
        host.sfx('hit');
        vfx.push({ kind: 'enemy', x: 260, y: 350, life: 0.55, maxLife: 0.55 });
        popups.push({ x: 260, y: 195, text: '-' + dmg, col: '#fb7185', life: 0.95 });

        if (partyHp <= 0) {
          host.sfx('fail');
          host.fail();
          return;
        }
        playerTurn = true;
        updateHud();
        renderToolbar();
      }

      function updateHud() {
        var t = uiT();
        host.setHud(t.mosesParty + ' HP:' + partyHp + ' MP:' + partyMp + ' · ' + t.enemyParty + ' HP:' + enemyHp +
          ' · ' + (playerTurn ? t.turnPlayer : t.turnEnemy));
      }

      updateHud();
      renderToolbar();

      host.onUpdate(function (dt) {
        time += dt;
        if (partyLunge > 0) partyLunge = Math.max(0, partyLunge - dt * 140);
        if (enemyLunge > 0) enemyLunge = Math.max(0, enemyLunge - dt * 140);
        if (partyHit > 0) partyHit = Math.max(0, partyHit - dt);
        if (enemyHit > 0) enemyHit = Math.max(0, enemyHit - dt);

        for (var i = vfx.length - 1; i >= 0; i--) {
          vfx[i].life -= dt;
          if (vfx[i].life <= 0) vfx.splice(i, 1);
        }
        for (var j = popups.length - 1; j >= 0; j--) {
          popups[j].y -= 30 * dt;
          popups[j].life -= dt;
          if (popups[j].life <= 0) popups.splice(j, 1);
        }
      });

      host.onRender(function (ctx) {
        if (!Sp || !Sp.drawCover(ctx, 'bg_plagues', W, H)) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#fed7aa');
          sky.addColorStop(1, '#fcd34d');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
        }

        // Goshen Passover Golden Dome
        if (shieldOn) {
          ctx.save();
          var g = ctx.createRadialGradient(270, 365, 25, 270, 365, 98);
          g.addColorStop(0, 'rgba(254, 240, 138, 0.08)');
          g.addColorStop(1, 'rgba(250, 204, 21, 0.42)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(270, 365, 98, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3.5; ctx.stroke();
          ctx.restore();
        }

        // Party: Moses & Aaron (Left Side)
        S.drawChibiHero(ctx, 235 + partyLunge, 408, {
          kind: 'moses',
          height: 132,
          hitFlash: partyHit > 0,
          lv: root.COG.State.getPlayerLevel()
        }, time);
        S.drawChibiHero(ctx, 325 + partyLunge * 0.7, 438, {
          kind: 'aaron',
          height: 112,
          hitFlash: partyHit > 0
        }, time);

        // Enemies: Pharaoh & Magician (Right Side)
        S.drawCutePharaohOrGuard(ctx, 695 - enemyLunge, 408, true, time, 1, {
          height: 142,
          hitFlash: enemyHit > 0,
          lv: 'BOSS'
        });
        S.drawCutePharaohOrGuard(ctx, 792 - enemyLunge * 0.7, 438, false, time, 1, {
          height: 112,
          hitFlash: enemyHit > 0
        });

        // Glossy JRPG Party & Boss Overhead Gauges
        if (Sp && Sp.drawGlossyBar) {
          Sp.drawGlossyBar(ctx, 185, 245, 175, 14, partyHp / partyMaxHp, '#22c55e', '#1c1917');
          Sp.drawGlossyBar(ctx, 185, 263, 175, 9, partyMp / partyMaxMp, '#38bdf8', '#1c1917');
          Sp.drawGlossyBar(ctx, 635, 245, 175, 14, enemyHp / enemyMaxHp, '#fb7185', '#1c1917');
        }
        drawStrokeText(ctx, 'HP ' + partyHp + '/' + partyMaxHp, 272, 238, '#bbf7d0', '900 13px sans-serif');
        drawStrokeText(ctx, 'HP ' + enemyHp + '/' + enemyMaxHp, 722, 238, '#fecdd3', '900 13px sans-serif');

        // Multi-ring Miracle VFX
        vfx.forEach(function (fx) {
          var prog = 1 - fx.life / fx.maxLife;
          var col = fx.kind === 'enemy' ? '#f43f5e' : (fx.kind === 'heal' ? '#4ade80' : (fx.kind === 'passover' ? '#facc15' : '#38bdf8'));
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - prog);
          ctx.strokeStyle = col;
          ctx.lineWidth = 7;
          ctx.beginPath(); ctx.arc(fx.x, fx.y, prog * 115 + 24, 0, Math.PI * 2); ctx.stroke();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(fx.x, fx.y, prog * 80 + 12, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
        });

        popups.forEach(function (p) {
          drawStrokeText(ctx, p.text, p.x, p.y, p.col, '900 22px sans-serif');
        });
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.plagues;
  }
})(typeof window !== 'undefined' ? window : globalThis);
