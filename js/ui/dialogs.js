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
        root.COG.RpgEngine.pause();
        d.showModal();
      }
    },

    openWorldMap: function (onTravel) {
      this.renderWorldMap(onTravel);
      this.openModal('dlg-map');
    },

    renderWorldMap: function (onTravel) {
      var t = function (k) { return root.COG.i18n.t(k); };
      var st = root.COG.State.get();
      var grid = el('world-map-grid');
      if (!grid) return;
      grid.innerHTML = '';

      (root.COG.DATA.ZONES || []).forEach(function (z) {
        var isCur = st.activeZoneId === z.id;
        var doneCount = z.quests.filter(function (q) { return !!st.completedQuests[q.id]; }).length;

        var card = document.createElement('article');
        card.className = 'zone-card' + (isCur ? ' is-current' : '');
        card.style.borderTopColor = z.accent;
        card.style.borderTopWidth = '4px';

        var title = document.createElement('h3');
        title.textContent = t('zones.' + z.id + '.title');

        var meta = document.createElement('p');
        meta.textContent = t('zones.' + z.id + '.period') + ' · ' + t('viewpoints.' + z.viewpoint);

        var desc = document.createElement('p');
        desc.textContent = t('zones.' + z.id + '.desc');

        var prog = document.createElement('p');
        prog.style.color = '#fde68a';
        prog.textContent = t('ui.questsDone') + ': ' + doneCount + '/' + z.quests.length +
          (z.isHighestScoreZone ? ' · 👑 ' + t('ui.highestScoreBadge') : '');

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = isCur ? 'btn-secondary' : 'btn-primary-gold';
        btn.textContent = isCur ? t('ui.currentZone') : t('ui.travelToZone');
        btn.addEventListener('click', function () {
          var dlg = el('dlg-map');
          if (dlg && dlg.open) dlg.close();
          if (onTravel) onTravel(z.id);
        });

        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(desc);
        card.appendChild(prog);
        card.appendChild(btn);
        grid.appendChild(card);
      });
    },

    openCharacterSheet: function (onUpdate) {
      this.renderCharacterSheet(onUpdate);
      this.openModal('dlg-char');
    },

    renderCharacterSheet: function (onUpdate) {
      var t = function (k, v) { return root.COG.i18n.t(k, v); };
      var st = root.COG.State.get();
      var drv = root.COG.State.getDerivedStats();

      var sum = el('char-stats-summary');
      if (sum) {
        sum.innerHTML =
          '<span class="inline-pill">' + t('ui.level') + ' ' + st.level + '</span>' +
          '<span class="inline-pill">' + t('ui.atk') + ' ' + drv.atk + '</span>' +
          '<span class="inline-pill">' + t('ui.def') + ' ' + drv.def + '</span>' +
          '<span class="inline-pill">' + t('ui.hp') + ' ' + drv.maxHp + '</span>' +
          '<span class="inline-pill">' + t('ui.mp') + ' ' + drv.maxMp + '</span>' +
          '<span class="inline-pill">' + t('ui.faith') + ' ' + st.stats.faith + '</span>' +
          '<span class="inline-pill">' + t('ui.wisdom') + ' ' + st.stats.wisdom + '</span>' +
          '<span class="inline-pill">' + t('ui.mercy') + ' ' + st.stats.mercy + '</span>';
      }

      var spBadge = el('char-sp-badge');
      if (spBadge) spBadge.textContent = t('ui.skillPoints') + ': ' + st.skillPoints;

      var skillsList = el('char-skills-list');
      if (skillsList) {
        skillsList.innerHTML = '';
        (root.COG.DATA.SKILLS || []).forEach(function (sk) {
          var lv = st.skillLevels[sk.id] || 1;
          var row = document.createElement('div');
          row.className = 'info-card';
          var left = document.createElement('div');
          left.innerHTML = '<div class="codex-ref">[' + sk.hotkey + '] ' + t('skills.' + sk.id + '.name') + ' (Lv.' + lv + '/' + sk.maxLevel + ')</div>' +
            '<p class="codex-text">' + t('skills.' + sk.id + '.desc') + '</p>';
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn-primary-gold';
          btn.disabled = st.skillPoints <= 0 || lv >= sk.maxLevel;
          btn.textContent = lv >= sk.maxLevel ? t('ui.maxed') : t('ui.upgradeSkill');
          btn.addEventListener('click', function () {
            if (root.COG.State.upgradeSkill(sk.id)) {
              root.COG.Audio.play('levelup');
              Dialogs.renderCharacterSheet(onUpdate);
              if (onUpdate) onUpdate();
            }
          });
          row.appendChild(left);
          row.appendChild(btn);
          skillsList.appendChild(row);
        });
      }

      var slotsEl = el('char-equipped-slots');
      if (slotsEl) {
        var slotMap = [
          { key: 'weapon', label: t('ui.slotWeapon') },
          { key: 'cloak', label: t('ui.slotCloak') },
          { key: 'relic', label: t('ui.slotRelic') }
        ];
        slotsEl.innerHTML = '';
        slotMap.forEach(function (sl) {
          var id = st.equipped[sl.key];
          var box = document.createElement('div');
          box.className = 'equip-slot-box';
          box.innerHTML = '<strong>' + sl.label + '</strong><div>' + (id ? t('items.' + id + '.name') : t('ui.slotEmpty')) + '</div>';
          slotsEl.appendChild(box);
        });
      }

      var itemsEl = el('char-items-list');
      if (itemsEl) {
        itemsEl.innerHTML = '';
        (root.COG.DATA.ITEMS || []).forEach(function (it) {
          var owned = st.unlockedItems.indexOf(it.id) !== -1;
          var isEq = st.equipped[it.slot] === it.id;
          var row = document.createElement('div');
          row.className = 'info-card';
          var left = document.createElement('div');
          left.innerHTML = '<div class="codex-ref">' + t('items.' + it.id + '.name') + ' [' + t(owned ? 'ui.unlocked' : 'ui.locked') + ']</div>' +
            '<p class="codex-text">' + t('items.' + it.id + '.desc') + '</p>';
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = isEq ? 'btn-secondary' : 'btn-primary-gold';
          btn.disabled = !owned || isEq;
          btn.textContent = isEq ? t('ui.equipped') : t('ui.equip');
          btn.addEventListener('click', function () {
            if (root.COG.State.equipItem(it.id)) {
              root.COG.Audio.play('click');
              Dialogs.renderCharacterSheet(onUpdate);
              if (onUpdate) onUpdate();
            }
          });
          row.appendChild(left);
          row.appendChild(btn);
          itemsEl.appendChild(row);
        });
      }

      var guidesEl = el('char-guides-list');
      if (guidesEl) {
        guidesEl.innerHTML = '';
        (root.COG.DATA.GUIDES || []).forEach(function (g) {
          var unlocked = st.level >= g.unlockLevel;
          var active = st.activeGuideId === g.id;
          var row = document.createElement('div');
          row.className = 'info-card';
          var left = document.createElement('div');
          left.innerHTML = '<div class="codex-ref">' + t('guides.' + g.id + '.name') + ' — ' + t('guides.' + g.id + '.role') + '</div>' +
            '<p class="codex-text">' + (unlocked ? t('guides.' + g.id + '.desc') : t('ui.requiresLevel', { lv: g.unlockLevel })) + '</p>';
          row.appendChild(left);
          if (unlocked) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = active ? 'btn-secondary' : 'btn-primary-gold';
            btn.disabled = active;
            btn.textContent = active ? t('ui.selected') : t('ui.selectGuide');
            btn.addEventListener('click', function () {
              root.COG.State.setActiveGuide(g.id);
              root.COG.Audio.play('click');
              Dialogs.renderCharacterSheet(onUpdate);
              if (onUpdate) onUpdate();
            });
            row.appendChild(btn);
          }
          guidesEl.appendChild(row);
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
        btn.className = activeBookFilter === b.id ? 'btn-primary-gold' : 'btn-ghost';
        btn.textContent = b.label;
        btn.addEventListener('click', function () {
          activeBookFilter = b.id;
          Dialogs.renderCodex();
        });
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

    openHelp: function () {
      this.openModal('dlg-help');
    },

    openEnding: function () {
      var t = function (k) { return root.COG.i18n.t(k); };
      var st = root.COG.State.get();
      var bossesDefeated = Object.keys(st.defeatedBosses).length;
      var key = 'pilgrim';
      var emblem = '🕊️';
      if (st.edenRoute === 'preserved' && bossesDefeated >= 3) {
        key = 'crown';
        emblem = '👑';
      } else if (st.defeatedBosses['boss_amalek'] || bossesDefeated >= 3) {
        key = 'covenant';
        emblem = '📜';
      }

      el('ending-emblem').textContent = emblem;
      el('ending-headline').textContent = t('endings.' + key + '.title');
      el('ending-desc').textContent = t('endings.' + key + '.desc');
      el('ending-stats').innerHTML =
        '<span class="inline-pill">' + t('ui.score') + ': ' + root.COG.State.getTotalScore().toLocaleString() + '</span>' +
        '<span class="inline-pill">' + t('ui.level') + ' ' + st.level + '</span>' +
        '<span class="inline-pill">' + t('ui.faith') + ': ' + st.stats.faith + '</span>' +
        '<span class="inline-pill">' + t('ui.wisdom') + ': ' + st.stats.wisdom + '</span>' +
        '<span class="inline-pill">' + t('ui.mercy') + ': ' + st.stats.mercy + '</span>';

      this.openModal('dlg-ending');
    },

    openDialogueBox: function (dialogueId, callbacks) {
      var dlgData = (root.COG.DATA.DIALOGUES || {})[dialogueId];
      if (!dlgData) {
        if (callbacks && callbacks.onClose) callbacks.onClose();
        return;
      }
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
      el('dlg-portrait').innerHTML = root.COG.Sprites.getPortraitSvg(s.data.portrait);
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
            if (ch.effects && s.callbacks && s.callbacks.onEffect) {
              s.callbacks.onEffect(ch.effects);
            }
            s.nodeId = ch.next;
            Dialogs.renderDialogueNode();
          });
          choicesEl.appendChild(btn);
        });
      } else {
        var endBtn = document.createElement('button');
        endBtn.type = 'button';
        endBtn.className = 'btn-primary-gold';
        endBtn.textContent = t('ui.endDialogue');
        endBtn.addEventListener('click', function () {
          root.COG.Audio.play('click');
          if (node.effects && s.callbacks && s.callbacks.onEffect) {
            s.callbacks.onEffect(node.effects);
          }
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
