(function (root) {
  'use strict';

  function el(id) { return document.getElementById(id); }

  var activeStage = null;
  var touchEnabled = false;

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

  function renderGallery() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var st = root.COG.State.get();
    var grid = el('stage-gallery-grid');
    if (!grid) return;
    grid.innerHTML = '';

    (root.COG.DATA.STAGES || []).forEach(function (stage) {
      var rec = st.completedStages[stage.id];
      var card = document.createElement('article');
      card.className = 'storybook-card';
      card.style.borderTopColor = stage.accent;
      card.style.borderTopWidth = '5px';

      if (stage.bg && stage.heroSprite) {
        var banner = document.createElement('div');
        banner.className = 'card-scene-banner';
        banner.innerHTML = '<img class="card-scene-bg" src="' + stage.bg + '" alt="">' +
          '<div class="card-banner-scrim"></div>' +
          '<div class="card-banner-badges">' +
          '<span class="genre-badge">' + t('genres.' + stage.genreId) + '</span>' +
          (stage.isHighestScoreStage ? '<span class="crown-pill">👑 ' + t('ui.highestScoreBadge') + '</span>' : '') +
          '</div>' +
          '<img class="card-hero-cutout" src="' + stage.heroSprite + '" alt="">';
        card.appendChild(banner);
      }

      var top = document.createElement('div');
      top.className = 'card-top';
      var img = document.createElement('img');
      img.className = 'card-portrait';
      img.src = stage.portrait;
      img.alt = t('viewpoints.' + stage.viewpoint);

      var info = document.createElement('div');
      info.className = 'card-head-info';
      info.innerHTML = '<div class="card-period">' + t('stages.' + stage.id + '.period') + ' · ' + t('viewpoints.' + stage.viewpoint) + '</div>' +
        '<h3>' + t('stages.' + stage.id + '.title') + '</h3>';

      top.appendChild(img);
      top.appendChild(info);
      card.appendChild(top);

      var desc = document.createElement('p');
      desc.className = 'card-desc';
      desc.textContent = t('stages.' + stage.id + '.desc');
      card.appendChild(desc);

      var bottom = document.createElement('div');
      bottom.className = 'card-bottom';
      var stars = document.createElement('span');
      stars.className = 'card-stars';
      stars.textContent = rec ? ('★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars)) : '☆☆☆';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-sunny';
      btn.textContent = rec ? t('ui.replayStage') : t('ui.playStage');
      btn.addEventListener('click', function () {
        root.COG.Audio.play('choice');
        startStage(stage);
      });

      bottom.appendChild(stars);
      bottom.appendChild(btn);
      card.appendChild(bottom);
      grid.appendChild(card);
    });
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
    el('btn-toggle-touch').addEventListener('click', function () {
      touchEnabled = !touchEnabled;
      el('touch-pad').hidden = !touchEnabled;
    });

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
