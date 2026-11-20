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
      portrait: './assets/art/cherubim.png',
      buff: { atk: 6, def: 2, scorePct: 0 }
    },
    {
      id: 'angel_lord',
      unlockLevel: 2,
      scriptureId: 'exod_3_2_5',
      color: '#fb7185',
      portrait: './assets/art/moses.png',
      buff: { atk: 10, def: 4, scorePct: 5 }
    },
    {
      id: 'pillar_fire',
      unlockLevel: 3,
      scriptureId: 'exod_13_21',
      color: '#38bdf8',
      portrait: './assets/art/cherubim.png',
      buff: { atk: 14, def: 6, scorePct: 10 }
    },
    {
      id: 'gabriel',
      unlockLevel: 4,
      scriptureId: 'dan_8_16',
      color: '#c084fc',
      portrait: './assets/art/abraham.png',
      buff: { atk: 18, def: 9, scorePct: 15 }
    },
    {
      id: 'michael',
      unlockLevel: 6,
      scriptureId: 'dan_10_13',
      color: '#facc15',
      portrait: './assets/art/cherubim.png',
      buff: { atk: 24, def: 14, scorePct: 22 }
    }
  ];

  root.COG.DATA.GUIDES = GUIDES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GUIDES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
