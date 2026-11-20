(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.GAMES = root.COG.GAMES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  root.COG.GAMES.redsea = {
    start: function (host, levelObj) {
      var sub = levelObj.subLevel;
      var W = host.WIDTH;
      var H = host.HEIGHT;
      var gText = function () { return host.pack().games.redsea; };

      if (sub === 1) {
        // 5-1: Follow Pillar of Fire for 25s
        var player = { x: 480, y: 270, r: 16, speed: 265 };
        var pillar = { x: 480, y: 270, r: 105, t: 0 };
        var ptr = null;
        var sanity = 100;
        var timeLeft = 25;

        host.onCanvasPointer(function (x, y) { ptr = { x: x, y: y }; });
        host.onItemUse(function (itemId) {
          if (itemId === 'word_of_light' || itemId === 'tree_of_life_leaf') {
            sanity = Math.min(100, sanity + 35);
            host.playSfx('chime');
            return true;
          }
          return false;
        });

        host.onUpdate(function (dt, keys) {
          timeLeft -= dt;
          pillar.t += dt;
          pillar.x = 480 + Math.cos(pillar.t * 0.85) * 260;
          pillar.y = 270 + Math.sin(pillar.t * 1.25) * 140;

          var dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
          var dy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
          if (dx || dy) {
            ptr = null;
            var l = Math.sqrt(dx * dx + dy * dy);
            player.x += (dx / l) * player.speed * dt;
            player.y += (dy / l) * player.speed * dt;
          } else if (ptr) {
            var pdx = ptr.x - player.x;
            var pdy = ptr.y - player.y;
            var pd = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pd > 8) {
              player.x += (pdx / pd) * player.speed * dt;
              player.y += (pdy / pd) * player.speed * dt;
            } else ptr = null;
          }
          player.x = Math.max(28, Math.min(W - 28, player.x));
          player.y = Math.max(28, Math.min(H - 28, player.y));

          var inside = dist(player.x, player.y, pillar.x, pillar.y) <= pillar.r;
          sanity = Math.max(0, Math.min(100, sanity + (inside ? 14 : -22) * dt));

          host.setHud(gText().pillarDistance + ': ' + Math.round(sanity) + '% · ' + Math.max(0, Math.ceil(timeLeft)) + 's');
          if (sanity <= 0) { host.fail(); return; }
          if (timeLeft <= 0) {
            host.playSfx('win');
            host.win(levelObj.baseScore + Math.round(sanity * 2), sanity >= 75 ? 3 : 2, { faith: 5 });
          }
        });

        host.onRender(function (ctx) {
          ctx.fillStyle = '#070b1a';
          ctx.fillRect(0, 0, W, H);

          var g = ctx.createRadialGradient(pillar.x, pillar.y, 12, pillar.x, pillar.y, pillar.r * 1.45);
          g.addColorStop(0, 'rgba(253, 224, 71, 0.72)');
          g.addColorStop(0.65, 'rgba(249, 115, 22, 0.35)');
          g.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(pillar.x, pillar.y, pillar.r * 1.45, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(pillar.x, pillar.y, pillar.r, 0, Math.PI * 2); ctx.stroke();

          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🔥', pillar.x, pillar.y + 10);

          ctx.fillStyle = '#fef3c7';
          ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();
          ctx.font = '18px sans-serif';
          ctx.fillText('🚶', player.x, player.y + 6);
        });
      } else if (sub === 2) {
        // 5-2: Timing Miracle - Part the Red Sea (3 hits)
        var hits = 0;
        var triesLeft = 6;
        var cursor = 0.1;
        var dir = 1;
        var speed = 1.25;

        function strike() {
          if (Math.abs(cursor - 0.5) <= 0.14) {
            hits++;
            speed += 0.25;
            host.playSfx('light');
            if (hits >= 3) {
              host.playSfx('win');
              host.win(levelObj.baseScore + triesLeft * 50, triesLeft >= 4 ? 3 : 2, { faith: 6 });
            }
          } else {
            triesLeft--;
            host.playSfx('hit');
            if (triesLeft <= 0) host.fail();
          }
        }

        host.onCanvasPointer(function () { strike(); });
        host.onItemUse(function (itemId) {
          if (itemId === 'staff_of_moses') {
            hits++;
            host.playSfx('light');
            if (hits >= 3) {
              host.playSfx('win');
              host.win(levelObj.baseScore + 200, 3, { faith: 6 });
            }
            return true;
          }
          return false;
        });

        host.onUpdate(function (dt) {
          cursor += dir * speed * dt;
          if (cursor >= 1) { cursor = 1; dir = -1; }
          if (cursor <= 0) { cursor = 0; dir = 1; }
          if (host.consumeAction()) strike();
          host.setHud(gText().staffHits + ': ' + hits + '/3 · ❤️'.repeat(triesLeft));
        });

        host.onRender(function (ctx) {
          ctx.fillStyle = '#082f49';
          ctx.fillRect(0, 0, W, H);
          // Parting seabed channel proportional to hits
          var splitWidth = hits * 110;
          if (splitWidth > 0) {
            ctx.fillStyle = '#92400e';
            ctx.fillRect(W / 2 - splitWidth / 2, 0, splitWidth, H);
          }
          // Timing bar
          var bx = 180;
          var bw = 600;
          var by = 245;
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(bx, by, bw, 36);
          // Gold center target zone
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(bx + bw * 0.36, by, bw * 0.28, 36);
          // Moving marker
          var mx = bx + cursor * bw;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(mx - 5, by - 10, 10, 56);

          ctx.fillStyle = '#fde68a';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🪄 ' + gText().pressAction, W / 2, 185);
        });
      } else if (sub === 3) {
        // 5-3: 3-Lane Red Sea Dry Ground Runner (400m)
        var lanes = [165, 270, 375];
        var laneIdx = 1;
        var distLeft = 400;
        var hp3 = 4;
        var saved = 0;
        var invuln = 0;
        var entities = [];
        var spawnTimer = 0.6;
        var moveCd = 0;

        host.onCanvasPointer(function (x, y) {
          if (y < 220) laneIdx = 0;
          else if (y < 325) laneIdx = 1;
          else laneIdx = 2;
        });

        host.onItemUse(function (itemId) {
          if (itemId === 'olive_branch') {
            entities = entities.filter(function (e) { return e.kind === 'star'; });
            host.playSfx('chime');
            return true;
          }
          if (itemId === 'tree_of_life_leaf') { hp3 = Math.min(5, hp3 + 1); host.playSfx('chime'); return true; }
          if (itemId === 'garment_of_skin') { invuln = 5; host.playSfx('chime'); return true; }
          return false;
        });

        host.onUpdate(function (dt, keys) {
          if (invuln > 0) invuln -= dt;
          if (moveCd > 0) moveCd -= dt;
          if (moveCd <= 0) {
            if (keys.up || keys.left) { laneIdx = Math.max(0, laneIdx - 1); moveCd = 0.18; }
            else if (keys.down || keys.right) { laneIdx = Math.min(2, laneIdx + 1); moveCd = 0.18; }
          }

          distLeft -= 22 * dt;
          spawnTimer -= dt;
          if (spawnTimer <= 0) {
            spawnTimer = 0.72;
            var l = Math.floor(Math.random() * 3);
            var isStar = Math.random() < 0.35;
            entities.push({ lane: l, x: W + 30, kind: isStar ? 'star' : (Math.random() < 0.5 ? 'chariot' : 'wave') });
          }

          for (var i = entities.length - 1; i >= 0; i--) {
            var ent = entities[i];
            ent.x -= 300 * dt;
            if (ent.lane === laneIdx && Math.abs(ent.x - 140) < 34) {
              if (ent.kind === 'star') {
                saved++;
                host.playSfx('chime');
              } else if (invuln <= 0) {
                hp3--;
                invuln = 1.1;
                host.playSfx('hit');
                if (hp3 <= 0) { host.fail(); return; }
              }
              entities.splice(i, 1);
              continue;
            }
            if (ent.x < -50) entities.splice(i, 1);
          }

          var gt = gText();
          host.setHud(gt.distanceLeft + ': ' + Math.max(0, Math.ceil(distLeft)) + 'm · ' + gt.israelSaved + ': ' + saved + ' · ❤️'.repeat(hp3));
          if (distLeft <= 0) {
            host.playSfx('win');
            host.win(levelObj.baseScore + saved * 40 + hp3 * 60, hp3 >= 3 ? 3 : 2, { faith: 6, mercy: 4 });
          }
        });

        host.onRender(function (ctx) {
          // Towering sea walls top & bottom
          ctx.fillStyle = '#0369a1';
          ctx.fillRect(0, 0, W, 105);
          ctx.fillRect(0, 435, W, 105);
          // Dry seabed road
          ctx.fillStyle = '#78350f';
          ctx.fillRect(0, 105, W, 330);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.25)';
          ctx.setLineDash([18, 18]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 217); ctx.lineTo(W, 217);
          ctx.moveTo(0, 322); ctx.lineTo(W, 322);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = '30px sans-serif';
          ctx.textAlign = 'center';
          entities.forEach(function (ent) {
            var ey = lanes[ent.lane] + 10;
            ctx.fillText(ent.kind === 'star' ? '⭐' : (ent.kind === 'chariot' ? '🏇' : '🌊'), ent.x, ey);
          });

          if (invuln > 0) {
            ctx.strokeStyle = '#67e8f9';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(140, lanes[laneIdx], 26, 0, Math.PI * 2); ctx.stroke();
          }
          ctx.font = '34px sans-serif';
          ctx.fillText('🏃', 140, lanes[laneIdx] + 12);
          ctx.fillStyle = '#e0f2fe';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(gText().laneHint, W / 2, 55);
        });
      } else {
        // 5-4: Song of Miriam Praise Note Catcher (12 golden notes)
        var catcherX = 480;
        var ptr4 = null;
        var caught = 0;
        var notes = [];
        var noteCd = 0.5;

        host.onCanvasPointer(function (x) { ptr4 = x; });
        host.onUpdate(function (dt, keys) {
          var move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
          if (move !== 0) {
            ptr4 = null;
            catcherX += move * 360 * dt;
          } else if (ptr4 !== null) {
            var diff = ptr4 - catcherX;
            if (Math.abs(diff) > 8) catcherX += Math.sign(diff) * Math.min(Math.abs(diff), 400 * dt);
          }
          catcherX = Math.max(50, Math.min(W - 50, catcherX));

          noteCd -= dt;
          if (noteCd <= 0) {
            noteCd = 0.85;
            notes.push({ x: 80 + Math.random() * (W - 160), y: -20, vy: 175 });
          }

          for (var i = notes.length - 1; i >= 0; i--) {
            notes[i].y += notes[i].vy * dt;
            if (notes[i].y >= 435 && notes[i].y <= 495 && Math.abs(notes[i].x - catcherX) < 52) {
              notes.splice(i, 1);
              caught++;
              host.playSfx('chime');
              if (caught >= 12) {
                host.playSfx('win');
                host.win(levelObj.baseScore + 250, 3, { faith: 8, mercy: 6 });
                return;
              }
              continue;
            }
            if (notes[i].y > H + 20) notes.splice(i, 1);
          }
          host.setHud(gText().notesCaught + ': ' + caught + '/12');
        });

        host.onRender(function (ctx) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#1e3a8a');
          sky.addColorStop(1, '#f59e0b');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = '#0891b2';
          ctx.fillRect(0, 420, W, 120);

          ctx.font = '30px sans-serif';
          ctx.textAlign = 'center';
          notes.forEach(function (n) { ctx.fillText('🎵', n.x, n.y); });

          ctx.fillStyle = '#fde68a';
          ctx.fillRect(catcherX - 48, 455, 96, 16);
          ctx.font = '30px sans-serif';
          ctx.fillText('🥁', catcherX, 450);
        });
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.GAMES.redsea;
  }
})(typeof window !== 'undefined' ? window : globalThis);
