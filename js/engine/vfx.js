(function (root) {
  'use strict';
  root.COG = root.COG || {};

  function createManager() {
    var bursts = [];
    var dusts = [];
    var rings = [];
    var orbs = [];
    var ghosts = [];
    var popups = [];

    return {
      spawnBurst: function (x, y, color, count, speed, size, gravity) {
        var n = count || 10;
        var baseSpd = speed || 110;
        var baseSz = size || 4.2;
        var g = gravity || 0;
        for (var i = 0; i < n; i++) {
          var a = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.55;
          var sp = baseSpd * (0.55 + Math.random() * 0.7);
          bursts.push({
            x: x,
            y: y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - (g > 0 ? 45 : 0),
            g: g,
            color: color || '#fde047',
            size: baseSz * (0.75 + Math.random() * 0.55),
            life: 0.36 + Math.random() * 0.22,
            maxLife: 0.52
          });
        }
      },

      spawnDust: function (x, y, count) {
        var n = count || 2;
        for (var i = 0; i < n; i++) {
          dusts.push({
            x: x + (Math.random() - 0.5) * 14,
            y: y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 26,
            vy: -14 - Math.random() * 18,
            r: 4 + Math.random() * 4.5,
            life: 0.35 + Math.random() * 0.18,
            maxLife: 0.5
          });
        }
      },

      spawnRing: function (x, y, color, maxR, duration) {
        rings.push({
          x: x,
          y: y,
          color: color || '#fde047',
          maxR: maxR || 90,
          life: duration || 0.45,
          maxLife: duration || 0.45
        });
      },

      spawnOrb: function (sx, sy, tx, ty, color, duration, onArrive) {
        orbs.push({
          sx: sx,
          sy: sy,
          tx: tx,
          ty: ty,
          color: color || '#fde047',
          elapsed: 0,
          duration: duration || 0.48,
          onArrive: onArrive || null
        });
      },

      addAfterimage: function (sheetKey, frameIdx, x, y, opts) {
        opts = opts || {};
        ghosts.push({
          key: sheetKey,
          frame: frameIdx || 0,
          x: x,
          y: y,
          height: opts.height || 92,
          flipX: !!opts.flipX,
          tint: opts.tint || null,
          life: opts.duration || 0.22,
          maxLife: opts.duration || 0.22
        });
      },

      addPopup: function (x, y, text, color, scale) {
        popups.push({
          x: x,
          y: y,
          text: String(text),
          color: color || '#fde047',
          scale: scale || 1,
          age: 0,
          life: 0.88,
          maxLife: 0.88
        });
      },

      update: function (dt) {
        for (var i = bursts.length - 1; i >= 0; i--) {
          var p = bursts[i];
          p.vy += p.g * dt;
          p.vx *= Math.max(0, 1 - 2.6 * dt);
          p.vy *= Math.max(0, 1 - 1.8 * dt);
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) bursts.splice(i, 1);
        }

        for (var d = dusts.length - 1; d >= 0; d--) {
          var du = dusts[d];
          du.x += du.vx * dt;
          du.y += du.vy * dt;
          du.r += 10 * dt;
          du.life -= dt;
          if (du.life <= 0) dusts.splice(d, 1);
        }

        for (var r = rings.length - 1; r >= 0; r--) {
          rings[r].life -= dt;
          if (rings[r].life <= 0) rings.splice(r, 1);
        }

        for (var o = orbs.length - 1; o >= 0; o--) {
          var ob = orbs[o];
          ob.elapsed += dt;
          if (ob.elapsed >= ob.duration) {
            if (typeof ob.onArrive === 'function') ob.onArrive();
            this.spawnBurst(ob.tx, ob.ty, ob.color, 6, 70, 3.2);
            orbs.splice(o, 1);
          }
        }

        for (var g = ghosts.length - 1; g >= 0; g--) {
          ghosts[g].life -= dt;
          if (ghosts[g].life <= 0) ghosts.splice(g, 1);
        }

        for (var k = popups.length - 1; k >= 0; k--) {
          var pp = popups[k];
          pp.age += dt;
          pp.y -= 34 * dt;
          pp.life -= dt;
          if (pp.life <= 0) popups.splice(k, 1);
        }
      },

      renderBack: function (ctx) {
        var Sp = root.COG.Sprites;
        for (var g = 0; g < ghosts.length; g++) {
          var gh = ghosts[g];
          var ratio = Math.max(0, gh.life / gh.maxLife);
          if (Sp && Sp.drawAnimFrame && gh.key.indexOf('_sheet') !== -1) {
            Sp.drawAnimFrame(ctx, gh.key, gh.frame, gh.x, gh.y, {
              height: gh.height,
              flipX: gh.flipX,
              alpha: 0.42 * ratio,
              noShadow: true,
              hitFlash: true
            });
          } else if (Sp && Sp.drawSprite) {
            Sp.drawSprite(ctx, gh.key, gh.x, gh.y, {
              height: gh.height,
              flipX: gh.flipX,
              alpha: 0.38 * ratio,
              noShadow: true
            });
          }
        }

        for (var d = 0; d < dusts.length; d++) {
          var du = dusts[d];
          var alpha = Math.max(0, du.life / du.maxLife) * 0.55;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.arc(du.x, du.y, du.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      },

      renderFront: function (ctx) {
        for (var r = 0; r < rings.length; r++) {
          var rg = rings[r];
          var prog = 1 - Math.max(0, rg.life / rg.maxLife);
          var rad = 12 + prog * rg.maxR;
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - prog);
          ctx.strokeStyle = rg.color;
          ctx.lineWidth = 6 * (1 - prog * 0.5);
          ctx.beginPath();
          ctx.arc(rg.x, rg.y, rad, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(rg.x, rg.y, rad * 0.72, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        for (var o = 0; o < orbs.length; o++) {
          var ob = orbs[o];
          var u = Math.min(1, ob.elapsed / ob.duration);
          var inv = 1 - u;
          var cx = (ob.sx + ob.tx) * 0.5;
          var cy = Math.min(ob.sy, ob.ty) - 56;
          var px = inv * inv * ob.sx + 2 * inv * u * cx + u * u * ob.tx;
          var py = inv * inv * ob.sy + 2 * inv * u * cy + u * u * ob.ty;
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = ob.color;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        for (var i = 0; i < bursts.length; i++) {
          var p = bursts[i];
          var a = Math.max(0, p.life / p.maxLife);
          ctx.save();
          ctx.globalAlpha = a;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.5 + a * 0.5), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        for (var k = 0; k < popups.length; k++) {
          var pp = popups[k];
          var pop = pp.age < 0.12 ? (0.7 + (pp.age / 0.12) * 0.5) : (1.2 - Math.min(0.2, (pp.age - 0.12) * 0.8));
          var sc = pp.scale * pop;
          ctx.save();
          ctx.globalAlpha = Math.min(1, (pp.life / pp.maxLife) * 1.4);
          ctx.translate(pp.x, pp.y);
          ctx.scale(sc, sc);
          ctx.font = '900 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 4.5;
          ctx.strokeStyle = '#291709';
          ctx.strokeText(pp.text, 0, 0);
          ctx.fillStyle = pp.color;
          ctx.fillText(pp.text, 0, 0);
          ctx.restore();
        }
      }
    };
  }

  root.COG.VFX = {
    createManager: createManager
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.COG.VFX;
  }
})(typeof window !== 'undefined' ? window : globalThis);
