(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var STORAGE_KEY = 'cog_save_v2';

  function cloneDefault() {
    return {
      lang: 'ko',
      sound: true,
      xp: 0,
      level: 1,
      skillPoints: 1,
      skillLevels: { nova: 1, beam: 1, grace: 1 },
      equipped: { weapon: 'word_of_light', cloak: null, relic: null },
      unlockedItems: ['word_of_light', 'staff_of_moses'],
      activeGuideId: 'cherubim',
      activeZoneId: 'eden',
      completedQuests: {}, // { questId: true }
      defeatedBosses: {},  // { bossId: true }
      collectedNodes: {},  // { nodeId: true }
      stats: { faith: 10, wisdom: 10, mercy: 10 },
      edenRoute: 'undecided', // 'undecided' | 'preserved' | 'fallen'
      score: 0
    };
  }

  var stateData = cloneDefault();
  var listeners = [];

  function emit() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](stateData); } catch (_) {}
    }
  }

  function xpForNext(lv) {
    return 140 + (lv - 1) * 70;
  }

  var State = {
    load: function () {
      var raw = null;
      try { raw = root.localStorage ? root.localStorage.getItem(STORAGE_KEY) : null; } catch (_) {}
      if (raw) {
        try {
          var p = JSON.parse(raw);
          if (p && typeof p === 'object') {
            var base = cloneDefault();
            stateData = Object.assign(base, p);
            stateData.skillLevels = Object.assign(base.skillLevels, p.skillLevels || {});
            stateData.equipped = Object.assign(base.equipped, p.equipped || {});
            stateData.stats = Object.assign(base.stats, p.stats || {});
            stateData.completedQuests = p.completedQuests || {};
            stateData.defeatedBosses = p.defeatedBosses || {};
            stateData.collectedNodes = p.collectedNodes || {};
            stateData.unlockedItems = Array.isArray(p.unlockedItems) && p.unlockedItems.length
              ? p.unlockedItems : base.unlockedItems;
          }
        } catch (_) {
          stateData = cloneDefault();
        }
      }
      return stateData;
    },

    save: function () {
      try {
        if (root.localStorage) {
          root.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateData));
        }
      } catch (_) {}
    },

    reset: function () {
      var keepLang = stateData.lang;
      var keepSound = stateData.sound;
      stateData = cloneDefault();
      stateData.lang = keepLang;
      stateData.sound = keepSound;
      this.save();
      emit();
    },

    get: function () {
      return stateData;
    },

    getXpNeeded: function () {
      return xpForNext(stateData.level);
    },

    getPlayerLevel: function () {
      return stateData.level;
    },

    getTotalScore: function () {
      return Number(stateData.score || 0) + (stateData.edenRoute === 'preserved' ? 5000 : 0);
    },

    setLang: function (lang) {
      stateData.lang = lang;
      this.save();
      emit();
    },

    setSound: function (enabled) {
      stateData.sound = !!enabled;
      this.save();
      emit();
    },

    setActiveZone: function (zoneId) {
      stateData.activeZoneId = zoneId;
      this.save();
      emit();
    },

    getUnlockedGuides: function () {
      var guides = (root.COG.DATA && root.COG.DATA.GUIDES) || [];
      return guides.filter(function (g) { return stateData.level >= g.unlockLevel; });
    },

    getActiveGuide: function () {
      var guides = (root.COG.DATA && root.COG.DATA.GUIDES) || [];
      var unlocked = this.getUnlockedGuides();
      var found = unlocked.find(function (g) { return g.id === stateData.activeGuideId; });
      return found || unlocked[0] || guides[0];
    },

    setActiveGuide: function (guideId) {
      var unlocked = this.getUnlockedGuides();
      if (unlocked.some(function (g) { return g.id === guideId; })) {
        stateData.activeGuideId = guideId;
        this.save();
        emit();
        return true;
      }
      return false;
    },

    getDerivedStats: function () {
      var maxHp = 120 + (stateData.level - 1) * 18;
      var maxMp = 80 + (stateData.level - 1) * 10;
      var atk = 18 + (stateData.level - 1) * 3;
      var def = 3 + (stateData.level - 1) * 1;
      var speed = 235;
      var mpRegen = 4.5;
      var scorePct = 0;

      var items = (root.COG.DATA && root.COG.DATA.ITEMS) || [];
      ['weapon', 'cloak', 'relic'].forEach(function (slot) {
        var id = stateData.equipped[slot];
        if (!id) return;
        var it = items.find(function (x) { return x.id === id; });
        if (it && it.stats) {
          atk += it.stats.atk || 0;
          def += it.stats.def || 0;
          maxHp += it.stats.hp || 0;
          maxMp += it.stats.mp || 0;
          speed += it.stats.speed || 0;
        }
      });

      var guide = this.getActiveGuide();
      if (guide && guide.buff) {
        atk += guide.buff.atk || 0;
        def += guide.buff.def || 0;
        speed += guide.buff.speed || 0;
        mpRegen += guide.buff.mpRegen || 0;
        scorePct += guide.buff.scorePct || 0;
      }

      return { maxHp: maxHp, maxMp: maxMp, atk: atk, def: def, speed: speed, mpRegen: mpRegen, scorePct: scorePct };
    },

    unlockItem: function (itemId) {
      if (!itemId) return false;
      var items = (root.COG.DATA && root.COG.DATA.ITEMS) || [];
      var item = items.find(function (i) { return i.id === itemId; });
      if (!item) return false;
      if (stateData.unlockedItems.indexOf(itemId) === -1) {
        stateData.unlockedItems.push(itemId);
        // Auto-equip if slot is empty or strictly stronger
        if (!stateData.equipped[item.slot]) {
          stateData.equipped[item.slot] = itemId;
        }
        this.save();
        emit();
        return true;
      }
      return false;
    },

    equipItem: function (itemId) {
      if (stateData.unlockedItems.indexOf(itemId) === -1) return false;
      var items = (root.COG.DATA && root.COG.DATA.ITEMS) || [];
      var item = items.find(function (i) { return i.id === itemId; });
      if (!item) return false;
      stateData.equipped[item.slot] = itemId;
      this.save();
      emit();
      return true;
    },

    upgradeSkill: function (skillId) {
      var skills = (root.COG.DATA && root.COG.DATA.SKILLS) || [];
      var sk = skills.find(function (s) { return s.id === skillId; });
      if (!sk || stateData.skillPoints <= 0) return false;
      var cur = stateData.skillLevels[skillId] || 1;
      if (cur >= sk.maxLevel) return false;
      stateData.skillLevels[skillId] = cur + 1;
      stateData.skillPoints -= 1;
      this.save();
      emit();
      return true;
    },

    addRewards: function (xpGain, scoreGain, statDelta) {
      var guide = this.getActiveGuide();
      var mult = 1 + ((guide && guide.buff && guide.buff.scorePct) || 0) / 100;
      var finalScore = Math.round((scoreGain || 0) * mult);
      stateData.score += finalScore;
      stateData.xp += Number(xpGain || 0);

      var prevLv = stateData.level;
      var prevGuides = this.getUnlockedGuides().map(function (g) { return g.id; });

      while (stateData.xp >= xpForNext(stateData.level) && stateData.level < 20) {
        stateData.xp -= xpForNext(stateData.level);
        stateData.level += 1;
        stateData.skillPoints += 1;
      }

      if (statDelta) {
        if (statDelta.faith) stateData.stats.faith += statDelta.faith;
        if (statDelta.wisdom) stateData.stats.wisdom += statDelta.wisdom;
        if (statDelta.mercy) stateData.stats.mercy += statDelta.mercy;
      }

      var newGuides = [];
      if (stateData.level > prevLv) {
        var nowGuides = this.getUnlockedGuides();
        for (var i = 0; i < nowGuides.length; i++) {
          if (prevGuides.indexOf(nowGuides[i].id) === -1) {
            newGuides.push(nowGuides[i]);
            stateData.activeGuideId = nowGuides[i].id;
          }
        }
      }

      this.save();
      emit();
      return {
        leveledUp: stateData.level > prevLv,
        newLevel: stateData.level,
        newGuides: newGuides,
        awardedScore: finalScore
      };
    },

    markNodeCollected: function (nodeId) {
      if (stateData.collectedNodes[nodeId]) return false;
      stateData.collectedNodes[nodeId] = true;
      this.save();
      emit();
      return true;
    },

    completeQuest: function (questObj) {
      if (!questObj || stateData.completedQuests[questObj.id]) return null;
      stateData.completedQuests[questObj.id] = true;
      var res = this.addRewards(questObj.xp || 100, questObj.score || 300, { faith: 2 });
      this.save();
      emit();
      return res;
    },

    defeatBoss: function (zoneObj) {
      if (!zoneObj || !zoneObj.boss) return null;
      var firstTime = !stateData.defeatedBosses[zoneObj.boss.id];
      stateData.defeatedBosses[zoneObj.boss.id] = true;

      if (zoneObj.id === 'eden' && stateData.edenRoute === 'undecided') {
        stateData.edenRoute = 'preserved';
      }

      var itemToUnlock = zoneObj.id === 'eden' && stateData.edenRoute === 'fallen'
        ? zoneObj.altRewardItem
        : zoneObj.rewardItem;
      var unlockedNewItem = this.unlockItem(itemToUnlock) ? itemToUnlock : null;

      var qBoss = zoneObj.quests.find(function (q) { return q.type === 'boss'; });
      if (qBoss) stateData.completedQuests[qBoss.id] = true;

      var rewardRes = this.addRewards(
        firstTime ? zoneObj.boss.xp : Math.round(zoneObj.boss.xp * 0.4),
        firstTime ? zoneObj.boss.score : Math.round(zoneObj.boss.score * 0.35),
        { faith: 5, wisdom: 3 }
      );
      rewardRes.unlockedItem = unlockedNewItem;
      return rewardRes;
    },

    setEdenRoute: function (route) {
      if (route === 'preserved' || route === 'fallen' || route === 'undecided') {
        stateData.edenRoute = route;
        if (route === 'preserved') this.unlockItem('tree_of_life_leaf');
        else if (route === 'fallen') this.unlockItem('garment_of_skin');
        this.save();
        emit();
      }
    },

    onChange: function (fn) {
      if (typeof fn === 'function') listeners.push(fn);
    }
  };

  root.COG.State = State;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = State;
  }
})(typeof window !== 'undefined' ? window : globalThis);
