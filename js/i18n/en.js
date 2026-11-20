(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.I18N = root.COG.I18N || {};

  root.COG.I18N.en = {
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    appTitle: 'Choice of God',
    appSubtitle: 'Cute Storybook Multi-Genre RPG Adventure (Genesis & Exodus)',
    appTagline: 'A sparkling Bible picture-book adventure where every stage transforms into a brand-new genre!',
    metaTitle: 'Choice of God v6.0 — Biblical World Map & Multi-Genre RPG',
    ui: {
      galleryTitle: 'Biblical World Map · Choose Any Stage & Genre',
      galleryHint: 'Click any landmark pin on the map to preview its story, mission & controls right on the start screen! (Guarding Eden in Stage 1 grants +5,000 bonus)',
      mapHint: 'Click any landmark pin on the World Map to read the briefing, then hit Start! (Double-click a pin to jump right in)',
      briefObjective: '🎯 Mission Objective',
      briefControls: '🎮 Controls',
      briefVerse: '📖 Key Verse',
      prevStage: '◀ Prev',
      bestScore: 'Best Score',
      unplayed: 'Not Cleared',
      highestScoreBadge: 'Highest Score Route (+5,000)',
      score: 'Score',
      level: 'Lv',
      faith: 'Faith',
      wisdom: 'Wisdom',
      mercy: 'Mercy',
      route: 'Eden Branch',
      routeUndecided: 'Exploring',
      routePreserved: 'Eden Preserved',
      routeFallen: 'History & Redemption',
      activeGuide: 'Companion',
      playStage: 'Play This Genre',
      replayStage: 'Replay Stage',
      backToGallery: 'Storybook Map',
      retry: 'Try Again',
      nextStage: 'Next Stage',
      codex: 'Scripture Codex',
      inventory: 'Relics & Angels',
      help: 'How to Play',
      settings: 'Settings · Language',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      language: 'Language',
      close: 'Close',
      confirm: 'OK',
      resetProgress: 'Reset Progress',
      resetConfirm: 'Reset all scores, levels, relics, and completed stages?',
      touchControls: 'Touch Pad',
      actionBtn: 'Action / Attack (Space)',
      dashBtn: 'Dash Roll (Shift)',
      endDialogue: 'End Chat',
      unlocked: 'Owned',
      locked: 'Locked',
      requiresLevel: 'Joins at Lv.{lv}',
      selectGuide: 'Choose Guide',
      selected: 'Following',
      completedBadge: 'Clear',
      stageClear: 'Stage Cleared!',
      stageFailed: 'Almost There — Try Again!',
      viewEnding: 'View Storybook Finale',
      endingTitle: 'Storybook Finale — Choice of God',
      endingClose: 'Back to Storybook Map',
      allChapters: 'All',
      genesisBook: 'Genesis',
      exodusBook: 'Exodus',
      danielBook: 'Daniel',
      controlsHint: 'Move: WASD/Arrows · Attack/Aim: Space/Click · Dash: Shift · 6 Unique Genres!',
      helpBody1: '1. Pick any of the 6 illustrated stages (Adam & Eve, Noah, Abraham, Moses) freely from the Storybook Map.',
      helpBody2: '2. Each stage switches genres: 1. Action RPG -> 2. Building Sim -> 3. Hex Turn-Based Strategy -> 4. JRPG Battle -> 5. 3-Lane RTS Defense -> 6. 1st-Person Light Aiming!',
      helpBody3: '3. Defeating the playful Serpent in Stage 1 without eating the forbidden fruit unlocks the +5,000 Crown Bonus; eating opens the redemption path.',
      helpBody4: '4. Leveling up unlocks 5 cute angel companions and 8 sacred relics that strengthen your heroes.'
    },
    viewpoints: { adam_eve: 'Adam & Eve', noah: 'Noah', abraham: 'Abraham', moses: 'Moses' },
    genres: {
      action_rpg: '⚔️ Action RPG (Zelda Style)',
      city_sim: '🏡 Building Sim (Sims / Cozy Town)',
      hex_tbs: '♟️ Hex Turn-Based Strategy (Civ Style)',
      jrpg_battle: '🃏 Turn-Based JRPG Battle (FF Style)',
      rts_defense: '🛡️ Real-Time Strategy RTS (3-Lane)',
      fps_light: '✨ 1st-Person Light Shooter (FPS)'
    },
    books: { genesis: 'Genesis', exodus: 'Exodus', daniel: 'Daniel' },
    stages: {
      eden: {
        mapLabel: '1. Eden',
        title: 'Stage 1. Garden of Eden — Sunny Action RPG',
        period: 'Genesis 1–3',
        objective: 'Gather 5 Creation Stars, speak with baby Cherubim, and purify the Serpent (or choose at the Tree of Knowledge)!',
        desc: 'Dash and slash across a sunlit meadow with four sparkling rivers as adorable chibi Adam & Eve.',
        controls: 'Click-to-Move / Auto-Action · WASD · Space 3-Hit Combo · Q/R Skills · Shift Dash',
        outroPreserved: 'Holding fast to God’s Word, Eden blossoms forever as Paradise! (+5,000 Crown Bonus)',
        outroFallen: 'Clothed in God’s warm Garment of Skin, humanity steps forward into the story of redemption!'
      },
      ark: {
        mapLabel: '2. Noah’s Ark',
        title: 'Stage 2. Noah’s Ark — Cozy Village Builder',
        period: 'Genesis 6–9',
        objective: 'Build Timber Mills, Pitch Wells & Animal Shelters on meadow tiles, welcome baby animals, and reach 100% Ark!',
        desc: 'Construct timber workshops on a 6x4 sunny grid, harvest resources, and guide baby animals aboard the Ark.',
        controls: 'Click grass plots to move, hammer & upgrade workshops · Build Ark at 100%',
        outro: 'All baby animals are safely aboard and a bright pastel rainbow shines over the valley!'
      },
      abraham: {
        mapLabel: '3. Canaan',
        title: 'Stage 3. Abraham — Hex Strategy Expedition',
        period: 'Genesis 12–22',
        objective: 'March turn-by-turn across Canaan’s hex tiles, light 3 Star Shrines, and reach Mount Moriah!',
        desc: 'Command Abraham’s caravan across pastel hexes with diplomacy choices, star shrines, and tactical clashes.',
        controls: 'Click any hex tile to march along the shortest path · Cast Starlight / Peace skills',
        outro: 'Faith shining brighter than the stars guides you safely to Mount Moriah — Jehovah-Jireh!'
      },
      plagues: {
        mapLabel: '4. Egypt Plagues',
        title: 'Stage 4. Moses & Ten Plagues — JRPG Battle',
        period: 'Exodus 3–12',
        objective: 'Lead Moses & Aaron in turn-based JRPG combat using iconic Miracle Skills to overcome Pharaoh’s court!',
        desc: 'Side-view turn-based RPG duel featuring Nile Waves, Bouncing Frogs, Sky Hail, Goshen Shield & Passover Seal.',
        controls: 'Choose 5 Miracle Skills by turn (raise Goshen Shield when Pharaoh charges)',
        outro: 'Goshen glows beneath the golden shield and the dawn of the Exodus opens!'
      },
      redsea: {
        mapLabel: '5. Red Sea',
        title: 'Stage 5. Crossing the Red Sea — 3-Lane RTS',
        period: 'Exodus 13–15',
        objective: 'Spend regenerating Faith Mana to summon Angels, Knights & Miriam across 3 lanes and unleash the Staff Wave!',
        desc: 'Real-time 3-lane defense between fish-filled turquoise water walls against oncoming chariots!',
        controls: 'Select Lane 1–3 · Summon Angel, Knight & Miriam · Unleash Staff Wave',
        outro: 'Every traveler reaches the sunny eastern shore as Miriam’s victory song fills the sky!'
      },
      sinai: {
        mapLabel: '6. Mt. Sinai',
        title: 'Stage 6. Mount Sinai — 1st-Person Light Aim & Finale',
        period: 'Exodus 16–40',
        objective: 'Aim Moses’s glowing staff to catch 8 Manna stars and purify 8 Golden Calf shadow wisps!',
        desc: 'First-person light-staff aiming action over Mount Sinai, crowning the golden Tabernacle.',
        controls: 'Move mouse/touch to aim · Click/Space to fire light orbs · Shift Glory Beam',
        outro: 'The cloud of glory fills the golden Tabernacle, completing the Genesis & Exodus chronicle!'
      }
    },
    stageUi: {
      eden: {
        stars: 'Stars', bossHp: 'Chibi Serpent Boss', hearts: 'Hearts', combo: 'Combo',
        autoOn: '🤖 Auto-Action: ON', autoOff: '🎮 Auto-Action: OFF',
        skills: { spin: '🌀 Radiant Spin (Q)', angelBurst: '✨ Angel Burst + Heal (R)' },
        hint: 'Click anywhere to run, talk & attack! Or use WASD/Arrows · Space Combo · Q/R Skills'
      },
      ark: {
        timber: 'Gopher Wood', pitch: 'Pitch', animals: 'Baby Animals', arkProg: 'Ark Progress',
        driftwood: '🪵 Driftwood (+4)', rainBoost: '🌧️ Blessing Rain! Pitch x2!',
        tools: { mill: '🪵 Timber Mill (Free)', well: '🏺 Pitch Well (3 Wood)', pen: '🐑 Cozy Animal Pen (4 Wood)', buildArk: '🚢 Build Ark (+25% · 6 Wood, 4 Pitch)' },
        harvestTip: 'Click grass plots — Noah runs over and hammers each workshop up to Lv.3!'
      },
      abraham: {
        turn: 'Turn', faith: 'Faith', food: 'Food', shrines: 'Star Shrines',
        skills: { starBolt: '⭐ Starlight Bolt (8 Faith)', peace: '🕊️ Peace Envoy (6 Food)' },
        hint: 'Click highlighted hexes to march across Canaan or cast skills to break raiders!'
      },
      plagues: {
        mosesParty: 'Moses & Aaron', enemyParty: 'Pharaoh & Magician',
        turnPlayer: 'Moses’s Turn — Choose a Miracle Skill!',
        turnEnemy: 'Pharaoh prepares a counterattack...',
        intents: { attack: '⚔️ Attack Incoming', charge: '⚡ Sandstorm Charging! (Break It!)', guard: '🛡️ Arcane Ward' },
        skills: [
          { id: 'nile', name: '🌊 Crimson Nile Wave', desc: 'Hit all foes for 28 dmg (0 MP)' },
          { id: 'frogs', name: '🐸 Bouncing Frogs', desc: 'Heavy single hit 42 dmg (15 MP)' },
          { id: 'hail', name: '☄️ Starry Sky Hail', desc: 'Strong all-foe hit 48 dmg (24 MP)' },
          { id: 'shield', name: '🛡️ Goshen Golden Shield', desc: 'Heal +35 HP & Shield (12 MP)' },
          { id: 'passover', name: '🕊️ Passover Grace Seal', desc: 'Ultimate 65 dmg & Heal (32 MP)' }
        ]
      },
      redsea: {
        mana: 'Faith Mana', lane: 'Selected Lane', wave: 'Chariots Stopped', baseHp: 'Israel Convoy',
        lanes: ['Top Lane (1)', 'Middle Lane (2)', 'Bottom Lane (3)'],
        units: [
          { id: 'angel', name: '👼 Angel Guardian (20)', cost: 20 },
          { id: 'knight', name: '🛡️ Shield Knight (30)', cost: 30 },
          { id: 'miriam', name: '🎵 Miriam Healer (25)', cost: 25 },
          { id: 'wave', name: '🌊 Staff Tidal Wave! (45)', cost: 45 }
        ]
      },
      sinai: {
        manna: 'Manna Caught', purified: 'Shadows Purified', time: 'Sunlight Left',
        fever: 'FEVER x3!', bossName: 'Shadow Serpent Guardian',
        skills: { sunburst: '☀️ Sinai Sunburst! (Shift)' },
        hint: 'Chain hits for x3 Fever spread! Press Shift for Sunburst beam & defeat the Guardian!'
      }
    },
    speakers: {
      cherubim: 'Baby Cherubim Angel',
      serpent: 'Playful Serpent & Apple Tree',
      lot: 'Nephew Lot',
      aaron: 'Aaron & The Golden Calf'
    },
    dialogues: {
      eden_cherubim: {
        n1: 'Hi Adam and Eve! Sparkling Creation Stars fell by the rivers and a mischievous serpent appeared to the west. What will you do?',
        c1: 'We’ll trust God’s Word and guard Eden with all our hearts! (+4 Faith, Heal)',
        c2: 'We’ll check out the western grove wisely and stay alert! (+5 Wisdom, +150 Score)',
        n2: 'Wonderful! May golden sparkles empower your blade!',
        n3: 'Be careful! Sweet temptations wait under the western tree.'
      },
      eden_crossroads: {
        n1: 'The purple serpent grins under the glowing apples: “Did God really say not to eat? Just one yummy bite opens your eyes!”',
        c_resist: '“No way! We keep God’s Word!” — Reject & Guard Paradise (+5,000 Crown Route)',
        c_eat: '“Just one bite...” — Enter Human History & Redemption (Unlocks Garment of Skin)',
        n_resist: 'Golden light bursts forth! Defeat the Serpent Boss to preserve Eden forever!',
        n_eat: 'Though toil begins, God wraps you in a cozy Garment of Skin and opens Noah, Abraham & Moses’s journey!'
      },
      abraham_lot: {
        n1: 'Uncle Abraham! Our fluffy flocks grew too huge for one hill. How shall we share the land?',
        c_peace: '“We’re family! Let’s never quarrel — pick whichever green valley you like first.” (+6 Faith, +8 Mercy)',
        c_firm: '“Let’s mark friendly borders so both camps stay peaceful.” (+6 Wisdom)',
        n_peace: 'Your kindness melts my heart! May God bless you with descendants like the stars!',
        n_firm: 'Smart plan! Let’s march onward and light the Star Shrines!'
      },
      sinai_calf: {
        n1: 'Moses! Some folks got impatient and want a Golden Calf statue. What should we do?',
        c_shatter: '“Only the LORD is God!” Banish the idol and uphold the Ten Words (+10 Faith)',
        c_pray: 'Pray tenderly to turn everyone’s hearts back to God (+9 Mercy)',
        n_shatter: 'Everyone cheers in repentance! Now aim the Light Staff to purify the shadows!',
        n_pray: 'Heaven smiles down! Time to consecrate the Tabernacle!'
      }
    },
    guides: {
      cherubim: { name: 'Baby Cherubim', role: 'Eden Guardian (+6 ATK)', desc: 'Fluffy-winged guardian angel who cheers you on from Lv.1.', quote: '“Let’s protect the garden with sparkling light!”' },
      angel_lord: { name: 'Angel of the LORD', role: 'Burning Bush Guide (+10 ATK, +5% Score)', desc: 'Warm flame messenger from Exodus 3:2.', quote: '“Be brave — I’m walking right beside you!”' },
      pillar_fire: { name: 'Cloud & Fire Pillar', role: 'Desert Pathfinder (+14 ATK, +10% Score)', desc: 'Bright guide shining day and night across the desert.', quote: '“Not even the darkest night can hide our path!”' },
      gabriel: { name: 'Angel Gabriel', role: 'Wisdom Messenger (+18 ATK, +15% Score)', desc: 'Joyful messenger of Daniel 8:16.', quote: '“Every wonderful promise blooms right on time!”' },
      michael: { name: 'Archangel Michael', role: 'Heavenly Captain (+24 ATK, +22% Score)', desc: 'Courageous defender of Daniel 10:13.', quote: '“Stay bold to the finish — victory shines ahead!”' }
    },
    items: {
      word_of_light: { name: 'Sparkle Blade of Light', desc: 'Shining sword from Genesis 1:3 (+6 ATK)' },
      staff_of_moses: { name: 'Golden Shepherd Staff', desc: 'Moses’s miracle staff from Exodus 4:2 (+10 ATK)' },
      tree_of_life_leaf: { name: 'Tree of Life Leaf Crown', desc: 'Awarded for guarding Paradise (+35 HP, +4 Faith)' },
      garment_of_skin: { name: 'Cozy Garment of Skin', desc: 'Warm covering of mercy from Genesis 3:21 (+8 DEF, +4 Mercy)' },
      olive_branch: { name: 'Dove’s Olive Twig', desc: 'Peaceful gift after the flood (+25 HP)' },
      star_compass: { name: 'Starlight Compass', desc: 'Reflects Abraham’s starry promise (+8 ATK, +5 Wisdom)' },
      blood_of_lamb: { name: 'Passover Gold Shield', desc: 'Protected Goshen during Exodus (+12 DEF)' },
      stone_tablets: { name: 'Tablets of Sinai', desc: 'Crowning covenant relic (+16 ATK, +10 DEF)' }
    },
    bible: {
      gen_1_1: { ref: 'Genesis 1:1', text: 'In the beginning, God created the heavens and the earth.' },
      gen_1_3: { ref: 'Genesis 1:3', text: 'And God said, “Let there be light,” and there was light.' },
      gen_2_8_9: { ref: 'Genesis 2:8-9', text: 'And the LORD God planted a garden in Eden, in the east... And in the midst of the garden were the tree of life and the tree of the knowledge of good and evil.' },
      gen_2_16_17: { ref: 'Genesis 2:16-17', text: 'You may surely eat of every tree of the garden, but of the tree of the knowledge of good and evil you shall not eat, for in the day that you eat of it you shall surely die.' },
      gen_3_1_6: { ref: 'Genesis 3:4-6', text: 'But the serpent said to the woman, “You will not surely die.” ... So she took of its fruit and ate, and she also gave some to her husband who was with her, and he ate.' },
      gen_3_21: { ref: 'Genesis 3:21', text: 'And the LORD God made for Adam and for his wife garments of skins and clothed them.' },
      gen_3_24: { ref: 'Genesis 3:24', text: 'He drove out the man, and at the east of the garden of Eden he placed the cherubim and a flaming sword that turned every way to guard the way to the tree of life.' },
      gen_6_14: { ref: 'Genesis 6:14', text: 'Make yourself an ark of gopher wood. Make rooms in the ark, and cover it inside and out with pitch.' },
      gen_7_2_3: { ref: 'Genesis 7:2-3', text: 'Take with you seven pairs of all clean animals... and a pair of the animals that are not clean, to keep their offspring alive on the face of all the earth.' },
      gen_7_12: { ref: 'Genesis 7:12', text: 'And rain fell upon the earth forty days and forty nights.' },
      gen_8_11: { ref: 'Genesis 8:11', text: 'And the dove came back to him in the evening, and behold, in her mouth was a freshly plucked olive leaf.' },
      gen_9_13: { ref: 'Genesis 9:13', text: 'I have set my bow in the cloud, and it shall be a sign of the covenant between me and the earth.' },
      gen_12_1_4: { ref: 'Genesis 12:1-2', text: 'Go from your country and your kindred and your father’s house to the land that I will show you. And I will make of you a great nation, and I will bless you.' },
      gen_13_8_9: { ref: 'Genesis 13:8-9', text: 'Let there be no strife between you and me... If you take the left hand, then I will go to the right, or if you take the right hand, then I will go to the left.' },
      gen_15_5: { ref: 'Genesis 15:5', text: 'Look toward heaven, and number the stars, if you are able to number them. Then he said to him, “So shall your offspring be.”' },
      gen_22_13_14: { ref: 'Genesis 22:13-14', text: 'So Abraham called the name of that place, “The LORD will provide”; as it is said to this day, “On the mount of the LORD it shall be provided.”' },
      exod_3_2_5: { ref: 'Exodus 3:2, 5', text: 'And the angel of the LORD appeared to him in a flame of fire out of the midst of a bush... Take your sandals off your feet, for the place on which you are standing is holy ground.' },
      exod_4_2: { ref: 'Exodus 4:2', text: 'The LORD said to him, “What is that in your hand?” He said, “A staff.”' },
      exod_7_14_17: { ref: 'Exodus 7:17', text: 'Behold, with the staff that is in my hand I will strike the water that is in the Nile, and it shall turn into blood.' },
      exod_9_22_26: { ref: 'Exodus 9:26', text: 'Only in the land of Goshen, where the people of Israel were, was there no hail.' },
      exod_12_12_13: { ref: 'Exodus 12:13', text: 'The blood shall be a sign for you, on the houses where you are. And when I see the blood, I will pass over you.' },
      exod_13_21: { ref: 'Exodus 13:21', text: 'And the LORD went before them by day in a pillar of cloud to lead them along the way, and by night in a pillar of fire to give them light.' },
      exod_14_13_16: { ref: 'Exodus 14:13, 16', text: 'Fear not, stand firm, and see the salvation of the LORD... Lift up your staff, and stretch out your hand over the sea and divide it.' },
      exod_14_21_22: { ref: 'Exodus 14:21-22', text: 'The LORD drove the sea back by a strong east wind all night and made the sea dry land... And the people of Israel went into the midst of the sea on dry ground.' },
      exod_15_1_2: { ref: 'Exodus 15:2', text: 'The LORD is my strength and my song, and he has become my salvation; this is my God, and I will praise him.' },
      exod_16_4_15: { ref: 'Exodus 16:4, 15', text: 'Behold, I am about to rain bread from heaven for you, and the people shall go out and gather a day’s portion every day.' },
      exod_17_6: { ref: 'Exodus 17:6', text: 'You shall strike the rock, and water shall come out of it, and the people will drink.' },
      exod_20_1_17: { ref: 'Exodus 20:2-3', text: 'I am the LORD your God, who brought you out of the land of Egypt, out of the house of slavery. You shall have no other gods before me.' },
      exod_31_18: { ref: 'Exodus 31:18', text: 'And he gave to Moses, when he had finished speaking with him on Mount Sinai, the two tablets of the testimony, tablets of stone, written with the finger of God.' },
      exod_40_34: { ref: 'Exodus 40:34', text: 'Then the cloud covered the tent of meeting, and the glory of the LORD filled the tabernacle.' },
      dan_8_16: { ref: 'Daniel 8:16', text: '“Gabriel, make this man understand the vision.”' },
      dan_10_13: { ref: 'Daniel 10:13', text: 'But Michael, one of the chief princes, came to help me.' }
    },
    endings: {
      crown: {
        title: 'Crown of Eden — Shining Keeper of Paradise',
        desc: 'You protected Eden for the +5,000 Crown Bonus and conquered all 6 distinct biblical game genres in radiant joy!'
      },
      covenant: {
        title: 'Star of the Covenant — Glory Upon Sinai',
        desc: 'Through Action RPG, Village Building, Hex Strategy, JRPG Battle, 3-Lane RTS, and Light Aiming, you raised the golden Tabernacle!'
      },
      pilgrim: {
        title: 'Storybook Pilgrim of Faith',
        desc: 'A lovely start through Genesis & Exodus! Try clearing every genre and protecting Eden for the Crown ending!'
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.I18N.en;
  }
})(typeof window !== 'undefined' ? window : globalThis);
