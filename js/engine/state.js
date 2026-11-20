(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var STORAGE_KEY = 'cog_save_v1';

  function cloneDefault() {
    return {
      lang: 'ko',
      sound: true,
      xp: 0,
      bonusScore: 0,
      stats: {
        faith: 10,
        wisdom: 10,
        mercy: 10
      },
      edenRoute: 'undecided', // 'undecided' | 'preserved' | 'fallen'
      activeGuideId: 'cherubim',
      activeChapterId: 'eden',
      activeSubLevel: 1,
      completedLevels: {}, // { levelId: { stars, bestScore } }
      unlockedItems: ['word_of_light', 'staff_of_moses']
    };
  }

  var stateData = cloneDefault();
  var changeListeners = [];

  function emit() {
    for (var i = 0; i < changeListeners.length; i++) {
      try {
        changeListeners[i](stateData);
      } catch (_) {}
    }
  }

  var State = {
    load: function () {
      var raw = null;
      try {
        raw = root.localStorage ? root.localStorage.getItem(STORAGE_KEY) : null;
      } catch (_) {
        raw = null;
      }
      if (raw) {
        try {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            var base = cloneDefault();
            stateData = Object.assign(base, parsed);
            stateData.stats = Object.assign(base.stats, parsed.stats || {});
            stateData.completedLevels = parsed.completedLevels || {};
            stateData.unlockedItems = Array.isArray(parsed.unlockedItems) && parsed.unlockedItems.length
              ? parsed.unlockedItems
              : base.unlockedItems;
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

    setActiveView: function (chapterId, subLevel) {
      stateData.activeChapterId = chapterId;
      if (typeof subLevel === 'number') {
        stateData.activeSubLevel = subLevel;
      }
      this.save();
      emit();
    },

    getPlayerLevel: function () {
      return Math.min(20, 1 + Math.floor(stateData.xp / 180));
    },

    getTotalScore: function () {
      var sum = 0;
      var keys = Object.keys(stateData.completedLevels);
      for (var i = 0; i < keys.length; i++) {
        sum += Number(stateData.completedLevels[keys[i]].bestScore || 0);
      }
      if (stateData.edenRoute === 'preserved') {
        sum += 5000;
      }
      sum += Number(stateData.bonusScore || 0);
      return sum;
    },

    getCompletedCount: function () {
      return Object.keys(stateData.completedLevels).length;
    },

    getChapterStars: function (chapterId) {
      var chapters = (root.COG.DATA && root.COG.DATA.CHAPTERS) || [];
      var ch = chapters.find(function (c) { return c.id === chapterId; });
      if (!ch) return { stars: 0, completed: 0, total: 0 };
      var stars = 0;
      var completed = 0;
      for (var i = 0; i < ch.levels.length; i++) {
        var rec = stateData.completedLevels[ch.levels[i].id];
        if (rec) {
          completed++;
          stars += rec.stars || 1;
        }
      }
      return { stars: stars, completed: completed, total: ch.levels.length };
    },

    getUnlockedGuides: function () {
      var guides = (root.COG.DATA && root.COG.DATA.GUIDES) || [];
      var lv = this.getPlayerLevel();
      return guides.filter(function (g) { return lv >= g.unlockLevel; });
    },

    getActiveGuide: function () {
      var guides = (root.COG.DATA && root.COG.DATA.GUIDES) || [];
      var found = guides.find(function (g) { return g.id === stateData.activeGuideId; });
      var unlocked = this.getUnlockedGuides();
      if (found && unlocked.indexOf(found) !== -1) return found;
      return unlocked[0] || guides[0];
    },

    setActiveGuide: function (guideId) {
      var unlocked = this.getUnlockedGuides();
      var ok = unlocked.some(function (g) { return g.id === guideId; });
      if (ok) {
        stateData.activeGuideId = guideId;
        this.save();
        emit();
        return true;
      }
      return false;
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
      if (delta.faith) stateData.stats.faith = Math.max(0, stateData.stats.faith + delta.faith);
      if (delta.wisdom) stateData.stats.wisdom = Math.max(0, stateData.stats.wisdom + delta.wisdom);
      if (delta.mercy) stateData.stats.mercy = Math.max(0, stateData.stats.mercy + delta.mercy);
      if (delta.bonusScore) stateData.bonusScore += delta.bonusScore;
      this.save();
      emit();
    },

    setEdenRoute: function (route) {
      if (route === 'preserved' || route === 'fallen' || route === 'undecided') {
        stateData.edenRoute = route;
        if (route === 'preserved') {
          this.unlockItem('tree_of_life_leaf');
        } else if (route === 'fallen') {
          this.unlockItem('garment_of_skin');
        }
        this.save();
        emit();
      }
    },

    completeLevel: function (levelObj, earnedScore, stars, extra) {
      var prevLevel = this.getPlayerLevel();
      var prevUnlockedGuides = this.getUnlockedGuides().map(function (g) { return g.id; });
      var levelId = levelObj.id;
      var prev = stateData.completedLevels[levelId];
      var cleanStars = Math.max(1, Math.min(3, stars || 1));
      var cleanScore = Math.max(100, Math.round(earnedScore || levelObj.baseScore || 500));

      if (!prev) {
        stateData.completedLevels[levelId] = { stars: cleanStars, bestScore: cleanScore };
        stateData.xp += Number(levelObj.xp || 140);
      } else {
        stateData.completedLevels[levelId] = {
          stars: Math.max(prev.stars, cleanStars),
          bestScore: Math.max(prev.bestScore, cleanScore)
        };
        stateData.xp += Math.round(Number(levelObj.xp || 100) * 0.35);
      }

      if (extra && extra.faith) stateData.stats.faith += extra.faith;
      if (extra && extra.wisdom) stateData.stats.wisdom += extra.wisdom;
      if (extra && extra.mercy) stateData.stats.mercy += extra.mercy;

      var newItemUnlocked = null;
      var chapters = (root.COG.DATA && root.COG.DATA.CHAPTERS) || [];
      var ch = chapters.find(function (c) { return c.id === levelObj.chapterId; });
      if (ch && levelObj.subLevel === 4) {
        if (ch.id === 'eden') {
          var itemToGive = stateData.edenRoute === 'fallen' ? ch.altRewardItem : ch.rewardItem;
          if (this.unlockItem(itemToGive)) {
            newItemUnlocked = itemToGive;
          }
        } else if (ch.rewardItem) {
          if (this.unlockItem(ch.rewardItem)) {
            newItemUnlocked = ch.rewardItem;
          }
        }
      }

      var newLevel = this.getPlayerLevel();
      var newGuides = [];
      if (newLevel > prevLevel) {
        var nowGuides = this.getUnlockedGuides();
        for (var i = 0; i < nowGuides.length; i++) {
          if (prevUnlockedGuides.indexOf(nowGuides[i].id) === -1) {
            newGuides.push(nowGuides[i]);
            stateData.activeGuideId = nowGuides[i].id;
          }
        }
      }

      this.save();
      emit();

      return {
        totalScore: this.getTotalScore(),
        playerLevel: newLevel,
        newItemUnlocked: newItemUnlocked,
        newGuidesUnlocked: newGuides
      };
    },

    onChange: function (fn) {
      if (typeof fn === 'function') {
        changeListeners.push(fn);
      }
    }
  };

  root.COG.State = State;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = State;
  }
})(typeof window !== 'undefined' ? window : globalThis);
