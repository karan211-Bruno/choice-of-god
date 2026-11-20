(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.GAMES = root.COG.GAMES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  root.COG.GAMES.ark = {
    start: function (host, levelObj) {
      var sub = levelObj.subLevel;
      var W = host.WIDTH;
      var H = host.HEIGHT;
      var gText = function () { return host.pack().games.ark; };

      if (sub === 1) {
        // 2-1: Gather 8 gopher wood + 6 pitch
        var player = { x: 140, y: 270, r: 18, speed: 250, invuln: 0 };
        var ptr = null;
        var woodCount = 0;
        var pitchCount = 0;
        var hp = 4;
        var items = [];
        var rocks = [];
        for (var i = 0; i < 8; i++) {
          items.push({ kind: 'wood', x: 120 + Math.random() * 760, y: 70 + Math.random() * 400 });
        }
        for (var j = 0; j < 6; j++) {
          items.push({ kind: 'pitch', x: 120 + Math.random() * 760, y: 70 + Math.random() * 400 });
        }
        for (var r = 0; r < 4; r++) {
          rocks.push({
            x: 240 + r * 170,
            y: 100 + (r % 2) * 280,
            vx: (r % 2 === 0 ? 1 : -1) * 90,
            vy: (r % 2 === 0 ? -1 : 1) * 110,
            r: 20
          });
        }

        host.onCanvasPointer(function (x, y) { ptr = { x: x, y: y }; });
        host.onItemUse(function (itemId) {
          if (itemId === 'tree_of_life_leaf') { hp = Math.min(5, hp + 1); host.playSfx('chime'); return true; }
          if (itemId === 'garment_of_skin') { player.invuln = 5; host.playSfx('chime'); return true; }
          return false;
        });

        host.onUpdate(function (dt, keys) {
          if (player.invuln > 0) player.invuln -= dt;
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
          player.x = Math.max(30, Math.min(W - 30, player.x));
          player.y = Math.max(36, Math.min(H - 36, player.y));

          for (var ri = 0; ri < rocks.length; ri++) {
            var rk = rocks[ri];
            rk.x += rk.vx * dt; rk.y += rk.vy * dt;
            if (rk.x < 40 || rk.x > W - 40) rk.vx *= -1;
            if (rk.y < 40 || rk.y > H - 40) rk.vy *= -1;
            if (player.invuln <= 0 && dist(player.x, player.y, rk.x, rk.y) < player.r + rk.r) {
              hp--;
              player.invuln = 1.2;
              host.playSfx('hit');
              if (hp <= 0) { host.fail(); return; }
            }
          }

          for (var ii = items.length - 1; ii >= 0; ii--) {
            if (dist(player.x, player.y, items[ii].x, items[ii].y) < player.r + 16) {
              if (items[ii].kind === 'wood') woodCount++;
              else pitchCount++;
              items.splice(ii, 1);
              host.playSfx('chime');
            }
          }

          var gt = gText();
          host.setHud(gt.wood + ': ' + woodCount + '/8 · ' + gt.pitch + ': ' + pitchCount + '/6 · ❤️'.repeat(hp));
          if (items.length === 0) {
            host.playSfx('win');
            host.win(levelObj.baseScore + hp * 60, hp >= 3 ? 3 : 2, { wisdom: 4 });
          }
        });

        host.onRender(function (ctx) {
          ctx.fillStyle = '#1b263b';
          ctx.fillRect(0, 0, W, H);
          // Ark blueprint frame
          ctx.strokeStyle = 'rgba(230, 185, 92, 0.25)';
          ctx.lineWidth = 4;
          ctx.strokeRect(48, 48, W - 96, H - 96);
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          items.forEach(function (it) {
            ctx.fillText(it.kind === 'wood' ? '🪵' : '🏺', it.x, it.y + 8);
          });
          rocks.forEach(function (rk) {
            ctx.fillStyle = '#475569';
            ctx.beginPath(); ctx.arc(rk.x, rk.y, rk.r, 0, Math.PI * 2); ctx.fill();
            ctx.fillText('🪨', rk.x, rk.y + 8);
          });
          ctx.fillStyle = player.invuln > 0 ? '#67e8f9' : '#fde68a';
          ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();
          ctx.fillText('🔨', player.x, player.y + 8);
        });
      } else if (sub === 2) {
        // 2-2: Two by Two animal pairing overlay
        var icons = ['🦁', '🐑', '🦌', '🕊️', '🐘', '🐂'];
        var names = gText().animals;
        var deck = [];
        for (var k = 0; k < 6; k++) {
          deck.push({ pairId: k, icon: icons[k], matched: false });
          deck.push({ pairId: k, icon: icons[k], matched: false });
        }
        deck.sort(function () { return Math.random() - 0.5; });
        var firstIdx = -1;
        var pairsLeft = 6;
        var mistakes = 0;

        host.onRender(function (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, W, H);
        });

        function renderPairs() {
          var gt = gText();
          host.setHud(gt.pairsLeft + ': ' + pairsLeft);
          var html = '<div class="ov-panel"><h3>🚢 ' + host.t('levels.ark-2.title') + '</h3>' +
            '<p>' + host.t('levels.ark-2.objective') + '</p>' +
            '<div class="pair-grid">';
          deck.forEach(function (card, idx) {
            var cls = 'pair-card' + (card.matched ? ' is-matched' : '') + (idx === firstIdx ? ' is-picked' : '');
            html += '<button type="button" class="' + cls + '" data-idx="' + idx + '"' + (card.matched ? ' disabled' : '') + '>' +
              '<span style="font-size:1.7rem">' + card.icon + '</span>' +
              '<span>' + names[card.pairId] + '</span></button>';
          });
          html += '</div></div>';
          var ov = host.showOverlay(html);
          var btns = ov.querySelectorAll('.pair-card');
          for (var b = 0; b < btns.length; b++) {
            btns[b].addEventListener('click', function () {
              var idx = Number(this.getAttribute('data-idx'));
              if (deck[idx].matched || idx === firstIdx) return;
              if (firstIdx === -1) {
                firstIdx = idx;
                host.playSfx('click');
                renderPairs();
              } else {
                if (deck[firstIdx].pairId === deck[idx].pairId) {
                  deck[firstIdx].matched = true;
                  deck[idx].matched = true;
                  pairsLeft--;
                  firstIdx = -1;
                  host.playSfx('chime');
                  if (pairsLeft <= 0) {
                    host.hideOverlay();
                    host.playSfx('win');
                    host.win(levelObj.baseScore + Math.max(0, 150 - mistakes * 25), mistakes <= 2 ? 3 : 2, { mercy: 4 });
                    return;
                  }
                } else {
                  mistakes++;
                  firstIdx = -1;
                  host.playSfx('hit');
                }
                renderPairs();
              }
            });
          }
        }
        renderPairs();
      } else if (sub === 3) {
        // 2-3: 40-day Storm Balance + Click Red Leaks
        var timeLeft = 30;
        var integrity = 100;
        var tilt = 0;
        var waveForce = 16;
        var leaks = [];
        var leakTimer = 1.6;
        var rainPhase = 0;
        var calmTimer = 0;

        host.onItemUse(function (itemId) {
          if (itemId === 'olive_branch') { calmTimer = 7; host.playSfx('chime'); return true; }
          if (itemId === 'tree_of_life_leaf') { integrity = Math.min(100, integrity + 30); host.playSfx('chime'); return true; }
          return false;
        });

        host.onCanvasPointer(function (x, y) {
          for (var li = leaks.length - 1; li >= 0; li--) {
            if (dist(x, y, leaks[li].x, leaks[li].y) < 34) {
              leaks.splice(li, 1);
              host.playSfx('chime');
              return;
            }
          }
          // Tapping left/right half also steers gently
          tilt += x < W / 2 ? -8 : 8;
        });

        host.onUpdate(function (dt, keys) {
          timeLeft -= dt;
          rainPhase += dt;
          if (calmTimer > 0) calmTimer -= dt;
          var windMult = calmTimer > 0 ? 0.45 : 1.0;

          waveForce = Math.sin(rainPhase * 1.4) * 24 * windMult;
          tilt += waveForce * dt;
          if (keys.left) tilt -= 44 * dt;
          if (keys.right) tilt += 44 * dt;
          tilt = Math.max(-45, Math.min(45, tilt));

          if (Math.abs(tilt) > 28) {
            integrity -= 9 * dt;
          }

          leakTimer -= dt;
          if (leakTimer <= 0 && leaks.length < 4) {
            leakTimer = calmTimer > 0 ? 3.2 : 2.1;
            leaks.push({
              x: 280 + Math.random() * 400,
              y: 285 + Math.random() * 75
            });
          }
          integrity -= leaks.length * 4.2 * dt;

          var gt = gText();
          host.setHud(gt.hullIntegrity + ': ' + Math.max(0, Math.round(integrity)) + '% · ' + gt.tilt + ': ' + Math.round(tilt) + '° · ' + Math.ceil(timeLeft) + 's');

          if (integrity <= 0) {
            host.fail();
            return;
          }
          if (timeLeft <= 0) {
            host.playSfx('win');
            host.win(levelObj.baseScore + Math.round(integrity * 3), integrity >= 70 ? 3 : 2, { faith: 5 });
          }
        });

        host.onRender(function (ctx) {
          var gt = gText();
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, W, H);
          // Rain lines
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
          ctx.lineWidth = 1.5;
          for (var r = 0; r < 35; r++) {
            var rx = (r * 37 + rainPhase * 180) % W;
            var ry = (r * 53 + rainPhase * 340) % H;
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 10, ry + 24); ctx.stroke();
          }

          // Tilted Ark
          ctx.save();
          ctx.translate(W / 2, 320);
          ctx.rotate((tilt * Math.PI) / 180);
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.moveTo(-240, -30);
          ctx.lineTo(240, -30);
          ctx.lineTo(190, 65);
          ctx.lineTo(-190, 65);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = '#92400e';
          ctx.fillRect(-160, -85, 320, 55);
          ctx.restore();

          // Sea waves
          ctx.fillStyle = 'rgba(30, 64, 175, 0.72)';
          ctx.fillRect(0, 365, W, H - 365);

          // Red leaks
          leaks.forEach(function (lk) {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(lk.x, lk.y, 18, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('💧', lk.x, lk.y + 5);
          });

          // Tilt gauge bar
          ctx.fillStyle = 'rgba(255,255,255,0.16)';
          ctx.fillRect(330, 30, 300, 14);
          ctx.fillStyle = Math.abs(tilt) > 25 ? '#ef4444' : '#34d399';
          var knobX = 480 + (tilt / 45) * 140;
          ctx.beginPath(); ctx.arc(knobX, 37, 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(gt.patchPrompt, W / 2, 72);
        });
      } else {
        // 2-4: Dove flight + 5 Olive Leaves + Return to Ark
        var dove = { x: 140, y: 390, r: 16, speed: 245, invuln: 0 };
        var ptr4 = null;
        var leavesCollected = 0;
        var hp4 = 3;
        var leaves = [
          { x: 350, y: 120 }, { x: 520, y: 240 }, { x: 690, y: 110 },
          { x: 780, y: 310 }, { x: 620, y: 420 }
        ];
        var clouds = [
          { x: 380, y: 220, vx: 75, vy: 55 },
          { x: 640, y: 260, vx: -85, vy: 65 },
          { x: 480, y: 390, vx: 95, vy: -50 }
        ];

        host.onCanvasPointer(function (x, y) { ptr4 = { x: x, y: y }; });
        host.onItemUse(function (itemId) {
          if (itemId === 'tree_of_life_leaf') { hp4 = Math.min(4, hp4 + 1); host.playSfx('chime'); return true; }
          if (itemId === 'garment_of_skin') { dove.invuln = 5; host.playSfx('chime'); return true; }
          return false;
        });

        host.onUpdate(function (dt, keys) {
          if (dove.invuln > 0) dove.invuln -= dt;
          var dx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
          var dy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
          if (dx || dy) {
            ptr4 = null;
            var l = Math.sqrt(dx * dx + dy * dy);
            dove.x += (dx / l) * dove.speed * dt;
            dove.y += (dy / l) * dove.speed * dt;
          } else if (ptr4) {
            var pdx = ptr4.x - dove.x;
            var pdy = ptr4.y - dove.y;
            var pd = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pd > 8) {
              dove.x += (pdx / pd) * dove.speed * dt;
              dove.y += (pdy / pd) * dove.speed * dt;
            } else ptr4 = null;
          }
          dove.x = Math.max(28, Math.min(W - 28, dove.x));
          dove.y = Math.max(36, Math.min(H - 36, dove.y));

          for (var c = 0; c < clouds.length; c++) {
            var cl = clouds[c];
            cl.x += cl.vx * dt; cl.y += cl.vy * dt;
            if (cl.x < 160 || cl.x > W - 50) cl.vx *= -1;
            if (cl.y < 50 || cl.y > H - 50) cl.vy *= -1;
            if (dove.invuln <= 0 && dist(dove.x, dove.y, cl.x, cl.y) < 34) {
              hp4--;
              dove.invuln = 1.4;
              host.playSfx('hit');
              if (hp4 <= 0) { host.fail(); return; }
            }
          }

          for (var li = leaves.length - 1; li >= 0; li--) {
            if (dist(dove.x, dove.y, leaves[li].x, leaves[li].y) < 28) {
              leaves.splice(li, 1);
              leavesCollected++;
              host.playSfx('chime');
            }
          }

          var gt = gText();
          host.setHud(gt.leaves + ': ' + leavesCollected + '/5 · ' + (leaves.length === 0 ? gt.returnToArk : '') + ' ❤️'.repeat(hp4));
          if (leaves.length === 0 && dist(dove.x, dove.y, 130, 410) < 52) {
            host.playSfx('win');
            host.win(levelObj.baseScore + hp4 * 80, hp4 >= 3 ? 3 : 2, { faith: 5, mercy: 4 });
          }
        });

        host.onRender(function (ctx) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#1e3a8a');
          sky.addColorStop(1, '#38bdf8');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);

          // Rainbow Covenant arc (fades in as leaves collected)
          var rainbowCols = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#6366f1', '#a855f7'];
          ctx.globalAlpha = 0.22 + (leavesCollected / 5) * 0.6;
          for (var rb = 0; rb < rainbowCols.length; rb++) {
            ctx.strokeStyle = rainbowCols[rb];
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(W / 2, H + 40, 430 - rb * 7, Math.PI, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;

          // Ark home icon
          ctx.fillStyle = leaves.length === 0 ? 'rgba(253, 224, 71, 0.35)' : 'rgba(255,255,255,0.12)';
          ctx.beginPath(); ctx.arc(130, 410, 46, 0, Math.PI * 2); ctx.fill();
          ctx.font = '36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🚢', 130, 422);

          // Leaves & storm clouds
          ctx.font = '26px sans-serif';
          leaves.forEach(function (lf) { ctx.fillText('🌿', lf.x, lf.y + 8); });
          clouds.forEach(function (cl) {
            ctx.fillStyle = 'rgba(30, 41, 59, 0.78)';
            ctx.beginPath(); ctx.arc(cl.x, cl.y, 26, 0, Math.PI * 2); ctx.fill();
            ctx.fillText('⛈️', cl.x, cl.y + 9);
          });

          ctx.font = '28px sans-serif';
          ctx.fillText('🕊️', dove.x, dove.y + 10);
        });
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.GAMES.ark;
  }
})(typeof window !== 'undefined' ? window : globalThis);
