(function (root) {
  'use strict';

  function el(id) { return document.getElementById(id); }

  var toastTimer = null;
  var touchEnabled = false;

  function showToast(msg) {
    var box = el('toast-banner');
    if (!box) return;
    box.textContent = msg;
    box.hidden = false;
    root.COG.Dialogs.announce(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.hidden = true; }, 3200);
  }

  function renderGlobalHud() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var st = root.COG.State.get();
    var zone = root.COG.RpgEngine.zone || root.COG.DATA.ZONES[0];
    var hero = root.COG.RpgEngine.hero;
    var xpNeed = root.COG.State.getXpNeeded();

    el('hud-zone-title').textContent = t('zones.' + zone.id + '.title');
    el('hud-viewpoint').textContent = t('viewpoints.' + zone.viewpoint);
    el('hud-lv').textContent = String(st.level);
    el('hud-xp-txt').textContent = st.xp + '/' + xpNeed;
    el('hud-xp-bar').style.width = Math.min(100, Math.round((st.xp / xpNeed) * 100)) + '%';
    el('hud-score').textContent = root.COG.State.getTotalScore().toLocaleString();

    var rKey = 'ui.routeUndecided';
    if (st.edenRoute === 'preserved') rKey = 'ui.routePreserved';
    else if (st.edenRoute === 'fallen') rKey = 'ui.routeFallen';
    el('hud-route').textContent = t(rKey);

    var guide = root.COG.State.getActiveGuide();
    if (guide) {
      el('btn-hud-guide').textContent = t('guides.' + guide.id + '.name');
    }

    if (hero) {
      el('hud-hp-txt').textContent = Math.max(0, Math.round(hero.hp)) + '/' + hero.maxHp;
      el('hud-hp-bar').style.width = Math.max(0, Math.min(100, Math.round((hero.hp / hero.maxHp) * 100))) + '%';
      el('hud-mp-txt').textContent = Math.round(hero.mp) + '/' + hero.maxMp;
      el('hud-mp-bar').style.width = Math.max(0, Math.min(100, Math.round((hero.mp / hero.maxMp) * 100))) + '%';
    }

    el('lbl-skill-nova').textContent = t('skills.nova.name');
    el('lbl-skill-beam').textContent = t('skills.beam.name');
    el('lbl-skill-grace').textContent = t('skills.grace.name');

    var endBtn = el('btn-view-ending');
    if (endBtn) {
      endBtn.hidden = !(Object.keys(st.defeatedBosses).length >= 1 || st.edenRoute === 'preserved');
    }

    var sndBtn = el('btn-sound');
    if (sndBtn) {
      var on = root.COG.Audio.isEnabled();
      sndBtn.textContent = on ? '🔊' : '🔇';
      sndBtn.setAttribute('aria-pressed', String(on));
    }

    var langSel = el('lang-select');
    if (langSel && langSel.value !== root.COG.i18n.getLang()) {
      langSel.value = root.COG.i18n.getLang();
    }

    renderQuestTracker();
  }

  function renderQuestTracker() {
    var t = function (k) { return root.COG.i18n.t(k); };
    var zone = root.COG.RpgEngine.zone;
    var list = el('qt-list');
    if (!zone || !list) return;
    var st = root.COG.State.get();
    var counts = root.COG.RpgEngine.questCounts || {};

    list.innerHTML = '';
    zone.quests.forEach(function (q) {
      var done = !!st.completedQuests[q.id];
      var cur = done ? q.targetCount : (counts[q.id] || 0);
      var li = document.createElement('li');
      li.className = 'qt-item' + (done ? ' is-done' : '');
      li.innerHTML = '<strong>' + (done ? '✓ ' : '• ') + t('quests.' + q.id + '.title') + ' (' + cur + '/' + q.targetCount + ')</strong>' +
        '<span class="qt-desc">' + t('quests.' + q.id + '.desc') + '</span>';
      list.appendChild(li);
    });
  }

  function onTickHud(hero, boss, cds) {
    if (hero) {
      el('hud-hp-txt').textContent = Math.max(0, Math.round(hero.hp)) + '/' + hero.maxHp;
      el('hud-hp-bar').style.width = Math.max(0, Math.min(100, Math.round((hero.hp / hero.maxHp) * 100))) + '%';
      el('hud-mp-txt').textContent = Math.round(hero.mp) + '/' + hero.maxMp;
      el('hud-mp-bar').style.width = Math.max(0, Math.min(100, Math.round((hero.mp / hero.maxMp) * 100))) + '%';
    }

    ['nova', 'beam', 'grace'].forEach(function (sk) {
      var badge = el('cd-' + sk);
      if (badge) badge.textContent = cds[sk] > 0.05 ? cds[sk].toFixed(1) + 's' : '';
    });

    var bHud = el('boss-hud');
    var bossInRange = false;
    if (boss && boss.hp > 0 && hero) {
      var bdx = boss.x - hero.x;
      var bdy = boss.y - hero.y;
      bossInRange = (bdx * bdx + bdy * bdy) < (640 * 640) || boss.hp < boss.maxHp;
    }
    if (bossInRange) {
      bHud.hidden = false;
      el('boss-name').textContent = root.COG.i18n.t('bosses.' + boss.id + '.name') + (boss.phase2 ? ' ★' : '');
      el('boss-sub').textContent = root.COG.i18n.t('bosses.' + boss.id + '.subtitle');
      el('boss-hp-fill').style.width = Math.max(0, Math.round((boss.hp / boss.maxHp) * 100)) + '%';
    } else if (!bHud.hidden) {
      bHud.hidden = true;
    }
  }

  function bindControls() {
    el('hb-slash').addEventListener('click', function () { root.COG.RpgEngine.slash(); });
    el('hb-dash').addEventListener('click', function () { root.COG.RpgEngine.dash(); });
    el('hb-interact').addEventListener('click', function () { root.COG.RpgEngine.interact(); });
    el('hb-skill-nova').addEventListener('click', function () { root.COG.RpgEngine.useSkill('nova'); });
    el('hb-skill-beam').addEventListener('click', function () { root.COG.RpgEngine.useSkill('beam'); });
    el('hb-skill-grace').addEventListener('click', function () { root.COG.RpgEngine.useSkill('grace'); });

    el('btn-toggle-touch').addEventListener('click', function () {
      touchEnabled = !touchEnabled;
      el('touch-pad').hidden = !touchEnabled;
    });

    var pads = document.querySelectorAll('.pad-btn[data-dir]');
    for (var i = 0; i < pads.length; i++) {
      (function (btn) {
        var dir = btn.getAttribute('data-dir');
        btn.addEventListener('pointerdown', function (e) { e.preventDefault(); root.COG.RpgEngine.setTouchKey(dir, true); });
        btn.addEventListener('pointerup', function () { root.COG.RpgEngine.setTouchKey(dir, false); });
        btn.addEventListener('pointerleave', function () { root.COG.RpgEngine.setTouchKey(dir, false); });
        btn.addEventListener('pointercancel', function () { root.COG.RpgEngine.setTouchKey(dir, false); });
      })(pads[i]);
    }
    el('touch-slash').addEventListener('pointerdown', function (e) { e.preventDefault(); root.COG.RpgEngine.slash(); });
    el('touch-dash').addEventListener('pointerdown', function (e) { e.preventDefault(); root.COG.RpgEngine.dash(); });
    el('touch-interact').addEventListener('pointerdown', function (e) { e.preventDefault(); root.COG.RpgEngine.interact(); });

    el('btn-world-map').addEventListener('click', function () {
      root.COG.Dialogs.openWorldMap(function (zoneId) {
        root.COG.RpgEngine.loadZone(zoneId);
        renderGlobalHud();
      });
    });
    el('btn-char-sheet').addEventListener('click', function () {
      root.COG.Dialogs.openCharacterSheet(function () {
        root.COG.RpgEngine.syncHeroMaxStats();
        renderGlobalHud();
      });
    });
    el('btn-hud-guide').addEventListener('click', function () {
      root.COG.Dialogs.openCharacterSheet(function () {
        root.COG.RpgEngine.syncHeroMaxStats();
        renderGlobalHud();
      });
    });
    el('btn-codex').addEventListener('click', function () { root.COG.Dialogs.openCodex(); });
    el('btn-help').addEventListener('click', function () { root.COG.Dialogs.openHelp(); });
    el('btn-settings').addEventListener('click', function () { root.COG.Dialogs.openSettings(); });
    el('btn-view-ending').addEventListener('click', function () { root.COG.Dialogs.openEnding(); });

    el('lang-select').addEventListener('change', function () {
      root.COG.State.setLang(this.value);
      root.COG.i18n.setLang(this.value);
    });
    el('btn-sound').addEventListener('click', function () {
      var next = !root.COG.Audio.isEnabled();
      root.COG.Audio.setEnabled(next);
      root.COG.State.setSound(next);
      renderGlobalHud();
    });

    window.addEventListener('keydown', function (e) {
      if (document.querySelector('dialog[open]')) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        root.COG.Dialogs.openWorldMap(function (zoneId) {
          root.COG.RpgEngine.loadZone(zoneId);
          renderGlobalHud();
        });
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        root.COG.Dialogs.openCharacterSheet(function () {
          root.COG.RpgEngine.syncHeroMaxStats();
          renderGlobalHud();
        });
      }
    });
  }

  function bootstrap() {
    var st = root.COG.State.load();
    root.COG.i18n.init(st.lang);
    root.COG.Audio.setEnabled(st.sound);

    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      touchEnabled = true;
      el('touch-pad').hidden = false;
    }

    root.COG.Dialogs.init({
      onChangeLang: function (code) {
        root.COG.State.setLang(code);
        root.COG.i18n.setLang(code);
      },
      onToggleSound: function () {
        var next = !root.COG.Audio.isEnabled();
        root.COG.Audio.setEnabled(next);
        root.COG.State.setSound(next);
        renderGlobalHud();
      },
      onReset: function () {
        root.COG.State.reset();
        root.COG.RpgEngine.loadZone('eden');
        renderGlobalHud();
      },
      onDialogClosed: function () {
        if (!document.querySelector('dialog[open]') && el('dialogue-box').hidden) {
          root.COG.RpgEngine.resume();
        }
      }
    });

    root.COG.RpgEngine.init(el('rpg-canvas'), {
      onHudUpdate: renderGlobalHud,
      onTickHud: onTickHud,
      onZoneChanged: renderGlobalHud,
      onLevelUp: function (res) {
        root.COG.Audio.play('levelup');
        showToast(root.COG.i18n.t('ui.levelUpToast', { lv: res.newLevel }));
      },
      onQuestCompleted: function (q) {
        showToast(root.COG.i18n.t('ui.questDoneToast', { title: root.COG.i18n.t('quests.' + q.id + '.title') }));
      },
      onBossDefeated: function (zone, res) {
        showToast(root.COG.i18n.t('ui.bossDefeatedToast', { score: res.awardedScore }));
        if (zone.id === 'sinai') {
          setTimeout(function () { root.COG.Dialogs.openEnding(); }, 900);
        }
      },
      onRespawn: function () {
        showToast(root.COG.i18n.t('ui.respawnToast'));
      },
      onOpenDialogue: function (dialogueId, cbs) {
        root.COG.Dialogs.openDialogueBox(dialogueId, cbs);
      }
    });

    root.COG.i18n.onChange(function () {
      renderGlobalHud();
      root.COG.Dialogs.refreshActiveDialogue();
    });

    bindControls();
    root.COG.RpgEngine.loadZone(st.activeZoneId || 'eden');
    renderGlobalHud();

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
