// ============================================================
// COLLISION - phep tinh hinh hoc dung chung (khong phu thuoc canvas).
// ============================================================
export const circleHit = (ax, ay, ar, bx, by, br) => {
  const dx = bx - ax, dy = by - ay, r = ar + br;
  return dx * dx + dy * dy <= r * r;
};

export const pointInCircle = (px, py, cx, cy, cr) => {
  const dx = px - cx, dy = py - cy;
  return dx * dx + dy * dy <= cr * cr;
};

export const pointInRect = (px, py, x, y, w, h) =>
  px >= x && px <= x + w && py >= y && py <= y + h;

// Khoang cach tu diem P den doan thang AB - dung de kiem tra vi tri xay
// co nam tren duong di cua quai hay khong.
export function segPointDist(ax, ay, bx, by, px, py) {
  const dx = bx - ax, dy = by - ay;
  const L = dx * dx + dy * dy;
  let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}
