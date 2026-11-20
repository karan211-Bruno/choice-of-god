(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var GUIDES = [
    {
      id: 'cherubim',
      unlockLevel: 1,
      scriptureId: 'gen_3_24',
      icon: '🔥',
      color: '#f59e0b'
    },
    {
      id: 'angel_lord',
      unlockLevel: 3,
      scriptureId: 'exod_3_2_5',
      icon: '🌿',
      color: '#ef4444'
    },
    {
      id: 'pillar_fire',
      unlockLevel: 5,
      scriptureId: 'exod_13_21',
      icon: '☁️',
      color: '#38bdf8'
    },
    {
      id: 'gabriel',
      unlockLevel: 7,
      scriptureId: 'dan_8_16',
      icon: '📯',
      color: '#a855f7'
    },
    {
      id: 'michael',
      unlockLevel: 10,
      scriptureId: 'dan_10_13',
      icon: '🛡️',
      color: '#eab308'
    }
  ];

  root.COG.DATA.GUIDES = GUIDES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GUIDES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
