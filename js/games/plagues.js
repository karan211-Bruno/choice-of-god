(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.GAMES = root.COG.GAMES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  root.COG.GAMES.plagues = {
    start: function (host, levelObj) {
      var sub = levelObj.subLevel;
      var W = host.WIDTH;
      var H = host.HEIGHT;
      var gText = function () { return host.pack().games.plagues; };

      if (sub === 1) {
        // 4-1: Burning Bush 3-Sign Sequence Puzzle
        var step = 0;
        var mistakes = 0;
        var expected = ['staff', 'hand', 'nile'];
        var phase = 0;

        host.onUpdate(function (dt) { phase += dt; });
        host.onRender(function (ctx) {
          ctx.fillStyle = '#1c0f0a';
          ctx.fillRect(0, 0, W, H);
          var r = 80 + Math.sin(phase * 5) * 12;
          var grad = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, r * 2);
          grad.addColorStop(0, 'rgba(251, 146, 60, 0.55)');
          grad.addColorStop(1, 'rgba(251, 146, 60, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);
        });

        function renderBush() {
          var gt = gText();
          host.setHud(step + ' / 3');
          // Scramble display order slightly so player reads & orders them (or show clear 3 choices)
          var signs = [gt.signs[1], gt.signs[2], gt.signs[0]];
          var html = '<div class="ov-panel"><h3>🔥 ' + gt.bushTitle + '</h3>' +
            '<p>' + gt.bushPrompt + ' (' + step + '/3)</p>' +
            '<div class="ov-choices">';
          signs.forEach(function (s) {
            var done = expected.indexOf(s.id) < step;
            html += '<button type="button" class="ov-choice-btn" data-sign="' + s.id + '"' + (done ? ' disabled' : '') + '>' +
              (done ? '✅ ' : '✨ ') + s.label + '</button>';
          });
          html += '</div></div>';
          var ov = host.showOverlay(html);
          var btns = ov.querySelectorAll('[data-sign]');
          for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function () {
              var id = this.getAttribute('data-sign');
              if (id === expected[step]) {
                step++;
                host.playSfx('chime');
                if (step >= 3) {
                  host.hideOverlay();
                  host.playSfx('win');
                  host.win(levelObj.baseScore + Math.max(0, 150 - mistakes * 40), mistakes === 0 ? 3 : 2, { faith: 5 });
                  return;
                }
              } else {
                mistakes++;
                step = 0;
                host.playSfx('hit');
              }
              renderBush();
            });
          }
        }
        renderBush();
      } else if (sub === 2 || sub === 3) {
        // 4-2 & 4-3: Turn-based Plague Cards Strategy vs Pharaoh
        var pharaoh = sub === 2 ? 100 : 120;
        var pharaohMax = pharaoh;
        var goshen = 85;
        var turn = 1;
        var wardActive = false;

        host.onRender(function (ctx) {
          var bg = ctx.createLinearGradient(0, 0, 0, H);
          bg.addColorStop(0, sub === 3 ? '#090d16' : '#3b0712');
          bg.addColorStop(1, '#1e1b4b');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, W, H);
        });

        host.onItemUse(function (itemId) {
          if (itemId === 'staff_of_moses') {
            pharaoh = Math.max(0, pharaoh - 24);
            host.playSfx('light');
            renderDuel();
            return true;
          }
          if (itemId === 'blood_of_lamb' || itemId === 'garment_of_skin') {
            wardActive = true;
            goshen = Math.min(100, goshen + 20);
            host.playSfx('chime');
            renderDuel();
            return true;
          }
          return false;
        });

        function renderDuel() {
          var gt = gText();
          host.setHud(gt.turn + ' ' + turn + ' · ' + gt.pharaohStubborn + ': ' + pharaoh + ' · ' + gt.goshenFaith + ': ' + goshen);
          if (pharaoh <= 0) {
            host.hideOverlay();
            host.playSfx('win');
            host.win(levelObj.baseScore + goshen * 3, goshen >= 60 ? 3 : 2, { faith: 6, wisdom: 4 });
            return;
          }
          if (goshen <= 0) {
            host.hideOverlay();
            host.playSfx('fail');
            host.fail();
            return;
          }

          var html = '<div class="ov-panel">' +
            '<div class="ov-gauges">' +
            '<div class="ov-gauge"><span>👑 ' + gt.pharaohStubborn + ': ' + pharaoh + '/' + pharaohMax + '</span><div class="ov-bar"><div class="ov-bar-fill" style="width:' + Math.round((pharaoh / pharaohMax) * 100) + '%;background:#ef4444"></div></div></div>' +
            '<div class="ov-gauge"><span>🏕️ ' + gt.goshenFaith + ': ' + goshen + '/100' + (wardActive ? ' 🛡️' : '') + '</span><div class="ov-bar"><div class="ov-bar-fill" style="width:' + Math.min(100, goshen) + '%"></div></div></div>' +
            '</div>' +
            '<h3>' + host.t('levels.' + levelObj.id + '.title') + ' (' + gt.turn + ' ' + turn + ')</h3>' +
            '<div class="ov-cards-grid">';

          gt.cards.forEach(function (card) {
            if (sub === 2 && card.id === 'darkness') return;
            html += '<button type="button" class="ov-card-btn" data-card="' + card.id + '">' +
              '<strong>' + card.name + '</strong>' +
              '<small style="color:#cbd5e1">' + card.desc + '</small></button>';
          });
          html += '</div></div>';

          var ov = host.showOverlay(html);
          var btns = ov.querySelectorAll('[data-card]');
          for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function () {
              var cid = this.getAttribute('data-card');
              var card = gt.cards.find(function (c) { return c.id === cid; });
              if (!card) return;
              pharaoh = Math.max(0, pharaoh - card.dmg);
              goshen = Math.min(100, goshen + card.shield);
              if (pharaoh > 0) {
                var enemyStrike = (sub === 3 ? 16 : 11) + (turn % 2) * 4;
                if (card.shield > 0 || wardActive) {
                  enemyStrike = Math.max(0, Math.round(enemyStrike * 0.35));
                  wardActive = false;
                }
                goshen = Math.max(0, goshen - enemyStrike);
              }
              turn++;
              host.playSfx(card.dmg > 0 ? 'light' : 'chime');
              renderDuel();
            });
          }
        }
        renderDuel();
      } else {
        // 4-4: Passover Night Doorpost Sealing (6 houses before midnight)
        var timeLeft = 22;
        var houses = [
          { x: 170, y: 210, sealed: false },
          { x: 480, y: 185, sealed: false },
          { x: 785, y: 210, sealed: false },
          { x: 205, y: 405, sealed: false },
          { x: 480, y: 415, sealed: false },
          { x: 755, y: 405, sealed: false }
        ];
        var sealedCount = 0;

        host.onItemUse(function (itemId) {
          if (itemId === 'olive_branch') { timeLeft += 6; host.playSfx('chime'); return true; }
          if (itemId === 'blood_of_lamb') {
            houses.forEach(function (h) {
              if (!h.sealed) { h.sealed = true; sealedCount++; }
            });
            host.playSfx('win');
            host.win(levelObj.baseScore + Math.round(timeLeft * 20), 3, { faith: 8, mercy: 5 });
            return true;
          }
          return false;
        });

        host.onCanvasPointer(function (x, y) {
          for (var i = 0; i < houses.length; i++) {
            var h = houses[i];
            if (!h.sealed && dist(x, y, h.x, h.y) < 58) {
              h.sealed = true;
              sealedCount++;
              host.playSfx('chime');
              if (sealedCount >= houses.length) {
                host.playSfx('win');
                host.win(levelObj.baseScore + Math.round(timeLeft * 25), timeLeft >= 8 ? 3 : 2, { faith: 8, mercy: 5 });
              }
              return;
            }
          }
        });

        host.onUpdate(function (dt) {
          timeLeft -= dt;
          if (host.consumeAction()) {
            // Space also seals nearest unsealed house
            for (var i = 0; i < houses.length; i++) {
              if (!houses[i].sealed) {
                houses[i].sealed = true;
                sealedCount++;
                host.playSfx('chime');
                if (sealedCount >= houses.length) {
                  host.playSfx('win');
                  host.win(levelObj.baseScore + Math.round(timeLeft * 25), timeLeft >= 8 ? 3 : 2, { faith: 8, mercy: 5 });
                }
                break;
              }
            }
          }
          var gt = gText();
          host.setHud(gt.passoverHouses + ': ' + sealedCount + '/6 · ' + gt.passoverTimer + ': ' + Math.max(0, Math.ceil(timeLeft)) + 's');
          if (timeLeft <= 0) {
            host.fail();
          }
        });

        host.onRender(function (ctx) {
          ctx.fillStyle = '#070b1a';
          ctx.fillRect(0, 0, W, H);
          // Moon & Passover shadow sweep
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath(); ctx.arc(850, 75, 28, 0, Math.PI * 2); ctx.fill();

          houses.forEach(function (h) {
            // Cottage
            ctx.fillStyle = h.sealed ? '#451a03' : '#1e293b';
            ctx.fillRect(h.x - 48, h.y - 38, 96, 76);
            ctx.strokeStyle = h.sealed ? '#fbbf24' : '#64748b';
            ctx.lineWidth = 3;
            ctx.strokeRect(h.x - 48, h.y - 38, 96, 76);
            // Doorframe
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(h.x - 16, h.y - 10, 32, 48);
            ctx.strokeStyle = h.sealed ? '#ef4444' : '#fde047';
            ctx.lineWidth = h.sealed ? 5 : 2;
            ctx.strokeRect(h.x - 16, h.y - 10, 32, 48);
            if (h.sealed) {
              ctx.font = '22px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('🩸', h.x, h.y - 20);
            }
          });
        });
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.GAMES.plagues;
  }
})(typeof window !== 'undefined' ? window : globalThis);
