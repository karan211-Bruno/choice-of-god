(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var ITEMS = [
    {
      id: 'word_of_light',
      icon: '✨',
      unlockDefault: true,
      scriptureId: 'gen_1_3',
      effect: 'pulse_boost',
      color: '#fde047'
    },
    {
      id: 'tree_of_life_leaf',
      icon: '🌿',
      unlockDefault: false,
      scriptureId: 'gen_2_8_9',
      effect: 'heal_grace',
      color: '#34d399'
    },
    {
      id: 'garment_of_skin',
      icon: '🧥',
      unlockDefault: false,
      scriptureId: 'gen_3_21',
      effect: 'grace_shield',
      color: '#d97706'
    },
    {
      id: 'olive_branch',
      icon: '🕊️',
      unlockDefault: false,
      scriptureId: 'gen_8_11',
      effect: 'calm_storm',
      color: '#6ee7b7'
    },
    {
      id: 'star_compass',
      icon: '🌟',
      unlockDefault: false,
      scriptureId: 'gen_15_5',
      effect: 'insight_hint',
      color: '#93c5fd'
    },
    {
      id: 'staff_of_moses',
      icon: '🪄',
      unlockDefault: true,
      scriptureId: 'exod_4_2',
      effect: 'miracle_charge',
      color: '#fbbf24'
    },
    {
      id: 'blood_of_lamb',
      icon: '🩸',
      unlockDefault: false,
      scriptureId: 'exod_12_12_13',
      effect: 'goshen_ward',
      color: '#f87171'
    },
    {
      id: 'stone_tablets',
      icon: '📜',
      unlockDefault: false,
      scriptureId: 'exod_31_18',
      effect: 'covenant_multiplier',
      color: '#c4b5fd'
    }
  ];

  root.COG.DATA.ITEMS = ITEMS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ITEMS;
  }
})(typeof window !== 'undefined' ? window : globalThis);
