(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.I18N = root.COG.I18N || {};

  root.COG.I18N.en = {
    langCode: 'en',
    langName: 'English',
    langNative: 'English',
    appTitle: 'Choice of God',
    appSubtitle: 'Genesis & Exodus Open-Field Action RPG Adventure',
    metaTitle: 'Choice of God v2.0 — Biblical Action RPG',
    ui: {
      hp: 'HP',
      mp: 'Spirit MP',
      xp: 'XP',
      level: 'Lv',
      score: 'Score',
      atk: 'ATK',
      def: 'DEF',
      speed: 'Speed',
      faith: 'Faith',
      wisdom: 'Wisdom',
      mercy: 'Mercy',
      route: 'Eden Branch',
      routeUndecided: 'Undecided (Exploring)',
      routePreserved: 'Eden Preserved (Crown)',
      routeFallen: 'Beyond Eden (Redemption)',
      worldMap: 'World Map / Fast Travel (M)',
      characterSheet: 'Hero · Skills · Relics (C)',
      codex: 'Scripture Codex',
      settings: 'Settings & Language',
      help: 'Controls & Guide',
      touchControls: 'Touch Pad',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      language: 'Language',
      close: 'Close',
      confirm: 'Confirm',
      resetProgress: 'Reset Save Data',
      resetConfirm: 'Reset all hero levels, relics, quests, and scores?',
      questTracker: 'Active Zone Quests',
      questsDone: 'Done',
      bossAlert: 'Boss Encounter!',
      interactPrompt: '[E] Talk / Interact',
      slashBtn: 'Slash (Space)',
      dashBtn: 'Dash (Shift)',
      interactBtn: 'Interact (E)',
      skillPoints: 'Skill Points',
      upgradeSkill: 'Upgrade (+1)',
      maxed: 'MAX',
      equipped: 'Equipped',
      equip: 'Equip',
      unlocked: 'Owned',
      locked: 'Locked',
      requiresLevel: 'Joins at Lv.{lv}',
      activeGuide: 'Companion Guide',
      selectGuide: 'Choose Guide',
      selected: 'Active',
      travelToZone: 'Travel to This Zone',
      currentZone: 'Current Zone',
      highestScoreBadge: 'Highest Score Route (+5,000)',
      freeTravelHint: 'Travel freely at any time across all 6 Genesis & Exodus open-world regions and 4 hero viewpoints. Defeating the Ancient Serpent in Eden without eating the fruit unlocks the +5,000 Crown Bonus!',
      slotWeapon: 'Weapon',
      slotCloak: 'Cloak',
      slotRelic: 'Sacred Relic',
      slotEmpty: 'Empty',
      levelUpToast: 'Level Up! Lv.{lv} (+1 Skill Point)',
      questDoneToast: 'Quest Completed: {title}',
      bossDefeatedToast: 'Boss Purified! +{score} pts',
      respawnToast: 'Restored at Sanctuary!',
      endingBtn: 'View Journey Finale',
      endingTitle: 'Chronicle Finale — Choice of God',
      endingClose: 'Return to Field',
      endDialogue: 'End Conversation',
      controlsHint: 'Move: WASD/Arrows · Attack: Space/Click · Dash: Shift · Skills: 1/2/3 · Interact: E · Map: M · Hero: C',
      allChapters: 'All',
      genesisBook: 'Genesis',
      exodusBook: 'Exodus',
      danielBook: 'Daniel',
      helpBody1: '1. Explore 6 seamless open fields (1920x1280). Walk up to golden NPCs or glowing crystals/beacons and press [E] or Interact to speak or collect.',
      helpBody2: '2. Press [Space] or click the canvas to unleash directional blade/staff slashes, [Shift] to dodge-dash with invulnerability, and [1/2/3] for active skills.',
      helpBody3: '3. Follow the top-right Quest Tracker to purify enemies and defeat multi-phase Bosses, earning XP, Skill Points, and equipable Sacred Relics in [C].',
      helpBody4: '4. Open the World Map [M] anytime to freely switch viewpoints between Adam & Eve, Noah, Abraham, and Moses!'
    },
    viewpoints: {
      adam_eve: 'Adam & Eve (Creation & Eden)',
      noah: 'Noah (The Ark & Deluge)',
      abraham: 'Abraham (Journey of Faith)',
      moses: 'Moses (Exodus & Sinai)'
    },
    books: {
      genesis: 'Genesis',
      exodus: 'Exodus',
      daniel: 'Daniel'
    },
    zones: {
      eden: {
        title: 'Zone 1. Garden of Eden',
        period: 'Genesis 1–3',
        desc: 'Lush paradise watered by four rivers around the Tree of Life. Gather Creation Light and banish the Serpent, or face the choice at the western Tree of Knowledge.'
      },
      ark: {
        title: 'Zone 2. Valley of the Ark',
        period: 'Genesis 6–9',
        desc: 'Rain-swept shipyard where the great Ark rises. Gather gopher timber and pitch, guide animal pairs aboard, and defeat Leviathan of the storm.'
      },
      abraham: {
        title: 'Zone 3. Canaan & Mount Moriah',
        period: 'Genesis 12–22',
        desc: 'Starlit hills of promise. Resolve Lot’s parting with grace, kindle five Covenant Star Beacons, and break Chedorlaomer’s raiders.'
      },
      plagues: {
        title: 'Zone 4. Goshen & Pharaoh’s Court',
        period: 'Exodus 3–12',
        desc: 'Answer the Burning Bush, seal five Goshen doorframes for Passover, and defeat Pharaoh’s High Magicians.'
      },
      redsea: {
        title: 'Zone 5. The Parted Red Sea',
        period: 'Exodus 13–15',
        desc: 'A dry seabed corridor flanked by towering walls of turquoise water. Light the Pillar beacons, rally Israel, and stop the Royal Chariot Captain.'
      },
      sinai: {
        title: 'Zone 6. Mount Sinai & Tabernacle',
        period: 'Exodus 16–40',
        desc: 'Collect morning Manna, reject the Golden Calf at camp, repel Amalekite raiders, and consecrate the Tabernacle in glory.'
      }
    },
    quests: {
      'eden-q1': { title: 'Restore Creation Light', desc: 'Collect 5 glowing Creation Light crystals beside the four rivers [E].' },
      'eden-q2': { title: 'Council with Cherubim', desc: 'Speak with the winged Cherubim guarding the eastern sanctuary [E].' },
      'eden-q3': { title: 'Purify Shadow Serpents', desc: 'Defeat 5 Shadow Serpents & Wisps creeping into Eden.' },
      'eden-q4': { title: 'Boss: Ancient Serpent or Crossroads', desc: 'Purify the Ancient Serpent to preserve Paradise (+5,000), or interact with the western Tree.' },
      'ark-q1': { title: 'Gopher Wood & Pitch', desc: 'Gather 6 bundles of timber and pitch around the valley [E].' },
      'ark-q2': { title: 'Escort Animal Pairs', desc: 'Guide 4 animal pairs safely toward the Ark [E].' },
      'ark-q3': { title: 'Repel Storm Wraiths', desc: 'Defeat 5 Storm Wraiths battering the shipyard.' },
      'ark-q4': { title: 'Boss: Leviathan of the Deep', desc: 'Vanquish Leviathan to seal the Rainbow Covenant.' },
      'abraham-q1': { title: 'Peace with Lot', desc: 'Speak with Lot at the southern camp to resolve pasture strife [E].' },
      'abraham-q2': { title: 'Covenant Star Beacons', desc: 'Kindle all 5 Star Beacons across Canaan [E].' },
      'abraham-q3': { title: 'Rescue the Valley', desc: 'Defeat 5 invading raiders across the eastern hills.' },
      'abraham-q4': { title: 'Boss: Warlord Chedorlaomer', desc: 'Defeat Chedorlaomer near Mount Moriah.' },
      'plagues-q1': { title: 'The Burning Bush', desc: 'Receive your calling before the Angel of the LORD [E].' },
      'plagues-q2': { title: 'Passover Doorpost Seals', desc: 'Apply the Passover mark to 5 Goshen dwellings [E].' },
      'plagues-q3': { title: 'Breach the Outer Court', desc: 'Defeat 5 Egyptian Magicians and Palace Guards.' },
      'plagues-q4': { title: 'Boss: High Magician of Egypt', desc: 'Defeat the High Magician inside the royal courtyard.' },
      'redsea-q1': { title: 'Pillar of Fire Beacons', desc: 'Light 4 Pillar waypoints across the parted seabed [E].' },
      'redsea-q2': { title: 'Rally the Travelers', desc: 'Guide 4 Israelite groups forward through the waters [E].' },
      'redsea-q3': { title: 'Hold Back Pursuit', desc: 'Destroy 5 pursuing Egyptian Chariots and Guards.' },
      'redsea-q4': { title: 'Boss: Royal Chariot Captain', desc: 'Defeat Pharaoh’s Chariot Captain near the eastern shore.' },
      'sinai-q1': { title: 'Daily Morning Manna', desc: 'Gather 6 portions of Manna near Horeb Rock and the flats [E].' },
      'sinai-q2': { title: 'Trial of the Golden Calf', desc: 'Confront Aaron and reject idolatry at the southern camp [E].' },
      'sinai-q3': { title: 'Defend Against Amalek', desc: 'Defeat 6 Amalekite Raiders surrounding the camp.' },
      'sinai-q4': { title: 'Boss: Amalek Warlord', desc: 'Defeat the Amalek Warlord to crown the Tabernacle in glory!' }
    },
    bosses: {
      boss_serpent: { name: 'Ancient Serpent', subtitle: 'Tempter of Eden' },
      boss_leviathan: { name: 'Leviathan of the Deep', subtitle: 'Tempest Sovereign' },
      boss_chedorlaomer: { name: 'King Chedorlaomer', subtitle: 'Eastern Alliance Warlord' },
      boss_magician: { name: 'Pharaoh’s High Magician', subtitle: 'Master of Egyptian Sorcery' },
      boss_chariot: { name: 'Royal Chariot Captain', subtitle: 'Vanguard of Pursuit' },
      boss_amalek: { name: 'Amalek Warlord', subtitle: 'Final Trial of the Wilderness' }
    },
    speakers: {
      cherubim: 'Cherubim Guardian',
      serpent: 'Serpent & Tree of Knowledge',
      shem: 'Shem, Son of Noah',
      lot: 'Lot, Kinsman of Abraham',
      angel_lord: 'Angel in the Burning Bush',
      miriam: 'Prophetess Miriam',
      aaron: 'Aaron & The Golden Calf'
    },
    skills: {
      nova: { name: 'Word of Light Nova', desc: 'Erupts a radiant ring of golden light damaging and knocking back nearby foes.' },
      beam: { name: 'Miracle Staff Beam', desc: 'Fires a piercing celestial lance of energy in your facing direction.' },
      grace: { name: 'Tree of Life Grace', desc: 'Restores HP immediately and wraps you in a golden shield.' }
    },
    guides: {
      cherubim: {
        name: 'Cherubim',
        role: 'Guardian of Eden (+5 ATK, +2 DEF)',
        desc: 'Bearer of the flaming sword in Genesis 3:24. Bolsters strike power from Level 1.',
        quote: '“Raise the light of the Word and guard the way of life.”'
      },
      angel_lord: {
        name: 'Angel of the LORD',
        role: 'Voice in the Bush (+9 ATK, +MP Regen)',
        desc: 'Revealed in Exodus 3:2 within unconsumed fire. Speeds Spirit MP regeneration.',
        quote: '“The ground where you stand is holy; go forth without fear.”'
      },
      pillar_fire: {
        name: 'Pillar of Cloud & Fire',
        role: 'Desert Pathfinder (+18 Speed, +12 ATK)',
        desc: 'From Exodus 13:21, accelerating movement speed and battle prowess.',
        quote: '“By day and by night My guidance shall never leave you.”'
      },
      gabriel: {
        name: 'Angel Gabriel',
        role: 'Messenger of Wisdom (+2.8 MP/s, +12% Score)',
        desc: 'Sent in Daniel 8:16 to sharpen skill casting and reward mastery.',
        quote: '“Every divine promise reaches fulfillment at its appointed hour.”'
      },
      michael: {
        name: 'Archangel Michael',
        role: 'Champion of the Covenant (+22 ATK, +14 DEF, +20% Score)',
        desc: 'The great prince of Daniel 10:13 granting supreme battlefield protection.',
        quote: '“Stand firm to the end; heaven’s shield marches beside you.”'
      }
    },
    items: {
      word_of_light: { name: 'Blade of Creation Light', desc: 'Forged from Genesis 1:3 “Let there be light.” (+8 ATK, +15 MP)' },
      staff_of_moses: { name: 'Staff of Moses', desc: 'The miracle rod of Exodus 4:2. (+12 ATK, +20 MP, +10 HP)' },
      stone_tablets: { name: 'Tablets of Testimony', desc: 'Supreme Sinai covenant relic. (+22 ATK, +8 DEF, +30 HP)' },
      garment_of_skin: { name: 'Garment of Skin', desc: 'God’s merciful covering from Genesis 3:21. (+9 DEF, +40 HP)' },
      blood_of_lamb: { name: 'Passover Mantle', desc: 'Goshen’s protective cloak from Exodus 12:13. (+15 DEF, +55 HP)' },
      tree_of_life_leaf: { name: 'Leaf of the Tree of Life', desc: 'Crown relic for preserving Eden. (+60 HP, +25 MP, +8 ATK)' },
      olive_branch: { name: 'Dove’s Olive Branch', desc: 'Swift token of peace after the flood. (+28 Speed, +35 HP)' },
      star_compass: { name: 'Star Covenant Compass', desc: 'Celestial promise of Abraham. (+12 ATK, +35 MP, +6 DEF)' }
    },
    dialogues: {
      eden_cherubim: {
        n1: 'Adam and Eve, the four rivers sing in harmony, yet a dark whisper creeps beneath the western boughs. How will you respond?',
        c1: 'We will hold fast to the Word and guard Eden to the very end. (+3 Faith, Heal)',
        c2: 'We will stay watchful and discern the shadow from the west. (+4 Wisdom, +150 Score)',
        n2: 'Noble resolve! May celestial light empower your blade and steps.',
        n3: 'Stay vigilant — deception speaks softly, while life abides in truth.'
      },
      eden_crossroads: {
        n1: 'The Serpent whispers from the Tree of Knowledge: “Did God really say you must not eat? Your eyes will be opened!” Choose your destiny:',
        c_resist: '“Be gone!” Reject temptation, uphold the Word, and purify the Ancient Serpent (Highest Score Route)',
        c_eat: 'Taste the fruit — step beyond Eden into human history and redemption (Unlocks Garment of Skin)',
        n_resist: 'Brilliant light shatters the shadow! Defeat the Serpent to preserve Eden forever (+5,000 Bonus)!',
        n_eat: 'Sorrow enters, yet God clothes you in mercy and opens the grand story of Noah, Abraham, and Exodus!'
      },
      ark_shem: {
        n1: 'Father Noah, dark clouds gather above! Are the gopher timbers, pitch, and animal pairs ready before the floodgates burst?',
        c1: 'Every task follows God’s design — we will save every living pair. (+4 Faith, Heal)',
        c2: 'Let us brace the shipyard against the coming storm wraiths. (+4 Wisdom, +120 Score)',
        n2: 'Surely the LORD will carry the Ark safely over the waters!'
      },
      abraham_lot: {
        n1: 'Uncle Abraham, our herdsmen quarrel daily over pastures and wells. How shall we divide this land?',
        c_peace: '“We are kinsmen; let there be no strife. Choose the fertile plains first.” (+6 Faith, +8 Mercy)',
        c_firm: '“Let us establish clear boundaries so order remains.” (+5 Wisdom)',
        n_peace: 'Your generosity humbles me. May God grant you descendants countless as the stars!',
        n_firm: 'A measured choice. Go kindle the star beacons of promise across Canaan.'
      },
      plagues_bush: {
        n1: 'Moses, Moses! Take off your sandals, for this place is holy ground. I have seen My people’s affliction and send you to Pharaoh.',
        c_obey: '“Here am I, LORD! With Your staff I will deliver Israel!” (+7 Faith, Heal)',
        c_humble: '“Though slow of speech, I trust Your presence to guide me.” (+6 Mercy, Heal)',
        n_obey: 'I will surely be with you! Seal Goshen’s doorposts and confront Egypt’s court.',
        n_humble: 'My power will speak through the staff in your hand. March forward in courage!'
      },
      redsea_miriam: {
        n1: 'Brother Moses! Chariots thunder behind us while walls of water tower on left and right. The people tremble!',
        c1: '“Fear not, stand firm, and see the salvation of the LORD!” (+5 Faith, Heal)',
        c2: '“Follow the Pillar of Fire in order; not one soul shall be left behind!” (+5 Wisdom, +4 Mercy)',
        n2: 'Courage returns to Israel! Strike down the Chariot Captain and reach the shore!'
      },
      sinai_calf: {
        n1: 'While you were on the mountain, the people grew restless and forged a Golden Calf! What will you do?',
        c_shatter: '“You shall have no other gods before the LORD!” Shatter the idol and uphold the Law (+10 Faith, +8 Wisdom)',
        c_pray: 'Halt the idolatry and intercede with mercy for the people (+9 Mercy, +6 Faith)',
        n_shatter: 'The camp turns back in repentance! Now repel Amalek from the north and consecrate the Tabernacle!',
        n_pray: 'Heaven hears your prayer. Raise the Tabernacle and behold the glory of God!'
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
    endings: {
      crown: {
        title: 'Crown of Eden — Eternal Guardian of Paradise',
        desc: 'You purified the Ancient Serpent without eating the forbidden fruit (+5,000 Bonus) and triumphed across Genesis and Exodus all the way to the glory of the Tabernacle!'
      },
      covenant: {
        title: 'Champion of the Covenant — Glory Upon Sinai',
        desc: 'Braving the flood, Canaan, plagues, and the parted Red Sea, you led the people in faith and raised the sacred Tabernacle.'
      },
      pilgrim: {
        title: 'Wanderer of Faith — Dawn of the Chronicle',
        desc: 'Your journey is inscribed in legend! Explore remaining zones or defend Eden intact (+5,000 Bonus) to claim the Crown Ending.'
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.I18N.en;
  }
})(typeof window !== 'undefined' ? window : globalThis);
