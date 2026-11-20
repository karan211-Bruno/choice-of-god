(function (root) {
  'use strict';
  root.COG = root.COG || {};

  var VIEW_W = 960;
  var VIEW_H = 540;

  function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  var RpgEngine = {
    VIEW_W: VIEW_W,
    VIEW_H: VIEW_H,
    canvas: null,
    ctx: null,
    rafId: null,
    paused: false,
    lastTs: 0,
    elapsed: 0,
    zone: null,
    hero: null,
    companion: { x: 0, y: 0 },
    cam: { x: 0, y: 0 },
    enemies: [],
    boss: null,
    projectiles: [],
    effects: [],
    floatTexts: [],
    interactables: [],
    npcs: [],
    landmarks: [],
    questCounts: {},
    skillCooldowns: { nova: 0, beam: 0, grace: 0 },
    keys: { left: false, right: false, up: false, down: false },
    pointerMove: null,
    hooks: {},

    init: function (canvasEl, hooks) {
      this.canvas = canvasEl;
      this.hooks = hooks || {};
      if (canvasEl) {
        canvasEl.width = VIEW_W;
        canvasEl.height = VIEW_H;
        this.ctx = canvasEl.getContext('2d');
        var self = this;
        canvasEl.addEventListener('pointerdown', function (e) {
          if (self.paused || !self.zone) return;
          var rect = canvasEl.getBoundingClientRect();
          var sx = (e.clientX - rect.left) * (VIEW_W / rect.width);
          var sy = (e.clientY - rect.top) * (VIEW_H / rect.height);
          var wx = sx + self.cam.x;
          var wy = sy + self.cam.y;

          // If player clicked close to hero or an enemy, attack toward cursor; if close to NPC/node, interact
          var nearTarget = self.findNearestInteractable();
          if (nearTarget && dist(wx, wy, nearTarget.x, nearTarget.y) < 55) {
            self.interact();
            return;
          }
          self.hero.facingAngle = Math.atan2(wy - self.hero.y, wx - self.hero.x);
          self.slash();
        });
      }
      this.bindKeyboard();
    },

    bindKeyboard: function () {
      if (typeof window === 'undefined') return;
      var self = this;
      window.addEventListener('keydown', function (e) {
        if (!self.zone) return;
        if (document.querySelector('dialog[open]') || self.paused) {
          self.clearKeys();
          return;
        }
        var k = e.key;
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') { self.keys.left = true; e.preventDefault(); }
        else if (k === 'ArrowRight' || k === 'd' || k === 'D') { self.keys.right = true; e.preventDefault(); }
        else if (k === 'ArrowUp' || k === 'w' || k === 'W') { self.keys.up = true; e.preventDefault(); }
        else if (k === 'ArrowDown' || k === 's' || k === 'S') { self.keys.down = true; e.preventDefault(); }
        else if (k === ' ' || k === 'j' || k === 'J') {
          if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT')) return;
          e.preventDefault();
          self.slash();
        } else if (k === 'Shift' || k === 'k' || k === 'K') {
          e.preventDefault();
          self.dash();
        } else if (k === 'e' || k === 'E') {
          e.preventDefault();
          self.interact();
        } else if (k === '1') { self.useSkill('nova'); }
        else if (k === '2') { self.useSkill('beam'); }
        else if (k === '3') { self.useSkill('grace'); }
      });

      window.addEventListener('keyup', function (e) {
        var k = e.key;
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') self.keys.left = false;
        else if (k === 'ArrowRight' || k === 'd' || k === 'D') self.keys.right = false;
        else if (k === 'ArrowUp' || k === 'w' || k === 'W') self.keys.up = false;
        else if (k === 'ArrowDown' || k === 's' || k === 'S') self.keys.down = false;
      });
    },

    clearKeys: function () {
      this.keys.left = false;
      this.keys.right = false;
      this.keys.up = false;
      this.keys.down = false;
    },

    setTouchKey: function (dir, pressed) {
      if (dir === 'left' || dir === 'right' || dir === 'up' || dir === 'down') {
        this.keys[dir] = !!pressed;
      }
    },

    loadZone: function (zoneId) {
      var zones = (root.COG.DATA && root.COG.DATA.ZONES) || [];
      var z = zones.find(function (item) { return item.id === zoneId; }) || zones[0];
      this.zone = z;
      root.COG.State.setActiveZone(z.id);

      var st = root.COG.State.get();
      var derived = root.COG.State.getDerivedStats();

      this.hero = {
        x: z.spawn.x,
        y: z.spawn.y,
        r: 18,
        heroType: z.heroType,
        hp: derived.maxHp,
        maxHp: derived.maxHp,
        mp: derived.maxMp,
        maxMp: derived.maxMp,
        facingAngle: 0,
        moving: false,
        attackTimer: 0,
        attackCd: 0,
        dashTimer: 0,
        dashCd: 0,
        dashVx: 0,
        dashVy: 0,
        invuln: 0,
        shieldTimer: 0
      };
      this.companion = { x: z.spawn.x - 38, y: z.spawn.y - 34 };
      this.cam.x = clamp(this.hero.x - VIEW_W / 2, 0, z.width - VIEW_W);
      this.cam.y = clamp(this.hero.y - VIEW_H / 2, 0, z.height - VIEW_H);

      this.landmarks = (z.landmarks || []).slice();
      this.npcs = (z.npcs || []).slice();
      this.interactables = (z.interactables || []).filter(function (nd) {
        return !st.collectedNodes[nd.id];
      }).map(function (nd) { return Object.assign({}, nd); });

      this.enemies = (z.enemies || []).map(function (en) {
        return Object.assign({}, en, {
          maxHp: en.hp,
          flash: 0,
          atkCd: 0.8 + Math.random(),
          homeX: en.x,
          homeY: en.y
        });
      });

      this.boss = null;
      if (z.boss && !st.defeatedBosses[z.boss.id]) {
        this.boss = Object.assign({}, z.boss, {
          maxHp: z.boss.hp,
          flash: 0,
          phase2: false,
          crossroadsTriggered: false,
          atkCd: 1.5,
          telegraphTimer: 0,
          telegraphMax: 1.1,
          telegraphX: z.boss.x,
          telegraphY: z.boss.y,
          telegraphR: 95
        });
      }

      this.projectiles = [];
      this.effects = [];
      this.floatTexts = [];
      this.skillCooldowns = { nova: 0, beam: 0, grace: 0 };
      this.syncQuestCounts();

      this.paused = false;
      this.lastTs = 0;
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      var self = this;
      var tick = function (ts) {
        self.frame(ts);
        self.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);

      if (this.hooks.onZoneChanged) this.hooks.onZoneChanged(z);
      if (this.hooks.onHudUpdate) this.hooks.onHudUpdate();
    },

    syncHeroMaxStats: function () {
      if (!this.hero) return;
      var d = root.COG.State.getDerivedStats();
      var hpPct = this.hero.hp / Math.max(1, this.hero.maxHp);
      var mpPct = this.hero.mp / Math.max(1, this.hero.maxMp);
      this.hero.maxHp = d.maxHp;
      this.hero.maxMp = d.maxMp;
      this.hero.hp = Math.min(d.maxHp, Math.max(1, Math.round(d.maxHp * hpPct)));
      this.hero.mp = Math.min(d.maxMp, Math.round(d.maxMp * mpPct));
    },

    syncQuestCounts: function () {
      if (!this.zone) return;
      var st = root.COG.State.get();
      var counts = {};
      var z = this.zone;
      z.quests.forEach(function (q) {
        if (st.completedQuests[q.id]) {
          counts[q.id] = q.targetCount;
          return;
        }
        if (q.type === 'collect') {
          var total = (z.interactables || []).filter(function (i) { return i.questId === q.id; }).length;
          var collected = (z.interactables || []).filter(function (i) {
            return i.questId === q.id && st.collectedNodes[i.id];
          }).length;
          counts[q.id] = Math.min(q.targetCount, collected || (total === 0 ? 0 : collected));
        } else {
          counts[q.id] = counts[q.id] || 0;
        }
      });
      this.questCounts = Object.assign({}, this.questCounts, counts);
    },

    pause: function () {
      this.paused = true;
      this.clearKeys();
    },

    resume: function () {
      this.paused = false;
      this.lastTs = 0;
    },

    addFloatText: function (x, y, text, color) {
      this.floatTexts.push({ x: x, y: y, text: String(text), color: color || '#fde047', life: 0.95 });
    },

    slash: function () {
      if (this.paused || !this.hero || this.hero.attackCd > 0) return;
      var h = this.hero;
      h.attackTimer = 0.22;
      h.attackCd = 0.28;
      root.COG.Audio.play('slash');

      var derived = root.COG.State.getDerivedStats();
      var reach = 74;
      this.hitTargetsInArc(h.x, h.y, reach, h.facingAngle, 1.35, derived.atk);
    },

    dash: function () {
      if (this.paused || !this.hero || this.hero.dashCd > 0) return;
      var h = this.hero;
      h.dashTimer = 0.22;
      h.dashCd = 1.0;
      h.invuln = Math.max(h.invuln, 0.28);
      h.dashVx = Math.cos(h.facingAngle) * 560;
      h.dashVy = Math.sin(h.facingAngle) * 560;
      root.COG.Audio.play('dash');
      this.effects.push({ kind: 'ring', x: h.x, y: h.y, r: 10, maxR: 48, life: 0.25, color: '#67e8f9' });
    },

    useSkill: function (skillId) {
      if (this.paused || !this.hero) return;
      var skills = root.COG.DATA.SKILLS || [];
      var sk = skills.find(function (s) { return s.id === skillId; });
      if (!sk) return;
      if ((this.skillCooldowns[skillId] || 0) > 0) return;
      if (this.hero.mp < sk.mpCost) return;

      var st = root.COG.State.get();
      var lv = (st.skillLevels && st.skillLevels[skillId]) || 1;
      var derived = root.COG.State.getDerivedStats();

      this.hero.mp -= sk.mpCost;
      this.skillCooldowns[skillId] = sk.cooldown;

      if (skillId === 'nova') {
        var dmgNova = sk.baseDmg + (lv - 1) * sk.dmgPerLevel + Math.round(derived.atk * 0.65);
        root.COG.Audio.play('skill_nova');
        this.effects.push({ kind: 'ring', x: this.hero.x, y: this.hero.y, r: 18, maxR: sk.radius, life: 0.38, color: sk.color });
        this.hitTargetsInRadius(this.hero.x, this.hero.y, sk.radius, dmgNova, true);
      } else if (skillId === 'beam') {
        var dmgBeam = sk.baseDmg + (lv - 1) * sk.dmgPerLevel + Math.round(derived.atk * 0.8);
        root.COG.Audio.play('skill_beam');
        var ang = this.hero.facingAngle;
        this.effects.push({
          kind: 'beam',
          x: this.hero.x,
          y: this.hero.y,
          angle: ang,
          range: sk.range,
          life: 0.28,
          color: sk.color
        });
        // Check line hits
        for (var d = 30; d <= sk.range; d += 36) {
          this.hitTargetsInRadius(this.hero.x + Math.cos(ang) * d, this.hero.y + Math.sin(ang) * d, 42, dmgBeam, false, true);
        }
      } else if (skillId === 'grace') {
        var healAmt = sk.baseHeal + (lv - 1) * sk.healPerLevel;
        this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + healAmt);
        this.hero.shieldTimer = sk.shieldSec;
        root.COG.Audio.play('heal');
        this.addFloatText(this.hero.x, this.hero.y - 28, '+' + healAmt + ' HP', '#34d399');
        this.effects.push({ kind: 'ring', x: this.hero.x, y: this.hero.y, r: 14, maxR: 75, life: 0.4, color: '#34d399' });
      }
      if (this.hooks.onHudUpdate) this.hooks.onHudUpdate();
    },

    hitTargetsInArc: function (ox, oy, radius, angle, halfArc, dmg) {
      var self = this;
      var apply = function (target, isBoss) {
        var d = dist(ox, oy, target.x, target.y);
        if (d > radius + (isBoss ? 36 : 18)) return;
        var a = Math.atan2(target.y - oy, target.x - ox);
        var diff = Math.abs(Math.atan2(Math.sin(a - angle), Math.cos(a - angle)));
        if (diff <= halfArc || d < 32) {
          self.damageTarget(target, dmg, a, isBoss);
        }
      };
      for (var i = this.enemies.length - 1; i >= 0; i--) apply(this.enemies[i], false);
      if (this.boss && this.boss.hp > 0) apply(this.boss, true);
    },

    hitTargetsInRadius: function (cx, cy, radius, dmg, knockback, dedupe) {
      var self = this;
      var hitSet = dedupe ? {} : null;
      for (var i = this.enemies.length - 1; i >= 0; i--) {
        var en = this.enemies[i];
        if (hitSet && hitSet[en.id]) continue;
        if (dist(cx, cy, en.x, en.y) <= radius + 18) {
          if (hitSet) hitSet[en.id] = true;
          var a = Math.atan2(en.y - this.hero.y, en.x - this.hero.x);
          this.damageTarget(en, dmg, knockback ? a : null, false);
        }
      }
      if (this.boss && this.boss.hp > 0 && dist(cx, cy, this.boss.x, this.boss.y) <= radius + 36) {
        if (!hitSet || !hitSet[this.boss.id]) {
          if (hitSet) hitSet[this.boss.id] = true;
          this.damageTarget(this.boss, dmg, null, true);
        }
      }
    },

    damageTarget: function (target, rawDmg, knockAngle, isBoss) {
      var crit = Math.random() < 0.2;
      var dmg = Math.round(rawDmg * (crit ? 1.4 : 1));
      target.hp -= dmg;
      target.flash = 0.14;
      this.addFloatText(target.x, target.y - 26, crit ? dmg + '!' : dmg, crit ? '#fde047' : '#ffffff');

      if (!isBoss && knockAngle !== null) {
        target.x = clamp(target.x + Math.cos(knockAngle) * 28, 40, this.zone.width - 40);
        target.y = clamp(target.y + Math.sin(knockAngle) * 28, 40, this.zone.height - 40);
      }

      if (isBoss) {
        if (!target.phase2 && target.hp > 0 && target.hp <= target.maxHp * (target.phase2Threshold || 0.5)) {
          target.phase2 = true;
          root.COG.Audio.play('boss_roar');
          if (this.zone.id === 'eden' && !target.crossroadsTriggered && root.COG.State.get().edenRoute === 'undecided') {
            target.crossroadsTriggered = true;
            this.openDialogue('eden_crossroads');
          }
        }
        if (target.hp <= 0) {
          this.onBossDefeated();
        }
      } else if (target.hp <= 0) {
        this.onEnemyDefeated(target);
      }
      if (this.hooks.onHudUpdate) this.hooks.onHudUpdate();
    },

    onEnemyDefeated: function (en) {
      var idx = this.enemies.indexOf(en);
      if (idx !== -1) this.enemies.splice(idx, 1);
      root.COG.Audio.play('enemy_down');
      this.effects.push({ kind: 'ring', x: en.x, y: en.y, r: 8, maxR: 46, life: 0.3, color: '#fbbf24' });

      var rw = root.COG.State.addRewards(en.xp, en.score);
      if (rw.leveledUp && this.hooks.onLevelUp) this.hooks.onLevelUp(rw);

      if (en.questId) {
        this.incrementQuestProgress(en.questId, 1);
      }
    },

    onBossDefeated: function () {
      var b = this.boss;
      this.boss = null;
      root.COG.Audio.play('levelup');
      this.effects.push({ kind: 'ring', x: b.x, y: b.y, r: 20, maxR: 150, life: 0.65, color: '#fde047' });

      var res = root.COG.State.defeatBoss(this.zone);
      if (this.hooks.onBossDefeated) this.hooks.onBossDefeated(this.zone, res);
      if (res && res.leveledUp && this.hooks.onLevelUp) this.hooks.onLevelUp(res);
      if (this.hooks.onHudUpdate) this.hooks.onHudUpdate();
    },

    incrementQuestProgress: function (questId, amount) {
      if (!this.zone) return;
      var q = this.zone.quests.find(function (item) { return item.id === questId; });
      if (!q) return;
      if (root.COG.State.get().completedQuests[questId]) return;

      this.questCounts[questId] = (this.questCounts[questId] || 0) + (amount || 1);
      if (this.questCounts[questId] >= q.targetCount) {
        var res = root.COG.State.completeQuest(q);
        root.COG.Audio.play('quest_done');
        if (this.hooks.onQuestCompleted) this.hooks.onQuestCompleted(q, res);
        if (res && res.leveledUp && this.hooks.onLevelUp) this.hooks.onLevelUp(res);
      }
      if (this.hooks.onHudUpdate) this.hooks.onHudUpdate();
    },

    findNearestInteractable: function () {
      if (!this.hero) return null;
      var best = null;
      var bestD = 72;

      for (var i = 0; i < this.npcs.length; i++) {
        var n = this.npcs[i];
        var d1 = dist(this.hero.x, this.hero.y, n.x, n.y);
        if (d1 < bestD) { bestD = d1; best = { kind: 'npc', ref: n, x: n.x, y: n.y }; }
      }
      for (var j = 0; j < this.interactables.length; j++) {
        var nd = this.interactables[j];
        var d2 = dist(this.hero.x, this.hero.y, nd.x, nd.y);
        if (d2 < bestD) { bestD = d2; best = { kind: 'node', ref: nd, x: nd.x, y: nd.y }; }
      }
      for (var k = 0; k < this.landmarks.length; k++) {
        var lm = this.landmarks[k];
        if (!lm.dialogueId) continue;
        var d3 = dist(this.hero.x, this.hero.y, lm.x, lm.y);
        if (d3 < bestD + 20) { bestD = d3; best = { kind: 'landmark', ref: lm, x: lm.x, y: lm.y }; }
      }
      return best;
    },

    interact: function () {
      if (this.paused || !this.hero) return false;
      var target = this.findNearestInteractable();
      if (!target) return false;

      if (target.kind === 'npc' || target.kind === 'landmark') {
        this.openDialogue(target.ref.dialogueId);
        return true;
      }
      if (target.kind === 'node') {
        var nd = target.ref;
        var idx = this.interactables.indexOf(nd);
        if (idx !== -1) this.interactables.splice(idx, 1);
        root.COG.State.markNodeCollected(nd.id);
        root.COG.Audio.play('quest_done');
        this.effects.push({ kind: 'ring', x: nd.x, y: nd.y, r: 8, maxR: 50, life: 0.35, color: '#fde047' });
        this.addFloatText(nd.x, nd.y - 24, '+50', '#fde047');
        var rw = root.COG.State.addRewards(25, 50);
        if (rw.leveledUp && this.hooks.onLevelUp) this.hooks.onLevelUp(rw);
        if (nd.questId) this.incrementQuestProgress(nd.questId, 1);
        return true;
      }
      return false;
    },

    openDialogue: function (dialogueId) {
      if (!dialogueId || !this.hooks.onOpenDialogue) return;
      this.pause();
      var self = this;
      this.hooks.onOpenDialogue(dialogueId, {
        onEffect: function (eff) {
          self.applyDialogueEffects(eff);
        },
        onClose: function () {
          self.resume();
          if (self.hooks.onHudUpdate) self.hooks.onHudUpdate();
        }
      });
    },

    applyDialogueEffects: function (eff) {
      if (!eff) return;
      if (eff.heal && this.hero) {
        this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + eff.heal);
        this.addFloatText(this.hero.x, this.hero.y - 28, '+' + eff.heal + ' HP', '#34d399');
      }
      if (eff.faith || eff.wisdom || eff.mercy || eff.score) {
        root.COG.State.addRewards(0, eff.score || 0, {
          faith: eff.faith || 0,
          wisdom: eff.wisdom || 0,
          mercy: eff.mercy || 0
        });
      }
      if (eff.edenRoute) {
        root.COG.State.setEdenRoute(eff.edenRoute);
        // If Eden Fallen chosen, clear Eden boss gracefully so player can travel ahead cleanly
        if (eff.edenRoute === 'fallen' && this.zone.id === 'eden') {
          root.COG.State.defeatBoss(this.zone);
          this.boss = null;
        }
      }
      if (eff.unlockItem) {
        root.COG.State.unlockItem(eff.unlockItem);
      }
      if (eff.completeQuest && this.zone) {
        var q = this.zone.quests.find(function (item) { return item.id === eff.completeQuest; });
        if (q && !root.COG.State.get().completedQuests[q.id]) {
          var res = root.COG.State.completeQuest(q);
          this.questCounts[q.id] = q.targetCount;
          if (this.hooks.onQuestCompleted) this.hooks.onQuestCompleted(q, res);
          if (res && res.leveledUp && this.hooks.onLevelUp) this.hooks.onLevelUp(res);
        }
      }
      if (this.hooks.onHudUpdate) this.hooks.onHudUpdate();
    },

    damageHero: function (rawDmg) {
      if (!this.hero || this.hero.invuln > 0 || this.hero.shieldTimer > 0) return;
      var derived = root.COG.State.getDerivedStats();
      var dmg = Math.max(3, rawDmg - Math.round(derived.def * 0.65));
      this.hero.hp -= dmg;
      this.hero.invuln = 0.75;
      root.COG.Audio.play('hit');
      this.addFloatText(this.hero.x, this.hero.y - 28, '-' + dmg, '#f87171');

      if (this.hero.hp <= 0) {
        // Gentle Sanctuary Respawn — never lose progress!
        this.hero.x = this.zone.spawn.x;
        this.hero.y = this.zone.spawn.y;
        this.hero.hp = this.hero.maxHp;
        this.hero.mp = this.hero.maxMp;
        this.hero.invuln = 2.0;
        this.projectiles = [];
        if (this.hooks.onRespawn) this.hooks.onRespawn();
      }
      if (this.hooks.onHudUpdate) this.hooks.onHudUpdate();
    },

    frame: function (ts) {
      if (!this.zone || !this.hero) return;
      if (!this.lastTs) this.lastTs = ts;
      var dt = Math.min(0.05, Math.max(0.001, (ts - this.lastTs) / 1000));
      this.lastTs = ts;

      if (!this.paused) {
        this.elapsed += dt;
        this.update(dt);
      }
      this.render();
    },

    update: function (dt) {
      var h = this.hero;
      var z = this.zone;
      var derived = root.COG.State.getDerivedStats();

      // Passive MP regen & timers
      h.mp = Math.min(h.maxMp, h.mp + derived.mpRegen * dt);
      if (h.attackTimer > 0) h.attackTimer = Math.max(0, h.attackTimer - dt);
      if (h.attackCd > 0) h.attackCd = Math.max(0, h.attackCd - dt);
      if (h.dashCd > 0) h.dashCd = Math.max(0, h.dashCd - dt);
      if (h.invuln > 0) h.invuln = Math.max(0, h.invuln - dt);
      if (h.shieldTimer > 0) h.shieldTimer = Math.max(0, h.shieldTimer - dt);

      ['nova', 'beam', 'grace'].forEach(function (k) {
        if (this.skillCooldowns[k] > 0) {
          this.skillCooldowns[k] = Math.max(0, this.skillCooldowns[k] - dt);
        }
      }, this);

      // Movement or Dash
      if (h.dashTimer > 0) {
        h.dashTimer -= dt;
        h.x += h.dashVx * dt;
        h.y += h.dashVy * dt;
        h.moving = true;
      } else {
        var dx = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
        var dy = (this.keys.down ? 1 : 0) - (this.keys.up ? 1 : 0);
        if (dx !== 0 || dy !== 0) {
          var len = Math.sqrt(dx * dx + dy * dy);
          h.x += (dx / len) * derived.speed * dt;
          h.y += (dy / len) * derived.speed * dt;
          h.facingAngle = Math.atan2(dy, dx);
          h.moving = true;
        } else {
          h.moving = false;
        }
      }

      // World & Red Sea water-wall bounds
      var minY = z.biome === 'redsea' ? 235 : 42;
      var maxY = z.biome === 'redsea' ? 1045 : z.height - 42;
      h.x = clamp(h.x, 42, z.width - 42);
      h.y = clamp(h.y, minY, maxY);

      // Companion smooth follow
      var targetCompX = h.x - Math.cos(h.facingAngle) * 42 - 14;
      var targetCompY = h.y - 34;
      this.companion.x += (targetCompX - this.companion.x) * Math.min(1, dt * 5.5);
      this.companion.y += (targetCompY - this.companion.y) * Math.min(1, dt * 5.5);

      // Smooth Camera follow
      var targetCamX = clamp(h.x - VIEW_W / 2, 0, z.width - VIEW_W);
      var targetCamY = clamp(h.y - VIEW_H / 2, 0, z.height - VIEW_H);
      this.cam.x += (targetCamX - this.cam.x) * Math.min(1, dt * 7);
      this.cam.y += (targetCamY - this.cam.y) * Math.min(1, dt * 7);

      // Regular Enemies AI
      for (var i = 0; i < this.enemies.length; i++) {
        var en = this.enemies[i];
        if (en.flash > 0) en.flash -= dt;
        var dToHero = dist(en.x, en.y, h.x, h.y);
        if (dToHero < 390 && dToHero > 24) {
          var a = Math.atan2(h.y - en.y, h.x - en.x);
          en.x += Math.cos(a) * en.speed * dt;
          en.y += Math.sin(a) * en.speed * dt;
        }
        if (dToHero < 34) {
          this.damageHero(en.atk);
        }
        if (en.kind === 'magician' || en.kind === 'shadow_wisp') {
          en.atkCd -= dt;
          if (en.atkCd <= 0 && dToHero < 420) {
            en.atkCd = 2.6;
            var pa = Math.atan2(h.y - en.y, h.x - en.x);
            this.projectiles.push({
              x: en.x, y: en.y, vx: Math.cos(pa) * 210, vy: Math.sin(pa) * 210,
              dmg: en.atk, r: 8, life: 2.2, color: '#c084fc'
            });
          }
        }
      }

      // Multi-Phase Boss AI
      if (this.boss) {
        var b = this.boss;
        if (b.flash > 0) b.flash -= dt;
        var dBoss = dist(b.x, b.y, h.x, h.y);
        if (dBoss < 560) {
          var spd = b.phase2 ? b.speed * 1.25 : b.speed;
          if (dBoss > 55 && b.telegraphTimer <= 0) {
            var ba = Math.atan2(h.y - b.y, h.x - b.x);
            b.x += Math.cos(ba) * spd * dt;
            b.y += Math.sin(ba) * spd * dt;
          }
          if (dBoss < 46) {
            this.damageHero(b.atk);
          }

          if (b.telegraphTimer > 0) {
            b.telegraphTimer -= dt;
            if (b.telegraphTimer <= 0) {
              // Telegraph detonation!
              root.COG.Audio.play('boss_roar');
              this.effects.push({ kind: 'ring', x: b.telegraphX, y: b.telegraphY, r: 15, maxR: b.telegraphR, life: 0.35, color: '#ef4444' });
              if (dist(h.x, h.y, b.telegraphX, b.telegraphY) <= b.telegraphR) {
                this.damageHero(b.atk + 6);
              }
            }
          } else {
            b.atkCd -= dt;
            if (b.atkCd <= 0) {
              b.atkCd = b.phase2 ? 2.1 : 3.0;
              b.telegraphX = h.x;
              b.telegraphY = h.y;
              b.telegraphR = b.phase2 ? 115 : 95;
              b.telegraphMax = b.phase2 ? 0.95 : 1.15;
              b.telegraphTimer = b.telegraphMax;

              // Also fire radial orbs in Phase 2
              if (b.phase2) {
                for (var o = 0; o < 4; o++) {
                  var oa = (o / 4) * Math.PI * 2 + this.elapsed;
                  this.projectiles.push({
                    x: b.x, y: b.y, vx: Math.cos(oa) * 190, vy: Math.sin(oa) * 190,
                    dmg: Math.round(b.atk * 0.8), r: 10, life: 2.4, color: '#ef4444'
                  });
                }
              }
            }
          }
        }
      }

      // Enemy Projectiles
      for (var pi = this.projectiles.length - 1; pi >= 0; pi--) {
        var pr = this.projectiles[pi];
        pr.x += pr.vx * dt;
        pr.y += pr.vy * dt;
        pr.life -= dt;
        if (dist(pr.x, pr.y, h.x, h.y) < h.r + pr.r) {
          this.damageHero(pr.dmg);
          this.projectiles.splice(pi, 1);
          continue;
        }
        if (pr.life <= 0) this.projectiles.splice(pi, 1);
      }

      // VFX & Float Texts
      for (var ei = this.effects.length - 1; ei >= 0; ei--) {
        this.effects[ei].life -= dt;
        if (this.effects[ei].life <= 0) this.effects.splice(ei, 1);
      }
      for (var fi = this.floatTexts.length - 1; fi >= 0; fi--) {
        this.floatTexts[fi].y -= 32 * dt;
        this.floatTexts[fi].life -= dt;
        if (this.floatTexts[fi].life <= 0) this.floatTexts.splice(fi, 1);
      }

      if (this.hooks.onTickHud) {
        this.hooks.onTickHud(this.hero, this.boss, this.skillCooldowns, this.findNearestInteractable());
      }
    },

    render: function () {
      if (!this.ctx || !this.zone) return;
      var ctx = this.ctx;
      var z = this.zone;
      var S = root.COG.Sprites;
      var st = root.COG.State.get();

      S.drawBiomeGround(ctx, z, this.cam.x, this.cam.y, VIEW_W, VIEW_H, this.elapsed);

      ctx.save();
      ctx.translate(-this.cam.x, -this.cam.y);

      var extraState = {
        rainbowActive: !!st.defeatedBosses['boss_leviathan'],
        tabernacleLit: !!st.defeatedBosses['boss_amalek']
      };
      this.landmarks.forEach(function (lm) {
        S.drawLandmark(ctx, lm, this.elapsed, extraState);
      }, this);

      var nearest = this.findNearestInteractable();

      this.interactables.forEach(function (nd) {
        S.drawInteractable(ctx, nd, this.elapsed, nearest && nearest.ref === nd);
      }, this);

      this.npcs.forEach(function (npc) {
        S.drawNpc(ctx, npc, this.elapsed, nearest && nearest.ref === npc);
      }, this);

      this.enemies.forEach(function (en) {
        S.drawEnemy(ctx, en, this.elapsed);
      }, this);

      if (this.boss && this.boss.hp > 0) {
        S.drawBoss(ctx, this.boss, this.elapsed);
      }

      // Hero & Floating Angel Companion
      S.drawHero(ctx, this.hero, this.elapsed);
      S.drawCompanion(ctx, this.companion, root.COG.State.getActiveGuide(), this.elapsed);

      // Projectiles
      this.projectiles.forEach(function (pr) {
        ctx.fillStyle = pr.color;
        ctx.beginPath(); ctx.arc(pr.x, pr.y, pr.r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      });

      // VFX Rings & Beams
      this.effects.forEach(function (ef) {
        if (ef.kind === 'ring') {
          var t = 1 - ef.life / 0.4;
          var r = ef.r + (ef.maxR - ef.r) * clamp(t, 0, 1);
          ctx.strokeStyle = ef.color;
          ctx.globalAlpha = Math.max(0, ef.life * 2);
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(ef.x, ef.y, r, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
        } else if (ef.kind === 'beam') {
          ctx.save();
          ctx.translate(ef.x, ef.y);
          ctx.rotate(ef.angle);
          ctx.fillStyle = ef.color;
          ctx.globalAlpha = Math.max(0, ef.life * 3);
          ctx.fillRect(10, -10, ef.range, 20);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(10, -4, ef.range, 8);
          ctx.restore();
        }
      });

      // Floating Prompt Bubble near interactables
      if (nearest) {
        ctx.fillStyle = 'rgba(11, 19, 43, 0.88)';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.fillRect(nearest.x - 56, nearest.y - 62, 112, 24);
        ctx.strokeRect(nearest.x - 56, nearest.y - 62, 112, 24);
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(root.COG.i18n.t('ui.interactPrompt'), nearest.x, nearest.y - 46);
      }

      // Floating Damage / Heal numbers
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      this.floatTexts.forEach(function (ft) {
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      });

      ctx.restore();

      // Corner Minimap (top-left of canvas)
      this.renderMinimap(ctx);
    },

    renderMinimap: function (ctx) {
      var z = this.zone;
      var mw = 168;
      var mh = 112;
      var mx = 14;
      var my = 14;
      var sx = mw / z.width;
      var sy = mh / z.height;

      ctx.save();
      ctx.fillStyle = 'rgba(7, 11, 26, 0.78)';
      ctx.fillRect(mx, my, mw, mh);
      ctx.strokeStyle = 'rgba(230, 185, 92, 0.75)';
      ctx.lineWidth = 2;
      ctx.strokeRect(mx, my, mw, mh);

      // Camera viewport box
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(mx + this.cam.x * sx, my + this.cam.y * sy, VIEW_W * sx, VIEW_H * sy);

      // Quest nodes (cyan)
      ctx.fillStyle = '#38bdf8';
      this.interactables.forEach(function (nd) {
        ctx.beginPath(); ctx.arc(mx + nd.x * sx, my + nd.y * sy, 2.8, 0, Math.PI * 2); ctx.fill();
      });
      // NPCs (gold)
      ctx.fillStyle = '#facc15';
      this.npcs.forEach(function (n) {
        ctx.beginPath(); ctx.arc(mx + n.x * sx, my + n.y * sy, 3.5, 0, Math.PI * 2); ctx.fill();
      });
      // Enemies (orange-red)
      ctx.fillStyle = '#f87171';
      this.enemies.forEach(function (en) {
        ctx.beginPath(); ctx.arc(mx + en.x * sx, my + en.y * sy, 2.8, 0, Math.PI * 2); ctx.fill();
      });
      // Boss (large crimson dot)
      if (this.boss && this.boss.hp > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(mx + this.boss.x * sx, my + this.boss.y * sy, 5.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      // Hero (bright white/green dot)
      ctx.fillStyle = '#4ade80';
      ctx.beginPath(); ctx.arc(mx + this.hero.x * sx, my + this.hero.y * sy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  };

  root.COG.RpgEngine = RpgEngine;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RpgEngine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
