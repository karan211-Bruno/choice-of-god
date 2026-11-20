(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var SKILLS = [
    {
      id: 'nova',
      hotkey: '1',
      maxLevel: 5,
      mpCost: 20,
      cooldown: 3.2,
      baseDmg: 38,
      dmgPerLevel: 12,
      radius: 185,
      color: '#fde047'
    },
    {
      id: 'beam',
      hotkey: '2',
      maxLevel: 5,
      mpCost: 26,
      cooldown: 4.2,
      baseDmg: 56,
      dmgPerLevel: 16,
      range: 460,
      color: '#38bdf8'
    },
    {
      id: 'grace',
      hotkey: '3',
      maxLevel: 5,
      mpCost: 28,
      cooldown: 6.5,
      baseHeal: 55,
      healPerLevel: 18,
      shieldSec: 3.8,
      color: '#34d399'
    }
  ];

  root.COG.DATA.SKILLS = SKILLS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SKILLS;
  }
})(typeof window !== 'undefined' ? window : globalThis);
