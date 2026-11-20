(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var ITEMS = [
    {
      id: 'word_of_light',
      slot: 'weapon',
      unlockDefault: true,
      scriptureId: 'gen_1_3',
      color: '#fde047',
      stats: { atk: 8, mp: 15, def: 0, hp: 0, speed: 0 }
    },
    {
      id: 'staff_of_moses',
      slot: 'weapon',
      unlockDefault: true,
      scriptureId: 'exod_4_2',
      color: '#fbbf24',
      stats: { atk: 12, mp: 20, def: 2, hp: 10, speed: 0 }
    },
    {
      id: 'stone_tablets',
      slot: 'weapon',
      unlockDefault: false,
      scriptureId: 'exod_31_18',
      color: '#c4b5fd',
      stats: { atk: 22, mp: 30, def: 8, hp: 30, speed: 10 }
    },
    {
      id: 'garment_of_skin',
      slot: 'cloak',
      unlockDefault: false,
      scriptureId: 'gen_3_21',
      color: '#d97706',
      stats: { atk: 0, mp: 0, def: 9, hp: 40, speed: 6 }
    },
    {
      id: 'blood_of_lamb',
      slot: 'cloak',
      unlockDefault: false,
      scriptureId: 'exod_12_12_13',
      color: '#f87171',
      stats: { atk: 4, mp: 10, def: 15, hp: 55, speed: 10 }
    },
    {
      id: 'tree_of_life_leaf',
      slot: 'relic',
      unlockDefault: false,
      scriptureId: 'gen_2_8_9',
      color: '#34d399',
      stats: { atk: 8, mp: 25, def: 6, hp: 60, speed: 12 }
    },
    {
      id: 'olive_branch',
      slot: 'relic',
      unlockDefault: false,
      scriptureId: 'gen_8_11',
      color: '#6ee7b7',
      stats: { atk: 6, mp: 20, def: 8, hp: 35, speed: 28 }
    },
    {
      id: 'star_compass',
      slot: 'relic',
      unlockDefault: false,
      scriptureId: 'gen_15_5',
      color: '#93c5fd',
      stats: { atk: 12, mp: 35, def: 6, hp: 20, speed: 14 }
    }
  ];

  root.COG.DATA.ITEMS = ITEMS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ITEMS;
  }
})(typeof window !== 'undefined' ? window : globalThis);
