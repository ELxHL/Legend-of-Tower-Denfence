// ============================================================
// ANIMATION ENGINE - Bo xu ly sprite sheet.
// Khong mac dinh moi sheet cung so frame: moi cau hinh co frameW/frameH,
// cols/rows, count, fps va danh sach animation (idle/walk/attack/death/skill...).
// Neu khong co animations -> toan bo sheet chay lap la 'idle'.
// ============================================================
export class SpriteAnimator {
  constructor(img, cfg) {
    if (!img) throw new Error('SpriteAnimator cần ảnh');
    this.img = img;
    this.cfg = cfg || {};
    this.frameW = this.cfg.frameW || img.width;
    this.frameH = this.cfg.frameH || img.height;
    if (!(this.frameW > 0) || !(this.frameH > 0)) throw new Error('Kích thước frame không hợp lệ');
    this.cols = this.cfg.cols || Math.max(1, Math.floor(img.width / this.frameW));
    this.rows = this.cfg.rows || Math.max(1, Math.floor(img.height / this.frameH));
    this.count = this.cfg.count || (this.cols * this.rows);
    this.count = Math.max(1, Math.min(this.count, this.cols * this.rows));

    const anims = this.cfg.animations || {};
    const baseFps = this.cfg.fps || 8;
    this.anims = {};
    if (!Object.keys(anims).length) {
      this.anims.idle = { start: 0, end: this.count - 1, fps: baseFps, loop: true };
    } else {
      for (const k of Object.keys(anims)) {
        const a = anims[k];
        if (!Array.isArray(a) || a.length < 2) continue;
        this.anims[k] = {
          start: Math.max(0, Math.min(a[0], this.count - 1)),
          end: Math.max(0, Math.min(a[1], this.count - 1)),
          fps: a[2] || baseFps,
          loop: a[3] !== false
        };
      }
      if (!this.anims.idle) this.anims.idle = { start: 0, end: this.count - 1, fps: baseFps, loop: true };
    }

    this.curName = this.cfg.defaultAnim || Object.keys(this.anims)[0] || 'idle';
    this.cur = this.anims[this.curName] || this.anims.idle;
    this.t = 0;
    this.frame = this.cur.start;
    this.done = false;
  }

  play(name) {
    if (this.anims[name] && this.curName !== name) {
      this.curName = name;
      this.cur = this.anims[name];
      this.t = 0;
      this.frame = this.cur.start;
      this.done = false;
    }
  }

  update(dt) {
    this.t += dt;
    const f = this.cur;
    const span = f.end - f.start + 1;
    const idx = Math.floor(this.t * f.fps);
    if (f.loop) {
      this.frame = f.start + (idx % span);
    } else {
      const i = f.start + idx;
      if (i >= f.end) { this.frame = f.end; this.done = true; }
      else this.frame = i;
    }
  }

  // Ve frame hien tai voi tam la (x, y) - anchor bottom-center khi anchorY=1
  draw(ctx, x, y, opts) {
    const o = opts || {};
    const scale = o.scale == null ? 1 : o.scale;
    const flip = !!o.flip;
    const col = this.frame % this.cols;
    const row = Math.floor(this.frame / this.cols);
    const ax = this.frameW / 2;
    const ay = o.anchorY === 0.5 ? this.frameH / 2 : this.frameH * 0.9;
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-scale, scale); else ctx.scale(scale, scale);
    ctx.drawImage(this.img, col * this.frameW, row * this.frameH, this.frameW, this.frameH, -ax, -ay, this.frameW, this.frameH);
    ctx.restore();
  }
}

// Tao animator tu asset manager; tra ve null neu khong co anh (dung placeholder).
export function createAnimator(assets, animCfg) {
  if (!assets || !animCfg || !animCfg.assetId) return null;
  const img = assets.get(animCfg.assetId);
  if (!img) return null;
  try { return new SpriteAnimator(img, animCfg); }
  catch (e) { console.warn('[Anim] cấu hình lỗi:', e); return null; }
}
