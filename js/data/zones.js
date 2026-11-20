(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.DATA = root.COG.DATA || {};

  var ZONES = [
    {
      id: 'eden',
      order: 1,
      book: 'genesis',
      viewpoint: 'adam_eve',
      heroType: 'adam_eve',
      width: 1920,
      height: 1280,
      spawn: { x: 960, y: 760 },
      accent: '#2a9d6f',
      biome: 'eden',
      rewardItem: 'tree_of_life_leaf',
      altRewardItem: 'garment_of_skin',
      isHighestScoreZone: true,
      landmarks: [
        { id: 'tree_of_life', kind: 'tree_of_life', x: 960, y: 600, r: 54 },
        { id: 'forbidden_tree', kind: 'forbidden_tree', x: 310, y: 620, r: 46, dialogueId: 'eden_crossroads' },
        { id: 'eden_gate', kind: 'eden_gate', x: 1700, y: 620, r: 50 }
      ],
      npcs: [
        { id: 'npc_cherubim', x: 1120, y: 640, spriteType: 'cherubim', dialogueId: 'eden_cherubim' }
      ],
      interactables: [
        { id: 'eden-c1', questId: 'eden-q1', kind: 'crystal', x: 760, y: 420 },
        { id: 'eden-c2', questId: 'eden-q1', kind: 'crystal', x: 1180, y: 420 },
        { id: 'eden-c3', questId: 'eden-q1', kind: 'crystal', x: 740, y: 860 },
        { id: 'eden-c4', questId: 'eden-q1', kind: 'crystal', x: 1210, y: 880 },
        { id: 'eden-c5', questId: 'eden-q1', kind: 'crystal', x: 960, y: 290 }
      ],
      enemies: [
        { id: 'eden-e1', questId: 'eden-q3', kind: 'serpent_minion', x: 520, y: 480, hp: 55, atk: 10, speed: 115, xp: 45, score: 120 },
        { id: 'eden-e2', questId: 'eden-q3', kind: 'serpent_minion', x: 470, y: 770, hp: 55, atk: 10, speed: 115, xp: 45, score: 120 },
        { id: 'eden-e3', questId: 'eden-q3', kind: 'shadow_wisp', x: 640, y: 310, hp: 65, atk: 12, speed: 125, xp: 55, score: 140 },
        { id: 'eden-e4', questId: 'eden-q3', kind: 'shadow_wisp', x: 1580, y: 340, hp: 65, atk: 12, speed: 125, xp: 55, score: 140 },
        { id: 'eden-e5', questId: 'eden-q3', kind: 'serpent_minion', x: 1560, y: 900, hp: 60, atk: 11, speed: 120, xp: 50, score: 130 }
      ],
      boss: {
        id: 'boss_serpent',
        questId: 'eden-q4',
        kind: 'boss_serpent',
        x: 370,
        y: 620,
        hp: 260,
        atk: 16,
        speed: 135,
        xp: 220,
        score: 1200,
        phase2Threshold: 0.5
      },
      quests: [
        { id: 'eden-q1', order: 1, type: 'collect', targetCount: 5, xp: 100, score: 350, scriptureId: 'gen_1_3' },
        { id: 'eden-q2', order: 2, type: 'talk', targetCount: 1, xp: 90, score: 250, scriptureId: 'gen_2_8_9' },
        { id: 'eden-q3', order: 3, type: 'kill', targetCount: 5, xp: 140, score: 450, scriptureId: 'gen_3_1_6' },
        { id: 'eden-q4', order: 4, type: 'boss', targetCount: 1, xp: 240, score: 1200, scriptureId: 'gen_3_24' }
      ]
    },
    {
      id: 'ark',
      order: 2,
      book: 'genesis',
      viewpoint: 'noah',
      heroType: 'noah',
      width: 1920,
      height: 1280,
      spawn: { x: 960, y: 840 },
      accent: '#3b82f6',
      biome: 'ark',
      rewardItem: 'olive_branch',
      landmarks: [
        { id: 'ark_hull', kind: 'ark_hull', x: 960, y: 540, r: 95 },
        { id: 'rainbow_arch', kind: 'rainbow_arch', x: 960, y: 210, r: 40 }
      ],
      npcs: [
        { id: 'npc_shem', x: 780, y: 760, spriteType: 'villager', dialogueId: 'ark_shem' }
      ],
      interactables: [
        { id: 'ark-t1', questId: 'ark-q1', kind: 'timber', x: 420, y: 390 },
        { id: 'ark-t2', questId: 'ark-q1', kind: 'timber', x: 520, y: 920 },
        { id: 'ark-t3', questId: 'ark-q1', kind: 'pitch', x: 1460, y: 380 },
        { id: 'ark-t4', questId: 'ark-q1', kind: 'pitch', x: 1520, y: 890 },
        { id: 'ark-t5', questId: 'ark-q1', kind: 'timber', x: 1230, y: 960 },
        { id: 'ark-t6', questId: 'ark-q1', kind: 'pitch', x: 640, y: 320 },
        { id: 'ark-a1', questId: 'ark-q2', kind: 'animal_pair', x: 350, y: 660 },
        { id: 'ark-a2', questId: 'ark-q2', kind: 'animal_pair', x: 1580, y: 640 },
        { id: 'ark-a3', questId: 'ark-q2', kind: 'animal_pair', x: 690, y: 1020 },
        { id: 'ark-a4', questId: 'ark-q2', kind: 'animal_pair', x: 1260, y: 260 }
      ],
      enemies: [
        { id: 'ark-e1', questId: 'ark-q3', kind: 'storm_wraith', x: 560, y: 510, hp: 75, atk: 13, speed: 125, xp: 60, score: 160 },
        { id: 'ark-e2', questId: 'ark-q3', kind: 'storm_wraith', x: 1380, y: 520, hp: 75, atk: 13, speed: 125, xp: 60, score: 160 },
        { id: 'ark-e3', questId: 'ark-q3', kind: 'storm_wraith', x: 760, y: 290, hp: 80, atk: 14, speed: 130, xp: 65, score: 170 },
        { id: 'ark-e4', questId: 'ark-q3', kind: 'storm_wraith', x: 1240, y: 780, hp: 80, atk: 14, speed: 130, xp: 65, score: 170 },
        { id: 'ark-e5', questId: 'ark-q3', kind: 'storm_wraith', x: 460, y: 820, hp: 80, atk: 14, speed: 130, xp: 65, score: 170 }
      ],
      boss: {
        id: 'boss_leviathan',
        questId: 'ark-q4',
        kind: 'boss_leviathan',
        x: 1540,
        y: 360,
        hp: 340,
        atk: 19,
        speed: 140,
        xp: 260,
        score: 1350,
        phase2Threshold: 0.5
      },
      quests: [
        { id: 'ark-q1', order: 1, type: 'collect', targetCount: 6, xp: 110, score: 400, scriptureId: 'gen_6_14' },
        { id: 'ark-q2', order: 2, type: 'collect', targetCount: 4, xp: 120, score: 450, scriptureId: 'gen_7_2_3' },
        { id: 'ark-q3', order: 3, type: 'kill', targetCount: 5, xp: 150, score: 500, scriptureId: 'gen_7_12' },
        { id: 'ark-q4', order: 4, type: 'boss', targetCount: 1, xp: 260, score: 1350, scriptureId: 'gen_9_13' }
      ]
    },
    {
      id: 'abraham',
      order: 3,
      book: 'genesis',
      viewpoint: 'abraham',
      heroType: 'abraham',
      width: 1920,
      height: 1280,
      spawn: { x: 420, y: 920 },
      accent: '#d97706',
      biome: 'abraham',
      rewardItem: 'star_compass',
      landmarks: [
        { id: 'bethel_altar', kind: 'stone_altar', x: 740, y: 740, r: 42 },
        { id: 'moriah_altar', kind: 'stone_altar', x: 1520, y: 290, r: 48 }
      ],
      npcs: [
        { id: 'npc_lot', x: 640, y: 820, spriteType: 'villager', dialogueId: 'abraham_lot' }
      ],
      interactables: [
        { id: 'abr-s1', questId: 'abraham-q2', kind: 'star_beacon', x: 960, y: 640 },
        { id: 'abr-s2', questId: 'abraham-q2', kind: 'star_beacon', x: 1180, y: 490 },
        { id: 'abr-s3', questId: 'abraham-q2', kind: 'star_beacon', x: 840, y: 390 },
        { id: 'abr-s4', questId: 'abraham-q2', kind: 'star_beacon', x: 1380, y: 780 },
        { id: 'abr-s5', questId: 'abraham-q2', kind: 'star_beacon', x: 540, y: 420 }
      ],
      enemies: [
        { id: 'abr-e1', questId: 'abraham-q3', kind: 'raider', x: 1220, y: 920, hp: 85, atk: 15, speed: 135, xp: 70, score: 180 },
        { id: 'abr-e2', questId: 'abraham-q3', kind: 'raider', x: 1450, y: 890, hp: 85, atk: 15, speed: 135, xp: 70, score: 180 },
        { id: 'abr-e3', questId: 'abraham-q3', kind: 'raider', x: 1580, y: 620, hp: 90, atk: 16, speed: 140, xp: 75, score: 190 },
        { id: 'abr-e4', questId: 'abraham-q3', kind: 'raider', x: 1290, y: 360, hp: 90, atk: 16, speed: 140, xp: 75, score: 190 },
        { id: 'abr-e5', questId: 'abraham-q3', kind: 'raider', x: 1020, y: 260, hp: 95, atk: 17, speed: 142, xp: 80, score: 200 }
      ],
      boss: {
        id: 'boss_chedorlaomer',
        questId: 'abraham-q4',
        kind: 'boss_warlord',
        x: 1560,
        y: 350,
        hp: 400,
        atk: 21,
        speed: 148,
        xp: 300,
        score: 1500,
        phase2Threshold: 0.5
      },
      quests: [
        { id: 'abraham-q1', order: 1, type: 'talk', targetCount: 1, xp: 110, score: 350, scriptureId: 'gen_13_8_9' },
        { id: 'abraham-q2', order: 2, type: 'collect', targetCount: 5, xp: 140, score: 500, scriptureId: 'gen_15_5' },
        { id: 'abraham-q3', order: 3, type: 'kill', targetCount: 5, xp: 160, score: 550, scriptureId: 'gen_12_1_4' },
        { id: 'abraham-q4', order: 4, type: 'boss', targetCount: 1, xp: 300, score: 1500, scriptureId: 'gen_22_13_14' }
      ]
    },
    {
      id: 'plagues',
      order: 4,
      book: 'exodus',
      viewpoint: 'moses',
      heroType: 'moses',
      width: 1920,
      height: 1280,
      spawn: { x: 340, y: 680 },
      accent: '#dc2626',
      biome: 'egypt',
      rewardItem: 'blood_of_lamb',
      landmarks: [
        { id: 'burning_bush', kind: 'burning_bush', x: 260, y: 480, r: 44, dialogueId: 'plagues_bush' },
        { id: 'palace_obelisk', kind: 'obelisk', x: 1540, y: 580, r: 46 }
      ],
      npcs: [
        { id: 'npc_bush_angel', x: 320, y: 520, spriteType: 'angel_lord', dialogueId: 'plagues_bush' }
      ],
      interactables: [
        { id: 'plg-h1', questId: 'plagues-q2', kind: 'goshen_door', x: 580, y: 360 },
        { id: 'plg-h2', questId: 'plagues-q2', kind: 'goshen_door', x: 640, y: 880 },
        { id: 'plg-h3', questId: 'plagues-q2', kind: 'goshen_door', x: 860, y: 420 },
        { id: 'plg-h4', questId: 'plagues-q2', kind: 'goshen_door', x: 880, y: 920 },
        { id: 'plg-h5', questId: 'plagues-q2', kind: 'goshen_door', x: 1090, y: 660 }
      ],
      enemies: [
        { id: 'plg-e1', questId: 'plagues-q3', kind: 'magician', x: 1250, y: 400, hp: 100, atk: 17, speed: 135, xp: 80, score: 210 },
        { id: 'plg-e2', questId: 'plagues-q3', kind: 'magician', x: 1280, y: 880, hp: 100, atk: 17, speed: 135, xp: 80, score: 210 },
        { id: 'plg-e3', questId: 'plagues-q3', kind: 'egypt_guard', x: 1410, y: 500, hp: 110, atk: 19, speed: 145, xp: 85, score: 220 },
        { id: 'plg-e4', questId: 'plagues-q3', kind: 'egypt_guard', x: 1410, y: 780, hp: 110, atk: 19, speed: 145, xp: 85, score: 220 },
        { id: 'plg-e5', questId: 'plagues-q3', kind: 'magician', x: 1620, y: 920, hp: 105, atk: 18, speed: 138, xp: 85, score: 220 }
      ],
      boss: {
        id: 'boss_magician',
        questId: 'plagues-q4',
        kind: 'boss_magician',
        x: 1620,
        y: 640,
        hp: 460,
        atk: 23,
        speed: 145,
        xp: 340,
        score: 1650,
        phase2Threshold: 0.5
      },
      quests: [
        { id: 'plagues-q1', order: 1, type: 'talk', targetCount: 1, xp: 120, score: 380, scriptureId: 'exod_3_2_5' },
        { id: 'plagues-q2', order: 2, type: 'collect', targetCount: 5, xp: 150, score: 550, scriptureId: 'exod_12_12_13' },
        { id: 'plagues-q3', order: 3, type: 'kill', targetCount: 5, xp: 180, score: 600, scriptureId: 'exod_9_22_26' },
        { id: 'plagues-q4', order: 4, type: 'boss', targetCount: 1, xp: 340, score: 1650, scriptureId: 'exod_7_14_17' }
      ]
    },
    {
      id: 'redsea',
      order: 5,
      book: 'exodus',
      viewpoint: 'moses',
      heroType: 'moses',
      width: 1920,
      height: 1280,
      spawn: { x: 240, y: 640 },
      accent: '#0891b2',
      biome: 'redsea',
      rewardItem: 'staff_of_moses',
      landmarks: [
        { id: 'pillar_start', kind: 'pillar_fire', x: 210, y: 520, r: 44 },
        { id: 'shore_arch', kind: 'stone_altar', x: 1740, y: 640, r: 46 }
      ],
      npcs: [
        { id: 'npc_miriam', x: 350, y: 540, spriteType: 'miriam', dialogueId: 'redsea_miriam' }
      ],
      interactables: [
        { id: 'rs-p1', questId: 'redsea-q1', kind: 'pillar_beacon', x: 540, y: 470 },
        { id: 'rs-p2', questId: 'redsea-q1', kind: 'pillar_beacon', x: 860, y: 790 },
        { id: 'rs-p3', questId: 'redsea-q1', kind: 'pillar_beacon', x: 1180, y: 470 },
        { id: 'rs-p4', questId: 'redsea-q1', kind: 'pillar_beacon', x: 1460, y: 760 },
        { id: 'rs-i1', questId: 'redsea-q2', kind: 'traveler', x: 480, y: 760 },
        { id: 'rs-i2', questId: 'redsea-q2', kind: 'traveler', x: 780, y: 500 },
        { id: 'rs-i3', questId: 'redsea-q2', kind: 'traveler', x: 1080, y: 760 },
        { id: 'rs-i4', questId: 'redsea-q2', kind: 'traveler', x: 1360, y: 510 }
      ],
      enemies: [
        { id: 'rs-e1', questId: 'redsea-q3', kind: 'chariot', x: 690, y: 640, hp: 115, atk: 20, speed: 165, xp: 90, score: 240 },
        { id: 'rs-e2', questId: 'redsea-q3', kind: 'chariot', x: 960, y: 500, hp: 115, atk: 20, speed: 165, xp: 90, score: 240 },
        { id: 'rs-e3', questId: 'redsea-q3', kind: 'chariot', x: 1210, y: 770, hp: 120, atk: 21, speed: 170, xp: 95, score: 250 },
        { id: 'rs-e4', questId: 'redsea-q3', kind: 'egypt_guard', x: 1420, y: 640, hp: 120, atk: 20, speed: 155, xp: 95, score: 240 },
        { id: 'rs-e5', questId: 'redsea-q3', kind: 'chariot', x: 1550, y: 480, hp: 125, atk: 22, speed: 172, xp: 100, score: 260 }
      ],
      boss: {
        id: 'boss_chariot',
        questId: 'redsea-q4',
        kind: 'boss_chariot',
        x: 1660,
        y: 640,
        hp: 520,
        atk: 25,
        speed: 175,
        xp: 380,
        score: 1850,
        phase2Threshold: 0.5
      },
      quests: [
        { id: 'redsea-q1', order: 1, type: 'collect', targetCount: 4, xp: 140, score: 500, scriptureId: 'exod_13_21' },
        { id: 'redsea-q2', order: 2, type: 'collect', targetCount: 4, xp: 150, score: 550, scriptureId: 'exod_14_21_22' },
        { id: 'redsea-q3', order: 3, type: 'kill', targetCount: 5, xp: 190, score: 650, scriptureId: 'exod_14_13_16' },
        { id: 'redsea-q4', order: 4, type: 'boss', targetCount: 1, xp: 380, score: 1850, scriptureId: 'exod_15_1_2' }
      ]
    },
    {
      id: 'sinai',
      order: 6,
      book: 'exodus',
      viewpoint: 'moses',
      heroType: 'moses',
      width: 1920,
      height: 1280,
      spawn: { x: 460, y: 920 },
      accent: '#b45309',
      biome: 'sinai',
      rewardItem: 'stone_tablets',
      landmarks: [
        { id: 'horeb_rock', kind: 'horeb_rock', x: 340, y: 420, r: 52 },
        { id: 'tabernacle', kind: 'tabernacle', x: 960, y: 580, r: 80 },
        { id: 'golden_calf', kind: 'golden_calf', x: 1480, y: 900, r: 42, dialogueId: 'sinai_calf' }
      ],
      npcs: [
        { id: 'npc_aaron', x: 1410, y: 890, spriteType: 'villager', dialogueId: 'sinai_calf' }
      ],
      interactables: [
        { id: 'sin-m1', questId: 'sinai-q1', kind: 'manna', x: 520, y: 660 },
        { id: 'sin-m2', questId: 'sinai-q1', kind: 'manna', x: 640, y: 420 },
        { id: 'sin-m3', questId: 'sinai-q1', kind: 'manna', x: 820, y: 920 },
        { id: 'sin-m4', questId: 'sinai-q1', kind: 'manna', x: 1120, y: 840 },
        { id: 'sin-m5', questId: 'sinai-q1', kind: 'manna', x: 1250, y: 470 },
        { id: 'sin-m6', questId: 'sinai-q1', kind: 'manna', x: 370, y: 470 }
      ],
      enemies: [
        { id: 'sin-e1', questId: 'sinai-q3', kind: 'amalekite', x: 740, y: 290, hp: 130, atk: 21, speed: 150, xp: 100, score: 260 },
        { id: 'sin-e2', questId: 'sinai-q3', kind: 'amalekite', x: 1080, y: 260, hp: 130, atk: 21, speed: 150, xp: 100, score: 260 },
        { id: 'sin-e3', questId: 'sinai-q3', kind: 'amalekite', x: 1360, y: 310, hp: 135, atk: 22, speed: 155, xp: 105, score: 270 },
        { id: 'sin-e4', questId: 'sinai-q3', kind: 'amalekite', x: 1540, y: 580, hp: 135, atk: 22, speed: 155, xp: 105, score: 270 },
        { id: 'sin-e5', questId: 'sinai-q3', kind: 'amalekite', x: 1220, y: 1020, hp: 140, atk: 23, speed: 158, xp: 110, score: 280 },
        { id: 'sin-e6', questId: 'sinai-q3', kind: 'amalekite', x: 720, y: 1040, hp: 140, atk: 23, speed: 158, xp: 110, score: 280 }
      ],
      boss: {
        id: 'boss_amalek',
        questId: 'sinai-q4',
        kind: 'boss_amalek',
        x: 960,
        y: 240,
        hp: 620,
        atk: 26,
        speed: 162,
        xp: 450,
        score: 2200,
        phase2Threshold: 0.5
      },
      quests: [
        { id: 'sinai-q1', order: 1, type: 'collect', targetCount: 6, xp: 150, score: 550, scriptureId: 'exod_16_4_15' },
        { id: 'sinai-q2', order: 2, type: 'talk', targetCount: 1, xp: 160, score: 600, scriptureId: 'exod_20_1_17' },
        { id: 'sinai-q3', order: 3, type: 'kill', targetCount: 6, xp: 220, score: 750, scriptureId: 'exod_17_6' },
        { id: 'sinai-q4', order: 4, type: 'boss', targetCount: 1, xp: 450, score: 2200, scriptureId: 'exod_40_34' }
      ]
    }
  ];

  root.COG.DATA.ZONES = ZONES;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZONES;
  }
})(typeof window !== 'undefined' ? window : globalThis);
