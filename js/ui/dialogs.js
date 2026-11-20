(function (root) {
  'use strict';
  root.COG = root.COG || {};

  function getEl(id) {
    return document.getElementById(id);
  }

  function announce(msg) {
    var el = getEl('live-announcer');
    if (!el) return;
    el.textContent = '';
    setTimeout(function () {
      el.textContent = msg;
    }, 30);
  }

  function installLightDismissFallback() {
    if (typeof HTMLDialogElement === 'undefined') return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    var outside = function (e, dialog) {
      var r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    var anyDialogs = document.querySelectorAll('dialog[closedby="any"]');
    for (var i = 0; i < anyDialogs.length; i++) {
      (function (dlg) {
        var pressedOutside = false;
        dlg.addEventListener('pointerdown', function (e) {
          pressedOutside = outside(e, dlg);
        });
        dlg.addEventListener('pointerup', function (e) {
          if (pressedOutside && outside(e, dlg)) {
            dlg.close();
          }
          pressedOutside = false;
        });
      })(anyDialogs[i]);
    }
  }

  var activeBookFilter = 'all';

  var Dialogs = {
    init: function (handlers) {
      installLightDismissFallback();

      var closeButtons = document.querySelectorAll('[data-close-dialog]');
      for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', function () {
          var id = this.getAttribute('data-close-dialog');
          var d = getEl(id);
          if (d && d.open) d.close();
        });
      }

      var allDlgs = document.querySelectorAll('dialog');
      for (var j = 0; j < allDlgs.length; j++) {
        (function (dlg) {
          dlg.addEventListener('close', function () {
            dlg.returnValue = '';
          });
          if (dlg.getAttribute('closedby') === 'none') {
            dlg.addEventListener('cancel', function (e) {
              e.preventDefault();
            });
          }
        })(allDlgs[j]);
      }

      var langBtns = document.querySelectorAll('[data-set-lang]');
      for (var k = 0; k < langBtns.length; k++) {
        langBtns[k].addEventListener('click', function () {
          var code = this.getAttribute('data-set-lang');
          if (handlers && handlers.onChangeLang) handlers.onChangeLang(code);
          Dialogs.refreshSettings();
        });
      }

      var soundBtn = getEl('dlg-sound-toggle');
      if (soundBtn) {
        soundBtn.addEventListener('click', function () {
          if (handlers && handlers.onToggleSound) handlers.onToggleSound();
          Dialogs.refreshSettings();
        });
      }

      var resetBtn = getEl('dlg-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (window.confirm(root.COG.i18n.t('ui.resetConfirm'))) {
            if (handlers && handlers.onReset) handlers.onReset();
            var s = getEl('dlg-settings');
            if (s && s.open) s.close();
          }
        });
      }
    },

    announce: announce,

    openSettings: function () {
      this.refreshSettings();
      var d = getEl('dlg-settings');
      if (d && !d.open) d.showModal();
    },

    refreshSettings: function () {
      var curLang = root.COG.i18n.getLang();
      var btns = document.querySelectorAll('[data-set-lang]');
      for (var i = 0; i < btns.length; i++) {
        var code = btns[i].getAttribute('data-set-lang');
        btns[i].classList.toggle('is-active', code === curLang);
      }
      var soundBtn = getEl('dlg-sound-toggle');
      if (soundBtn) {
        var on = root.COG.Audio.isEnabled();
        soundBtn.textContent = (on ? '🔊 ' : '🔇 ') + root.COG.i18n.t(on ? 'ui.soundOn' : 'ui.soundOff');
      }
    },

    openHelp: function () {
      var d = getEl('dlg-help');
      if (d && !d.open) d.showModal();
    },

    openCodex: function (filterBook) {
      if (filterBook) activeBookFilter = filterBook;
      this.renderCodex();
      var d = getEl('dlg-codex');
      if (d && !d.open) d.showModal();
    },

    renderCodex: function () {
      var t = function (k) { return root.COG.i18n.t(k); };
      var filtersEl = getEl('codex-filters');
      var listEl = getEl('codex-list');
      if (!filtersEl || !listEl) return;

      var books = [
        { id: 'all', label: t('ui.allChapters') },
        { id: 'genesis', label: t('ui.genesisBook') },
        { id: 'exodus', label: t('ui.exodusBook') },
        { id: 'daniel', label: t('ui.danielBook') }
      ];
      filtersEl.innerHTML = '';
      books.forEach(function (b) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = activeBookFilter === b.id ? 'btn-primary-gold' : 'btn-ghost';
        btn.textContent = b.label;
        btn.addEventListener('click', function () {
          activeBookFilter = b.id;
          Dialogs.renderCodex();
        });
        filtersEl.appendChild(btn);
      });

      var entries = (root.COG.DATA && root.COG.DATA.BIBLE) || [];
      var filtered = entries.filter(function (e) {
        return activeBookFilter === 'all' || e.book === activeBookFilter;
      });
      listEl.innerHTML = '';
      filtered.forEach(function (entry) {
        var box = document.createElement('article');
        box.className = 'codex-entry';
        var ref = document.createElement('div');
        ref.className = 'codex-ref';
        ref.textContent = t('bible.' + entry.id + '.ref');
        var txt = document.createElement('p');
        txt.className = 'codex-text';
        txt.textContent = t('bible.' + entry.id + '.text');
        box.appendChild(ref);
        box.appendChild(txt);
        listEl.appendChild(box);
      });
    },

    openInventory: function (onGuideSelected) {
      this.renderInventory(onGuideSelected);
      var d = getEl('dlg-inventory');
      if (d && !d.open) d.showModal();
    },

    renderInventory: function (onGuideSelected) {
      var t = function (k, v) { return root.COG.i18n.t(k, v); };
      var state = root.COG.State.get();
      var lv = root.COG.State.getPlayerLevel();
      var guidesEl = getEl('guides-list');
      var itemsEl = getEl('items-list');
      if (!guidesEl || !itemsEl) return;

      guidesEl.innerHTML = '';
      (root.COG.DATA.GUIDES || []).forEach(function (g) {
        var unlocked = lv >= g.unlockLevel;
        var active = state.activeGuideId === g.id;
        var card = document.createElement('div');
        card.className = 'info-card';

        var title = document.createElement('div');
        title.className = 'codex-ref';
        title.textContent = g.icon + ' ' + t('guides.' + g.id + '.name') + ' — ' + t('guides.' + g.id + '.role');

        var desc = document.createElement('p');
        desc.className = 'codex-text';
        desc.textContent = unlocked
          ? t('guides.' + g.id + '.desc') + ' ' + t('guides.' + g.id + '.quote')
          : t('ui.requiresLevel', { lv: g.unlockLevel });

        card.appendChild(title);
        card.appendChild(desc);

        if (unlocked) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = active ? 'btn-primary-gold mt-lg' : 'btn-ghost mt-lg';
          btn.style.marginTop = '8px';
          btn.textContent = active ? t('ui.selected') : t('ui.selectGuide');
          btn.addEventListener('click', function () {
            root.COG.State.setActiveGuide(g.id);
            Dialogs.renderInventory(onGuideSelected);
            if (onGuideSelected) onGuideSelected(g);
          });
          card.appendChild(btn);
        }
        guidesEl.appendChild(card);
      });

      itemsEl.innerHTML = '';
      (root.COG.DATA.ITEMS || []).forEach(function (item) {
        var has = state.unlockedItems.indexOf(item.id) !== -1;
        var card = document.createElement('div');
        card.className = 'info-card';
        var title = document.createElement('div');
        title.className = 'codex-ref';
        title.textContent = item.icon + ' ' + t('items.' + item.id + '.name') + ' [' + t(has ? 'ui.unlocked' : 'ui.locked') + ']';
        var desc = document.createElement('p');
        desc.className = 'codex-text';
        desc.textContent = t('items.' + item.id + '.desc') + ' (' + t('items.' + item.id + '.effectLabel') + ')';
        card.appendChild(title);
        card.appendChild(desc);
        itemsEl.appendChild(card);
      });
    },

    openEdenChoice: function (callbacks) {
      var d = getEl('dlg-eden-choice');
      var verseEl = getEl('eden-choice-verse');
      if (verseEl) {
        verseEl.textContent = root.COG.i18n.t('bible.gen_2_16_17.ref') + ' — “' + root.COG.i18n.t('bible.gen_2_16_17.text') + '”';
      }
      var btnResist = getEl('btn-eden-resist');
      var btnEat = getEl('btn-eden-eat');

      btnResist.onclick = function () {
        if (d.open) d.close();
        if (callbacks && callbacks.onResist) callbacks.onResist();
      };
      btnEat.onclick = function () {
        if (d.open) d.close();
        if (callbacks && callbacks.onEat) callbacks.onEat();
      };
      if (d && !d.open) d.showModal();
    },

    openResult: function (opts) {
      var t = function (k) { return root.COG.i18n.t(k); };
      var d = getEl('dlg-result');
      var titleEl = getEl('dlg-result-title');
      var starsEl = getEl('dlg-result-stars');
      var sumEl = getEl('dlg-result-summary');
      var verseEl = getEl('dlg-result-verse');
      var unlocksEl = getEl('dlg-result-unlocks');
      var btnMap = getEl('btn-result-map');
      var btnRetry = getEl('btn-result-retry');
      var btnNext = getEl('btn-result-next');

      titleEl.textContent = opts.win ? (opts.customTitle || t('ui.levelClear')) : t('ui.levelFailed');
      if (opts.win) {
        var filled = '';
        for (var i = 0; i < 3; i++) filled += i < (opts.stars || 1) ? '★' : '☆';
        starsEl.textContent = filled + '  +' + (opts.earnedScore || 0) + ' ' + t('ui.score');
      } else {
        starsEl.textContent = '💔';
      }
      sumEl.textContent = opts.summary || '';

      if (opts.scriptureId) {
        verseEl.textContent = t('bible.' + opts.scriptureId + '.ref') + ' — “' + t('bible.' + opts.scriptureId + '.text') + '”';
        verseEl.hidden = false;
      } else {
        verseEl.hidden = true;
      }

      unlocksEl.innerHTML = '';
      if (opts.newItemUnlocked) {
        var pItem = document.createElement('p');
        pItem.className = 'codex-ref';
        pItem.textContent = '🎁 ' + t('ui.itemObtained') + ': ' + t('items.' + opts.newItemUnlocked + '.name');
        unlocksEl.appendChild(pItem);
      }
      if (opts.newGuidesUnlocked && opts.newGuidesUnlocked.length) {
        opts.newGuidesUnlocked.forEach(function (g) {
          var pg = document.createElement('p');
          pg.className = 'codex-ref';
          pg.textContent = g.icon + ' ' + t('ui.guideUnlocked') + ': ' + t('guides.' + g.id + '.name');
          unlocksEl.appendChild(pg);
        });
      }

      btnNext.hidden = !opts.hasNext;
      btnMap.onclick = function () {
        if (d.open) d.close();
        if (opts.onMap) opts.onMap();
      };
      btnRetry.onclick = function () {
        if (d.open) d.close();
        if (opts.onRetry) opts.onRetry();
      };
      btnNext.onclick = function () {
        if (d.open) d.close();
        if (opts.onNext) opts.onNext();
      };

      if (d && !d.open) d.showModal();
    },

    openEnding: function () {
      var t = function (k) { return root.COG.i18n.t(k); };
      var state = root.COG.State.get();
      var totalScore = root.COG.State.getTotalScore();
      var completed = root.COG.State.getCompletedCount();

      var endingKey = 'pilgrim';
      var emblem = '🕊️';
      if (state.edenRoute === 'preserved' && completed >= 12) {
        endingKey = 'crown';
        emblem = '👑';
      } else if (completed >= 6 || state.completedLevels['sinai-4']) {
        endingKey = 'covenant';
        emblem = '📜';
      }

      getEl('ending-emblem').textContent = emblem;
      getEl('ending-headline').textContent = t('games.sinai.endings.' + endingKey + '.title');
      getEl('ending-desc').textContent = t('games.sinai.endings.' + endingKey + '.desc');
      getEl('ending-stats').innerHTML =
        '<span class="inline-pill">' + t('ui.score') + ': ' + totalScore.toLocaleString() + '</span>' +
        '<span class="inline-pill">' + t('ui.level') + ': ' + root.COG.State.getPlayerLevel() + '</span>' +
        '<span class="inline-pill">' + t('ui.faith') + ': ' + state.stats.faith + '</span>' +
        '<span class="inline-pill">' + t('ui.route') + ': ' + t('ui.route' + state.edenRoute.charAt(0).toUpperCase() + state.edenRoute.slice(1)) + '</span>';

      var d = getEl('dlg-ending');
      if (d && !d.open) d.showModal();
    }
  };

  root.COG.Dialogs = Dialogs;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dialogs;
  }
})(typeof window !== 'undefined' ? window : globalThis);
