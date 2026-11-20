(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.GAMES = root.COG.GAMES || {};

  root.COG.GAMES.sinai = {
    start: function (host, levelObj) {
      var sub = levelObj.subLevel;
      var W = host.WIDTH;
      var H = host.HEIGHT;
      var gText = function () { return host.pack().games.sinai; };

      if (sub === 1) {
        // 6-1: Daily Manna Collector (exact 7 white manna, avoid red spoiled flakes)
        var basketX = 480;
        var ptr = null;
        var collected = 0;
        var hp = 3;
        var flakes = [];
        var spawnCd = 0.45;

        host.onCanvasPointer(function (x) { ptr = x; });
        host.onItemUse(function (itemId) {
          if (itemId === 'tree_of_life_leaf') { hp = Math.min(4, hp + 1); host.playSfx('chime'); return true; }
          return false;
        });

        host.onUpdate(function (dt, keys) {
          var mv = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
          if (mv !== 0) { ptr = null; basketX += mv * 360 * dt; }
          else if (ptr !== null) {
            var d = ptr - basketX;
            if (Math.abs(d) > 8) basketX += Math.sign(d) * Math.min(Math.abs(d), 400 * dt);
          }
          basketX = Math.max(55, Math.min(W - 55, basketX));

          spawnCd -= dt;
          if (spawnCd <= 0) {
            spawnCd = 0.65;
            flakes.push({
              x: 70 + Math.random() * (W - 140),
              y: -15,
              vy: 145 + Math.random() * 55,
              spoiled: Math.random() < 0.34
            });
          }

          for (var i = flakes.length - 1; i >= 0; i--) {
            flakes[i].y += flakes[i].vy * dt;
            if (flakes[i].y >= 440 && flakes[i].y <= 495 && Math.abs(flakes[i].x - basketX) < 52) {
              var spoiled = flakes[i].spoiled;
              flakes.splice(i, 1);
              if (spoiled) {
                hp--;
                host.playSfx('hit');
                if (hp <= 0) { host.fail(); return; }
              } else {
                collected++;
                host.playSfx('chime');
                if (collected >= 7) {
                  host.playSfx('win');
                  host.win(levelObj.baseScore + hp * 80, hp >= 3 ? 3 : 2, { faith: 5 });
                  return;
                }
              }
              continue;
            }
            if (flakes[i].y > H + 20) flakes.splice(i, 1);
          }
          host.setHud(gText().mannaCount + ': ' + collected + '/7 · ❤️'.repeat(hp));
        });

        host.onRender(function (ctx) {
          ctx.fillStyle = '#451a03';
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(0, 445, W, 95);

          flakes.forEach(function (fl) {
            ctx.fillStyle = fl.spoiled ? '#ef4444' : '#fef9c3';
            ctx.beginPath(); ctx.arc(fl.x, fl.y, 13, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = fl.spoiled ? '#7f1d1d' : '#fde047';
            ctx.lineWidth = 2;
            ctx.stroke();
          });

          ctx.fillStyle = '#d97706';
          ctx.fillRect(basketX - 48, 458, 96, 20);
          ctx.font = '26px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🧺', basketX, 452);
        });
      } else if (sub === 2) {
        // 6-2: Horeb Rock Water Channel 4x4 Rotation Puzzle
        // Directions bitmask: N=1, E=2, S=4, W=8
        // Fixed winning path: (0,0)E -> (0,1)SW -> (1,1)NS -> (2,1)NE -> (2,2)ES -> (3,2)NE -> (3,3)W
        var grid = [
          [{ mask: 2, rot: 1 }, { mask: 12, rot: 2 }, { mask: 10, rot: 0 }, { mask: 6, rot: 1 }],
          [{ mask: 5, rot: 0 }, { mask: 5, rot: 1 }, { mask: 9, rot: 2 }, { mask: 5, rot: 0 }],
          [{ mask: 3, rot: 1 }, { mask: 3, rot: 2 }, { mask: 12, rot: 3 }, { mask: 9, rot: 0 }],
          [{ mask: 10, rot: 0 }, { mask: 10, rot: 1 }, { mask: 3, rot: 2 }, { mask: 8, rot: 1 }]
        ];

        function rotateMask(mask, r) {
          var m = mask;
          for (var k = 0; k < (r % 4); k++) {
            var next = 0;
            if (m & 1) next |= 2;
            if (m & 2) next |= 4;
            if (m & 4) next |= 8;
            if (m & 8) next |= 1;
            m = next;
          }
          return m;
        }

        function computeWet() {
          var wet = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false]];
          var queue = [[0, 0]];
          wet[0][0] = true;
          while (queue.length) {
            var cur = queue.shift();
            var r = cur[0], c = cur[1];
            var m = rotateMask(grid[r][c].mask, grid[r][c].rot);
            var dirs = [
              { bit: 1, opp: 4, dr: -1, dc: 0 },
              { bit: 2, opp: 8, dr: 0, dc: 1 },
              { bit: 4, opp: 1, dr: 1, dc: 0 },
              { bit: 8, opp: 2, dr: 0, dc: -1 }
            ];
            for (var d = 0; d < dirs.length; d++) {
              if (m & dirs[d].bit) {
                var nr = r + dirs[d].dr;
                var nc = c + dirs[d].dc;
                if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4 && !wet[nr][nc]) {
                  var nm = rotateMask(grid[nr][nc].mask, grid[nr][nc].rot);
                  if (nm & dirs[d].opp) {
                    wet[nr][nc] = true;
                    queue.push([nr, nc]);
                  }
                }
              }
            }
          }
          return wet;
        }

        host.onRender(function (ctx) {
          ctx.fillStyle = '#0c4a6e';
          ctx.fillRect(0, 0, W, H);
        });

        function pipeSvg(m, isWet) {
          var stroke = isWet ? '#38bdf8' : '#e6b95c';
          var paths = '<circle cx="24" cy="24" r="5" fill="' + stroke + '"/>';
          if (m & 1) paths += '<line x1="24" y1="24" x2="24" y2="0" stroke="' + stroke + '" stroke-width="8" stroke-linecap="round"/>';
          if (m & 2) paths += '<line x1="24" y1="24" x2="48" y2="24" stroke="' + stroke + '" stroke-width="8" stroke-linecap="round"/>';
          if (m & 4) paths += '<line x1="24" y1="24" x2="24" y2="48" stroke="' + stroke + '" stroke-width="8" stroke-linecap="round"/>';
          if (m & 8) paths += '<line x1="24" y1="24" x2="0" y2="24" stroke="' + stroke + '" stroke-width="8" stroke-linecap="round"/>';
          return '<svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">' + paths + '</svg>';
        }

        function renderPipes() {
          var gt = gText();
          var wet = computeWet();
          var reached = wet[3][3];
          host.setHud(reached ? '💧 100%' : '🪨 → 🏕️');

          var html = '<div class="ov-panel" style="text-align:center"><h3>🪨 ' + host.t('levels.sinai-2.title') + '</h3>' +
            '<p>' + gt.pipeHint + '</p>' +
            '<div class="pipe-grid">';
          for (var r = 0; r < 4; r++) {
            for (var c = 0; c < 4; c++) {
              var m = rotateMask(grid[r][c].mask, grid[r][c].rot);
              var label = (r === 0 && c === 0) ? '🪨' : ((r === 3 && c === 3) ? '🏕️' : '');
              html += '<button type="button" class="pipe-tile' + (wet[r][c] ? ' is-wet' : '') + '" data-r="' + r + '" data-c="' + c + '" title="' + label + '">' +
                pipeSvg(m, wet[r][c]) + '</button>';
            }
          }
          html += '</div><button type="button" id="btn-pipe-confirm" class="btn-primary-gold">' + gt.pipeBtn + '</button></div>';

          var ov = host.showOverlay(html);
          var tiles = ov.querySelectorAll('.pipe-tile');
          for (var i = 0; i < tiles.length; i++) {
            tiles[i].addEventListener('click', function () {
              var r = Number(this.getAttribute('data-r'));
              var c = Number(this.getAttribute('data-c'));
              grid[r][c].rot = (grid[r][c].rot + 1) % 4;
              host.playSfx('click');
              renderPipes();
            });
          }
          var confirmBtn = ov.querySelector('#btn-pipe-confirm');
          if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
              var check = computeWet();
              if (check[3][3]) {
                host.hideOverlay();
                host.playSfx('win');
                host.win(levelObj.baseScore + 200, 3, { wisdom: 6, mercy: 4 });
              } else {
                host.playSfx('hit');
              }
            });
          }
        }
        renderPipes();
      } else if (sub === 3) {
        // 6-3: Ten Commandments Matching + Reject Golden Calf Temptation
        var matched = [];
        var selectedLeft = -1;
        var calfActive = false;
        var calfDefeated = false;
        var shuffledRight = [2, 0, 4, 1, 3];

        host.onRender(function (ctx) {
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(0, 0, W, H);
        });

        function renderCmd() {
          var gt = gText();
          host.setHud(matched.length + ' / 5');
          var html = '<div class="ov-panel"><h3>📜 ' + gt.cmdTitle + ' (' + matched.length + '/5)</h3>';
          if (calfActive) {
            html += '<div class="calf-alert"><span>' + gt.calfWarning + '</span>' +
              '<button type="button" id="btn-destroy-calf" class="btn-primary-gold">' + gt.calfDestroy + '</button></div>';
          }
          html += '<div class="match-cols"><div class="match-col">';
          gt.cmdPairs.forEach(function (p, idx) {
            var done = matched.indexOf(idx) !== -1;
            html += '<button type="button" class="' + (selectedLeft === idx ? 'btn-primary-gold' : 'ov-choice-btn') + '" data-left="' + idx + '"' + (done ? ' disabled' : '') + '>' +
              (done ? '✅ ' : '') + p.num + '</button>';
          });
          html += '</div><div class="match-col">';
          shuffledRight.forEach(function (origIdx) {
            var done = matched.indexOf(origIdx) !== -1;
            html += '<button type="button" class="ov-choice-btn" data-right="' + origIdx + '"' + (done ? ' disabled' : '') + '>' +
              (done ? '✅ ' : '') + gt.cmdPairs[origIdx].meaning + '</button>';
          });
          html += '</div></div></div>';

          var ov = host.showOverlay(html);
          var destroyBtn = ov.querySelector('#btn-destroy-calf');
          if (destroyBtn) {
            destroyBtn.addEventListener('click', function () {
              calfActive = false;
              calfDefeated = true;
              host.playSfx('light');
              renderCmd();
            });
          }

          var lBtns = ov.querySelectorAll('[data-left]');
          for (var i = 0; i < lBtns.length; i++) {
            lBtns[i].addEventListener('click', function () {
              selectedLeft = Number(this.getAttribute('data-left'));
              host.playSfx('click');
              renderCmd();
            });
          }
          var rBtns = ov.querySelectorAll('[data-right]');
          for (var j = 0; j < rBtns.length; j++) {
            rBtns[j].addEventListener('click', function () {
              if (selectedLeft === -1) return;
              var rIdx = Number(this.getAttribute('data-right'));
              if (rIdx === selectedLeft) {
                matched.push(selectedLeft);
                selectedLeft = -1;
                host.playSfx('chime');
                if (matched.length === 2 && !calfDefeated) {
                  calfActive = true;
                }
                if (matched.length >= 5 && !calfActive) {
                  host.hideOverlay();
                  host.playSfx('win');
                  host.win(levelObj.baseScore + (calfDefeated ? 250 : 100), 3, { faith: 8, wisdom: 6 });
                  return;
                }
              } else {
                selectedLeft = -1;
                host.playSfx('hit');
              }
              renderCmd();
            });
          }
        }
        renderCmd();
      } else {
        // 6-4: Tabernacle Placement Finale
        var placed = {};
        var selectedPiece = null;

        host.onRender(function (ctx) {
          ctx.fillStyle = '#271705';
          ctx.fillRect(0, 0, W, H);
        });

        function renderTabernacle() {
          var gt = gText();
          var count = Object.keys(placed).length;
          host.setHud(count + ' / 5');

          var html = '<div class="ov-panel"><h3>⛺ ' + host.t('levels.sinai-4.title') + ' (' + count + '/5)</h3>' +
            '<p>' + gt.tabernacleHint + '</p>' +
            '<div class="tabernacle-wrap"><div class="match-col">';

          gt.tabernaclePieces.forEach(function (pc) {
            var isDone = !!placed[pc.id];
            html += '<button type="button" class="' + (selectedPiece === pc.id ? 'btn-primary-gold' : 'ov-choice-btn') + '" data-piece="' + pc.id + '"' + (isDone ? ' disabled' : '') + '>' +
              (isDone ? '✅ ' : '✨ ') + pc.name + '</button>';
          });
          html += '</div><div class="match-col">';
          gt.tabernacleSlots.forEach(function (slotName, sIdx) {
            var occ = gt.tabernaclePieces.find(function (p) { return placed[p.id] && p.correctSlot === sIdx; });
            html += '<button type="button" class="ov-choice-btn" data-slot="' + sIdx + '"' + (occ ? ' disabled' : '') + '>' +
              slotName + (occ ? ' — [' + occ.name + ']' : '') + '</button>';
          });
          html += '</div></div></div>';

          var ov = host.showOverlay(html);
          var pBtns = ov.querySelectorAll('[data-piece]');
          for (var i = 0; i < pBtns.length; i++) {
            pBtns[i].addEventListener('click', function () {
              selectedPiece = this.getAttribute('data-piece');
              host.playSfx('click');
              renderTabernacle();
            });
          }
          var sBtns = ov.querySelectorAll('[data-slot]');
          for (var j = 0; j < sBtns.length; j++) {
            sBtns[j].addEventListener('click', function () {
              if (!selectedPiece) return;
              var slotIdx = Number(this.getAttribute('data-slot'));
              var pc = gt.tabernaclePieces.find(function (p) { return p.id === selectedPiece; });
              if (pc && pc.correctSlot === slotIdx) {
                placed[pc.id] = true;
                selectedPiece = null;
                host.playSfx('chime');
                if (Object.keys(placed).length >= 5) {
                  host.hideOverlay();
                  host.playSfx('win');
                  host.win(levelObj.baseScore + 350, 3, { faith: 10, wisdom: 8, mercy: 8, triggerEnding: true });
                  return;
                }
              } else {
                selectedPiece = null;
                host.playSfx('hit');
              }
              renderTabernacle();
            });
          }
        }
        renderTabernacle();
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.GAMES.sinai;
  }
})(typeof window !== 'undefined' ? window : globalThis);
