(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var GUIDES = [
    {
      id: 'cherubim',
      unlockLevel: 1,
      scriptureId: 'gen_3_24',
      color: '#f59e0b',
      buff: { atk: 5, def: 2, speed: 0, mpRegen: 0.5, scorePct: 0 }
    },
    {
      id: 'angel_lord',
      unlockLevel: 3,
      scriptureId: 'exod_3_2_5',
      color: '#fb7185',
      buff: { atk: 9, def: 4, speed: 8, mpRegen: 1.4, scorePct: 5 }
    },
    {
      id: 'pillar_fire',
      unlockLevel: 5,
      scriptureId: 'exod_13_21',
      color: '#38bdf8',
      buff: { atk: 12, def: 7, speed: 18, mpRegen: 1.8, scorePct: 8 }
    },
    {
      id: 'gabriel',
      unlockLevel: 7,
      scriptureId: 'dan_8_16',
      color: '#c084fc',
      buff: { atk: 15, def: 9, speed: 20, mpRegen: 2.8, scorePct: 12 }
    },
    {
      id: 'michael',
      unlockLevel: 10,
      scriptureId: 'dan_10_13',
      color: '#facc15',
      buff: { atk: 22, def: 14, speed: 25, mpRegen: 3.5, scorePct: 20 }
    }
  ];

  root.COG.DATA.GUIDES = GUIDES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GUIDES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
