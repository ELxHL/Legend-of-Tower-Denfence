// ============================================================
// RENDERER - Canvas 2D, tu fit ban do thiet ke 1280x768 vao man hinh
// (letterbox), ho tro DPR cua man hinh retina va hieu ung rung man hinh.
// ============================================================
export class Renderer {
  constructor(canvas, designW = 1280, designH = 768) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.designW = designW;
    this.designH = designH;
    this.view = 1;
    this.offX = 0;
    this.offY = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.dpr = 1;
    this.cssW = 0;
    this.cssH = 0;
    this.resize();
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.dpr = dpr;
    this.cssW = w;
    this.cssH = h;
    this.view = Math.min(w / this.designW, h / this.designH);
    this.offX = (w - this.designW * this.view) / 2;
    this.offY = (h - this.designH * this.view) / 2;
  }

  // Bat dau khung hinh: don man hinh + dat transform sang khong gian thiet ke
  begin() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssW, this.cssH);
    ctx.save();
    ctx.translate(this.offX + this.shakeX, this.offY + this.shakeY);
    ctx.scale(this.view, this.view);
  }

  end() { this.ctx.restore(); }

  // Gioi han ve trong phan ban do (cat phan letterbox)
  clipDesign() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.rect(0, 0, this.designW, this.designH);
    ctx.clip();
  }

  // Chuyen toa do man hinh (client) sang toa do thiet ke
  toWorld(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left - this.offX - this.shakeX) / this.view,
      y: (clientY - r.top - this.offY - this.shakeY) / this.view
    };
  }
}
