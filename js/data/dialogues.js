(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var DIALOGUES = {
    eden_cherubim: {
      speaker: 'cherubim',
      portrait: './assets/art/cherubim.png',
      nodes: {
        start: {
          textKey: 'dialogues.eden_cherubim.n1',
          scriptureId: 'gen_2_8_9',
          choices: [
            { textKey: 'dialogues.eden_cherubim.c1', effects: { faith: 4, heal: 40, score: 150 }, next: 'blessing' },
            { textKey: 'dialogues.eden_cherubim.c2', effects: { wisdom: 5, score: 150 }, next: 'warning' }
          ]
        },
        blessing: { textKey: 'dialogues.eden_cherubim.n2', next: null },
        warning: { textKey: 'dialogues.eden_cherubim.n3', next: null }
      }
    },
    eden_crossroads: {
      speaker: 'serpent',
      portrait: './assets/art/serpent.png',
      critical: true,
      nodes: {
        start: {
          textKey: 'dialogues.eden_crossroads.n1',
          scriptureId: 'gen_2_16_17',
          choices: [
            { textKey: 'dialogues.eden_crossroads.c_resist', effects: { faith: 8, wisdom: 5, heal: 50, score: 250 }, next: 'resist_reply' },
            { textKey: 'dialogues.eden_crossroads.c_eat', effects: { mercy: 7, wisdom: 5, edenRoute: 'fallen', unlockItem: 'garment_of_skin' }, next: 'eat_reply' }
          ]
        },
        resist_reply: { textKey: 'dialogues.eden_crossroads.n_resist', next: null },
        eat_reply: { textKey: 'dialogues.eden_crossroads.n_eat', scriptureId: 'gen_3_21', next: null }
      }
    },
    abraham_lot: {
      speaker: 'lot',
      portrait: './assets/art/abraham.png',
      nodes: {
        start: {
          textKey: 'dialogues.abraham_lot.n1',
          scriptureId: 'gen_13_8_9',
          choices: [
            { textKey: 'dialogues.abraham_lot.c_peace', effects: { faith: 6, mercy: 8, score: 300 }, next: 'peace_end' },
            { textKey: 'dialogues.abraham_lot.c_firm', effects: { wisdom: 6, faith: 3, score: 180 }, next: 'firm_end' }
          ]
        },
        peace_end: { textKey: 'dialogues.abraham_lot.n_peace', next: null },
        firm_end: { textKey: 'dialogues.abraham_lot.n_firm', next: null }
      }
    },
    sinai_calf: {
      speaker: 'aaron',
      portrait: './assets/art/moses.png',
      nodes: {
        start: {
          textKey: 'dialogues.sinai_calf.n1',
          scriptureId: 'exod_20_1_17',
          choices: [
            { textKey: 'dialogues.sinai_calf.c_shatter', effects: { faith: 10, wisdom: 8, score: 350 }, next: 'shatter_end' },
            { textKey: 'dialogues.sinai_calf.c_pray', effects: { mercy: 9, faith: 7, score: 300 }, next: 'pray_end' }
          ]
        },
        shatter_end: { textKey: 'dialogues.sinai_calf.n_shatter', next: null },
        pray_end: { textKey: 'dialogues.sinai_calf.n_pray', next: null }
      }
    }
  };

  root.COG.DATA.DIALOGUES = DIALOGUES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DIALOGUES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
