(function (root) {
  'use strict';
  root.COG = root.COG || {};
  root.COG.I18N = root.COG.I18N || {};

  root.COG.I18N.zh = {
    langCode: 'zh',
    langName: 'Chinese',
    langNative: '中文',
    appTitle: 'Choice of God · 神的选择',
    appSubtitle: '创世记与出埃及记多类型叙事冒险游戏',
    appTagline: '在神的话语面前人类将如何抉择——从守护伊甸园到西奈山立约',
    metaTitle: 'Choice of God (神的选择) — 创世记与出埃及记叙事游戏',
    ui: {
      close: '关闭',
      confirm: '确认',
      cancel: '取消',
      retry: '重新挑战',
      nextLevel: '下一关',
      backToMap: '返回年表地图',
      playStage: '开始关卡',
      startGame: '开启旅程',
      continueJourney: '继续旅程',
      selectChapter: '自由选择视角与关卡',
      freeSelectHint: '你可以随时按任意顺序自由选择创世记与出埃及记的各个视角与关卡。最高分路线位于第一章守护伊甸园！',
      highestScoreBadge: '最高分路线 (+5,000)',
      score: '分数',
      level: '等级',
      faith: '信心',
      wisdom: '智慧',
      mercy: '怜悯',
      route: '伊甸分支',
      routeUndecided: '未决定（探索中）',
      routePreserved: '守护伊甸（天堂圆满）',
      routeFallen: '伊甸之外（救赎之路）',
      soundOn: '音效开启',
      soundOff: '音效静音',
      language: '切换语言',
      settings: '设置与语言',
      codex: '圣经经文图鉴',
      inventory: '圣物与天使向导',
      help: '游戏指南',
      resetProgress: '重置进度',
      resetConfirm: '确定要重置所有分数和关卡记录吗？',
      touchControls: '触控手柄',
      actionBtn: '话语 / 行动 (Space)',
      itemBar: '拥有圣物（点击激活）',
      unlocked: '已解锁',
      locked: '未解锁',
      requiresLevel: '等级 {lv} 解锁',
      activeGuide: '同行向导',
      selectGuide: '选择向导',
      selected: '已选择',
      viewpointLabel: '视角',
      genreLabel: '类型',
      controlsHint: '移动：WASD / 方向键 · 行动：空格 / 点击',
      allChapters: '全部',
      genesisBook: '创世记',
      exodusBook: '出埃及记',
      danielBook: '但以理书',
      endingTitle: '旅程终章 — 神的选择',
      endingClose: '返回年表地图',
      edenChoiceTitle: '分别善恶树前的十字路口',
      edenChoiceBody: '蛇的低语在伊甸林荫间回响。是摘食禁果踏上伊甸之外的历史救赎之路，还是坚守神的话语直到最后？',
      edenChoiceEat: '吃下果子（历史分支：展开救赎故事）',
      edenChoiceResist: '拒绝诱惑并守护伊甸（最高分路线）',
      levelClear: '关卡完成！',
      levelFailed: '挑战失败 — 请再次站起',
      starsEarned: '获得星级',
      bonusAwarded: '奖励分数',
      itemObtained: '获得新圣物',
      guideUnlocked: '新天使向导加入！',
      subLevelLabel: '阶段',
      completedBadge: '已完成',
      itemUsed: '{name} 已发动！',
      noEffectHere: '此圣物在当前关卡无手动效果。',
      skipToStage: '从此视角开始游玩',
      helpBody1: '1. 可在地图上自由选择创世记与出埃及记的任意6个章节与角色视角（亚当夏娃、挪亚、亚伯拉罕、摩西）。',
      helpBody2: '2. 每个章节包含4个递进阶段（导入 -> 展开 -> 试炼 -> 圆满），并采用不同的游戏玩法类型。',
      helpBody3: '3. 在第一章伊甸园击退诱惑并守住1-4关，可获得最高皇冠奖励(+5,000分)与天堂守卫结局；选择禁果则会延续到完整的人类救赎史。',
      helpBody4: '4. 随着玩家等级提升，圣经中的天使与向导将动态加入，关卡中还可点击下方圣物栏获得祝福。'
    },
    viewpoints: {
      adam_eve: '亚当与夏娃（创造与伊甸）',
      noah: '挪亚（方舟与彩虹之约）',
      abraham: '亚伯拉罕（信心之父）',
      moses: '摩西（出埃及与律法）'
    },
    genres: {
      topdown: '2D俯视守护动作',
      builder: '资源收集与风暴平衡生存',
      rpg: '抉择叙事策略RPG与星象解谜',
      tactics: '回合制策略卡牌与逾越节谜题',
      arcade: '红海跑酷动作与神迹时机',
      management: '旷野资源管理与圣幕终章'
    },
    books: {
      genesis: '创世记',
      exodus: '出埃及记',
      daniel: '但以理书'
    },
    chapters: {
      eden: {
        title: '第一章 伊甸园 — 最初的抉择',
        period: '创世记 1–3章',
        summary: '化身为创造曙光中的亚当与夏娃，照料四道江河与生命树，抵挡古蛇的试探，或做出改变历史的决定。',
        genreDesc: '2D俯视移动、光之话语护盾波、命运分支'
      },
      ark: {
        title: '第二章 挪亚方舟 — 洪水与彩虹之约',
        period: '创世记 6–9章',
        summary: '收集歌斐木与松香建造方舟，成双成对引导动物登舟，在四十昼夜风暴中保持平衡与修补漏洞，迎接鸽子叼回橄榄叶。',
        genreDesc: '材料收集、成对配对、风暴平衡与补漏动作'
      },
      abraham: {
        title: '第三章 亚伯拉罕 — 星辰与应许之旅',
        period: '创世记 12–22章',
        summary: '离开吾珥与哈兰，在信心、粮食与和平的权衡中做出抉择，与罗得谦让，连接夜空繁星，经历摩利亚山试炼。',
        genreDesc: '分支叙事策略RPG与夜空星座连线谜题'
      },
      plagues: {
        title: '第四章 摩西与十灾 — 荆棘火焰到逾越节',
        period: '出埃及记 3–12章',
        summary: '在燃烧的荆棘前蒙召，施展三项神迹，用战术卡牌直面法老硬心并守护歌珊地，在逾越节之夜涂抹门框。',
        genreDesc: '顺序谜题、回合卡牌策略与限时门框印记'
      },
      redsea: {
        title: '第五章 过红海 — 火柱与干地',
        period: '出埃及记 13–15章',
        summary: '在黑夜旷野紧随云柱火柱，高举摩西之杖分开大海，躲避波涛与埃及战车穿越干地海床。',
        genreDesc: '光柱追踪、神迹时机条与三赛道跑酷'
      },
      sinai: {
        title: '第六章 西奈山 — 吗哪、十诫与会幕',
        period: '出埃及记 16–40章',
        summary: '每日精准收取足够吗哪不贪多，旋转石渠引导何烈磐石活水，配对十诫并建立会幕，迎来最终结局。',
        genreDesc: '每日定量收集、水渠旋转谜题与会幕组装终章'
      }
    },
    levels: {
      'eden-1': {
        title: '1-1. 创造之光与初息',
        objective: '在伊甸四道河流周围收集 6 颗金色创造之光。',
        intro: '起初神创造天地，将亚当与夏娃安置在荣美的伊甸园中。',
        outro: '神圣的光芒充满伊甸，四道江河欢然奔流！',
        hint: '用 WASD 或方向键移动并收集全部金色光球。'
      },
      'eden-2': {
        title: '1-2. 照料生命树与四道江河',
        objective: '收集 8 滴生命之露，使中央生命树达到 100% 盛放。',
        intro: '守护园中的生命树以及比逊、基训、底格里斯、幼发拉底四河。',
        outro: '生命树焕发出灿烂荣光——然而西方树影中正爬出一条黑影。',
        hint: '收集青绿色露珠，同时避开古蛇黑影的触碰。'
      },
      'eden-3': {
        title: '1-3. 蛇的试探与话语光盾',
        objective: '按空格释放光之波抵挡诱惑暗球 25 秒（靠近西边分别善恶树可开启抉择）。',
        intro: '蛇诱惑说：“你们不一定死，你们的眼睛必明亮！”',
        outro: '坚守神的话语，你们挺过了第一波试探风暴！',
        hint: '按空格或行动按钮发射金色光波清除暗球。'
      },
      'eden-4': {
        title: '1-4. 守护伊甸 — 天堂冠冕或历史之门',
        objective: '不吃禁果并守护伊甸 35 秒，即可斩获最高奖励 (+5,000 分)！',
        intro: '伊甸的最终考验。是守住永恒天堂，还是迈向伊甸之外的历史？',
        outro: '你的选择回响天地，铭刻了整部旅程的命运。',
        hint: '善用空格光波与绿色恩典光球保持伊甸护盾！'
      },
      'ark-1': {
        title: '2-1. 歌斐木与松香筹备',
        objective: '收集 8 根歌斐木与 6 罐松香建造方舟。',
        intro: '神吩咐挪亚用歌斐木造一只方舟，里外抹上松香。',
        outro: '坚固的方舟船体已彻底涂抹密封。',
        hint: '避开障碍物，收齐所有木材与黑色松香罐。'
      },
      'ark-2': {
        title: '2-2. 成双成对进入方舟',
        objective: '依次点击相同的 6 对动物卡片，护送它们进入方舟。',
        intro: '大雨降临前，各样活物按着公母成对汇聚而来。',
        outro: '所有生灵安然登舟，耶和华亲手把门关上。',
        hint: '连续点击两张相同的动物即可配对登舟。'
      },
      'ark-3': {
        title: '2-3. 四十昼夜大洪水',
        objective: '用左右键保持方舟平衡，同时点击红色漏水点修补，坚持 30 秒。',
        intro: '大渊的泉源都裂开了，天上的窗户也敞开了，大雨降下四十昼夜。',
        outro: '风浪止息，方舟安稳停在亚拉腊山上。',
        hint: '用 A/D 保持倾斜指针居中，同时快速点击红色漏水处！'
      },
      'ark-4': {
        title: '2-4. 鸽子叼回橄榄叶与彩虹之约',
        objective: '操控鸽子躲避雷云，采回 5 片新鲜橄榄叶返回方舟。',
        intro: '挪亚放出鸽子去探查地上的水退了没有。',
        outro: '到了晚上鸽子嘴里叼着一个新拧下来的橄榄叶子回来，天际升起立约的彩虹。',
        hint: '用方向键收集 5 片绿叶后飞回方舟图标。'
      },
      'abraham-1': {
        title: '3-1. 离开吾珥与哈兰的呼召',
        objective: '在前往迦南的 3 次抉择中保持信心、粮食与和平均高于零。',
        intro: '耶和华对亚伯兰说：“你要离开本地、本族、父家，往我所要指示你的地去。”',
        outro: '亚伯兰顺服应许，在迦南筑起第一座坛。',
        hint: '谨慎权衡各项数值，别让任何一项降为零。'
      },
      'abraham-2': {
        title: '3-2. 与罗得和平分居',
        objective: '在牧人相争时以亚伯拉罕的宽容与信心做出和平选择。',
        intro: '牛羊甚多使那地容不下他们，亚伯兰的牧人与罗得的牧人相争。',
        outro: '“你向左，我就向右。”和平的胸怀展开了整片应许之地。',
        hint: '倾向和平与信心的抉择能赢得更高的长远奖赏。'
      },
      'abraham-3': {
        title: '3-3. 数算天上的繁星',
        objective: '在夜空中按数字 1 到 9 的顺序连接应许之星组成星座。',
        intro: '神领亚伯兰到外边说：“你向天观看，数算众星，能数得过来吗？”',
        outro: '亚伯兰信耶和华，耶和华就以此为他的义。',
        hint: '从数字 1 号星开始按顺序依次点击连线。'
      },
      'abraham-4': {
        title: '3-4. 摩利亚山的耶和华以勒',
        objective: '通过最后的信心试炼，见证神所预备的公羊救恩。',
        intro: '登上摩利亚山时以撒问：“燔祭的羊羔在哪里呢？”',
        outro: '神预备了两角扣在稠密小树中的公羊——“耶和华必预备”。',
        hint: '以坚定顺服神的信心回应试炼。'
      },
      'plagues-1': {
        title: '4-1. 燃烧荆棘与三项神迹',
        objective: '按圣经正确顺序演示三项神迹（杖、手、尼罗河水）。',
        intro: '神从荆棘里火焰中呼叫摩西，赐下凭据。',
        outro: '摩西手握神的杖，踏上拯救以色列民的埃及之路。',
        hint: '按顺序点击：1. 丢在地上的杖 -> 2. 放入怀里的手 -> 3. 尼罗河水。'
      },
      'plagues-2': {
        title: '4-2. 对峙法老（初期十灾策略）',
        objective: '出牌击破法老的刚硬(100→0)，同时守住歌珊平安。',
        intro: '法老心硬说：“耶和华是谁，使我听他的话容以色列人去呢？”',
        outro: '连埃及术士也不得不承认：“这是神的手段。”',
        hint: '灵活搭配灾祸牌与[歌珊护盾]保持百姓平安。'
      },
      'plagues-3': {
        title: '4-3. 冰雹、蝗虫与三日黑暗',
        objective: '抵挡法老猛烈反扑，不失歌珊之光取得胜利。',
        intro: '埃及遍地乌黑三天，惟有以色列人家中都有亮光。',
        outro: '黑暗中的亮光护佑了以色列，最后一夜即将来临。',
        hint: '在强力反击回合前优先使用护盾或恢复。'
      },
      'plagues-4': {
        title: '4-4. 逾越节之夜与门框印记',
        objective: '在午夜到来前点击标记全部 6 座以色列房屋门框。',
        intro: '“我一见这血，就越过你们去，灾殃必不临到你们身上灭你们。”',
        outro: '法老连夜召见摩西：“起来，从我民中出去！”出埃及的黎明到了！',
        hint: '迅速点击每座发光的门框印上逾越节印记。'
      },
      'redsea-1': {
        title: '5-1. 云柱与火柱的引路',
        objective: '在黑夜旷野中紧跟发光火柱的安全圈坚持 25 秒。',
        intro: '耶和华日间在云柱中领路，夜间在火柱中光照他们。',
        outro: '百姓平安抵达红海边的比哈希录安营。',
        hint: '紧随移动的金色光环，不要掉队！'
      },
      'redsea-2': {
        title: '5-2. 伸杖分开红海',
        objective: '当指针落在金色区域时精准按空格（或点击）3 次掀起大东风。',
        intro: '后有追兵战车，前有茫茫红海，摩西向海伸出神的杖。',
        outro: '大东风吹了一夜使海水分开，左右立起水墙！',
        hint: '在移动标尺经过正中金色区时果断按键。'
      },
      'redsea-3': {
        title: '5-3. 干地疾驰 — 冲破浪花与战车',
        objective: '在 3 条干地赛道间切换躲避巨浪与追兵，跑完 400 米抵达对岸。',
        intro: '以色列人下海中走干地，埃及战车随后紧追。',
        outro: '百姓全员登岸，海水回流淹没了埃及追兵！',
        hint: '用上下或左右键（或触控按键）在 3 条赛道间切换。'
      },
      'redsea-4': {
        title: '5-4. 米利暗与摩西的赞美诗',
        objective: '接住落下的 12 个金色赞美音符完成救恩颂歌。',
        intro: '先知米利暗拿起铃鼓，率领众人高唱胜利之歌。',
        outro: '“耶和华是我的力量，我的诗歌，也成了我的拯救！”',
        hint: '左右移动接住所有金色音符。'
      },
      'sinai-1': {
        title: '6-1. 每日吗哪 — 恰如其分的信赖',
        objective: '不多不少正好收集 7 颗白色吗哪，不要贪多也别碰腐坏红吗哪。',
        intro: '神从天降下粮食，教导百姓每日只取当日所需。',
        outro: '百姓按需收取，在安息日享受神信实的供应。',
        hint: '收满 7 颗即刻完成，千万避开红色变质颗粒！'
      },
      'sinai-2': {
        title: '6-2. 何烈磐石涌出活水',
        objective: '点击旋转水渠方块，从左上角何烈磐石连通至右下角营地。',
        intro: '百姓在利非订干渴，摩西奉命击打何烈山磐石。',
        outro: '甘甜活水从磐石涌流而出，滋润全营！',
        hint: '旋转管道接通两端后点击[确认水流]。'
      },
      'sinai-3': {
        title: '6-3. 西奈十诫与拒绝金牛犊',
        objective: '正确配对 5 组十诫经义，并在金牛犊试探出现时立刻粉碎它！',
        intro: '在雷轰闪电的西奈山上，神亲手赐下立约的十条诫命。',
        outro: '偶像被拒绝，神圣十诫铭刻于两块石版之上。',
        hint: '先点左侧诫命编号，再点右侧对应含义。'
      },
      'sinai-4': {
        title: '6-4. 会幕落成与耶和华的荣光',
        objective: '将 5 件圣物器皿（约柜、饼桌、灯台、香坛、洗濯盆）放入正确会幕位置。',
        intro: '百姓甘心乐意献上礼物，完全照神指示的样式建造会幕。',
        outro: '云彩遮盖会幕，耶和华的荣光充满了帐幕，壮丽史诗圆满完结！',
        hint: '先选择圣物，再点击对应的会幕区域。'
      }
    },
    guides: {
      cherubim: {
        name: '基路伯',
        role: '伊甸边界与生命树守护者',
        desc: '创世记3:24中手持火焰剑的守卫者。从第1级起伴随左右，帮助你识破试探。',
        quote: '“守护生命之路并非出于恐惧，而是神圣之爱的边界。”'
      },
      angel_lord: {
        name: '耶和华的使者',
        role: '燃烧荆棘中的呼召',
        desc: '在出埃及记3:2不烧毁的荆棘火焰中显现，唤醒信心与使命。',
        quote: '“你所站之地是圣地，不要惧怕回应神圣的呼召。”'
      },
      pillar_fire: {
        name: '云柱与火柱',
        role: '昼夜旷野引路者',
        desc: '源于出埃及记13:21，在暗夜与大海面前始终照明前路。',
        quote: '“日间云柱，夜间火柱，必总不离开你的面前。”'
      },
      gabriel: {
        name: '天使加百列',
        role: '传达神旨意的使者',
        desc: '出现于但以理书8:16，使人明白异象与应许的智慧天使。',
        quote: '“不要惧怕未知的前路，神的一切应许必按定时期成就。”'
      },
      michael: {
        name: '天使长米迦勒',
        role: '护卫立约百姓的大君',
        desc: '但以理书10:13记载的忠勇天使长，守护坚持信仰的同行者。',
        quote: '“凡持守信心到底的人，天庭的盾牌必步步相随。”'
      }
    },
    items: {
      word_of_light: {
        name: '创造之光话语',
        desc: '创世记1:3“要有光”的话语。扩大光波护盾并增加分数。',
        effectLabel: '光波强化 / +150 分'
      },
      tree_of_life_leaf: {
        name: '生命树之叶',
        desc: '伊甸生命树的恩典。在关卡中恢复 1 点生命或耐久度。',
        effectLabel: '恢复 +1 生命/耐久'
      },
      garment_of_skin: {
        name: '皮衣（恩典遮盖）',
        desc: '创世记3:21神亲手所做的怜悯遮盖。可抵挡 1 次伤害或失误。',
        effectLabel: '1次伤害护盾'
      },
      olive_branch: {
        name: '新鲜橄榄枝叶',
        desc: '洪水退后鸽子衔回的和平记号。暂缓风暴与危险物速度。',
        effectLabel: '平息风浪与减速'
      },
      star_compass: {
        name: '星辰立约罗盘',
        desc: '亚伯拉罕星空应许的印记。赐予智慧洞见并+200分。',
        effectLabel: '智慧加护 / +200 分'
      },
      staff_of_moses: {
        name: '摩西的杖',
        desc: '出埃及记4:2的神迹之杖。在十灾与红海中迅速充能神迹。',
        effectLabel: '充能神迹之力'
      },
      blood_of_lamb: {
        name: '逾越节门框印章',
        desc: '出埃及记12:13歌珊蒙护的记号。全面防卫并提升信心。',
        effectLabel: '完全防护 + 信心提升'
      },
      stone_tablets: {
        name: '西奈两块法版',
        desc: '神亲手书写的十诫石版。额外增加 +500 圣约奖励分。',
        effectLabel: '+500 圣约加成'
      }
    },
    bible: {
      gen_1_1: { ref: '创世记 1:1', text: '起初，神创造天地。' },
      gen_1_3: { ref: '创世记 1:3', text: '神说：“要有光”，就有了光。' },
      gen_2_8_9: { ref: '创世记 2:8-9', text: '耶和华神在东方的伊甸立了一个园子……园子当中又有生命树和分别善恶的树。' },
      gen_2_16_17: { ref: '创世记 2:16-17', text: '园中各样树上的果子，你可以随意吃，只是分别善恶树上的果子，你不可吃，因为你吃的日子必定死！' },
      gen_3_1_6: { ref: '创世记 3:4-6', text: '蛇对女人说：“你们不一定死”……女人就摘下果子来吃了，又给她丈夫，她丈夫也吃了。' },
      gen_3_21: { ref: '创世记 3:21', text: '耶和华神为亚当和他妻子用皮子作衣服给他们穿。' },
      gen_3_24: { ref: '创世记 3:24', text: '于是把他赶出去了；又在伊甸园的东边安设基路伯和四面转动发火焰的剑，要把守生命树的道路。' },
      gen_6_14: { ref: '创世记 6:14', text: '你要用歌斐木造一只方舟，分一间一间地造，里外抹上松香。' },
      gen_7_2_3: { ref: '创世记 7:2-3', text: '凡洁净的畜类，你要带七公七母；不洁净的畜类，你要带一公一母……可以留种，活在全地上。' },
      gen_7_12: { ref: '创世记 7:12', text: '四十昼夜降大雨在地上。' },
      gen_8_11: { ref: '创世记 8:11', text: '到了晚上，鸽子回到他那里，嘴里叼着一个新拧下来的橄榄叶子。' },
      gen_9_13: { ref: '创世记 9:13', text: '我把虹放在云彩中，这就可作我与地立约的记号了。' },
      gen_12_1_4: { ref: '创世记 12:1-2', text: '你要离开本地、本族、父家，往我所要指示你的地去。我必叫你成为大国。我必赐福给你。' },
      gen_13_8_9: { ref: '创世记 13:8-9', text: '你我不可相争，你的牧人和我的牧人也不可相争……你向左，我就向右；你向右，我就向左。' },
      gen_15_5: { ref: '创世记 15:5', text: '你向天观看，数算众星，能数得过来吗？又对他说：“你的后裔将要如此。”' },
      gen_22_13_14: { ref: '创世记 22:13-14', text: '亚伯拉罕给那地方起名叫“耶和华以勒”，直到今日人还说：“在耶和华的山上必有预备。”' },
      exod_3_2_5: { ref: '出埃及记 3:2, 5', text: '耶和华的使者从荆棘里火焰中向摩西显现……“把你脚上的鞋脱下来，因为你所站之地是圣地。”' },
      exod_4_2: { ref: '出埃及记 4:2', text: '耶和华对摩西说：“你手里是什么？”他说：“是杖。”' },
      exod_7_14_17: { ref: '出埃及记 7:17', text: '看哪，我必用我手里的杖击打河中的水，水就变作血。' },
      exod_9_22_26: { ref: '出埃及记 9:26', text: '惟独以色列人所住的歌珊地，没有冰雹。' },
      exod_12_12_13: { ref: '出埃及记 12:13', text: '这血要在你们所住的房屋上作记号；我一见这血，就越过你们去。' },
      exod_13_21: { ref: '出埃及记 13:21', text: '日间，耶和华在云柱中领他们的路；夜间，在火柱中光照他们，使他们日夜都可以行走。' },
      exod_14_13_16: { ref: '出埃及记 14:13, 16', text: '不要惧怕，只管站住！看耶和华今天向你们所要施行的救恩……你举手向海伸杖，把水分开。' },
      exod_14_21_22: { ref: '出埃及记 14:21-22', text: '耶和华便用大东风，使海水一夜退去……以色列人下海中走干地。' },
      exod_15_1_2: { ref: '出埃及记 15:2', text: '耶和华是我的力量，我的诗歌，也成了我的拯救。这是我的神，我要赞美他。' },
      exod_16_4_15: { ref: '出埃及记 16:4, 15', text: '我要将粮食从天降给你们。百姓可以出去，每天收每天的份。' },
      exod_17_6: { ref: '出埃及记 17:6', text: '你要击打磐石，从磐石里必有水流出来，使百姓可以喝。' },
      exod_20_1_17: { ref: '出埃及记 20:2-3', text: '我是耶和华你的神，曾将你从埃及地为奴之家领出来。除了我以外，你不可有别的神。' },
      exod_31_18: { ref: '出埃及记 31:18', text: '耶和华在西奈山和摩西说完了话，就把两块法版交给他，是神用指头写的石版。' },
      exod_40_34: { ref: '出埃及记 40:34', text: '当时，云彩遮盖会幕，耶和华的荣光就充满了帐幕。' },
      dan_8_16: { ref: '但以理书 8:16', text: '“加百列啊，要使这人明白这异象。”' },
      dan_10_13: { ref: '但以理书 10:13', text: '忽然有大君中的一位米迦勒来帮助我。' }
    },
    games: {
      eden: {
        treeOfLife: '生命树',
        forbiddenTree: '分别善恶树',
        serpent: '撒但（古蛇）',
        adamEve: '亚当与夏娃',
        orbsLeft: '剩余光球',
        timeLeft: '剩余时间',
        graceHearts: '伊甸守备力',
        bloom: '开花度',
        waveHint: '空格：光之话语波动',
        approachWarning: '靠近分别善恶树 — 在此停留可触发选择',
        preservedWinTitle: '守护伊甸园成功！（天堂圆满路线）',
        preservedWinDesc: '亚当与夏娃坚守神的话语胜过诱惑，伊甸园作为永恒乐园被完美保留！（获得最高奖励 +5,000 分）',
        fallenTransitionTitle: '伊甸之外 — 救赎历史的开端',
        fallenTransitionDesc: '选择禁果带来了劳苦，但神以慈悲皮衣遮盖人类，开启了贯穿创世记与出埃及记的救恩史诗！'
      },
      ark: {
        wood: '歌斐木',
        pitch: '松香',
        pairsLeft: '剩余动物对',
        hullIntegrity: '船体完整度',
        tilt: '倾斜平衡',
        leaksPatched: '已修补漏水',
        leaves: '橄榄叶',
        returnToArk: '飞回方舟！',
        animals: ['狮子', '绵羊', '小鹿', '鸽子', '大象', '牛'],
        patchPrompt: '点击红色漏水点修补！按 A/D 保持方舟平衡'
      },
      abraham: {
        gaugeFaith: '信心',
        gaugeProvisions: '粮食',
        gaugePeace: '和平',
        nextStar: '下一颗星',
        starDone: '星辰立约星座完成！',
        scenarios: {
          'abraham-1': [
            {
              prompt: '耶和华命令亚伯兰离开迦勒底的吾珥前往指示之地，你将如何回应？',
              options: [
                { text: '立刻信靠神的话语整理行装启程（信心 +20, 粮食 -10）', faith: 20, provisions: -10, peace: 10, score: 250 },
                { text: '先积攒充足商队物资后再慢慢出发（粮食 +15, 信心 +5）', faith: 5, provisions: 15, peace: 5, score: 160 }
              ]
            },
            {
              prompt: '经过哈兰来到迦南后，这地遭遇了严重的饥荒。',
              options: [
                { text: '在旷野筑坛祈祷并与众人分粮度日（信心 +20, 和平 +15）', faith: 20, provisions: -15, peace: 15, score: 260 },
                { text: '暂时南下埃及求取粮食（粮食 +20, 信心 -5）', faith: -5, provisions: 20, peace: 0, score: 170 }
              ]
            },
            {
              prompt: '回到伯特利的祭坛前，再次坚立信仰之约。',
              options: [
                { text: '呼求耶和华的名并献上感恩敬拜（信心 +25）', faith: 25, provisions: 5, peace: 15, score: 300 },
                { text: '扩充牛羊与营地护卫力量（粮食 +15, 和平 +5）', faith: 5, provisions: 15, peace: 5, score: 180 }
              ]
            }
          ],
          'abraham-2': [
            {
              prompt: '亚伯兰的牧人与罗得的牧人因水井和草场发生争执。',
              options: [
                { text: '“你我本是骨肉，不可相争，请你先选择吧！”（和平 +25, 信心 +15）', faith: 15, provisions: -10, peace: 25, score: 320 },
                { text: '以长辈身份先占领肥沃的约旦河平原（粮食 +20, 和平 -20）', faith: -10, provisions: 20, peace: -20, score: 120 }
              ]
            },
            {
              prompt: '罗得搬到所多玛附近后，传来他被敌王掳走的消息。',
              options: [
                { text: '率领家中精练壮丁 318 人连夜追击救出罗得（信心 +20, 和平 +15）', faith: 20, provisions: -10, peace: 15, score: 320 },
                { text: '按兵不动以保全自身营地安全（粮食 +10, 和平 -10）', faith: 0, provisions: 10, peace: -10, score: 140 }
              ]
            },
            {
              prompt: '得胜归来后，所多玛王提出把财物归给你。',
              options: [
                { text: '“一根线一根鞋带都不拿”，单将荣耀归于神（信心 +25, 和平 +15）', faith: 25, provisions: 0, peace: 15, score: 350 },
                { text: '收取部分战利品作为军费补偿（粮食 +20, 信心 -10）', faith: -10, provisions: 20, peace: 0, score: 150 }
              ]
            }
          ],
          'abraham-4': [
            {
              prompt: '登上摩利亚山的路上，以撒问：“父亲，燔祭的羊羔在哪里呢？”',
              options: [
                { text: '“我儿，神必自己预备作燔祭的羊羔。”', faith: 30, provisions: 0, peace: 20, score: 420 },
                { text: '在静默祷告中坚定迈向山顶', faith: 20, provisions: 0, peace: 10, score: 300 }
              ]
            },
            {
              prompt: '耶和华的使者从天上呼唤止住手，林中出现神预备的公羊。',
              options: [
                { text: '献上公羊并将那地命名为“耶和华以勒”', faith: 35, provisions: 15, peace: 25, score: 500 },
                { text: '怀着无比感恩紧抱以撒献上祈祷', faith: 25, provisions: 10, peace: 20, score: 420 }
              ]
            }
          ]
        }
      },
      plagues: {
        bushTitle: '燃烧荆棘前的三项神迹',
        bushPrompt: '请按圣经记载的先后顺序依次激活三项神迹。',
        signs: [
          { id: 'staff', label: '1. 丢在地上的杖（蛇变回杖）' },
          { id: 'hand', label: '2. 放进怀里抽出的手' },
          { id: 'nile', label: '3. 倒在干地上的尼罗河水' }
        ],
        pharaohStubborn: '法老的刚硬心',
        goshenFaith: '歌珊百姓平安',
        turn: '回合',
        cards: [
          { id: 'blood', name: '尼罗河水变血', dmg: 22, shield: 0, desc: '法老抗拒 -22' },
          { id: 'frogs', name: '青蛙、虱子与苍蝇之灾', dmg: 26, shield: 0, desc: '法老抗拒 -26' },
          { id: 'hail', name: '雷轰与夹杂火焰的冰雹', dmg: 32, shield: 0, desc: '强力打击 -32' },
          { id: 'darkness', name: '三日黑暗与歌珊亮光', dmg: 20, shield: 20, desc: '抗拒 -20 & 歌珊 +20' },
          { id: 'goshen', name: '歌珊分别之盾', dmg: 0, shield: 28, desc: '歌珊平安 +28' }
        ],
        passoverHouses: '已印记房屋',
        passoverTimer: '距离午夜'
      },
      redsea: {
        pillarDistance: '火柱庇护槽',
        staffHits: '东风神迹成功',
        distanceLeft: '距离对岸',
        israelSaved: '护送百姓',
        notesCaught: '赞美音符',
        pressAction: '在金色区域按 空格 / 点击！',
        laneHint: '用上下或左右键在三条赛道间移动！'
      },
      sinai: {
        mannaTarget: '今日吗哪定额',
        mannaCount: '已收集吗哪',
        pipeBtn: '检测活水流通',
        pipeHint: '点击旋转水渠方块，从左上磐石接通至右下营地。',
        cmdTitle: '十诫配对与拒绝金牛犊',
        calfWarning: '⚠️ 百姓鼓动造金牛犊！点击[粉碎偶像]坚守圣约！',
        calfDestroy: '拒绝并粉碎偶像！',
        cmdPairs: [
          { num: '第一诫', meaning: '除了我以外，你不可有别的神' },
          { num: '第二诫', meaning: '不可为自己雕刻偶像' },
          { num: '第四诫', meaning: '当记念安息日，守为圣日' },
          { num: '第五诫', meaning: '当孝敬父母' },
          { num: '第六与八诫', meaning: '不可杀人偷盗，当爱邻舍' }
        ],
        tabernacleSlots: ['至圣所（西方）', '圣所北侧', '圣所南侧', '圣所中央', '会幕外院'],
        tabernaclePieces: [
          { id: 'ark', name: '约柜与施恩座', correctSlot: 0 },
          { id: 'bread', name: '陈设饼桌子', correctSlot: 1 },
          { id: 'lamp', name: '精金灯台', correctSlot: 2 },
          { id: 'incense', name: '金香坛', correctSlot: 3 },
          { id: 'laver', name: '洗濯盆与祭坛', correctSlot: 4 }
        ],
        tabernacleHint: '先点击一件圣物，再点击它在会幕中的正确位置！',
        endings: {
          crown: {
            title: '伊甸冠冕 — 守住乐园的创造同工',
            desc: '你在伊甸园毫无退缩守住话语赢得 +5,000 最高奖励，并将创世记与出埃及记的荣耀推向顶点！'
          },
          covenant: {
            title: '圣约引领者 — 降临西奈的耶和华荣光',
            desc: '历尽伊甸外的洪水、应许、十灾与红海，你在西奈山立起会幕，自由与顺服化作照亮世代之光。'
          },
          pilgrim: {
            title: '信心朝圣者 — 迈向应许的第一步',
            desc: '你已通关西奈终章！欢迎再次探索其余章节或尝试守卫伊甸园以解锁最高冠冕结局。'
          }
        }
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.I18N.zh;
  }
})(typeof window !== 'undefined' ? window : globalThis);
