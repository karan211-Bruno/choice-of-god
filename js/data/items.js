(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var ITEMS = [
    { id: 'word_of_light', unlockDefault: true, scriptureId: 'gen_1_3', color: '#fde047', stats: { atk: 6, faith: 2 } },
    { id: 'staff_of_moses', unlockDefault: true, scriptureId: 'exod_4_2', color: '#fbbf24', stats: { atk: 10, wisdom: 2 } },
    { id: 'tree_of_life_leaf', unlockDefault: false, scriptureId: 'gen_2_8_9', color: '#34d399', stats: { hp: 35, faith: 4 } },
    { id: 'garment_of_skin', unlockDefault: false, scriptureId: 'gen_3_21', color: '#d97706', stats: { def: 8, mercy: 4 } },
    { id: 'olive_branch', unlockDefault: false, scriptureId: 'gen_8_11', color: '#6ee7b7', stats: { hp: 25, mercy: 4 } },
    { id: 'star_compass', unlockDefault: false, scriptureId: 'gen_15_5', color: '#93c5fd', stats: { atk: 8, wisdom: 5 } },
    { id: 'blood_of_lamb', unlockDefault: false, scriptureId: 'exod_12_12_13', color: '#f87171', stats: { def: 12, faith: 5 } },
    { id: 'stone_tablets', unlockDefault: false, scriptureId: 'exod_31_18', color: '#c4b5fd', stats: { atk: 16, def: 10, faith: 8 } }
  ];

  root.COG.DATA.ITEMS = ITEMS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ITEMS;
  }
})(typeof window !== 'undefined' ? window : globalThis);
