(function (root) {
  'use strict';

  function el(id) {
    return document.getElementById(id);
  }

  var activeStageRef = null; // { chapter, level }
  var usedItemsInRun = {};
  var touchEnabled = false;

  function findChapter(chapterId) {
    var list = root.COG.DATA.CHAPTERS || [];
    return list.find(function (c) { return c.id === chapterId; }) || list[0];
  }

  function findNextTarget(chapter, level) {
    var chapters = root.COG.DATA.CHAPTERS || [];
    var idx = level.subLevel - 1;
    if (idx + 1 < chapter.levels.length) {
      return { chapter: chapter, level: chapter.levels[idx + 1] };
    }
    var chIdx = chapters.findIndex(function (c) { return c.id === chapter.id; });
    if (chIdx !== -1 && chIdx + 1 < chapters.length) {
      var nextCh = chapters[chIdx + 1];
      return { chapter: nextCh, level: nextCh.levels[0] };
    }
    return null;
  }

  function renderHud() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var st = root.COG.State.get();
    el('hud-score').textContent = root.COG.State.getTotalScore().toLocaleString();
    el('hud-level').textContent = String(root.COG.State.getPlayerLevel());
    el('hud-faith').textContent = String(st.stats.faith);
    el('hud-wisdom').textContent = String(st.stats.wisdom);
    el('hud-mercy').textContent = String(st.stats.mercy);

    var routeKey = 'ui.routeUndecided';
    if (st.edenRoute === 'preserved') routeKey = 'ui.routePreserved';
    else if (st.edenRoute === 'fallen') routeKey = 'ui.routeFallen';
    el('hud-route').textContent = t(routeKey);

    var guide = root.COG.State.getActiveGuide();
    if (guide) {
      el('hud-guide-btn').textContent = guide.icon + ' ' + t('guides.' + guide.id + '.name');
    }

    var soundBtn = el('btn-sound');
    if (soundBtn) {
      var on = root.COG.Audio.isEnabled();
      soundBtn.textContent = on ? '🔊' : '🔇';
      soundBtn.setAttribute('aria-pressed', String(on));
      soundBtn.title = t(on ? 'ui.soundOn' : 'ui.soundOff');
    }

    var langSel = el('lang-select');
    if (langSel && langSel.value !== root.COG.i18n.getLang()) {
      langSel.value = root.COG.i18n.getLang();
    }

    var endBtn = el('btn-view-ending');
    if (endBtn) {
      endBtn.hidden = !(st.completedLevels['sinai-4'] || st.edenRoute === 'preserved');
    }
  }

  function renderMap() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var st = root.COG.State.get();
    var selectedCh = findChapter(st.activeChapterId);
    var chapters = root.COG.DATA.CHAPTERS || [];

    var quickBtn = el('btn-quick-start');
    if (quickBtn) {
      quickBtn.textContent = root.COG.State.getCompletedCount() > 0 ? t('ui.continueJourney') : t('ui.startGame');
    }

    var grid = el('chapter-grid');
    grid.innerHTML = '';
    chapters.forEach(function (ch) {
      var prog = root.COG.State.getChapterStars(ch.id);
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'chapter-card' + (ch.id === selectedCh.id ? ' is-selected' : '');
      card.style.borderTopColor = ch.accent;
      card.style.borderTopWidth = '4px';

      var top = document.createElement('div');
      top.className = 'chapter-card-top';
      var ico = document.createElement('span');
      ico.className = 'chapter-icon-pill';
      ico.textContent = ch.icon;
      var per = document.createElement('span');
      per.className = 'chapter-period';
      per.textContent = t('chapters.' + ch.id + '.period');
      top.appendChild(ico);
      top.appendChild(per);

      var title = document.createElement('h3');
      title.textContent = t('chapters.' + ch.id + '.title');

      var vp = document.createElement('p');
      vp.textContent = t('viewpoints.' + ch.viewpoint) + ' · ' + t('genres.' + ch.genre);

      var foot = document.createElement('div');
      foot.className = 'chapter-card-footer';
      foot.innerHTML = '<span>' + prog.completed + '/' + prog.total + ' ' + t('ui.completedBadge') + '</span><span>★ ' + prog.stars + '/' + (prog.total * 3) + '</span>';

      card.appendChild(top);
      card.appendChild(title);
      card.appendChild(vp);
      if (ch.isHighestScoreChapter) {
        var crown = document.createElement('span');
        crown.className = 'crown-badge';
        crown.textContent = '👑 ' + t('ui.highestScoreBadge');
        card.appendChild(crown);
      }
      card.appendChild(foot);

      card.addEventListener('click', function () {
        root.COG.Audio.play('click');
        root.COG.State.setActiveView(ch.id, 1);
        renderMap();
      });
      grid.appendChild(card);
    });

    // Selected chapter detail panel
    el('detail-period').textContent = t('chapters.' + selectedCh.id + '.period');
    el('detail-chapter-title').textContent = t('chapters.' + selectedCh.id + '.title');
    el('detail-viewpoint').textContent = t('viewpoints.' + selectedCh.viewpoint);
    el('detail-genre').textContent = t('genres.' + selectedCh.genre);
    el('detail-summary').textContent = t('chapters.' + selectedCh.id + '.summary');
    el('detail-crown-badge').hidden = !selectedCh.isHighestScoreChapter;

    var subGrid = el('sublevels-grid');
    subGrid.innerHTML = '';
    selectedCh.levels.forEach(function (lv) {
      var rec = st.completedLevels[lv.id];
      var card = document.createElement('article');
      card.className = 'sublevel-card' + (rec ? ' is-done' : '');

      var head = document.createElement('div');
      head.className = 'sublevel-head';
      var h4 = document.createElement('h4');
      h4.textContent = t('levels.' + lv.id + '.title');
      var stars = document.createElement('span');
      stars.className = 'sublevel-stars';
      stars.textContent = rec ? ('★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars)) : '☆☆☆';
      head.appendChild(h4);
      head.appendChild(stars);

      var obj = document.createElement('p');
      obj.className = 'sublevel-obj';
      obj.textContent = t('levels.' + lv.id + '.objective');

      var playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.className = 'btn-primary-gold';
      playBtn.textContent = t('ui.playStage');
      playBtn.addEventListener('click', function () {
        startStage(selectedCh, lv);
      });

      card.appendChild(head);
      card.appendChild(obj);
      card.appendChild(playBtn);
      subGrid.appendChild(card);
    });
  }

  function renderStageHeaders() {
    if (!activeStageRef) return;
    var t = function (k) { return root.COG.i18n.t(k); };
    var ch = activeStageRef.chapter;
    var lv = activeStageRef.level;

    el('stage-chapter-name').textContent = ch.icon + ' ' + t('chapters.' + ch.id + '.title');
    el('stage-level-title').textContent = t('levels.' + lv.id + '.title');
    el('stage-objective').textContent = t('levels.' + lv.id + '.objective');
    el('stage-hint-text').textContent = t('levels.' + lv.id + '.hint');

    var guide = root.COG.State.getActiveGuide();
    if (guide) {
      el('stage-guide-quote').textContent = guide.icon + ' ' + t('guides.' + guide.id + '.name') + ': ' + t('guides.' + guide.id + '.quote');
    }

    renderStageItemBar();
  }

  function renderStageItemBar() {
    var bar = el('stage-item-bar');
    if (!bar) return;
    var t = function (k, v) { return root.COG.i18n.t(k, v); };
    var st = root.COG.State.get();
    bar.innerHTML = '';

    (root.COG.DATA.ITEMS || []).forEach(function (item) {
      if (st.unlockedItems.indexOf(item.id) === -1) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item-chip';
      btn.disabled = !!usedItemsInRun[item.id];
      btn.title = t('items.' + item.id + '.desc');
      btn.textContent = item.icon + ' ' + t('items.' + item.id + '.name');

      btn.addEventListener('click', function () {
        if (usedItemsInRun[item.id]) return;
        var handled = root.COG.Runner.useItem(item.id);
        var universalGranted = false;
        if (!handled) {
          if (item.id === 'word_of_light') {
            root.COG.State.addStat({ bonusScore: 150, wisdom: 2 });
            universalGranted = true;
          } else if (item.id === 'star_compass') {
            root.COG.State.addStat({ bonusScore: 200, wisdom: 3 });
            universalGranted = true;
          } else if (item.id === 'stone_tablets') {
            root.COG.State.addStat({ bonusScore: 500, faith: 4 });
            universalGranted = true;
          }
        }
        if (handled || universalGranted) {
          usedItemsInRun[item.id] = true;
          root.COG.Audio.play('light');
          root.COG.Dialogs.announce(t('ui.itemUsed', { name: t('items.' + item.id + '.name') }));
          renderStageItemBar();
          renderHud();
        } else {
          root.COG.Dialogs.announce(t('ui.noEffectHere'));
        }
      });
      bar.appendChild(btn);
    });
  }

  function showMap() {
    root.COG.Runner.teardown();
    activeStageRef = null;
    el('view-stage').hidden = true;
    el('view-map').hidden = false;
    renderHud();
    renderMap();
  }

  function startStage(chapter, level) {
    activeStageRef = { chapter: chapter, level: level };
    usedItemsInRun = {};
    root.COG.State.setActiveView(chapter.id, level.subLevel);
    root.COG.Audio.play('choice');

    el('view-map').hidden = true;
    el('view-stage').hidden = false;
    renderStageHeaders();
    updateTouchVisibility();

    root.COG.Runner.mount(chapter, level, {
      onWin: function (earnedScore, stars, extra) {
        var res = root.COG.State.completeLevel(level, earnedScore, stars, extra);
        renderHud();
        var next = findNextTarget(chapter, level);
        var scId = level.scriptureIds && level.scriptureIds[0];
        var summary = (extra && extra.customSummary) ? extra.customSummary : root.COG.i18n.t('levels.' + level.id + '.outro');

        root.COG.Dialogs.openResult({
          win: true,
          customTitle: extra && extra.customTitle,
          stars: stars,
          earnedScore: earnedScore,
          summary: summary,
          scriptureId: scId,
          newItemUnlocked: res.newItemUnlocked,
          newGuidesUnlocked: res.newGuidesUnlocked,
          hasNext: !!next,
          onMap: function () {
            showMap();
            if (extra && extra.triggerEnding) {
              root.COG.Dialogs.openEnding();
            }
          },
          onRetry: function () {
            startStage(chapter, level);
          },
          onNext: function () {
            if (extra && extra.triggerEnding) {
              showMap();
              root.COG.Dialogs.openEnding();
            } else if (next) {
              startStage(next.chapter, next.level);
            } else {
              showMap();
            }
          }
        });
      },
      onFail: function () {
        var scId = level.scriptureIds && level.scriptureIds[0];
        root.COG.Dialogs.openResult({
          win: false,
          summary: root.COG.i18n.t('levels.' + level.id + '.hint'),
          scriptureId: scId,
          hasNext: false,
          onMap: showMap,
          onRetry: function () { startStage(chapter, level); }
        });
      },
      onEdenChoice: function (callbacks) {
        root.COG.Dialogs.openEdenChoice(callbacks);
      }
    });
  }

  function updateTouchVisibility() {
    var pad = el('touch-pad');
    if (pad) pad.hidden = !touchEnabled;
  }

  function bindTouchPad() {
    var padBtns = document.querySelectorAll('.pad-btn[data-dir]');
    for (var i = 0; i < padBtns.length; i++) {
      (function (btn) {
        var dir = btn.getAttribute('data-dir');
        btn.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          root.COG.Runner.setTouchKey(dir, true);
        });
        btn.addEventListener('pointerup', function () {
          root.COG.Runner.setTouchKey(dir, false);
        });
        btn.addEventListener('pointerleave', function () {
          root.COG.Runner.setTouchKey(dir, false);
        });
        btn.addEventListener('pointercancel', function () {
          root.COG.Runner.setTouchKey(dir, false);
        });
      })(padBtns[i]);
    }
    var actionBtn = el('touch-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        root.COG.Runner.triggerAction();
      });
    }
  }

  function bootstrap() {
    var st = root.COG.State.load();
    root.COG.i18n.init(st.lang);
    root.COG.Audio.setEnabled(st.sound);

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      touchEnabled = true;
    }

    root.COG.Runner.initDom({
      canvas: el('game-canvas'),
      overlay: el('interactive-overlay'),
      statusHud: el('stage-status-hud')
    });

    root.COG.Dialogs.init({
      onChangeLang: function (code) {
        root.COG.State.setLang(code);
        root.COG.i18n.setLang(code);
      },
      onToggleSound: function () {
        var next = !root.COG.Audio.isEnabled();
        root.COG.Audio.setEnabled(next);
        root.COG.State.setSound(next);
        renderHud();
      },
      onReset: function () {
        root.COG.State.reset();
        showMap();
      }
    });

    root.COG.i18n.onChange(function () {
      renderHud();
      renderMap();
      renderStageHeaders();
      if (activeStageRef && root.COG.Runner.isRunning()) {
        // Re-mount overlay-heavy stages or let dynamic text update cleanly
        if (el('interactive-overlay') && !el('interactive-overlay').hidden) {
          startStage(activeStageRef.chapter, activeStageRef.level);
        }
      }
    });

    el('lang-select').addEventListener('change', function () {
      var code = this.value;
      root.COG.State.setLang(code);
      root.COG.i18n.setLang(code);
    });

    el('btn-sound').addEventListener('click', function () {
      var next = !root.COG.Audio.isEnabled();
      root.COG.Audio.setEnabled(next);
      root.COG.State.setSound(next);
      renderHud();
    });

    el('btn-open-settings').addEventListener('click', function () {
      root.COG.Dialogs.openSettings();
    });
    el('btn-open-codex').addEventListener('click', function () {
      root.COG.Dialogs.openCodex('all');
    });
    el('btn-open-help').addEventListener('click', function () {
      root.COG.Dialogs.openHelp();
    });
    el('btn-open-inventory').addEventListener('click', function () {
      root.COG.Dialogs.openInventory(function () {
        renderHud();
        renderStageHeaders();
      });
    });
    el('hud-guide-btn').addEventListener('click', function () {
      root.COG.Dialogs.openInventory(function () {
        renderHud();
        renderStageHeaders();
      });
    });

    el('btn-quick-start').addEventListener('click', function () {
      var curSt = root.COG.State.get();
      var ch = findChapter(curSt.activeChapterId);
      var lv = ch.levels[Math.max(0, Math.min(ch.levels.length - 1, (curSt.activeSubLevel || 1) - 1))];
      startStage(ch, lv);
    });
    el('btn-view-ending').addEventListener('click', function () {
      root.COG.Dialogs.openEnding();
    });
    el('btn-back-map').addEventListener('click', showMap);
    el('btn-stage-retry').addEventListener('click', function () {
      if (activeStageRef) startStage(activeStageRef.chapter, activeStageRef.level);
    });
    el('btn-toggle-touch').addEventListener('click', function () {
      touchEnabled = !touchEnabled;
      updateTouchVisibility();
    });

    bindTouchPad();
    renderHud();
    renderMap();

    // Register Service Worker only on HTTP(S)/localhost — never on file://
    if (
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      typeof location !== 'undefined' &&
      (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ) {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
})(typeof window !== 'undefined' ? window : globalThis);
