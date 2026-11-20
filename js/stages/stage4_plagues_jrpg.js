(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.STAGES = root.COG.STAGES || {};

  root.COG.STAGES.plagues = {
    start: function (host, stageObj) {
      var W = host.WIDTH, H = host.HEIGHT;
      var S = root.COG.ChibiSprites;
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
          vfx.push({ kind: id, x: 690, y: 315, life: 0.65 });
          popups.push({ x: 690, y: 260, text: '-' + dmg, col: '#e11d48', life: 0.9 });
        }
        if (heal > 0) {
          partyHp = Math.min(partyMaxHp, partyHp + heal);
          popups.push({ x: 260, y: 260, text: '+' + heal + ' HP', col: '#10b981', life: 0.9 });
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
        host.sfx('hit');
        vfx.push({ kind: 'enemy', x: 260, y: 315, life: 0.5 });
        popups.push({ x: 260, y: 260, text: '-' + dmg, col: '#e11d48', life: 0.9 });

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
        for (var i = vfx.length - 1; i >= 0; i--) {
          vfx[i].life -= dt;
          if (vfx[i].life <= 0) vfx.splice(i, 1);
        }
        for (var j = popups.length - 1; j >= 0; j--) {
          popups[j].y -= 28 * dt;
          popups[j].life -= dt;
          if (popups[j].life <= 0) popups.splice(j, 1);
        }
      });

      host.onRender(function (ctx) {
        var sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#fed7aa');
        sky.addColorStop(0.55, '#fef3c7');
        sky.addColorStop(0.56, '#fde68a');
        sky.addColorStop(1, '#fcd34d');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Cute pastel pyramids in background
        ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(560, 300); ctx.lineTo(660, 175); ctx.lineTo(760, 300); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(730, 300); ctx.lineTo(805, 205); ctx.lineTo(880, 300); ctx.closePath(); ctx.fill(); ctx.stroke();

        // Moses & Aaron Party (left)
        S.drawChibiHero(ctx, 230, 355, { kind: 'moses', moving: false, scale: 1.35 }, time);
        S.drawChibiHero(ctx, 315, 395, { kind: 'aaron', moving: false, scale: 1.15 }, time);
        if (shieldOn) {
          ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(265, 365, 76, 0, Math.PI * 2); ctx.stroke();
        }

        // Pharaoh & Magician (right)
        S.drawCutePharaohOrGuard(ctx, 700, 355, true, time, 1.4);
        S.drawCutePharaohOrGuard(ctx, 785, 395, false, time, 1.15);

        // JRPG Overhead HP Bars
        ctx.fillStyle = '#fff'; ctx.strokeStyle = S.INK; ctx.lineWidth = 2;
        S.roundRect(ctx, 180, 260, 170, 14, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#22c55e';
        S.roundRect(ctx, 182, 262, 166 * (partyHp / partyMaxHp), 10, 5); ctx.fill();

        ctx.fillStyle = '#fff';
        S.roundRect(ctx, 640, 255, 170, 14, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fb7185';
        S.roundRect(ctx, 642, 257, 166 * (enemyHp / enemyMaxHp), 10, 5); ctx.fill();

        // Animated JRPG VFX
        vfx.forEach(function (fx) {
          ctx.strokeStyle = fx.kind === 'enemy' ? '#f43f5e' : '#38bdf8';
          ctx.lineWidth = 6;
          ctx.beginPath(); ctx.arc(fx.x, fx.y, (0.65 - fx.life) * 140 + 20, 0, Math.PI * 2); ctx.stroke();
        });

        ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
        popups.forEach(function (p) {
          ctx.fillStyle = p.col;
          ctx.fillText(p.text, p.x, p.y);
        });
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.STAGES.plagues;
  }
})(typeof window !== 'undefined' ? window : globalThis);
