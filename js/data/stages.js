(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var STAGES = [
    {
      id: 'eden',
      order: 1,
      book: 'genesis',
      genreId: 'action_rpg',
      viewpoint: 'adam_eve',
      portrait: './assets/art/adam_eve.png',
      bg: './assets/bg/bg_eden.jpg',
      heroSprite: './assets/sprites/hero_adam.png',
      accent: '#2ea06b',
      bgTint: '#eafaf1',
      baseScore: 1500,
      preservedBonus: 5000,
      xp: 220,
      rewardItem: 'tree_of_life_leaf',
      altRewardItem: 'garment_of_skin',
      scriptureIds: ['gen_1_3', 'gen_2_8_9', 'gen_2_16_17', 'gen_3_24'],
      isHighestScoreStage: true
    },
    {
      id: 'ark',
      order: 2,
      book: 'genesis',
      genreId: 'city_sim',
      viewpoint: 'noah',
      portrait: './assets/art/noah.png',
      bg: './assets/bg/bg_ark.jpg',
      heroSprite: './assets/sprites/hero_noah.png',
      accent: '#3b82f6',
      bgTint: '#eff6ff',
      baseScore: 1300,
      xp: 240,
      rewardItem: 'olive_branch',
      scriptureIds: ['gen_6_14', 'gen_7_2_3', 'gen_8_11', 'gen_9_13']
    },
    {
      id: 'abraham',
      order: 3,
      book: 'genesis',
      genreId: 'hex_tbs',
      viewpoint: 'abraham',
      portrait: './assets/art/abraham.png',
      bg: './assets/bg/bg_abraham.jpg',
      heroSprite: './assets/sprites/hero_abraham.png',
      accent: '#e08924',
      bgTint: '#fff7ed',
      baseScore: 1400,
      xp: 260,
      rewardItem: 'star_compass',
      scriptureIds: ['gen_12_1_4', 'gen_13_8_9', 'gen_15_5', 'gen_22_13_14']
    },
    {
      id: 'plagues',
      order: 4,
      book: 'exodus',
      genreId: 'jrpg_battle',
      viewpoint: 'moses',
      portrait: './assets/art/moses.png',
      bg: './assets/bg/bg_plagues.jpg',
      heroSprite: './assets/sprites/hero_moses.png',
      accent: '#e14b63',
      bgTint: '#fff1f2',
      baseScore: 1500,
      xp: 280,
      rewardItem: 'blood_of_lamb',
      scriptureIds: ['exod_3_2_5', 'exod_7_14_17', 'exod_9_22_26', 'exod_12_12_13']
    },
    {
      id: 'redsea',
      order: 5,
      book: 'exodus',
      genreId: 'rts_defense',
      viewpoint: 'moses',
      portrait: './assets/art/cherubim.png',
      bg: './assets/bg/bg_redsea.jpg',
      heroSprite: './assets/sprites/unit_angel.png',
      accent: '#0891b2',
      bgTint: '#ecfeff',
      baseScore: 1650,
      xp: 310,
      rewardItem: 'staff_of_moses',
      scriptureIds: ['exod_13_21', 'exod_14_13_16', 'exod_14_21_22', 'exod_15_1_2']
    },
    {
      id: 'sinai',
      order: 6,
      book: 'exodus',
      genreId: 'fps_light',
      viewpoint: 'moses',
      portrait: './assets/art/moses.png',
      bg: './assets/bg/bg_sinai.jpg',
      heroSprite: './assets/sprites/hero_moses.png',
      accent: '#c07c15',
      bgTint: '#fefce8',
      baseScore: 1900,
      xp: 360,
      rewardItem: 'stone_tablets',
      scriptureIds: ['exod_16_4_15', 'exod_17_6', 'exod_20_1_17', 'exod_40_34']
    }
  ];

  root.COG.DATA.STAGES = STAGES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = STAGES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
