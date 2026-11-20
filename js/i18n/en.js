(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.I18N = root.COG.I18N || {};

  root.COG.I18N.en = {
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    appTitle: 'Choice of God',
    appSubtitle: 'Genesis & Exodus Multi-Genre Narrative Adventure',
    appTagline: 'What will humanity choose before the Word of God — from guarding Eden to the Covenant at Sinai',
    metaTitle: 'Choice of God — Genesis & Exodus Narrative Game',
    ui: {
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel',
      retry: 'Retry',
      nextLevel: 'Next Level',
      backToMap: 'Timeline Map',
      playStage: 'Start Stage',
      startGame: 'Begin Journey',
      continueJourney: 'Continue Journey',
      selectChapter: 'Free Chapter & Viewpoint Selection',
      freeSelectHint: 'Jump freely to any Genesis or Exodus viewpoint and stage at any time. The highest possible score comes from guarding Eden in Chapter 1!',
      highestScoreBadge: 'Highest Score Route (+5,000)',
      score: 'Score',
      level: 'Level',
      faith: 'Faith',
      wisdom: 'Wisdom',
      mercy: 'Mercy',
      route: 'Eden Branch',
      routeUndecided: 'Undecided (Exploring)',
      routePreserved: 'Eden Preserved (Paradise)',
      routeFallen: 'Beyond Eden (Path of Redemption)',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      language: 'Language',
      settings: 'Settings & Language',
      codex: 'Scripture Codex',
      inventory: 'Sacred Items & Guides',
      help: 'How to Play',
      resetProgress: 'Reset Progress',
      resetConfirm: 'Reset all scores and stage progress?',
      touchControls: 'Touch Pad',
      actionBtn: 'Word / Action (Space)',
      itemBar: 'Sacred Items (Click to Activate)',
      unlocked: 'Unlocked',
      locked: 'Locked',
      requiresLevel: 'Unlocks at Level {lv}',
      activeGuide: 'Active Guide',
      selectGuide: 'Choose Guide',
      selected: 'Selected',
      viewpointLabel: 'Viewpoint',
      genreLabel: 'Genre',
      controlsHint: 'Move: WASD / Arrows · Action: Space / Click',
      allChapters: 'All',
      genesisBook: 'Genesis',
      exodusBook: 'Exodus',
      danielBook: 'Daniel',
      endingTitle: 'Journey Finale — Choice of God',
      endingClose: 'Return to Timeline Map',
      edenChoiceTitle: 'Crossroads at the Tree of Knowledge',
      edenChoiceBody: 'The Serpent’s whisper echoes beneath the boughs. Will you eat the forbidden fruit and enter history beyond Eden, or hold fast to the Word and guard Paradise?',
      edenChoiceEat: 'Eat the Fruit (History Branch: Redemption Story)',
      edenChoiceResist: 'Resist & Guard Eden (Highest Score Route)',
      levelClear: 'Stage Complete!',
      levelFailed: 'Challenge Failed — Rise Again',
      starsEarned: 'Stars',
      bonusAwarded: 'Bonus Score',
      itemObtained: 'Sacred Item Obtained',
      guideUnlocked: 'New Guide Joined!',
      subLevelLabel: 'Stage',
      completedBadge: 'Done',
      itemUsed: '{name} Activated!',
      noEffectHere: 'No passive/manual effect applies inside this specific stage.',
      skipToStage: 'Play From This Viewpoint',
      helpBody1: '1. Freely choose any of the 6 biblical chapters and viewpoints (Adam & Eve, Noah, Abraham, Moses) from the Timeline Map in any order.',
      helpBody2: '2. Each chapter features 4 escalating sub-levels (Introduction -> Application -> Mastery -> Covenant Reward) across different game genres.',
      helpBody3: '3. Resisting temptation through Stage 1-4 in Eden awards the highest Crown Bonus (+5,000 pts) and the Paradise Preserved branch. Eating the fruit transitions smoothly into the full salvation history across Genesis and Exodus.',
      helpBody4: '4. As your Player Level rises, biblical heavenly guides unlock dynamically, and sacred items in your bar can be clicked during play for tactical blessings.'
    },
    viewpoints: {
      adam_eve: 'Adam & Eve (Creation & Eden)',
      noah: 'Noah (The Ark & Covenant)',
      abraham: 'Abraham (Father of Faith)',
      moses: 'Moses (Exodus & Law)'
    },
    genres: {
      topdown: '2D Top-Down Guardian Action',
      builder: 'Resource Builder & Storm Balance',
      rpg: 'Choice-Driven Narrative RPG & Constellation Puzzle',
      tactics: 'Turn-Based Strategy & Passover Puzzle',
      arcade: 'Red Sea Arcade Runner & Timing',
      management: 'Wilderness Survival & Covenant Finale'
    },
    books: {
      genesis: 'Genesis',
      exodus: 'Exodus',
      daniel: 'Daniel'
    },
    chapters: {
      eden: {
        title: 'Ch 1. Garden of Eden — The First Choice',
        period: 'Genesis 1–3',
        summary: 'Step into the dawn of creation as Adam & Eve. Tend the four rivers, guard the Tree of Life against the Serpent, or step onto the road of redemption.',
        genreDesc: '2D top-down movement, Word-of-Light shield waves, branching fate'
      },
      ark: {
        title: 'Ch 2. Noah’s Ark — Flood & Rainbow Covenant',
        period: 'Genesis 6–9',
        summary: 'Gather gopher wood and pitch, guide animal pairs safely aboard, keep the ark balanced during the 40-day deluge, and welcome the dove.',
        genreDesc: 'Collection, pair matching & storm-balance repair action'
      },
      abraham: {
        title: 'Ch 3. Abraham — Journey of Stars & Promise',
        period: 'Genesis 12–22',
        summary: 'Leave Ur and Haran, balance Faith, Provisions, and Peace through difficult decisions, trace the stars of heaven, and face Mount Moriah.',
        genreDesc: 'Choice-driven strategy RPG & celestial constellation puzzle'
      },
      plagues: {
        title: 'Ch 4. Moses & Ten Plagues — Bush to Passover',
        period: 'Exodus 3–12',
        summary: 'Answer the call at the Burning Bush, confront Pharaoh with tactical plague cards while shielding Goshen, and mark the Passover doorposts.',
        genreDesc: 'Sequence puzzle, turn-based tactical duel & timed sealing'
      },
      redsea: {
        title: 'Ch 5. Crossing the Red Sea — Pillar & Dry Ground',
        period: 'Exodus 13–15',
        summary: 'Follow the Pillar of Fire through the night desert, part the waters with Moses’s Staff, and sprint across the dry seabed ahead of Pharaoh’s chariots.',
        genreDesc: 'Light-following, timing miracle & 3-lane arcade runner'
      },
      sinai: {
        title: 'Ch 6. Mount Sinai — Manna, Law & Tabernacle',
        period: 'Exodus 16–40',
        summary: 'Gather daily manna without hoarding, channel living water from the rock at Horeb, match the Ten Commandments, and assemble the Tabernacle.',
        genreDesc: 'Quota collection, pipe puzzle & covenant assembly finale'
      }
    },
    levels: {
      'eden-1': {
        title: '1-1. First Light of Creation',
        objective: 'Gather 6 golden Creation Light orbs around the four rivers of Eden.',
        intro: 'In the beginning God created the heavens and the earth, and placed humanity in a garden of wonder.',
        outro: 'Light fills the garden and the rivers sing with new life!',
        hint: 'Move with WASD or Arrow keys to collect all golden light orbs.'
      },
      'eden-2': {
        title: '1-2. Tending the Tree of Life',
        objective: 'Collect 8 Dewdrops of Life to bring the central Tree of Life to 100% bloom.',
        intro: 'Guard and cultivate the Tree of Life beside the four rivers: Pishon, Gihon, Tigris, and Euphrates.',
        outro: 'The Tree of Life shines brightly — yet a dark shadow begins slithering from the west.',
        hint: 'Collect blue-green dewdrops while avoiding contact with the Serpent’s shadow.'
      },
      'eden-3': {
        title: '1-3. The Serpent’s Whisper & Word Shield',
        objective: 'Survive 25 seconds deflecting temptation orbs with Space (Word-of-Light wave), or approach the western Forbidden Tree to choose.',
        intro: 'The Serpent approaches: “You shall not surely die; your eyes shall be opened!”',
        outro: 'You held fast to the Word and weathered the first storm of temptation!',
        hint: 'Press Space or Action to emit a golden Word-of-Light pulse that clears dark orbs.'
      },
      'eden-4': {
        title: '1-4. Guarding Paradise — Crown or History',
        objective: 'Protect Eden for 35 seconds without eating the Forbidden Fruit to claim the +5,000 Crown Route!',
        intro: 'The decisive hour of Eden arrives. Will you defend Paradise into eternal glory, or walk the path outside the gates?',
        outro: 'Your choice resounds across eternity and shapes every chapter to come.',
        hint: 'Use Space pulses and collect green grace orbs to preserve your Eden Shield!'
      },
      'ark-1': {
        title: '2-1. Gopher Wood & Pitch',
        objective: 'Collect 8 timbers of gopher wood and 6 jars of pitch to seal the Ark.',
        intro: 'Seeing a violent world, God commands Noah to build an Ark of gopher wood covered inside and out with pitch.',
        outro: 'The sturdy hull is sealed and ready for the coming waters.',
        hint: 'Steer around storm debris to gather all wood beams and pitch jars.'
      },
      'ark-2': {
        title: '2-2. Two by Two Into the Ark',
        objective: 'Click matching animal pairs (6 pairs) to guide every creature safely inside.',
        intro: 'Before the first raindrops fall, living creatures arrive two by two to find refuge.',
        outro: 'Every pair is safely aboard, and the LORD shuts the door.',
        hint: 'Click two matching animal cards in sequence to board them together.'
      },
      'ark-3': {
        title: '2-3. Forty Days & Nights of Rain',
        objective: 'Balance the Ark with Left/Right keys while clicking red hull leaks for 30 seconds.',
        intro: 'The fountains of the great deep burst open and rain pours for forty days and nights.',
        outro: 'The tempest subsides and the Ark rests gently upon the mountains of Ararat.',
        hint: 'Use A/D or Left/Right arrows to keep the tilt gauge centered and click leaks fast!'
      },
      'ark-4': {
        title: '2-4. The Dove & Rainbow Covenant',
        objective: 'Fly the dove past storm clouds to gather 5 fresh olive leaves and return to the Ark.',
        intro: 'At dusk Noah sends out a dove over the receding waters in search of dry land.',
        outro: 'In the evening she returns with a fresh olive leaf — and God sets His rainbow in the clouds.',
        hint: 'Fly with arrow keys/WASD, grab 5 green olive leaves, then fly back to the Ark icon.'
      },
      'abraham-1': {
        title: '3-1. Call to Leave Ur & Haran',
        objective: 'Navigate 3 decisive moments from Ur to Canaan while keeping Faith, Provisions, and Peace above zero.',
        intro: 'The LORD speaks to Abram: “Go from your country and your kindred to the land that I will show you.”',
        outro: 'Following the promise, Abram builds his first altar in the land of Canaan.',
        hint: 'Weigh each decision carefully so no vital resource drops to zero.'
      },
      'abraham-2': {
        title: '3-2. Peacemaker with Lot',
        objective: 'Resolve strife among shepherds and kings through Abraham’s faith-filled generosity.',
        intro: 'Their flocks grow too vast for one pasture, sparking conflict between Abram’s herdsmen and Lot’s.',
        outro: '“If you take the left hand, then I will go to the right.” Peace opens the whole horizon of promise.',
        hint: 'Choices favoring mercy and peace yield stronger long-term rewards.'
      },
      'abraham-3': {
        title: '3-3. Count the Stars of Heaven',
        objective: 'Connect the covenant stars in exact order from 1 to 9 across the night sky.',
        intro: 'God brings Abram outside beneath the night sky: “Look toward heaven, and number the stars, if you are able.”',
        outro: 'And he believed the LORD, and He counted it to him as righteousness.',
        hint: 'Click stars 1 through 9 sequentially to trace the constellation of promise.'
      },
      'abraham-4': {
        title: '3-4. Jehovah-Jireh on Mount Moriah',
        objective: 'Stand firm through the supreme test of faith and witness the LORD’s provision.',
        intro: 'Ascending Mount Moriah, Isaac asks: “Where is the lamb for a burnt offering?”',
        outro: 'God provides the ram caught in the thicket — “The LORD Will Provide.”',
        hint: 'Answer with steadfast trust in God’s faithfulness.'
      },
      'plagues-1': {
        title: '4-1. Burning Bush & Three Signs',
        objective: 'Demonstrate the three signs (Staff, Leprous Hand, Nile Water) in exact biblical order.',
        intro: 'From the midst of a bush burning with fire yet unconsumed, God calls Moses by name.',
        outro: 'Holding the staff of God, Moses sets out toward Egypt to deliver his people.',
        hint: 'Activate 1. Staff -> 2. Hand -> 3. Nile Water in order.'
      },
      'plagues-2': {
        title: '4-2. Confronting Pharaoh (Early Plagues)',
        objective: 'Play tactical plague & shield cards to break Pharaoh’s stubbornness (100 -> 0) while guarding Goshen.',
        intro: 'Pharaoh hardens his heart: “Who is the LORD, that I should obey His voice and let Israel go?”',
        outro: 'Even Egypt’s magicians whisper: “This is the finger of God.”',
        hint: 'Balance attack cards with [Shield of Goshen] so your people’s faith holds steady.'
      },
      'plagues-3': {
        title: '4-3. Hail, Locusts & Three Days of Darkness',
        objective: 'Outlast stronger royal retaliation and defeat Pharaoh’s resolve while keeping light in Goshen.',
        intro: 'Thick darkness covers Egypt for three days, yet all Israel has light in their dwellings.',
        outro: 'Light preserved Israel in the midst of gloom. Only the final night remains.',
        hint: 'Anticipate Pharaoh’s counter-strikes by defending before heavy attacks.'
      },
      'plagues-4': {
        title: '4-4. The Passover Night',
        objective: 'Mark all 6 Israelite doorframes with the Passover lamb’s seal before midnight runs out.',
        intro: '“When I see the blood, I will pass over you, and no plague will befall you to destroy you.”',
        outro: 'Pharaoh summons Moses by night: “Rise up, go out from among my people!”',
        hint: 'Click each glowing doorway swiftly to apply the Passover seal.'
      },
      'redsea-1': {
        title: '5-1. Pillar of Cloud & Fire',
        objective: 'Stay within the radiant sanctuary of the Pillar of Fire for 25 seconds across the night wilderness.',
        intro: 'By day in a pillar of cloud, by night in a pillar of fire, the LORD leads Israel onward.',
        outro: 'The people arrive safely at Pi-hahiroth beside the shore of the Red Sea.',
        hint: 'Keep moving inside the moving golden circle of the Pillar!'
      },
      'redsea-2': {
        title: '5-2. Stretch Out the Staff',
        objective: 'Strike Space (or Click) inside the golden miracle zone 3 times to drive back the Red Sea.',
        intro: 'Chariots thunder behind, deep waters surge ahead. Moses raises his staff over the sea.',
        outro: 'A strong east wind blows all night, dividing the waters into towering walls on left and right!',
        hint: 'Time your action precisely when the moving indicator crosses the gold center.'
      },
      'redsea-3': {
        title: '5-3. Sprint Through the Dry Seabed',
        objective: 'Dodge crashing spray and pursuing chariots across 3 lanes for 400m while gathering travelers.',
        intro: 'Israel marches on dry ground through the midst of the sea as Egypt pursues close behind.',
        outro: 'Every traveler reaches the eastern shore before the waters return over Pharaoh’s army!',
        hint: 'Use Up/Down (or W/S or touch lane buttons) to switch between the 3 seabed lanes.'
      },
      'redsea-4': {
        title: '5-4. Song of Miriam & Moses',
        objective: 'Catch 12 golden notes of praise across the lanes to finish the Song of Deliverance.',
        intro: 'Miriam takes a tambourine in hand, leading the people in triumphant worship on the shore.',
        outro: '“The LORD is my strength and my song, and He has become my salvation!”',
        hint: 'Slide left/right to catch every golden musical note!'
      },
      'sinai-1': {
        title: '6-1. Daily Manna — Just Enough for Today',
        objective: 'Collect the exact daily quota (7 white manna) without hoarding past 7 or touching spoiled red manna.',
        intro: 'Heaven rains bread each morning, teaching the people to trust God one day at a time.',
        outro: 'Six days they gathered an omer per person, and rested peacefully on the Sabbath.',
        hint: 'Stop at exactly 7 white manna! Avoid rotten red flakes.'
      },
      'sinai-2': {
        title: '6-2. Living Water from the Rock at Horeb',
        objective: 'Rotate the water-channel tiles to connect Horeb’s Rock (top-left) to Israel’s Camp (bottom-right).',
        intro: 'Thirsty at Rephidim, Moses strikes the rock at Horeb at the LORD’s command.',
        outro: 'Crystal springs gush from solid stone, refreshing the entire camp!',
        hint: 'Click channel tiles to rotate them until a continuous path flows, then press Confirm Flow.'
      },
      'sinai-3': {
        title: '6-3. Ten Commandments & Rejecting Idols',
        objective: 'Match 5 pairs of Commandments and reject the Golden Calf temptation when it interrupts!',
        intro: 'Amid thunder and cloud upon Mount Sinai, God inscribes His living covenant upon stone.',
        outro: 'Idolatry is cast down and the Ten Words shine upon the tablets.',
        hint: 'Click a commandment on the left, then its matching meaning on the right.'
      },
      'sinai-4': {
        title: '6-4. Completing the Tabernacle',
        objective: 'Place all 5 sacred furnishings into their rightful places in the Tabernacle.',
        intro: 'From willing hearts the people craft the Ark, Lampstand, Bread Table, Incense Altar, and Laver.',
        outro: 'The cloud covers the tent of meeting and the glory of the LORD fills the Tabernacle!',
        hint: 'Click a sacred furnishing, then click its designated sanctuary slot.'
      }
    },
    guides: {
      cherubim: {
        name: 'Cherubim',
        role: 'Guardian of Eden & Tree of Life',
        desc: 'Recorded in Genesis 3:24 with the flaming sword. Walks with you from Level 1 to sharpen discernment against temptation.',
        quote: '“Guarding the way to the Tree of Life is not born of fear, but of holy love.”'
      },
      angel_lord: {
        name: 'Angel of the LORD',
        role: 'Voice in the Burning Bush',
        desc: 'Appeared in Exodus 3:2 within the unconsumed flame to awaken courage and divine calling.',
        quote: '“The place on which you stand is holy ground; do not fear to answer the call.”'
      },
      pillar_fire: {
        name: 'Pillar of Cloud & Fire',
        role: 'Guide of Day & Night',
        desc: 'From Exodus 13:21, illuminating the desert night and guiding Israel through uncharted waters.',
        quote: '“Neither by day in cloud nor by night in fire shall guidance depart from before you.”'
      },
      gabriel: {
        name: 'Angel Gabriel',
        role: 'Messenger of Understanding',
        desc: 'Sent in Daniel 8:16 to give wisdom and unveil the meaning of visions and promises.',
        quote: '“Fear not the unseen road ahead; every promise of God keeps its appointed hour.”'
      },
      michael: {
        name: 'Archangel Michael',
        role: 'Great Prince & Protector',
        desc: 'Named in Daniel 10:13 as the steadfast defender who stands beside covenant travelers.',
        quote: '“For all who endure in faith to the end, heaven’s shield marches beside every step.”'
      }
    },
    items: {
      word_of_light: {
        name: 'Word of Creation Light',
        desc: 'The spoken light of Genesis 1:3. Expands protective light waves and strengthens Eden defenses.',
        effectLabel: 'Boosts Light Wave / +150 Bonus'
      },
      tree_of_life_leaf: {
        name: 'Leaf of the Tree of Life',
        desc: 'Grace from Eden’s living tree. Restores 1 Heart or Integrity inside active stages.',
        effectLabel: 'Restores +1 Integrity/Life'
      },
      garment_of_skin: {
        name: 'Garment of Skin',
        desc: 'God’s merciful covering from Genesis 3:21. Grants a protective shield blocking 1 hit.',
        effectLabel: '1-Hit Mercy Shield'
      },
      olive_branch: {
        name: 'Fresh Olive Leaf',
        desc: 'The dove’s token of peace after the flood. Calms storm winds and slows hazards briefly.',
        effectLabel: 'Calms Hazards & Storm'
      },
      star_compass: {
        name: 'Covenant Star Compass',
        desc: 'Reminder of Abraham’s starry promise. Grants tactical clarity and +200 score bonus.',
        effectLabel: 'Tactical Insight / +200 Score'
      },
      staff_of_moses: {
        name: 'Staff of Moses',
        desc: 'The rod of Exodus 4:2. Surges miracle power in plagues, sea crossings, and rock springs.',
        effectLabel: 'Charges Miracle Power'
      },
      blood_of_lamb: {
        name: 'Passover Seal',
        desc: 'Token of Goshen’s protection in Exodus 12:13. Shields your camp and strengthens Faith.',
        effectLabel: 'Full Ward + Faith Boost'
      },
      stone_tablets: {
        name: 'Two Tablets of Testimony',
        desc: 'Inscribed by the finger of God at Sinai. Multiplies final covenant score by +500.',
        effectLabel: '+500 Covenant Bonus'
      }
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
    games: {
      eden: {
        treeOfLife: 'Tree of Life',
        forbiddenTree: 'Tree of Knowledge',
        serpent: 'Serpent',
        adamEve: 'Adam & Eve',
        orbsLeft: 'Lights Left',
        timeLeft: 'Time Left',
        graceHearts: 'Eden Guard',
        bloom: 'Bloom',
        waveHint: 'Space: Word-of-Light Pulse',
        approachWarning: 'Near Tree of Knowledge — pause here to choose your path',
        preservedWinTitle: 'Paradise Preserved! (Heavenly Crown Route)',
        preservedWinDesc: 'Adam & Eve held fast to the Word and overcame temptation. Eden stands unbroken as an eternal garden of heaven! (+5,000 Highest Score Bonus)',
        fallenTransitionTitle: 'Beyond Eden — The Path of Redemption',
        fallenTransitionDesc: 'By choosing the fruit, toil and sorrow entered the world — yet God clothed them in mercy and opened the story of salvation across Genesis and Exodus!'
      },
      ark: {
        wood: 'Gopher Wood',
        pitch: 'Pitch',
        pairsLeft: 'Pairs Left',
        hullIntegrity: 'Hull Integrity',
        tilt: 'Balance',
        leaksPatched: 'Leaks Patched',
        leaves: 'Olive Leaves',
        returnToArk: 'Return to the Ark!',
        animals: ['Lion', 'Sheep', 'Deer', 'Dove', 'Elephant', 'Ox'],
        patchPrompt: 'Click red leaks to seal! Keep balance with A / D'
      },
      abraham: {
        gaugeFaith: 'Faith',
        gaugeProvisions: 'Provisions',
        gaugePeace: 'Peace',
        nextStar: 'Next Star',
        starDone: 'Covenant Constellation Complete!',
        scenarios: {
          'abraham-1': [
            {
              prompt: 'The LORD commands Abram to leave Ur of the Chaldeans for a land He will show him. How do you respond?',
              options: [
                { text: 'Trust the Word immediately and set forth in faith (Faith +20, Provisions -10)', faith: 20, provisions: -10, peace: 10, score: 250 },
                { text: 'Delay to stockpile extra caravan trade goods first (Provisions +15, Faith +5)', faith: 5, provisions: 15, peace: 5, score: 160 }
              ]
            },
            {
              prompt: 'Arriving in Canaan past Haran, a severe famine strikes the land.',
              options: [
                { text: 'Build an altar in trust and share rations generously (Faith +20, Peace +15)', faith: 20, provisions: -15, peace: 15, score: 260 },
                { text: 'Journey briefly south toward Egypt for grain (Provisions +20, Faith -5)', faith: -5, provisions: 20, peace: 0, score: 170 }
              ]
            },
            {
              prompt: 'Returning to the altar at Bethel, you renew your commitment before God.',
              options: [
                { text: 'Call upon the name of the LORD in worship (Faith +25)', faith: 25, provisions: 5, peace: 15, score: 300 },
                { text: 'Focus first on expanding flocks and camp walls (Provisions +15, Peace +5)', faith: 5, provisions: 15, peace: 5, score: 180 }
              ]
            }
          ],
          'abraham-2': [
            {
              prompt: 'Abram’s herdsmen and Lot’s herdsmen quarrel over wells and pasture.',
              options: [
                { text: '“We are kinsmen; let there be no strife. You choose first.” (Peace +25, Faith +15)', faith: 15, provisions: -10, peace: 25, score: 320 },
                { text: 'Claim the fertile Jordan valley first by seniority (Provisions +20, Peace -20)', faith: -10, provisions: 20, peace: -20, score: 120 }
              ]
            },
            {
              prompt: 'After Lot settles near Sodom, news arrives that invading kings took him captive.',
              options: [
                { text: 'Lead 318 trained men by night to rescue Lot (Faith +20, Peace +15)', faith: 20, provisions: -10, peace: 15, score: 320 },
                { text: 'Stay behind to guard your own tents in Canaan (Provisions +10, Peace -10)', faith: 0, provisions: 10, peace: -10, score: 140 }
              ]
            },
            {
              prompt: 'After victory, the king of Sodom offers you all the plunder.',
              options: [
                { text: 'Refuse even a thread or sandal strap; credit God alone (Faith +25, Peace +15)', faith: 25, provisions: 0, peace: 15, score: 350 },
                { text: 'Take a portion of the spoils to pay your camp expenses (Provisions +20, Faith -10)', faith: -10, provisions: 20, peace: 0, score: 150 }
              ]
            }
          ],
          'abraham-4': [
            {
              prompt: 'Climbing Mount Moriah, Isaac asks: “Father, where is the lamb for a burnt offering?”',
              options: [
                { text: '“God will provide for Himself the lamb for a burnt offering, my son.”', faith: 30, provisions: 0, peace: 20, score: 420 },
                { text: 'Walk onward in quiet prayer toward the summit', faith: 20, provisions: 0, peace: 10, score: 300 }
              ]
            },
            {
              prompt: 'The Angel of the LORD calls from heaven, sparing Isaac and revealing a ram in the thicket.',
              options: [
                { text: 'Offer the ram and name the mountain “Jehovah-Jireh” (The LORD Will Provide)', faith: 35, provisions: 15, peace: 25, score: 500 },
                { text: 'Embrace Isaac in silent thanksgiving for God’s deliverance', faith: 25, provisions: 10, peace: 20, score: 420 }
              ]
            }
          ]
        }
      },
      plagues: {
        bushTitle: 'Three Signs at the Burning Bush',
        bushPrompt: 'Activate the three signs given to Moses in exact scriptural order.',
        signs: [
          { id: 'staff', label: '1. Staff Cast Down (Serpent -> Staff)' },
          { id: 'hand', label: '2. Hand Inside Cloak' },
          { id: 'nile', label: '3. Water from the Nile' }
        ],
        pharaohStubborn: 'Pharaoh’s Hardened Heart',
        goshenFaith: 'Peace of Goshen',
        turn: 'Turn',
        cards: [
          { id: 'blood', name: 'Nile Turned to Blood', dmg: 22, shield: 0, desc: 'Pharaoh Resolve -22' },
          { id: 'frogs', name: 'Frogs, Gnats & Flies', dmg: 26, shield: 0, desc: 'Pharaoh Resolve -26' },
          { id: 'hail', name: 'Thunder & Fiery Hail', dmg: 32, shield: 0, desc: 'Heavy Strike -32' },
          { id: 'darkness', name: '3 Days Darkness / Goshen Light', dmg: 20, shield: 20, desc: 'Resolve -20 & Goshen +20' },
          { id: 'goshen', name: 'Shield of Goshen', dmg: 0, shield: 28, desc: 'Restore Goshen +28' }
        ],
        passoverHouses: 'Houses Sealed',
        passoverTimer: 'Until Midnight'
      },
      redsea: {
        pillarDistance: 'Pillar Sanctuary',
        staffHits: 'East Wind Strikes',
        distanceLeft: 'Shore Distance',
        israelSaved: 'People Guided',
        notesCaught: 'Praise Notes',
        pressAction: 'Press Space / Click in Gold Zone!',
        laneHint: 'Move Up/Down or Left/Right between the 3 lanes!'
      },
      sinai: {
        mannaTarget: 'Daily Manna Quota',
        mannaCount: 'Manna Gathered',
        pipeBtn: 'Check Living Water Flow',
        pipeHint: 'Click pipe tiles to rotate and connect Horeb Rock (top-left) to Camp (bottom-right).',
        cmdTitle: 'Match Ten Commandments & Reject Idols',
        calfWarning: '⚠️ The people urge a Golden Calf! Click [Shatter Idol] to hold fast to the Covenant!',
        calfDestroy: 'Reject & Stand Firm!',
        cmdPairs: [
          { num: '1st Command', meaning: 'You shall have no other gods before Me' },
          { num: '2nd Command', meaning: 'You shall not make for yourself a carved image' },
          { num: '4th Command', meaning: 'Remember the Sabbath day, to keep it holy' },
          { num: '5th Command', meaning: 'Honor your father and your mother' },
          { num: '6th & 8th', meaning: 'You shall not murder nor steal; love your neighbor' }
        ],
        tabernacleSlots: ['Most Holy Place (West)', 'Holy Place North', 'Holy Place South', 'Holy Place Center', 'Outer Courtyard'],
        tabernaclePieces: [
          { id: 'ark', name: 'Ark of the Covenant', correctSlot: 0 },
          { id: 'bread', name: 'Table of Showbread', correctSlot: 1 },
          { id: 'lamp', name: 'Golden Lampstand', correctSlot: 2 },
          { id: 'incense', name: 'Altar of Incense', correctSlot: 3 },
          { id: 'laver', name: 'Bronze Laver & Altar', correctSlot: 4 }
        ],
        tabernacleHint: 'Select a furnishing first, then click its rightful Tabernacle zone!',
        endings: {
          crown: {
            title: 'Crown of Eden — Faithful Keeper of Paradise',
            desc: 'You guarded Eden without falling, earned the +5,000 Crown Bonus, and fulfilled every chapter of Genesis and Exodus in glory!'
          },
          covenant: {
            title: 'Bearer of the Covenant — Glory Upon Sinai',
            desc: 'Walking beyond Eden through flood, promise, plagues, and parted seas, you built the Tabernacle and upheld God’s covenant.'
          },
          pilgrim: {
            title: 'Pilgrim of Faith — Dawn of the Promise',
            desc: 'You completed the finale at Sinai! Revisit earlier chapters or try defending Eden completely to unlock the highest Crown ending.'
          }
        }
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.I18N.en;
  }
})(typeof window !== 'undefined' ? window : globalThis);
