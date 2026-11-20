(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var DIALOGUES = {
    eden_cherubim: {
      speaker: 'cherubim',
      portrait: 'cherubim',
      nodes: {
        start: {
          textKey: 'dialogues.eden_cherubim.n1',
          choices: [
            { textKey: 'dialogues.eden_cherubim.c1', effects: { faith: 3, wisdom: 2, completeQuest: 'eden-q2' }, next: 'blessing' },
            { textKey: 'dialogues.eden_cherubim.c2', effects: { wisdom: 4, completeQuest: 'eden-q2' }, next: 'warning' }
          ]
        },
        blessing: { textKey: 'dialogues.eden_cherubim.n2', effects: { heal: 35 }, next: null },
        warning: { textKey: 'dialogues.eden_cherubim.n3', effects: { score: 150 }, next: null }
      }
    },
    eden_crossroads: {
      speaker: 'serpent',
      portrait: 'serpent',
      critical: true,
      nodes: {
        start: {
          textKey: 'dialogues.eden_crossroads.n1',
          scriptureId: 'gen_2_16_17',
          choices: [
            { textKey: 'dialogues.eden_crossroads.c_resist', effects: { faith: 8, wisdom: 5, heal: 50, score: 300 }, next: 'resist_reply' },
            { textKey: 'dialogues.eden_crossroads.c_eat', effects: { mercy: 6, wisdom: 4, edenRoute: 'fallen', unlockItem: 'garment_of_skin', completeQuest: 'eden-q4' }, next: 'eat_reply' }
          ]
        },
        resist_reply: { textKey: 'dialogues.eden_crossroads.n_resist', next: null },
        eat_reply: { textKey: 'dialogues.eden_crossroads.n_eat', scriptureId: 'gen_3_21', next: null }
      }
    },
    ark_shem: {
      speaker: 'shem',
      portrait: 'noah_ally',
      nodes: {
        start: {
          textKey: 'dialogues.ark_shem.n1',
          scriptureId: 'gen_6_14',
          choices: [
            { textKey: 'dialogues.ark_shem.c1', effects: { faith: 4, mercy: 3, heal: 40 }, next: 'end' },
            { textKey: 'dialogues.ark_shem.c2', effects: { wisdom: 4, score: 120 }, next: 'end' }
          ]
        },
        end: { textKey: 'dialogues.ark_shem.n2', next: null }
      }
    },
    abraham_lot: {
      speaker: 'lot',
      portrait: 'lot',
      nodes: {
        start: {
          textKey: 'dialogues.abraham_lot.n1',
          scriptureId: 'gen_13_8_9',
          choices: [
            { textKey: 'dialogues.abraham_lot.c_peace', effects: { faith: 6, mercy: 8, score: 350, completeQuest: 'abraham-q1' }, next: 'peace_end' },
            { textKey: 'dialogues.abraham_lot.c_firm', effects: { wisdom: 5, faith: 2, score: 180, completeQuest: 'abraham-q1' }, next: 'firm_end' }
          ]
        },
        peace_end: { textKey: 'dialogues.abraham_lot.n_peace', next: null },
        firm_end: { textKey: 'dialogues.abraham_lot.n_firm', next: null }
      }
    },
    plagues_bush: {
      speaker: 'angel_lord',
      portrait: 'burning_bush',
      nodes: {
        start: {
          textKey: 'dialogues.plagues_bush.n1',
          scriptureId: 'exod_3_2_5',
          choices: [
            { textKey: 'dialogues.plagues_bush.c_obey', effects: { faith: 7, wisdom: 4, heal: 50, score: 300, completeQuest: 'plagues-q1' }, next: 'obey_end' },
            { textKey: 'dialogues.plagues_bush.c_humble', effects: { mercy: 6, faith: 4, heal: 50, score: 260, completeQuest: 'plagues-q1' }, next: 'humble_end' }
          ]
        },
        obey_end: { textKey: 'dialogues.plagues_bush.n_obey', next: null },
        humble_end: { textKey: 'dialogues.plagues_bush.n_humble', next: null }
      }
    },
    redsea_miriam: {
      speaker: 'miriam',
      portrait: 'miriam',
      nodes: {
        start: {
          textKey: 'dialogues.redsea_miriam.n1',
          scriptureId: 'exod_14_13_16',
          choices: [
            { textKey: 'dialogues.redsea_miriam.c1', effects: { faith: 5, heal: 45, score: 200 }, next: 'end' },
            { textKey: 'dialogues.redsea_miriam.c2', effects: { wisdom: 5, mercy: 4, score: 200 }, next: 'end' }
          ]
        },
        end: { textKey: 'dialogues.redsea_miriam.n2', next: null }
      }
    },
    sinai_calf: {
      speaker: 'aaron',
      portrait: 'golden_calf',
      nodes: {
        start: {
          textKey: 'dialogues.sinai_calf.n1',
          scriptureId: 'exod_20_1_17',
          choices: [
            { textKey: 'dialogues.sinai_calf.c_shatter', effects: { faith: 10, wisdom: 8, score: 450, completeQuest: 'sinai-q2' }, next: 'shatter_end' },
            { textKey: 'dialogues.sinai_calf.c_pray', effects: { mercy: 9, faith: 6, score: 380, completeQuest: 'sinai-q2' }, next: 'pray_end' }
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
