'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function collectJsFiles(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(collectJsFiles(full));
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

console.log('1. Checking JS syntax across all files...');
const jsFiles = collectJsFiles(ROOT);
for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file]);
}
console.log(`   OK (${jsFiles.length} files passed node --check)`);

console.log('2. Checking PNG icons...');
for (const icon of ['icons/icon-192.png', 'icons/icon-512.png']) {
  const buf = fs.readFileSync(path.join(ROOT, icon));
  assert(buf.length > 500, `${icon} too small`);
  assert.strictEqual(buf.slice(0, 8).toString('hex'), '89504e470d0a1a0a', `${icon} invalid PNG`);
}
console.log('   OK (PNG signatures valid)');

console.log('3. Loading v2.0 Action RPG data & i18n modules...');
const langs = ['ko', 'en', 'ja', 'es', 'zh'];
for (const l of langs) require(path.join(ROOT, 'js', 'i18n', `${l}.js`));
const BIBLE = require(path.join(ROOT, 'js', 'data', 'bible.js'));
const GUIDES = require(path.join(ROOT, 'js', 'data', 'guides.js'));
const ITEMS = require(path.join(ROOT, 'js', 'data', 'items.js'));
const SKILLS = require(path.join(ROOT, 'js', 'data', 'skills.js'));
const DIALOGUES = require(path.join(ROOT, 'js', 'data', 'dialogues.js'));
const ZONES = require(path.join(ROOT, 'js', 'data', 'zones.js'));
const I18n = require(path.join(ROOT, 'js', 'engine', 'i18n.js'));
const State = require(path.join(ROOT, 'js', 'engine', 'state.js'));

function flattenKeys(obj, prefix = '') {
  let keys = [];
  if (Array.isArray(obj)) {
    obj.forEach((v, idx) => { keys = keys.concat(flattenKeys(v, `${prefix}[${idx}]`)); });
    return keys;
  }
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      keys = keys.concat(flattenKeys(obj[k], prefix ? `${prefix}.${k}` : k));
    }
    return keys;
  }
  keys.push({ path: prefix, val: obj });
  return keys;
}

console.log('4. Verifying exact 5-language key parity and non-empty strings...');
const koFlat = flattenKeys(globalThis.COG.I18N.ko);
const koMap = new Map(koFlat.map((e) => [e.path, e.val]));
for (const l of langs) {
  const flat = flattenKeys(globalThis.COG.I18N[l]);
  const map = new Map(flat.map((e) => [e.path, e.val]));
  for (const [k] of koMap) {
    assert(map.has(k), `Missing key "${k}" in lang "${l}"`);
    const v = map.get(k);
    if (typeof v === 'string') assert(v.trim().length > 0, `Empty string for "${k}" in "${l}"`);
  }
  for (const [k] of map) {
    assert(koMap.has(k), `Extra key "${k}" in "${l}" not in ko`);
  }
}
console.log(`   OK (${koFlat.length} leaf keys identical across all 5 languages)`);

console.log('5. Verifying 6 open-field zones, 24 quests, 6 bosses, 3 skills, 8 relics, 5 guides, dialogues & 32 scriptures...');
assert.strictEqual(ZONES.length, 6);
assert.strictEqual(SKILLS.length, 3);
assert.strictEqual(ITEMS.length, 8);
assert.strictEqual(GUIDES.length, 5);
assert.strictEqual(BIBLE.length, 32);

const bibleSet = new Set(BIBLE.map((b) => b.id));
let totalQuests = 0;
for (const z of ZONES) {
  assert.strictEqual(z.width, 1920);
  assert.strictEqual(z.height, 1280);
  assert.strictEqual(z.quests.length, 4, `Zone ${z.id} expected 4 quests`);
  assert(z.boss && z.boss.id, `Zone ${z.id} missing boss`);
  for (const q of z.quests) {
    totalQuests++;
    assert(bibleSet.has(q.scriptureId), `Quest ${q.id} unknown scripture ${q.scriptureId}`);
  }
  for (const npc of z.npcs) {
    assert(DIALOGUES[npc.dialogueId], `NPC ${npc.id} unknown dialogue ${npc.dialogueId}`);
  }
}
assert.strictEqual(totalQuests, 24);

for (const dKey of Object.keys(DIALOGUES)) {
  const dlg = DIALOGUES[dKey];
  assert(dlg.nodes && dlg.nodes.start, `Dialogue ${dKey} missing start node`);
  for (const nKey of Object.keys(dlg.nodes)) {
    const node = dlg.nodes[nKey];
    if (node.scriptureId) assert(bibleSet.has(node.scriptureId), `Dialogue ${dKey}.${nKey} bad scripture`);
    for (const l of langs) {
      assert(flattenKeys(globalThis.COG.I18N[l]).some((x) => x.path === node.textKey), `Missing textKey ${node.textKey} in ${l}`);
    }
  }
}
console.log('   OK (All zone, quest, boss, dialogue & scripture links valid)');

console.log('6. Verifying RPG State machine, derived stats, skill upgrades, equipment, Eden +5,000 & guide unlocks...');
State.reset();
I18n.init('ko');
assert.strictEqual(I18n.getLang(), 'ko');
I18n.setLang('en', true);
assert.strictEqual(I18n.t('ui.worldMap'), 'World Map / Fast Travel (M)');

const baseStats = State.getDerivedStats();
assert(baseStats.atk > 18 && baseStats.maxHp >= 120);

// Skill upgrade
assert.strictEqual(State.upgradeSkill('nova'), true);
assert.strictEqual(State.get().skillLevels.nova, 2);
assert.strictEqual(State.get().skillPoints, 0);

// Equip relic & verify stat increase
assert.strictEqual(State.equipItem('staff_of_moses'), true);
const staffStats = State.getDerivedStats();
assert(staffStats.atk > baseStats.atk, 'Equipping Staff of Moses should increase ATK');

// Free travel to Zone 5 (Red Sea)
State.setActiveZone('redsea');
assert.strictEqual(State.get().activeZoneId, 'redsea');

// Defeat Eden boss without eating -> Preserved Crown +5,000 bonus
State.reset();
const edenRes = State.defeatBoss(ZONES[0]);
assert.strictEqual(State.get().edenRoute, 'preserved');
assert(State.getTotalScore() >= 5000 + ZONES[0].boss.score, 'Expected +5,000 Eden Preserved bonus');
assert.strictEqual(edenRes.unlockedItem, 'tree_of_life_leaf');

// Leveling up unlocks all 5 companions
State.addRewards(5000, 0);
assert(State.getPlayerLevel() >= 10, `Expected Lv >= 10, got ${State.getPlayerLevel()}`);
assert.strictEqual(State.getUnlockedGuides().length, 5, 'Expected all 5 guides unlocked at Lv >= 10');

console.log('   OK (All RPG state & progression checks passed)');
console.log('ALL v2.0 VERIFICATION CHECKS PASSED!');
