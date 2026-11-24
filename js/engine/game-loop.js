// ============================================================
// GAME LOOP - requestAnimationFrame, buoc cap nhat co dinh (fixed timestep).
// Ho tro tam dung (paused) va toc do game 0.5x / 1x / 2x / 3x.
// Logic gameplay chay trong update(dt), hinh anh trong render().
// ============================================================
export class GameLoop {
  constructor(opts) {
    const o = opts || {};
    this.update = o.update || (() => {});
    this.render = o.render || (() => {});
    this.fixedDt = o.fixedDt || 1 / 60;
    this.acc = 0;
    this.last = 0;
    this.raf = 0;
    this.running = false;
    this.paused = false;
    this.speed = 1;
    this.fps = 0;
    this._fpsN = 0;
    this._fpsT = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (t) => {
      if (!this.running) return;
      this._tick(t);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  setSpeed(v) { this.speed = Math.max(0.1, v); }
  setPaused(p) { this.paused = !!p; }

  _tick(t) {
    const dt = Math.min(0.1, (t - this.last) / 1000);
    this.last = t;

    // dem FPS
    this._fpsN++; this._fpsT += dt;
    if (this._fpsT >= 0.5) {
      this.fps = Math.round(this._fpsN / this._fpsT);
      this._fpsN = 0; this._fpsT = 0;
    }

    if (!this.paused) {
      this.acc += dt * this.speed;
      let steps = 0;
      while (this.acc >= this.fixedDt && steps < 12) {
        this.update(this.fixedDt);
        this.acc -= this.fixedDt;
        steps++;
      }
      if (steps >= 12) this.acc = 0; // tranh domino khi may tre
    }
    this.render();
  }
}
