(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var STORAGE_KEY = 'cog_save_v3';

  function cloneDefault() {
    return {
      lang: 'ko',
      sound: true,
      xp: 0,
      level: 1,
      score: 0,
      stats: { faith: 10, wisdom: 10, mercy: 10 },
      edenRoute: 'undecided', // 'undecided' | 'preserved' | 'fallen'
      activeGuideId: 'cherubim',
      activeStageId: 'eden',
      completedStages: {}, // { stageId: { stars, bestScore } }
      unlockedItems: ['word_of_light', 'staff_of_moses']
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
    return 150 + (lv - 1) * 75;
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
            stateData.stats = Object.assign(base.stats, p.stats || {});
            stateData.completedStages = p.completedStages || {};
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

    get: function () { return stateData; },
    getXpNeeded: function () { return xpForNext(stateData.level); },
    getPlayerLevel: function () { return stateData.level; },

    getTotalScore: function () {
      var sum = Number(stateData.score || 0);
      var keys = Object.keys(stateData.completedStages);
      for (var i = 0; i < keys.length; i++) {
        sum += Number(stateData.completedStages[keys[i]].bestScore || 0);
      }
      if (stateData.edenRoute === 'preserved') {
        sum += 5000;
      }
      return sum;
    },

    getCompletedCount: function () {
      return Object.keys(stateData.completedStages).length;
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

    setActiveStage: function (stageId) {
      stateData.activeStageId = stageId;
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

    getPowerBonus: function () {
      var g = this.getActiveGuide();
      var atk = (g && g.buff && g.buff.atk) || 0;
      var def = (g && g.buff && g.buff.def) || 0;
      var hp = 0;
      var items = (root.COG.DATA && root.COG.DATA.ITEMS) || [];
      stateData.unlockedItems.forEach(function (id) {
        var it = items.find(function (x) { return x.id === id; });
        if (it && it.stats) {
          atk += it.stats.atk || 0;
          def += it.stats.def || 0;
          hp += it.stats.hp || 0;
        }
      });
      return { atk: atk + (stateData.level - 1) * 3, def: def + (stateData.level - 1) * 1, hp: hp };
    },

    unlockItem: function (itemId) {
      if (!itemId) return false;
      if (stateData.unlockedItems.indexOf(itemId) === -1) {
        stateData.unlockedItems.push(itemId);
        this.save();
        emit();
        return true;
      }
      return false;
    },

    addStat: function (delta) {
      if (!delta) return;
      if (delta.faith) stateData.stats.faith += delta.faith;
      if (delta.wisdom) stateData.stats.wisdom += delta.wisdom;
      if (delta.mercy) stateData.stats.mercy += delta.mercy;
      if (delta.score) stateData.score += delta.score;
      this.save();
      emit();
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

    completeStage: function (stageObj, earnedScore, stars, extra) {
      var prevLv = stateData.level;
      var prevGuides = this.getUnlockedGuides().map(function (g) { return g.id; });
      var prev = stateData.completedStages[stageObj.id];
      var guide = this.getActiveGuide();
      var mult = 1 + ((guide && guide.buff && guide.buff.scorePct) || 0) / 100;
      var finalScore = Math.max(200, Math.round((earnedScore || stageObj.baseScore) * mult));
      var cleanStars = Math.max(1, Math.min(3, stars || 1));

      if (!prev) {
        stateData.completedStages[stageObj.id] = { stars: cleanStars, bestScore: finalScore };
        stateData.xp += Number(stageObj.xp || 220);
      } else {
        stateData.completedStages[stageObj.id] = {
          stars: Math.max(prev.stars, cleanStars),
          bestScore: Math.max(prev.bestScore, finalScore)
        };
        stateData.xp += Math.round(Number(stageObj.xp || 220) * 0.45);
      }

      while (stateData.xp >= xpForNext(stateData.level) && stateData.level < 20) {
        stateData.xp -= xpForNext(stateData.level);
        stateData.level += 1;
      }

      if (extra) {
        if (extra.faith) stateData.stats.faith += extra.faith;
        if (extra.wisdom) stateData.stats.wisdom += extra.wisdom;
        if (extra.mercy) stateData.stats.mercy += extra.mercy;
      }

      var itemToGive = stageObj.id === 'eden' && stateData.edenRoute === 'fallen'
        ? stageObj.altRewardItem
        : stageObj.rewardItem;
      var newItem = this.unlockItem(itemToGive) ? itemToGive : null;

      var newGuides = [];
      if (stateData.level > prevLv) {
        var now = this.getUnlockedGuides();
        for (var i = 0; i < now.length; i++) {
          if (prevGuides.indexOf(now[i].id) === -1) {
            newGuides.push(now[i]);
            stateData.activeGuideId = now[i].id;
          }
        }
      }

      this.save();
      emit();

      return {
        totalScore: this.getTotalScore(),
        leveledUp: stateData.level > prevLv,
        newLevel: stateData.level,
        newItem: newItem,
        newGuides: newGuides,
        awardedScore: finalScore
      };
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
