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

console.log('2. Checking PWA & Chibi portrait PNG assets...');
const requiredPngs = [
  'icons/icon-192.png',
  'icons/icon-512.png',
  'assets/art/adam_eve.png',
  'assets/art/noah.png',
  'assets/art/abraham.png',
  'assets/art/moses.png',
  'assets/art/cherubim.png',
  'assets/art/serpent.png'
];
for (const rel of requiredPngs) {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  assert(buf.length > 1000, `${rel} too small`);
  assert.strictEqual(buf.slice(0, 8).toString('hex'), '89504e470d0a1a0a', `${rel} invalid PNG signature`);
}
console.log(`   OK (${requiredPngs.length} PNG files verified)`);

console.log('3. Loading v3.0 Storybook Multi-Genre data & i18n modules...');
const langs = ['ko', 'en', 'ja', 'es', 'zh'];
for (const l of langs) require(path.join(ROOT, 'js', 'i18n', `${l}.js`));
const BIBLE = require(path.join(ROOT, 'js', 'data', 'bible.js'));
const GUIDES = require(path.join(ROOT, 'js', 'data', 'guides.js'));
const ITEMS = require(path.join(ROOT, 'js', 'data', 'items.js'));
const DIALOGUES = require(path.join(ROOT, 'js', 'data', 'dialogues.js'));
const STAGES = require(path.join(ROOT, 'js', 'data', 'stages.js'));
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

console.log('5. Verifying 6 distinct genres, portraits, guides, items, dialogues & 32 scriptures...');
assert.strictEqual(STAGES.length, 6);
const genreSet = new Set(STAGES.map((s) => s.genreId));
assert.strictEqual(genreSet.size, 6, 'Expected 6 distinct game genres across the 6 stages');
const bibleSet = new Set(BIBLE.map((b) => b.id));
assert.strictEqual(BIBLE.length, 32);
assert.strictEqual(GUIDES.length, 5);
assert.strictEqual(ITEMS.length, 8);

for (const stg of STAGES) {
  assert(fs.existsSync(path.join(ROOT, stg.portrait)), `Missing portrait ${stg.portrait}`);
  for (const sid of stg.scriptureIds) {
    assert(bibleSet.has(sid), `Stage ${stg.id} unknown scripture ${sid}`);
  }
}
for (const dKey of Object.keys(DIALOGUES)) {
  const dlg = DIALOGUES[dKey];
  assert(fs.existsSync(path.join(ROOT, dlg.portrait)), `Missing dialogue portrait ${dlg.portrait}`);
  for (const nKey of Object.keys(dlg.nodes)) {
    const node = dlg.nodes[nKey];
    if (node.scriptureId) assert(bibleSet.has(node.scriptureId), `Bad scripture in ${dKey}.${nKey}`);
    for (const l of langs) {
      assert(flattenKeys(globalThis.COG.I18N[l]).some((x) => x.path === node.textKey), `Missing ${node.textKey} in ${l}`);
    }
  }
}
console.log('   OK (6 distinct genres, portraits & links verified)');

console.log('6. Verifying RPG state, Eden +5,000 bonus & companion unlocks...');
State.reset();
I18n.init('ko');
assert.strictEqual(I18n.getLang(), 'ko');
I18n.setLang('en', true);
assert.strictEqual(I18n.t('ui.backToGallery'), 'Storybook Map');

State.setEdenRoute('preserved');
const edenRes = State.completeStage(STAGES[0], 1700, 3, { faith: 10 });
assert.strictEqual(State.getTotalScore(), 6700, 'Expected 1700 + 5000 Eden Preserved Crown Bonus');
assert.strictEqual(State.get().unlockedItems.includes('tree_of_life_leaf'), true);

// Level up to unlock all 5 companions
for (const s of STAGES) State.completeStage(s, s.baseScore, 3);
State.addStat({});
assert(State.getPlayerLevel() >= 6, `Expected Lv >= 6, got ${State.getPlayerLevel()}`);
assert.strictEqual(State.getUnlockedGuides().length, 5, 'Expected all 5 cute companions unlocked');

console.log('   OK (All state & progression checks passed)');
console.log('ALL v3.0 STORYBOOK VERIFICATION CHECKS PASSED!');
