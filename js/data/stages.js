(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var CHAPTERS = [
    {
      id: 'eden',
      order: 1,
      book: 'genesis',
      genre: 'topdown',
      viewpoint: 'adam_eve',
      accent: '#2a9d6f',
      icon: '🌳',
      rewardItem: 'tree_of_life_leaf',
      altRewardItem: 'garment_of_skin',
      isHighestScoreChapter: true,
      levels: [
        {
          id: 'eden-1',
          chapterId: 'eden',
          subLevel: 1,
          scriptureIds: ['gen_1_1', 'gen_1_3'],
          baseScore: 600,
          xp: 120
        },
        {
          id: 'eden-2',
          chapterId: 'eden',
          subLevel: 2,
          scriptureIds: ['gen_2_8_9'],
          baseScore: 800,
          xp: 150
        },
        {
          id: 'eden-3',
          chapterId: 'eden',
          subLevel: 3,
          scriptureIds: ['gen_2_16_17', 'gen_3_1_6'],
          baseScore: 1000,
          xp: 180
        },
        {
          id: 'eden-4',
          chapterId: 'eden',
          subLevel: 4,
          scriptureIds: ['gen_3_21', 'gen_3_24'],
          baseScore: 1600,
          xp: 260,
          preservedBonus: 5000
        }
      ]
    },
    {
      id: 'ark',
      order: 2,
      book: 'genesis',
      genre: 'builder',
      viewpoint: 'noah',
      accent: '#3b82f6',
      icon: '🚢',
      rewardItem: 'olive_branch',
      levels: [
        {
          id: 'ark-1',
          chapterId: 'ark',
          subLevel: 1,
          scriptureIds: ['gen_6_14'],
          baseScore: 650,
          xp: 130
        },
        {
          id: 'ark-2',
          chapterId: 'ark',
          subLevel: 2,
          scriptureIds: ['gen_7_2_3'],
          baseScore: 800,
          xp: 160
        },
        {
          id: 'ark-3',
          chapterId: 'ark',
          subLevel: 3,
          scriptureIds: ['gen_7_12'],
          baseScore: 950,
          xp: 190
        },
        {
          id: 'ark-4',
          chapterId: 'ark',
          subLevel: 4,
          scriptureIds: ['gen_8_11', 'gen_9_13'],
          baseScore: 1100,
          xp: 220
        }
      ]
    },
    {
      id: 'abraham',
      order: 3,
      book: 'genesis',
      genre: 'rpg',
      viewpoint: 'abraham',
      accent: '#d97706',
      icon: '✨',
      rewardItem: 'star_compass',
      levels: [
        {
          id: 'abraham-1',
          chapterId: 'abraham',
          subLevel: 1,
          scriptureIds: ['gen_12_1_4'],
          baseScore: 700,
          xp: 140
        },
        {
          id: 'abraham-2',
          chapterId: 'abraham',
          subLevel: 2,
          scriptureIds: ['gen_13_8_9'],
          baseScore: 850,
          xp: 170
        },
        {
          id: 'abraham-3',
          chapterId: 'abraham',
          subLevel: 3,
          scriptureIds: ['gen_15_5'],
          baseScore: 1000,
          xp: 200
        },
        {
          id: 'abraham-4',
          chapterId: 'abraham',
          subLevel: 4,
          scriptureIds: ['gen_22_13_14'],
          baseScore: 1200,
          xp: 240
        }
      ]
    },
    {
      id: 'plagues',
      order: 4,
      book: 'exodus',
      genre: 'tactics',
      viewpoint: 'moses',
      accent: '#dc2626',
      icon: '🔥',
      rewardItem: 'blood_of_lamb',
      levels: [
        {
          id: 'plagues-1',
          chapterId: 'plagues',
          subLevel: 1,
          scriptureIds: ['exod_3_2_5', 'exod_4_2'],
          baseScore: 750,
          xp: 150
        },
        {
          id: 'plagues-2',
          chapterId: 'plagues',
          subLevel: 2,
          scriptureIds: ['exod_7_14_17'],
          baseScore: 900,
          xp: 180
        },
        {
          id: 'plagues-3',
          chapterId: 'plagues',
          subLevel: 3,
          scriptureIds: ['exod_9_22_26'],
          baseScore: 1050,
          xp: 210
        },
        {
          id: 'plagues-4',
          chapterId: 'plagues',
          subLevel: 4,
          scriptureIds: ['exod_12_12_13'],
          baseScore: 1250,
          xp: 250
        }
      ]
    },
    {
      id: 'redsea',
      order: 5,
      book: 'exodus',
      genre: 'arcade',
      viewpoint: 'moses',
      accent: '#0891b2',
      icon: '🌊',
      rewardItem: 'staff_of_moses',
      levels: [
        {
          id: 'redsea-1',
          chapterId: 'redsea',
          subLevel: 1,
          scriptureIds: ['exod_13_21'],
          baseScore: 800,
          xp: 160
        },
        {
          id: 'redsea-2',
          chapterId: 'redsea',
          subLevel: 2,
          scriptureIds: ['exod_14_13_16'],
          baseScore: 950,
          xp: 190
        },
        {
          id: 'redsea-3',
          chapterId: 'redsea',
          subLevel: 3,
          scriptureIds: ['exod_14_21_22'],
          baseScore: 1200,
          xp: 230
        },
        {
          id: 'redsea-4',
          chapterId: 'redsea',
          subLevel: 4,
          scriptureIds: ['exod_15_1_2'],
          baseScore: 1300,
          xp: 260
        }
      ]
    },
    {
      id: 'sinai',
      order: 6,
      book: 'exodus',
      genre: 'management',
      viewpoint: 'moses',
      accent: '#b45309',
      icon: '⛰️',
      rewardItem: 'stone_tablets',
      levels: [
        {
          id: 'sinai-1',
          chapterId: 'sinai',
          subLevel: 1,
          scriptureIds: ['exod_16_4_15'],
          baseScore: 850,
          xp: 180
        },
        {
          id: 'sinai-2',
          chapterId: 'sinai',
          subLevel: 2,
          scriptureIds: ['exod_17_6'],
          baseScore: 1000,
          xp: 210
        },
        {
          id: 'sinai-3',
          chapterId: 'sinai',
          subLevel: 3,
          scriptureIds: ['exod_20_1_17'],
          baseScore: 1200,
          xp: 250
        },
        {
          id: 'sinai-4',
          chapterId: 'sinai',
          subLevel: 4,
          scriptureIds: ['exod_31_18', 'exod_40_34'],
          baseScore: 1500,
          xp: 320
        }
      ]
    }
  ];

  root.COG.DATA.CHAPTERS = CHAPTERS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHAPTERS;
  }
})(typeof window !== 'undefined' ? window : globalThis);
