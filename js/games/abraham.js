(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.GAMES = root.COG.GAMES || {};

  function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  root.COG.GAMES.abraham = {
    start: function (host, levelObj) {
      var sub = levelObj.subLevel;
      var W = host.WIDTH;
      var H = host.HEIGHT;
      var gText = function () { return host.pack().games.abraham; };

      if (sub === 3) {
        // 3-3: Night Sky Constellation Puzzle (Connect stars 1..9)
        var stars = [
          { n: 1, x: 140, y: 380 },
          { n: 2, x: 240, y: 260 },
          { n: 3, x: 350, y: 170 },
          { n: 4, x: 470, y: 230 },
          { n: 5, x: 430, y: 370 },
          { n: 6, x: 590, y: 320 },
          { n: 7, x: 690, y: 190 },
          { n: 8, x: 810, y: 250 },
          { n: 9, x: 750, y: 400 }
        ];
        var nextIdx = 0;
        var mistakes = 0;
        var elapsed = 0;
        var bgStars = [];
        for (var b = 0; b < 50; b++) {
          bgStars.push({ x: Math.random() * W, y: Math.random() * (H - 80), r: 1 + Math.random() * 1.8 });
        }

        function pickStar(idx) {
          if (idx === nextIdx) {
            nextIdx++;
            host.playSfx('chime');
            if (nextIdx >= stars.length) {
              host.playSfx('win');
              host.win(levelObj.baseScore + Math.max(0, 200 - mistakes * 40), mistakes <= 1 ? 3 : 2, { faith: 6, wisdom: 5 });
            }
          } else {
            mistakes++;
            host.playSfx('hit');
          }
        }

        host.onCanvasPointer(function (x, y) {
          for (var i = 0; i < stars.length; i++) {
            if (dist(x, y, stars[i].x, stars[i].y) < 30) {
              pickStar(i);
              return;
            }
          }
        });

        host.onItemUse(function (itemId) {
          if (itemId === 'star_compass') {
            pickStar(nextIdx);
            return true;
          }
          return false;
        });

        host.onUpdate(function (dt) {
          elapsed += dt;
          if (host.consumeAction()) {
            pickStar(nextIdx);
          }
          host.setHud(gText().nextStar + ': ' + Math.min(9, nextIdx + 1) + ' / 9');
        });

        host.onRender(function (ctx) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, '#020617');
          sky.addColorStop(1, '#172554');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);

          // Twinkle field
          bgStars.forEach(function (s, idx) {
            ctx.fillStyle = 'rgba(255,255,255,' + (0.35 + 0.45 * Math.sin(elapsed * 2 + idx)) + ')';
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
          });

          // Connected golden lines
          if (nextIdx > 1) {
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(stars[0].x, stars[0].y);
            for (var c = 1; c < nextIdx; c++) {
              ctx.lineTo(stars[c].x, stars[c].y);
            }
            ctx.stroke();
          }

          // Numbered Covenant Stars
          stars.forEach(function (st, idx) {
            var done = idx < nextIdx;
            var isTarget = idx === nextIdx;
            ctx.fillStyle = done ? '#fde047' : (isTarget ? '#38bdf8' : '#334155');
            ctx.beginPath();
            ctx.arc(st.x, st.y, isTarget ? 21 : 17, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fffbeb';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = done || isTarget ? '#0f172a' : '#f8fafc';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(String(st.n), st.x, st.y + 5);
          });

          // Silhouette ridge
          ctx.fillStyle = '#090d16';
          ctx.beginPath();
          ctx.moveTo(0, H);
          ctx.lineTo(0, 455);
          ctx.quadraticCurveTo(300, 420, 560, 460);
          ctx.quadraticCurveTo(790, 430, W, 450);
          ctx.lineTo(W, H);
          ctx.closePath();
          ctx.fill();
        });
      } else {
        // 3-1, 3-2, 3-4: Narrative Strategy RPG
        var faith = 55;
        var provisions = 55;
        var peace = 55;
        var bonus = 0;
        var step = 0;

        host.onRender(function (ctx) {
          var bg = ctx.createLinearGradient(0, 0, 0, H);
          bg.addColorStop(0, sub === 4 ? '#451a03' : '#1e1b4b');
          bg.addColorStop(1, '#78350f');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, W, H);
        });

        host.onItemUse(function (itemId) {
          if (itemId === 'star_compass' || itemId === 'word_of_light') {
            faith = Math.min(100, faith + 15);
            peace = Math.min(100, peace + 15);
            renderRpg();
            host.playSfx('chime');
            return true;
          }
          if (itemId === 'tree_of_life_leaf') {
            provisions = Math.min(100, provisions + 20);
            renderRpg();
            host.playSfx('chime');
            return true;
          }
          return false;
        });

        function renderRpg() {
          var gt = gText();
          var scenarios = gt.scenarios[levelObj.id] || [];
          host.setHud(gt.gaugeFaith + ': ' + faith + ' · ' + gt.gaugeProvisions + ': ' + provisions + ' · ' + gt.gaugePeace + ': ' + peace);

          if (faith <= 0 || provisions <= 0 || peace <= 0) {
            host.hideOverlay();
            host.playSfx('fail');
            host.fail();
            return;
          }
          if (step >= scenarios.length) {
            host.hideOverlay();
            host.playSfx('win');
            var totalAvg = (faith + provisions + peace) / 3;
            host.win(levelObj.baseScore + bonus, totalAvg >= 60 ? 3 : 2, {
              faith: Math.round(faith / 12),
              wisdom: 4,
              mercy: Math.round(peace / 15)
            });
            return;
          }

          var sc = scenarios[step];
          var html = '<div class="ov-panel">' +
            '<div class="ov-gauges">' +
            '<div class="ov-gauge"><span>🕊️ ' + gt.gaugeFaith + ': ' + faith + '</span><div class="ov-bar"><div class="ov-bar-fill" style="width:' + Math.min(100, faith) + '%"></div></div></div>' +
            '<div class="ov-gauge"><span>🌾 ' + gt.gaugeProvisions + ': ' + provisions + '</span><div class="ov-bar"><div class="ov-bar-fill" style="width:' + Math.min(100, provisions) + '%"></div></div></div>' +
            '<div class="ov-gauge"><span>🤝 ' + gt.gaugePeace + ': ' + peace + '</span><div class="ov-bar"><div class="ov-bar-fill" style="width:' + Math.min(100, peace) + '%"></div></div></div>' +
            '</div>' +
            '<h3>' + host.t('levels.' + levelObj.id + '.title') + ' (' + (step + 1) + '/' + scenarios.length + ')</h3>' +
            '<p style="font-size:1rem;color:#f8fafc;">' + sc.prompt + '</p>' +
            '<div class="ov-choices">';

          sc.options.forEach(function (opt, idx) {
            html += '<button type="button" class="ov-choice-btn" data-opt="' + idx + '">' + opt.text + '</button>';
          });
          html += '</div></div>';

          var ov = host.showOverlay(html);
          var btns = ov.querySelectorAll('.ov-choice-btn');
          for (var b = 0; b < btns.length; b++) {
            btns[b].addEventListener('click', function () {
              var chosen = sc.options[Number(this.getAttribute('data-opt'))];
              faith = Math.min(100, faith + (chosen.faith || 0));
              provisions = Math.min(100, provisions + (chosen.provisions || 0));
              peace = Math.min(100, peace + (chosen.peace || 0));
              bonus += Number(chosen.score || 0);
              step++;
              host.playSfx('choice');
              renderRpg();
            });
          }
        }
        renderRpg();
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.GAMES.abraham;
  }
})(typeof window !== 'undefined' ? window : globalThis);
