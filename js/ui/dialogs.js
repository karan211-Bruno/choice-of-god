(function (root) {
  'use strict';
  root.COG = root.COG || {};

  function el(id) { return document.getElementById(id); }

  function announce(msg) {
    var node = el('live-announcer');
    if (!node) return;
    node.textContent = '';
    setTimeout(function () { node.textContent = msg; }, 25);
  }

  function installLightDismissFallback() {
    if (typeof HTMLDialogElement === 'undefined') return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    var outside = function (e, dialog) {
      var r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    var dlgs = document.querySelectorAll('dialog[closedby="any"]');
    for (var i = 0; i < dlgs.length; i++) {
      (function (dlg) {
        var pressedOutside = false;
        dlg.addEventListener('pointerdown', function (e) { pressedOutside = outside(e, dlg); });
        dlg.addEventListener('pointerup', function (e) {
          if (pressedOutside && outside(e, dlg)) dlg.close();
          pressedOutside = false;
        });
      })(dlgs[i]);
    }
  }

  var activeBookFilter = 'all';
  var activeDialogueSession = null;

  var Dialogs = {
    init: function (handlers) {
      installLightDismissFallback();

      var closes = document.querySelectorAll('[data-close-dialog]');
      for (var i = 0; i < closes.length; i++) {
        closes[i].addEventListener('click', function () {
          var d = el(this.getAttribute('data-close-dialog'));
          if (d && d.open) d.close();
        });
      }

      var all = document.querySelectorAll('dialog');
      for (var j = 0; j < all.length; j++) {
        (function (dlg) {
          dlg.addEventListener('close', function () {
            dlg.returnValue = '';
            if (handlers && handlers.onDialogClosed) handlers.onDialogClosed();
          });
          if (dlg.getAttribute('closedby') === 'none') {
            dlg.addEventListener('cancel', function (e) { e.preventDefault(); });
          }
        })(all[j]);
      }

      var langBtns = document.querySelectorAll('[data-set-lang]');
      for (var k = 0; k < langBtns.length; k++) {
        langBtns[k].addEventListener('click', function () {
          var code = this.getAttribute('data-set-lang');
          if (handlers && handlers.onChangeLang) handlers.onChangeLang(code);
          Dialogs.refreshSettings();
        });
      }

      var sndBtn = el('dlg-sound-toggle');
      if (sndBtn) {
        sndBtn.addEventListener('click', function () {
          if (handlers && handlers.onToggleSound) handlers.onToggleSound();
          Dialogs.refreshSettings();
        });
      }

      var rstBtn = el('dlg-reset-btn');
      if (rstBtn) {
        rstBtn.addEventListener('click', function () {
          if (window.confirm(root.COG.i18n.t('ui.resetConfirm'))) {
            if (handlers && handlers.onReset) handlers.onReset();
            var s = el('dlg-settings');
            if (s && s.open) s.close();
          }
        });
      }
    },

    announce: announce,

    openModal: function (id) {
      var d = el(id);
      if (d && !d.open) {
        root.COG.StageHost.pause();
        d.showModal();
      }
    },

    openInventory: function (onGuidePicked) {
      this.renderInventory(onGuidePicked);
      this.openModal('dlg-inventory');
    },

    renderInventory: function (onGuidePicked) {
      var t = function (k, v) { return root.COG.i18n.t(k, v); };
      var st = root.COG.State.get();

      var gEl = el('inv-guides-list');
      if (gEl) {
        gEl.innerHTML = '';
        (root.COG.DATA.GUIDES || []).forEach(function (g) {
          var unlocked = st.level >= g.unlockLevel;
          var active = st.activeGuideId === g.id;
          var card = document.createElement('div');
          card.className = 'info-card';
          card.innerHTML = '<div><div class="codex-ref">' + t('guides.' + g.id + '.name') + ' — ' + t('guides.' + g.id + '.role') + '</div>' +
            '<p class="codex-text">' + (unlocked ? t('guides.' + g.id + '.desc') + ' ' + t('guides.' + g.id + '.quote') : t('ui.requiresLevel', { lv: g.unlockLevel })) + '</p></div>';
          if (unlocked) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = active ? 'btn-soft' : 'btn-sunny';
            btn.disabled = active;
            btn.textContent = active ? t('ui.selected') : t('ui.selectGuide');
            btn.addEventListener('click', function () {
              root.COG.State.setActiveGuide(g.id);
              Dialogs.renderInventory(onGuidePicked);
              if (onGuidePicked) onGuidePicked();
            });
            card.appendChild(btn);
          }
          gEl.appendChild(card);
        });
      }

      var iEl = el('inv-items-list');
      if (iEl) {
        iEl.innerHTML = '';
        (root.COG.DATA.ITEMS || []).forEach(function (it) {
          var owned = st.unlockedItems.indexOf(it.id) !== -1;
          var card = document.createElement('div');
          card.className = 'info-card';
          card.innerHTML = '<div><div class="codex-ref">' + t('items.' + it.id + '.name') + ' [' + t(owned ? 'ui.unlocked' : 'ui.locked') + ']</div>' +
            '<p class="codex-text">' + t('items.' + it.id + '.desc') + '</p></div>';
          iEl.appendChild(card);
        });
      }
    },

    openCodex: function () {
      this.renderCodex();
      this.openModal('dlg-codex');
    },

    renderCodex: function () {
      var t = function (k) { return root.COG.i18n.t(k); };
      var filtersEl = el('codex-filters');
      var listEl = el('codex-list');
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
        btn.className = activeBookFilter === b.id ? 'btn-sunny' : 'btn-soft';
        btn.textContent = b.label;
        btn.addEventListener('click', function () { activeBookFilter = b.id; Dialogs.renderCodex(); });
        filtersEl.appendChild(btn);
      });

      listEl.innerHTML = '';
      (root.COG.DATA.BIBLE || []).forEach(function (entry) {
        if (activeBookFilter !== 'all' && entry.book !== activeBookFilter) return;
        var box = document.createElement('article');
        box.className = 'codex-entry';
        box.innerHTML = '<div class="codex-ref">' + t('bible.' + entry.id + '.ref') + '</div>' +
          '<p class="codex-text">' + t('bible.' + entry.id + '.text') + '</p>';
        listEl.appendChild(box);
      });
    },

    openSettings: function () {
      this.refreshSettings();
      this.openModal('dlg-settings');
    },

    refreshSettings: function () {
      var cur = root.COG.i18n.getLang();
      var btns = document.querySelectorAll('[data-set-lang]');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('is-active', btns[i].getAttribute('data-set-lang') === cur);
      }
      var snd = el('dlg-sound-toggle');
      if (snd) {
        var on = root.COG.Audio.isEnabled();
        snd.textContent = (on ? '🔊 ' : '🔇 ') + root.COG.i18n.t(on ? 'ui.soundOn' : 'ui.soundOff');
      }
    },

    openHelp: function () { this.openModal('dlg-help'); },

    openResult: function (opts) {
      var t = function (k) { return root.COG.i18n.t(k); };
      var d = el('dlg-result');
      el('dlg-result-title').textContent = opts.win ? t('ui.stageClear') : t('ui.stageFailed');

      if (opts.win) {
        el('res-stars').textContent = '★'.repeat(opts.stars || 1) + '☆'.repeat(3 - (opts.stars || 1)) + '  +' + (opts.score || 0) + ' ' + t('ui.score');
      } else {
        el('res-stars').textContent = '🌱';
      }
      el('res-summary').textContent = opts.summary || '';

      var verseEl = el('res-verse');
      if (opts.scriptureId) {
        verseEl.textContent = t('bible.' + opts.scriptureId + '.ref') + ' — “' + t('bible.' + opts.scriptureId + '.text') + '”';
        verseEl.hidden = false;
      } else {
        verseEl.hidden = true;
      }

      var unlocks = el('res-unlocks');
      unlocks.innerHTML = '';
      if (opts.newItem) {
        var p = document.createElement('p');
        p.className = 'codex-ref';
        p.textContent = '🎁 ' + t('items.' + opts.newItem + '.name');
        unlocks.appendChild(p);
      }
      if (opts.newGuides && opts.newGuides.length) {
        opts.newGuides.forEach(function (g) {
          var pg = document.createElement('p');
          pg.className = 'codex-ref';
          pg.textContent = '👼 ' + t('guides.' + g.id + '.name');
          unlocks.appendChild(pg);
        });
      }

      var btnNext = el('btn-res-next');
      btnNext.hidden = !opts.hasNext;
      el('btn-res-map').onclick = function () { if (d.open) d.close(); if (opts.onMap) opts.onMap(); };
      el('btn-res-retry').onclick = function () { if (d.open) d.close(); if (opts.onRetry) opts.onRetry(); };
      btnNext.onclick = function () { if (d.open) d.close(); if (opts.onNext) opts.onNext(); };

      if (d && !d.open) d.showModal();
    },

    openEnding: function () {
      var t = function (k) { return root.COG.i18n.t(k); };
      var st = root.COG.State.get();
      var cnt = root.COG.State.getCompletedCount();
      var key = 'pilgrim';
      var art = './assets/art/abraham.png';
      if (st.edenRoute === 'preserved' && cnt >= 3) {
        key = 'crown';
        art = './assets/art/adam_eve.png';
      } else if (st.completedStages.sinai || cnt >= 4) {
        key = 'covenant';
        art = './assets/art/moses.png';
      }

      el('ending-art').src = art;
      el('ending-headline').textContent = t('endings.' + key + '.title');
      el('ending-desc').textContent = t('endings.' + key + '.desc');
      el('ending-stats').innerHTML =
        '<span class="guide-pill">' + t('ui.score') + ': ' + root.COG.State.getTotalScore().toLocaleString() + '</span>' +
        '<span class="guide-pill">' + t('ui.level') + ' ' + st.level + '</span>' +
        '<span class="guide-pill">' + t('ui.faith') + ': ' + st.stats.faith + '</span>' +
        '<span class="guide-pill">' + t('ui.wisdom') + ': ' + st.stats.wisdom + '</span>' +
        '<span class="guide-pill">' + t('ui.mercy') + ': ' + st.stats.mercy + '</span>';

      this.openModal('dlg-ending');
    },

    openDialogueBox: function (dialogueId, callbacks) {
      var dlgData = (root.COG.DATA.DIALOGUES || {})[dialogueId];
      if (!dlgData) { if (callbacks && callbacks.onClose) callbacks.onClose(); return; }
      activeDialogueSession = { data: dlgData, nodeId: 'start', callbacks: callbacks };
      this.renderDialogueNode();
    },

    refreshActiveDialogue: function () {
      if (activeDialogueSession) this.renderDialogueNode();
    },

    renderDialogueNode: function () {
      if (!activeDialogueSession) return;
      var t = function (k) { return root.COG.i18n.t(k); };
      var s = activeDialogueSession;
      var node = s.data.nodes[s.nodeId];
      var box = el('dialogue-box');
      if (!node || !box) {
        if (box) box.hidden = true;
        var cb = s.callbacks;
        activeDialogueSession = null;
        if (cb && cb.onClose) cb.onClose();
        return;
      }

      box.hidden = false;
      el('dlg-portrait-img').src = s.data.portrait;
      el('dlg-npc-name').textContent = t('speakers.' + s.data.speaker);
      el('dlg-npc-text').textContent = t(node.textKey);

      var verseEl = el('dlg-npc-verse');
      if (node.scriptureId) {
        verseEl.textContent = t('bible.' + node.scriptureId + '.ref') + ' — “' + t('bible.' + node.scriptureId + '.text') + '”';
        verseEl.hidden = false;
      } else {
        verseEl.hidden = true;
      }

      var choicesEl = el('dlg-choices');
      choicesEl.innerHTML = '';

      if (node.choices && node.choices.length) {
        node.choices.forEach(function (ch) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'dlg-choice-btn';
          btn.textContent = t(ch.textKey);
          btn.addEventListener('click', function () {
            root.COG.Audio.play('choice');
            if (ch.effects && s.callbacks && s.callbacks.onEffect) s.callbacks.onEffect(ch.effects);
            s.nodeId = ch.next;
            Dialogs.renderDialogueNode();
          });
          choicesEl.appendChild(btn);
        });
      } else {
        var endBtn = document.createElement('button');
        endBtn.type = 'button';
        endBtn.className = 'btn-sunny';
        endBtn.textContent = t('ui.endDialogue');
        endBtn.addEventListener('click', function () {
          root.COG.Audio.play('click');
          box.hidden = true;
          var cb = s.callbacks;
          activeDialogueSession = null;
          if (cb && cb.onClose) cb.onClose();
        });
        choicesEl.appendChild(endBtn);
      }
    }
  };

  root.COG.Dialogs = Dialogs;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dialogs;
  }
})(typeof window !== 'undefined' ? window : globalThis);
