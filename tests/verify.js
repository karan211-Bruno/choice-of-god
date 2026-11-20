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

console.log('1. Checking JS syntax on all files...');
const jsFiles = collectJsFiles(ROOT);
for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file]);
}
console.log(`   OK (${jsFiles.length} files passed node --check)`);

console.log('2. Checking PNG icons...');
for (const icon of ['icons/icon-192.png', 'icons/icon-512.png']) {
  const buf = fs.readFileSync(path.join(ROOT, icon));
  assert(buf.length > 500, `${icon} too small`);
  assert.strictEqual(buf.slice(0, 8).toString('hex'), '89504e470d0a1a0a', `${icon} invalid PNG signature`);
}
console.log('   OK (PNG signatures valid)');

console.log('3. Loading data & i18n modules into shared global COG...');
const langs = ['ko', 'en', 'ja', 'es', 'zh'];
for (const l of langs) require(path.join(ROOT, 'js', 'i18n', `${l}.js`));
const BIBLE = require(path.join(ROOT, 'js', 'data', 'bible.js'));
const GUIDES = require(path.join(ROOT, 'js', 'data', 'guides.js'));
const ITEMS = require(path.join(ROOT, 'js', 'data', 'items.js'));
const CHAPTERS = require(path.join(ROOT, 'js', 'data', 'stages.js'));
const I18n = require(path.join(ROOT, 'js', 'engine', 'i18n.js'));
const State = require(path.join(ROOT, 'js', 'engine', 'state.js'));

function flattenKeys(obj, prefix = '') {
  let keys = [];
  if (Array.isArray(obj)) {
    obj.forEach((v, idx) => {
      keys = keys.concat(flattenKeys(v, `${prefix}[${idx}]`));
    });
    return keys;
  }
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const next = prefix ? `${prefix}.${k}` : k;
      keys = keys.concat(flattenKeys(obj[k], next));
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
    if (typeof v === 'string') {
      assert(v.trim().length > 0, `Empty string for "${k}" in lang "${l}"`);
    }
  }
  for (const [k] of map) {
    assert(koMap.has(k), `Extra key "${k}" in lang "${l}" not in ko`);
  }
}
console.log(`   OK (${koFlat.length} leaf keys identical across all 5 languages)`);

console.log('5. Verifying stage, item, guide & scripture cross-references...');
assert.strictEqual(CHAPTERS.length, 6, 'Expected 6 chapters');
let totalLevels = 0;
const bibleSet = new Set(BIBLE.map((b) => b.id));
assert.strictEqual(BIBLE.length, 32, 'Expected 32 bible entries');
assert.strictEqual(GUIDES.length, 5, 'Expected 5 guides');
assert.strictEqual(ITEMS.length, 8, 'Expected 8 items');

for (const b of BIBLE) {
  for (const l of langs) {
    const entry = globalThis.COG.I18N[l].bible[b.id];
    assert(entry && entry.ref && entry.text, `Missing bible entry ${b.id} in ${l}`);
  }
}

for (const g of GUIDES) {
  assert(bibleSet.has(g.scriptureId), `Guide ${g.id} references unknown scripture ${g.scriptureId}`);
}
for (const it of ITEMS) {
  assert(bibleSet.has(it.scriptureId), `Item ${it.id} references unknown scripture ${it.scriptureId}`);
}
for (const ch of CHAPTERS) {
  assert.strictEqual(ch.levels.length, 4, `Chapter ${ch.id} should have 4 levels`);
  for (const lv of ch.levels) {
    totalLevels++;
    for (const sid of lv.scriptureIds) {
      assert(bibleSet.has(sid), `Level ${lv.id} references unknown scripture ${sid}`);
    }
  }
}
assert.strictEqual(totalLevels, 24, 'Expected 24 total levels');
console.log('   OK (6 chapters, 24 levels, 8 items, 5 guides, 32 scriptures verified)');

console.log('6. Verifying State machine, Eden branching (+5,000), free stage selection & guide unlocks...');
State.reset();
I18n.init('ko');
assert.strictEqual(I18n.getLang(), 'ko');
I18n.setLang('en', true);
assert.strictEqual(I18n.t('ui.score'), 'Score');

// Free stage jump directly to Chapter 5 (Red Sea)
State.setActiveView('redsea', 3);
assert.strictEqual(State.get().activeChapterId, 'redsea');
assert.strictEqual(State.get().activeSubLevel, 3);

// Eden Preserved +5,000 bonus test
State.setEdenRoute('preserved');
const eden4 = CHAPTERS[0].levels[3];
State.completeLevel(eden4, 1800, 3, { faith: 10 });
assert.strictEqual(State.getTotalScore(), 6800, 'Expected 1800 + 5000 Eden Preserved bonus');
assert(State.get().unlockedItems.includes('tree_of_life_leaf'), 'Expected tree_of_life_leaf unlocked');

// Test Fallen route unlocks garment_of_skin
State.reset();
State.setEdenRoute('fallen');
assert(State.get().unlockedItems.includes('garment_of_skin'), 'Expected garment_of_skin unlocked');

// Test guide unlocks as XP increases
State.reset();
assert.strictEqual(State.getUnlockedGuides().length, 1);
for (const ch of CHAPTERS) {
  for (const lv of ch.levels) {
    State.completeLevel(lv, lv.baseScore, 3);
  }
}
assert(State.getPlayerLevel() >= 10, `Expected player level >= 10, got ${State.getPlayerLevel()}`);
assert.strictEqual(State.getUnlockedGuides().length, 5, 'Expected all 5 guides unlocked after clearing campaign');

console.log('   OK (All state machine & progression checks passed)');
console.log('ALL VERIFICATION CHECKS PASSED!');
