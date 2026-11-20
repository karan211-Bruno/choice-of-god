(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var BIBLE = [
    { id: 'gen_1_1', book: 'genesis', chapterId: 'eden' },
    { id: 'gen_1_3', book: 'genesis', chapterId: 'eden' },
    { id: 'gen_2_8_9', book: 'genesis', chapterId: 'eden' },
    { id: 'gen_2_16_17', book: 'genesis', chapterId: 'eden' },
    { id: 'gen_3_1_6', book: 'genesis', chapterId: 'eden' },
    { id: 'gen_3_21', book: 'genesis', chapterId: 'eden' },
    { id: 'gen_3_24', book: 'genesis', chapterId: 'eden' },

    { id: 'gen_6_14', book: 'genesis', chapterId: 'ark' },
    { id: 'gen_7_2_3', book: 'genesis', chapterId: 'ark' },
    { id: 'gen_7_12', book: 'genesis', chapterId: 'ark' },
    { id: 'gen_8_11', book: 'genesis', chapterId: 'ark' },
    { id: 'gen_9_13', book: 'genesis', chapterId: 'ark' },

    { id: 'gen_12_1_4', book: 'genesis', chapterId: 'abraham' },
    { id: 'gen_13_8_9', book: 'genesis', chapterId: 'abraham' },
    { id: 'gen_15_5', book: 'genesis', chapterId: 'abraham' },
    { id: 'gen_22_13_14', book: 'genesis', chapterId: 'abraham' },

    { id: 'exod_3_2_5', book: 'exodus', chapterId: 'plagues' },
    { id: 'exod_4_2', book: 'exodus', chapterId: 'plagues' },
    { id: 'exod_7_14_17', book: 'exodus', chapterId: 'plagues' },
    { id: 'exod_9_22_26', book: 'exodus', chapterId: 'plagues' },
    { id: 'exod_12_12_13', book: 'exodus', chapterId: 'plagues' },

    { id: 'exod_13_21', book: 'exodus', chapterId: 'redsea' },
    { id: 'exod_14_13_16', book: 'exodus', chapterId: 'redsea' },
    { id: 'exod_14_21_22', book: 'exodus', chapterId: 'redsea' },
    { id: 'exod_15_1_2', book: 'exodus', chapterId: 'redsea' },

    { id: 'exod_16_4_15', book: 'exodus', chapterId: 'sinai' },
    { id: 'exod_17_6', book: 'exodus', chapterId: 'sinai' },
    { id: 'exod_20_1_17', book: 'exodus', chapterId: 'sinai' },
    { id: 'exod_31_18', book: 'exodus', chapterId: 'sinai' },
    { id: 'exod_40_34', book: 'exodus', chapterId: 'sinai' },

    { id: 'dan_8_16', book: 'daniel', chapterId: 'guides' },
    { id: 'dan_10_13', book: 'daniel', chapterId: 'guides' }
  ];

  root.COG.DATA.BIBLE = BIBLE;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BIBLE;
  }
})(typeof window !== 'undefined' ? window : globalThis);
