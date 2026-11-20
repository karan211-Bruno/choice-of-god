(function (root) {
  'use strict';

  function el(id) { return document.getElementById(id); }

  var activeStage = null;
  var selectedStageId = 'eden';
  var touchEnabled = false;

  function getSelectedStage() {
    var list = root.COG.DATA.STAGES || [];
    return list.find(function (s) { return s.id === selectedStageId; }) || list[0];
  }

  function findNextStage(stageObj) {
    var list = root.COG.DATA.STAGES || [];
    var idx = list.findIndex(function (s) { return s.id === stageObj.id; });
    return (idx !== -1 && idx + 1 < list.length) ? list[idx + 1] : null;
  }

  function renderHud() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var st = root.COG.State.get();
    el('hud-score').textContent = root.COG.State.getTotalScore().toLocaleString();
    el('hud-level').textContent = String(st.level);
    el('hud-faith').textContent = String(st.stats.faith);
    el('hud-wisdom').textContent = String(st.stats.wisdom);
    el('hud-mercy').textContent = String(st.stats.mercy);

    var rKey = 'ui.routeUndecided';
    if (st.edenRoute === 'preserved') rKey = 'ui.routePreserved';
    else if (st.edenRoute === 'fallen') rKey = 'ui.routeFallen';
    el('hud-route').textContent = t(rKey);

    var g = root.COG.State.getActiveGuide();
    if (g) el('btn-hud-guide').textContent = t('guides.' + g.id + '.name');

    var endBtn = el('btn-view-ending');
    if (endBtn) endBtn.hidden = !(root.COG.State.getCompletedCount() >= 1 || st.edenRoute === 'preserved');

    var snd = el('btn-sound');
    if (snd) {
      var on = root.COG.Audio.isEnabled();
      snd.textContent = on ? '🔊' : '🔇';
      snd.setAttribute('aria-pressed', String(on));
    }

    var sel = el('lang-select');
    if (sel && sel.value !== root.COG.i18n.getLang()) sel.value = root.COG.i18n.getLang();
  }

  function renderWorldMap() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var st = root.COG.State.get();
    var stages = root.COG.DATA.STAGES || [];
    var selected = getSelectedStage();
    if (!selected) return;
    selectedStageId = selected.id;

    var trail = el('world-map-trail');
    if (trail && stages.length >= 6) {
      var pts = stages.map(function (s) { return s.mapPos || { x: 50, y: 50 }; });
      var pathD = 'M ' + pts[0].x + ' ' + pts[0].y +
        ' Q ' + ((pts[0].x + pts[1].x) / 2) + ' ' + ((pts[0].y + pts[1].y) / 2 + 9) + ' ' + pts[1].x + ' ' + pts[1].y +
        ' Q ' + ((pts[1].x + pts[2].x) / 2) + ' ' + ((pts[1].y + pts[2].y) / 2 + 8) + ' ' + pts[2].x + ' ' + pts[2].y +
        ' Q ' + (pts[2].x - 6) + ' ' + ((pts[2].y + pts[3].y) / 2) + ' ' + pts[3].x + ' ' + pts[3].y +
        ' Q ' + ((pts[3].x + pts[4].x) / 2) + ' ' + ((pts[3].y + pts[4].y) / 2 - 6) + ' ' + pts[4].x + ' ' + pts[4].y +
        ' Q ' + ((pts[4].x + pts[5].x) / 2) + ' ' + ((pts[4].y + pts[5].y) / 2 + 6) + ' ' + pts[5].x + ' ' + pts[5].y;
      trail.innerHTML = '<path class="trail-shadow" d="' + pathD + '"></path>' +
        '<path class="trail-gold" d="' + pathD + '"></path>';
    }

    var pinsWrap = el('world-map-pins');
    if (!pinsWrap) return;
    pinsWrap.innerHTML = '';

    stages.forEach(function (stage) {
      var rec = st.completedStages[stage.id];
      var isSelected = stage.id === selected.id;
      var pos = stage.mapPos || { x: 50, y: 50 };

      var pin = document.createElement('button');
      pin.type = 'button';
      pin.className = 'map-pin' + (isSelected ? ' is-selected' : '') + (rec ? ' is-cleared' : '');
      pin.dataset.stageId = stage.id;
      pin.style.left = pos.x + '%';
      pin.style.top = pos.y + '%';
      pin.style.setProperty('--pin-accent', stage.accent);
      pin.setAttribute('aria-pressed', String(isSelected));
      pin.setAttribute('aria-label', t('stages.' + stage.id + '.title') + ' — ' + t('genres.' + stage.genreId));

      var badgeText = rec ? '✓' : (stage.isHighestScoreStage ? '👑' : String(stage.order));
      var starsHtml = rec ? '<span class="map-pin-stars" aria-hidden="true">' + '★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars) + '</span>' : '';

      pin.innerHTML = '<span class="map-pin-avatar">' +
        '<span class="map-pin-halo" aria-hidden="true"></span>' +
        '<img class="map-pin-sprite" src="' + stage.heroSprite + '" alt="">' +
        '<span class="map-pin-badge">' + badgeText + '</span>' +
        '</span>' +
        '<span class="map-pin-label">' + t('stages.' + stage.id + '.mapLabel') + '</span>' +
        starsHtml;

      pin.addEventListener('click', function () {
        root.COG.Audio.play('click');
        selectStage(stage.id, true);
      });
      pin.addEventListener('dblclick', function () {
        root.COG.Audio.play('choice');
        selectStage(stage.id, false);
        startStage(stage);
      });

      pinsWrap.appendChild(pin);
    });
  }

  function renderBriefingPanel() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var st = root.COG.State.get();
    var stages = root.COG.DATA.STAGES || [];
    var stage = getSelectedStage();
    if (!stage) return;
    var rec = st.completedStages[stage.id];

    var panel = el('stage-briefing-panel');
    if (panel) panel.style.borderTopColor = stage.accent;

    var bg = el('brief-bg');
    if (bg) bg.src = stage.bg;
    var heroSprite = el('brief-hero-sprite');
    if (heroSprite) heroSprite.src = stage.heroSprite;
    var chapterBadge = el('brief-chapter-badge');
    if (chapterBadge) chapterBadge.textContent = 'STAGE ' + stage.order + ' / ' + stages.length;
    var genreEl = el('brief-genre');
    if (genreEl) genreEl.textContent = t('genres.' + stage.genreId);
    var crownEl = el('brief-crown');
    if (crownEl) crownEl.hidden = !stage.isHighestScoreStage;

    var portrait = el('brief-portrait');
    if (portrait) {
      portrait.src = stage.portrait;
      portrait.alt = t('viewpoints.' + stage.viewpoint);
    }
    var periodEl = el('brief-period');
    if (periodEl) periodEl.textContent = t('stages.' + stage.id + '.period') + ' · ' + t('viewpoints.' + stage.viewpoint);
    var titleEl = el('brief-title');
    if (titleEl) titleEl.textContent = t('stages.' + stage.id + '.title');
    var starsEl = el('brief-stars');
    if (starsEl) starsEl.textContent = rec ? ('★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars)) : '☆☆☆';
    var bestEl = el('brief-best-score');
    if (bestEl) bestEl.textContent = rec ? (t('ui.bestScore') + ': ' + rec.bestScore.toLocaleString()) : t('ui.unplayed');

    var descEl = el('brief-desc');
    if (descEl) descEl.textContent = t('stages.' + stage.id + '.desc');
    var objEl = el('brief-objective');
    if (objEl) objEl.textContent = t('stages.' + stage.id + '.objective');
    var ctrlEl = el('brief-controls');
    if (ctrlEl) ctrlEl.textContent = t('stages.' + stage.id + '.controls');

    var sid = (stage.scriptureIds && stage.scriptureIds[0]) || null;
    var verseText = el('brief-verse-text');
    var verseRef = el('brief-verse-ref');
    if (sid && verseText && verseRef) {
      verseText.textContent = '“' + t('bible.' + sid + '.text') + '”';
      verseRef.textContent = '— ' + t('bible.' + sid + '.ref');
    }

    var launchBtn = el('btn-launch-selected');
    if (launchBtn) {
      launchBtn.textContent = (rec ? t('ui.replayStage') : t('ui.playStage')) + ' · ' + t('stages.' + stage.id + '.mapLabel');
    }
  }

  function selectStage(stageId, announce) {
    var activeEl = document.activeElement;
    var wasPinFocused = !!(activeEl && activeEl.classList && activeEl.classList.contains('map-pin'));
    selectedStageId = stageId;
    renderWorldMap();
    renderBriefingPanel();
    if (wasPinFocused) {
      var targetPin = document.querySelector('#world-map-pins .map-pin[data-stage-id="' + stageId + '"]');
      if (targetPin) targetPin.focus();
    }
    if (announce && el('live-announcer')) {
      var stg = getSelectedStage();
      if (stg) {
        el('live-announcer').textContent = root.COG.i18n.t('stages.' + stg.id + '.title');
      }
    }
  }

  function renderGallery() {
    renderWorldMap();
    renderBriefingPanel();
  }

  function renderStageHeader() {
    if (!activeStage) return;
    var t = function (k) { return root.COG.i18n.t(k); };
    el('stage-hero-img').src = activeStage.portrait;
    el('stage-hero-img').alt = t('viewpoints.' + activeStage.viewpoint);
    el('stage-genre-badge').textContent = t('genres.' + activeStage.genreId);
    el('stage-title').textContent = t('stages.' + activeStage.id + '.title');
    el('stage-objective').textContent = t('stages.' + activeStage.id + '.objective');
  }

  function showGallery() {
    root.COG.StageHost.teardown();
    el('dialogue-box').hidden = true;
    activeStage = null;
    el('view-stage').hidden = true;
    el('view-gallery').hidden = false;
    renderHud();
    renderGallery();
  }

  function startStage(stageObj) {
    activeStage = stageObj;
    root.COG.State.setActiveStage(stageObj.id);
    el('view-gallery').hidden = true;
    el('view-stage').hidden = false;
    el('dialogue-box').hidden = true;
    renderStageHeader();

    root.COG.StageHost.mount(stageObj, {
      onDialogue: function (dialogueId, cbs) {
        root.COG.Dialogs.openDialogueBox(dialogueId, cbs);
      },
      onWin: function (score, stars, extra) {
        var res = root.COG.State.completeStage(stageObj, score, stars, extra);
        renderHud();
        var next = findNextStage(stageObj);
        var summary = (extra && extra.customSummary) ? extra.customSummary : root.COG.i18n.t('stages.' + stageObj.id + '.outro');
        root.COG.Dialogs.openResult({
          win: true,
          stars: stars,
          score: res.awardedScore,
          summary: summary,
          scriptureId: stageObj.scriptureIds && stageObj.scriptureIds[0],
          newItem: res.newItem,
          newGuides: res.newGuides,
          hasNext: !!next,
          onMap: function () {
            showGallery();
            if (extra && extra.triggerEnding) root.COG.Dialogs.openEnding();
          },
          onRetry: function () { startStage(stageObj); },
          onNext: function () {
            if (extra && extra.triggerEnding) {
              showGallery();
              root.COG.Dialogs.openEnding();
            } else if (next) {
              startStage(next);
            }
          }
        });
      },
      onFail: function () {
        root.COG.Dialogs.openResult({
          win: false,
          summary: root.COG.i18n.t('stages.' + stageObj.id + '.objective'),
          scriptureId: stageObj.scriptureIds && stageObj.scriptureIds[0],
          hasNext: false,
          onMap: showGallery,
          onRetry: function () { startStage(stageObj); }
        });
      }
    });
  }

  function bindTouchPad() {
    var pads = document.querySelectorAll('.pad-btn[data-dir]');
    for (var i = 0; i < pads.length; i++) {
      (function (btn) {
        var dir = btn.getAttribute('data-dir');
        btn.addEventListener('pointerdown', function (e) { e.preventDefault(); root.COG.StageHost.setTouchKey(dir, true); });
        btn.addEventListener('pointerup', function () { root.COG.StageHost.setTouchKey(dir, false); });
        btn.addEventListener('pointerleave', function () { root.COG.StageHost.setTouchKey(dir, false); });
        btn.addEventListener('pointercancel', function () { root.COG.StageHost.setTouchKey(dir, false); });
      })(pads[i]);
    }
    el('touch-action').addEventListener('pointerdown', function (e) { e.preventDefault(); root.COG.StageHost.triggerAction(); });
    el('touch-dash').addEventListener('pointerdown', function (e) { e.preventDefault(); root.COG.StageHost.triggerDash(); });
  }

  function bootstrap() {
    var st = root.COG.State.load();
    root.COG.i18n.init(st.lang);
    root.COG.Audio.setEnabled(st.sound);

    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      touchEnabled = true;
      el('touch-pad').hidden = false;
    }

    root.COG.StageHost.initDom({
      canvas: el('stage-canvas'),
      overlay: el('stage-overlay'),
      toolbar: el('stage-toolbar'),
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
        selectedStageId = 'eden';
        showGallery();
      },
      onDialogClosed: function () {
        if (!document.querySelector('dialog[open]') && el('dialogue-box').hidden) {
          root.COG.StageHost.resume();
        }
      }
    });

    root.COG.i18n.onChange(function () {
      renderHud();
      renderGallery();
      renderStageHeader();
      root.COG.Dialogs.refreshActiveDialogue();
      if (activeStage && root.COG.StageHost.isRunning()) {
        // Refresh stage toolbar/labels in new language cleanly
        startStage(activeStage);
      }
    });

    el('lang-select').addEventListener('change', function () {
      root.COG.State.setLang(this.value);
      root.COG.i18n.setLang(this.value);
    });
    el('btn-sound').addEventListener('click', function () {
      var next = !root.COG.Audio.isEnabled();
      root.COG.Audio.setEnabled(next);
      root.COG.State.setSound(next);
      renderHud();
    });

    el('btn-inventory').addEventListener('click', function () { root.COG.Dialogs.openInventory(renderHud); });
    el('btn-hud-guide').addEventListener('click', function () { root.COG.Dialogs.openInventory(renderHud); });
    el('btn-codex').addEventListener('click', function () { root.COG.Dialogs.openCodex(); });
    el('btn-help').addEventListener('click', function () { root.COG.Dialogs.openHelp(); });
    el('btn-settings').addEventListener('click', function () { root.COG.Dialogs.openSettings(); });
    el('btn-view-ending').addEventListener('click', function () { root.COG.Dialogs.openEnding(); });

    el('btn-back-gallery').addEventListener('click', showGallery);
    el('btn-retry-stage').addEventListener('click', function () { if (activeStage) startStage(activeStage); });
    el('btn-prev-stage').addEventListener('click', function () {
      var stages = root.COG.DATA.STAGES || [];
      if (!stages.length) return;
      var idx = stages.findIndex(function (s) { return s.id === getSelectedStage().id; });
      var prev = stages[(idx - 1 + stages.length) % stages.length];
      root.COG.Audio.play('click');
      selectStage(prev.id, true);
    });
    el('btn-next-stage-hub').addEventListener('click', function () {
      var stages = root.COG.DATA.STAGES || [];
      if (!stages.length) return;
      var idx = stages.findIndex(function (s) { return s.id === getSelectedStage().id; });
      var next = stages[(idx + 1) % stages.length];
      root.COG.Audio.play('click');
      selectStage(next.id, true);
    });
    el('btn-launch-selected').addEventListener('click', function () {
      root.COG.Audio.play('choice');
      startStage(getSelectedStage());
    });
    el('btn-toggle-touch').addEventListener('click', function () {
      touchEnabled = !touchEnabled;
      el('touch-pad').hidden = !touchEnabled;
    });

    if (st && st.activeStage && (root.COG.DATA.STAGES || []).some(function (s) { return s.id === st.activeStage; })) {
      selectedStageId = st.activeStage;
    }

    bindTouchPad();
    renderHud();
    renderGallery();

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
