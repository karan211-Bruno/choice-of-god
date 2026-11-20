(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.GAMES = root.COG.GAMES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  root.COG.GAMES.eden = {
    start: function (host, levelObj) {
      var sub = levelObj.subLevel;
      var W = host.WIDTH;
      var H = host.HEIGHT;
      var gText = function () { return host.pack().games.eden; };

      var player = { x: 480, y: 390, r: 18, speed: 245, invuln: 0, pulseCd: 0 };
      var pointerTarget = null;
      var hearts = 4;
      var maxHearts = 5;
      var collected = 0;
      var targetCount = sub === 1 ? 6 : (sub === 2 ? 8 : 99);
      var timer = sub === 3 ? 25 : (sub === 4 ? 35 : 0);
      var elapsed = 0;
      var waveRadius = 0;
      var waveMax = 155;
      var forbiddenHold = 0;
      var choiceOpened = false;
      var treeX = 480;
      var treeY = 265;
      var forbX = 135;
      var forbY = 270;

      var pickups = [];
      var darkOrbs = [];
      var serpent = { x: 180, y: 120, angle: 0, fireTimer: 1.5 };

      function spawnPickup(type) {
        var angle = Math.random() * Math.PI * 2;
        var rad = 90 + Math.random() * 190;
        var px = Math.max(85, Math.min(W - 85, treeX + Math.cos(angle) * rad * 1.4));
        var py = Math.max(75, Math.min(H - 75, treeY + Math.sin(angle) * rad * 0.8));
        if (sub >= 3 && dist(px, py, forbX, forbY) < 75) px += 120;
        pickups.push({ x: px, y: py, r: 13, type: type, bob: Math.random() * 6 });
      }

      if (sub === 1) {
        for (var i = 0; i < 6; i++) spawnPickup('light');
      } else if (sub === 2) {
        for (var j = 0; j < 8; j++) spawnPickup('dew');
      } else {
        for (var k = 0; k < 3; k++) spawnPickup('grace');
      }

      host.onCanvasPointer(function (x, y) {
        pointerTarget = { x: x, y: y };
        if (sub >= 3 && dist(x, y, player.x, player.y) < 42) {
          triggerPulse();
        }
      });

      function triggerPulse(superWave) {
        if (player.pulseCd > 0 && !superWave) return;
        player.pulseCd = 0.55;
        waveRadius = 18;
        waveMax = superWave ? 420 : 175;
        host.playSfx('light');
      }

      host.onItemUse(function (itemId) {
        if (itemId === 'word_of_light') {
          triggerPulse(true);
          return true;
        }
        if (itemId === 'tree_of_life_leaf') {
          hearts = Math.min(maxHearts, hearts + 1);
          host.playSfx('chime');
          return true;
        }
        if (itemId === 'garment_of_skin') {
          player.invuln = 5.0;
          host.playSfx('chime');
          return true;
        }
        return false;
      });

      function openCrossroads() {
        choiceOpened = true;
        pointerTarget = null;
        host.openEdenChoice({
          onResist: function () {
            player.x = 340;
            player.y = 270;
            player.invuln = 3.0;
            forbiddenHold = 0;
            choiceOpened = false;
            darkOrbs = [];
            triggerPulse(true);
            host.resume();
          },
          onEat: function () {
            root.COG.State.setEdenRoute('fallen');
            host.playSfx('choice');
            host.win(levelObj.baseScore, 2, {
              mercy: 5,
              wisdom: 5,
              customTitle: gText().fallenTransitionTitle,
              customSummary: gText().fallenTransitionDesc
            });
          }
        });
      }

      host.onUpdate(function (dt, keys) {
        elapsed += dt;
        if (player.invuln > 0) player.invuln -= dt;
        if (player.pulseCd > 0) player.pulseCd -= dt;

        var dx = 0;
        var dy = 0;
        if (keys.left) dx -= 1;
        if (keys.right) dx += 1;
        if (keys.up) dy -= 1;
        if (keys.down) dy += 1;

        if (dx !== 0 || dy !== 0) {
          pointerTarget = null;
          var len = Math.sqrt(dx * dx + dy * dy);
          player.x += (dx / len) * player.speed * dt;
          player.y += (dy / len) * player.speed * dt;
        } else if (pointerTarget) {
          var pdx = pointerTarget.x - player.x;
          var pdy = pointerTarget.y - player.y;
          var pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist > 8) {
            player.x += (pdx / pdist) * player.speed * dt;
            player.y += (pdy / pdist) * player.speed * dt;
          } else {
            pointerTarget = null;
          }
        }

        player.x = Math.max(36, Math.min(W - 36, player.x));
        player.y = Math.max(44, Math.min(H - 36, player.y));

        if (host.consumeAction() && sub >= 3) {
          triggerPulse(false);
        }

        if (waveRadius > 0) {
          waveRadius += 460 * dt;
          for (var wi = darkOrbs.length - 1; wi >= 0; wi--) {
            if (dist(player.x, player.y, darkOrbs[wi].x, darkOrbs[wi].y) <= waveRadius + darkOrbs[wi].r) {
              darkOrbs.splice(wi, 1);
            }
          }
          if (waveRadius >= waveMax) waveRadius = 0;
        }

        // Pickups
        for (var pi = pickups.length - 1; pi >= 0; pi--) {
          var p = pickups[pi];
          if (dist(player.x, player.y, p.x, p.y) < player.r + p.r) {
            pickups.splice(pi, 1);
            collected++;
            host.playSfx('chime');
            if (p.type === 'grace') {
              hearts = Math.min(maxHearts, hearts + 1);
              host.setTimeout(function () {
                if (host && pickups.length < 3) spawnPickup('grace');
              }, 2600);
            }
          }
        }

        // Serpent & enemies
        if (sub === 2) {
          serpent.angle += dt * 1.1;
          serpent.x = treeX + Math.cos(serpent.angle) * 210;
          serpent.y = treeY + Math.sin(serpent.angle * 1.3) * 145;
          if (player.invuln <= 0 && dist(player.x, player.y, serpent.x, serpent.y) < player.r + 18) {
            hearts--;
            player.invuln = 1.4;
            host.playSfx('hit');
          }
        } else if (sub >= 3) {
          serpent.angle += dt * (sub === 4 ? 1.4 : 1.0);
          serpent.x = treeX + Math.cos(serpent.angle) * 320;
          serpent.y = treeY + Math.sin(serpent.angle * 0.8) * 185;
          serpent.fireTimer -= dt;
          if (serpent.fireTimer <= 0) {
            serpent.fireTimer = sub === 4 ? 0.9 : 1.3;
            var tx = Math.random() < 0.5 ? player.x : treeX;
            var ty = Math.random() < 0.5 ? player.y : treeY;
            var adx = tx - serpent.x;
            var ady = ty - serpent.y;
            var alen = Math.max(1, Math.sqrt(adx * adx + ady * ady));
            var spd = sub === 4 ? 148 : 118;
            darkOrbs.push({
              x: serpent.x,
              y: serpent.y,
              vx: (adx / alen) * spd,
              vy: (ady / alen) * spd,
              r: 11
            });
          }

          for (var di = darkOrbs.length - 1; di >= 0; di--) {
            var orb = darkOrbs[di];
            orb.x += orb.vx * dt;
            orb.y += orb.vy * dt;
            if (orb.x < -20 || orb.x > W + 20 || orb.y < -20 || orb.y > H + 20) {
              darkOrbs.splice(di, 1);
              continue;
            }
            if (player.invuln <= 0 && dist(player.x, player.y, orb.x, orb.y) < player.r + orb.r) {
              darkOrbs.splice(di, 1);
              hearts--;
              player.invuln = 1.0;
              host.playSfx('hit');
            } else if (dist(treeX, treeY, orb.x, orb.y) < 34) {
              darkOrbs.splice(di, 1);
              hearts--;
              host.playSfx('hit');
            }
          }

          // Forbidden tree branching trigger
          if (!choiceOpened && dist(player.x, player.y, forbX, forbY) < 52) {
            forbiddenHold += dt;
            if (forbiddenHold >= 0.8) {
              openCrossroads();
              return;
            }
          } else {
            forbiddenHold = Math.max(0, forbiddenHold - dt * 2);
          }
        }

        // Win / Fail checks
        if (hearts <= 0) {
          host.fail();
          return;
        }

        var gt = gText();
        if (sub <= 2) {
          var left = Math.max(0, targetCount - collected);
          host.setHud((sub === 1 ? gt.orbsLeft + ': ' + left : gt.bloom + ': ' + Math.round((collected / targetCount) * 100) + '%') + ' · ' + gt.graceHearts + ': ' + '❤️'.repeat(hearts));
          if (collected >= targetCount) {
            host.playSfx('win');
            host.win(levelObj.baseScore + hearts * 75, hearts >= 4 ? 3 : 2, { faith: 3, wisdom: 2 });
          }
        } else {
          timer = Math.max(0, timer - dt);
          host.setHud(gt.timeLeft + ': ' + Math.ceil(timer) + 's · ' + gt.graceHearts + ': ' + '❤️'.repeat(hearts) + ' · ' + gt.waveHint);
          if (timer <= 0) {
            host.playSfx('win');
            if (sub === 4) {
              root.COG.State.setEdenRoute('preserved');
              host.win(levelObj.baseScore + hearts * 120, 3, {
                faith: 10,
                wisdom: 8,
                customTitle: gt.preservedWinTitle,
                customSummary: gt.preservedWinDesc
              });
            } else {
              host.win(levelObj.baseScore + hearts * 90, hearts >= 3 ? 3 : 2, { faith: 5 });
            }
          }
        }
      });

      host.onRender(function (ctx) {
        var gt = gText();
        // Lush Eden backdrop
        var bg = ctx.createRadialGradient(treeX, treeY, 40, treeX, treeY, 560);
        bg.addColorStop(0, '#1c4d3e');
        bg.addColorStop(0.6, '#12332a');
        bg.addColorStop(1, '#081b18');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Four Rivers of Eden
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 22;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(treeX, treeY); ctx.quadraticCurveTo(310, 120, 60, 40);
        ctx.moveTo(treeX, treeY); ctx.quadraticCurveTo(640, 120, 900, 50);
        ctx.moveTo(treeX, treeY); ctx.quadraticCurveTo(300, 420, 80, 510);
        ctx.moveTo(treeX, treeY); ctx.quadraticCurveTo(660, 420, 910, 500);
        ctx.stroke();

        // Central Tree of Life
        var glow = 44 + Math.sin(elapsed * 2.5) * 5;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.16)';
        ctx.beginPath(); ctx.arc(treeX, treeY, glow + 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(treeX - 10, treeY - 6, 20, 40);
        ctx.fillStyle = '#34d399';
        ctx.beginPath(); ctx.arc(treeX, treeY - 22, 34, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(gt.treeOfLife, treeX, treeY + 52);

        // Western Forbidden Tree (Lv 1-3 & 1-4)
        if (sub >= 3) {
          ctx.fillStyle = 'rgba(220, 38, 38, 0.16)';
          ctx.beginPath(); ctx.arc(forbX, forbY, 54, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#451a03';
          ctx.fillRect(forbX - 8, forbY - 4, 16, 36);
          ctx.fillStyle = '#7f1d1d';
          ctx.beginPath(); ctx.arc(forbX, forbY - 18, 28, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.arc(forbX - 9, forbY - 20, 5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(forbX + 10, forbY - 14, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fecaca';
          ctx.fillText(gt.forbiddenTree, forbX, forbY + 50);

          if (forbiddenHold > 0) {
            ctx.fillStyle = '#fca5a5';
            ctx.fillText(gt.approachWarning, W / 2, 30);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(forbX, forbY, 54, -Math.PI / 2, -Math.PI / 2 + (forbiddenHold / 0.8) * Math.PI * 2);
            ctx.stroke();
          }
        }

        // Pickups
        for (var i = 0; i < pickups.length; i++) {
          var pk = pickups[i];
          var py = pk.y + Math.sin(elapsed * 4 + pk.bob) * 4;
          ctx.fillStyle = pk.type === 'light' ? '#fde047' : (pk.type === 'dew' ? '#67e8f9' : '#6ee7b7');
          ctx.beginPath(); ctx.arc(pk.x, py, pk.r, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Serpent & Dark Orbs
        if (sub >= 2) {
          ctx.fillStyle = '#991b1b';
          ctx.beginPath(); ctx.arc(serpent.x, serpent.y, 17, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#fca5a5';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('🐍 ' + gt.serpent, serpent.x, serpent.y - 24);
        }

        for (var d = 0; d < darkOrbs.length; d++) {
          var o = darkOrbs[d];
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Word-of-Light Pulse
        if (waveRadius > 0) {
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.78)';
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(player.x, player.y, waveRadius, 0, Math.PI * 2); ctx.stroke();
        }

        // Player (Adam & Eve)
        if (player.invuln > 0) {
          ctx.strokeStyle = '#67e8f9';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(player.x, player.y, player.r + 8, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = '#fde68a';
        ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('🕊️', player.x, player.y + 5);
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(gt.adamEve, player.x, player.y + 32);
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.GAMES.eden;
  }
})(typeof window !== 'undefined' ? window : globalThis);
