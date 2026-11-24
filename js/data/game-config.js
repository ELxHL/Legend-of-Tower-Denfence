// ============================================================
// CAO SON TOWER DEFENSE - CAU HINH MAC DINH (V1)
// Moi noi dung o day deu co the sao chep / chinh sua qua GAME CREATOR
// ma khong can sua file nay. Du lieu nguoi dung duoc luu rieng tren
// IndexedDB va duoc gop (merge) len phan mac dinh khi khoi dong.
// Don vi: khoang cach = pixel (thiet ke 1280x768, o 64px), thoi gian = giay.
// ============================================================

export const CONFIG_VERSION = 1;

// Ham tao ngan cho danh sach wave: g = nhom quai, W = mot dot
const g = (monster, count, interval, delay = 0) => ({ monster, count, interval, delay });
const W = (groups, prep = 0) => ({ prep, groups });

export const DEFAULT_CONFIG = {
  meta: {
    name: 'CAO SON TOWER DEFENSE',
    version: CONFIG_VERSION,
    designW: 1280, designH: 768, tile: 64,
    baseHp: 100, startGold: 240,
    sellRatio: 0.6,        // ti le vang hoan khi ban thap
    minDamage: 1,          // sat thuong toi thieu sau khi tru giap
    earlyCallRate: 4,      // vang thuong moi giay khi goi som dot quai
    waveBonusBase: 18, waveBonusPerWave: 2,
    prepFirst: 20, prepNext: 12,
    hpScaleFromWave: 10, hpScalePerWave: 0.08 // quai tang HP tu dot 10
  },

  // ---------------- QUAI VAT (placeholder ve Canvas, doi anh that qua Creator) ----------------
  monsters: {
    slime:    { id: 'slime',    name: 'Slime Rừng',        hp: 42,   speed: 40,  armor: 0,  bounty: 6,   damage: 1,  size: 14, art: 'slime' },
    goblin:   { id: 'goblin',   name: 'Goblin Kẻ Cướp',    hp: 60,   speed: 72,  armor: 2,  bounty: 8,   damage: 1,  size: 13, art: 'goblin' },
    wolf:     { id: 'wolf',     name: 'Sói Rừng Xám',      hp: 95,   speed: 108, armor: 2,  bounty: 11,  damage: 1,  size: 14, art: 'wolf' },
    bat:      { id: 'bat',      name: 'Dơi Bóng Ma',       hp: 70,   speed: 96,  armor: 1,  bounty: 10,  damage: 1,  size: 12, art: 'bat' },
    orc:      { id: 'orc',      name: 'Orc Chiến Binh',    hp: 150,  speed: 48,  armor: 6,  bounty: 14,  damage: 2,  size: 16, art: 'orc' },
    knight:   { id: 'knight',   name: 'Hiệp Sĩ Đen',       hp: 280,  speed: 40,  armor: 12, bounty: 20,  damage: 3,  size: 16, art: 'knight' },
    golem:    { id: 'golem',    name: 'Golem Đá Khổng Lồ', hp: 1500, speed: 27,  armor: 10, bounty: 120, damage: 8,  size: 22, art: 'golem', boss: true },
    behemoth: { id: 'behemoth', name: 'Behemoth Vực Sâu',  hp: 3800, speed: 23,  armor: 16, bounty: 260, damage: 15, size: 26, art: 'behemoth', boss: true }
  },

  // ---------------- THAP (kind: 'proj' = dan bay, 'beam' = tia truc tiep) ----------------
  towers: {
    archer: {
      id: 'archer', name: 'Tháp Cung Thủ', desc: 'Bắn nhanh vào một mục tiêu, tầm xa.',
      art: 'archer', kind: 'proj',
      projectile: { speed: 330, size: 3, color: '#e8d9a0' },
      levels: [
        { damage: 12, range: 110, rate: 1.1,  cost: 70, upgradeCost: 55 },
        { damage: 24, range: 124, rate: 1.25, upgradeCost: 110 },
        { damage: 46, range: 140, rate: 1.4 }
      ]
    },
    cannon: {
      id: 'cannon', name: 'Tháp Pháo Bồi', desc: 'Đạn nổ gây sát thương diện rộng.',
      art: 'cannon', kind: 'proj',
      projectile: { speed: 190, size: 6, color: '#2f2f33', arc: true, splash: 46 },
      levels: [
        { damage: 26, range: 96,  rate: 0.55, cost: 110, upgradeCost: 90,  splash: 46 },
        { damage: 52, range: 106, rate: 0.6,  upgradeCost: 170, splash: 54 },
        { damage: 95, range: 116, rate: 0.65, splash: 62 }
      ]
    },
    frost: {
      id: 'frost', name: 'Tháp Băng Tinh', desc: 'Làm chậm mục tiêu bị trúng đạn.',
      art: 'frost', kind: 'proj',
      projectile: { speed: 260, size: 4, color: '#9fdcff', slow: { factor: 0.65, duration: 1.6 } },
      levels: [
        { damage: 8,  range: 100, rate: 0.9, cost: 90, upgradeCost: 75,  slow: { factor: 0.65, duration: 1.6 } },
        { damage: 16, range: 112, rate: 1.0, upgradeCost: 150, slow: { factor: 0.5,  duration: 1.8 } },
        { damage: 30, range: 124, rate: 1.1, slow: { factor: 0.4,  duration: 2.0 } }
      ]
    },
    tesla: {
      id: 'tesla', name: 'Tháp Sấm Sét', desc: 'Tia sét đánh tức thời, tốc độ rất cao.',
      art: 'tesla', kind: 'beam',
      levels: [
        { damage: 18, range: 88,  rate: 1.6, cost: 130, upgradeCost: 105 },
        { damage: 34, range: 98,  rate: 1.7, upgradeCost: 200 },
        { damage: 62, range: 108, rate: 1.8 }
      ]
    }
  },

  // ---------------- 20 DOT QUAI (Boss o dot 8, 13, 16, 20) ----------------
  waves: [
    W([g('slime', 8, 1.1)], 20),
    W([g('slime', 6, 0.9), g('goblin', 6, 0.85, 2)]),
    W([g('goblin', 12, 0.7)]),
    W([g('slime', 10, 0.6), g('goblin', 8, 0.7, 2)]),
    W([g('goblin', 10, 0.6), g('wolf', 4, 1.0, 4)]),
    W([g('wolf', 10, 0.7), g('slime', 8, 0.5, 1)]),
    W([g('bat', 12, 0.6), g('goblin', 6, 0.7, 3)]),
    W([g('golem', 1, 1), g('goblin', 10, 0.6, 2)], 14),
    W([g('orc', 8, 1.0), g('wolf', 6, 0.7, 2)]),
    W([g('orc', 10, 0.9), g('bat', 8, 0.6, 2)]),
    W([g('knight', 4, 1.4), g('goblin', 12, 0.5, 1)], 13),
    W([g('knight', 6, 1.2), g('wolf', 8, 0.6, 2)]),
    W([g('behemoth', 1, 1), g('orc', 6, 1.0, 3)], 15),
    W([g('orc', 12, 0.8), g('bat', 10, 0.5, 2)]),
    W([g('knight', 8, 1.0), g('slime', 12, 0.4, 1)]),
    W([g('golem', 2, 6), g('knight', 6, 1.1, 2), g('bat', 8, 0.5, 4)], 16),
    W([g('wolf', 16, 0.45), g('knight', 6, 1.1, 3)]),
    W([g('orc', 14, 0.7), g('knight', 8, 0.9, 2)]),
    W([g('bat', 18, 0.4), g('knight', 8, 0.9, 2), g('wolf', 10, 0.5, 4)]),
    W([g('behemoth', 1, 1), g('golem', 1, 8, 6), g('orc', 10, 0.8, 2), g('knight', 8, 0.9, 8)], 18)
  ],

  // ---------------- BAN DO (path = duong di theo o luoi, spots = vi tri xay thap) ----------------
  maps: [
    {
      id: 'map-oak', name: 'Rừng Sồi Cổ', theme: 'forest', cols: 20, rows: 12,
      path: [[-1, 2], [14, 2], [14, 6], [5, 6], [5, 10], [19, 10]],
      spots: [[1, 3], [4, 1], [6, 1], [8, 1], [10, 1], [12, 1], [16, 3], [16, 6], [3, 4], [7, 4], [11, 4], [3, 7], [7, 8], [11, 8], [15, 8], [17, 9]]
    },
    {
      id: 'map-pass', name: 'Đèo Núi Sương', theme: 'mountain', cols: 20, rows: 12,
      path: [[-1, 10], [3, 10], [3, 6], [8, 6], [8, 9], [12, 9], [12, 3], [6, 3], [6, 1], [19, 1]],
      spots: [[1, 8], [4, 8], [5, 4], [1, 4], [10, 7], [14, 7], [16, 9], [6, 11], [9, 11], [15, 11], [5, 10], [10, 10], [14, 4], [15, 3], [4, 3], [8, 2]]
    },
    {
      id: 'map-desert', name: 'Sa Mạc Hoang Tà', theme: 'desert', cols: 20, rows: 12,
      path: [[-1, 1], [17, 1], [17, 4], [2, 4], [2, 7], [17, 7], [17, 10], [3, 10]],
      spots: [[4, 2], [7, 2], [10, 2], [13, 2], [4, 5], [7, 5], [10, 5], [13, 5], [4, 8], [7, 8], [10, 8], [13, 8], [18, 2], [18, 5], [18, 8], [0, 5]]
    }
  ]
};

export function cloneDefaultConfig() {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

// Kiem tra mot dinh nghia ban do (thuat toan thuan, khong phu thuoc DOM)
export function validateMapDef(mp, tile = 64) {
  const errs = [];
  if (!mp || !mp.id) { errs.push('Bản đồ thiếu id'); return errs; }
  if (!Array.isArray(mp.path) || mp.path.length < 2) errs.push('Bản đồ ' + mp.id + ': đường đi cần ít nhất 2 điểm');
  if (!Array.isArray(mp.spots)) errs.push('Bản đồ ' + mp.id + ': thiếu danh sách vị trí xây tháp');
  const cols = mp.cols || 20, rows = mp.rows || 12;
  const px = (p) => ({ x: (p[0] + 0.5) * tile, y: (p[1] + 0.5) * tile });
  const path = (mp.path || []).map(px);
  const segDist = (a, b, p) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const L = dx * dx + dy * dy;
    let t = L > 0 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / L : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
  };
  for (const s of (mp.spots || [])) {
    const c = px(s);
    if (s[0] < 0 || s[0] >= cols || s[1] < 0 || s[1] >= rows) {
      errs.push('Bản đồ ' + mp.id + ': vị trí xây ngoài lưới [' + s + ']');
      continue;
    }
    for (let i = 0; i < path.length - 1; i++) {
      if (segDist(path[i], path[i + 1], c) < tile * 0.85) {
        errs.push('Bản đồ ' + mp.id + ': vị trí xây [' + s + '] nằm trên đường đi');
        break;
      }
    }
  }
  return errs;
}

// Kiem tra toan bo cau hinh - tra ve { ok, errors }
export function validateConfig(cfg) {
  const errors = [];
  if (!cfg || typeof cfg !== 'object') return { ok: false, errors: ['Cấu hình rỗng'] };
  if (!cfg.meta) errors.push('Thiếu mục meta');
  if (!cfg.monsters || !Object.keys(cfg.monsters).length) errors.push('Không có loại quái vật nào');
  if (!cfg.towers || !Object.keys(cfg.towers).length) errors.push('Không có loại tháp nào');
  if (!Array.isArray(cfg.waves) || !cfg.waves.length) errors.push('Không có đợt quái nào');
  if (!Array.isArray(cfg.maps) || !cfg.maps.length) errors.push('Không có bản đồ nào');

  (cfg.waves || []).forEach((w, i) => {
    (w.groups || []).forEach((gg, j) => {
      if (!cfg.monsters[gg.monster]) errors.push('Đợt ' + (i + 1) + ' nhóm ' + (j + 1) + ': quái không tồn tại (' + gg.monster + ')');
      if (!(gg.count > 0)) errors.push('Đợt ' + (i + 1) + ' nhóm ' + (j + 1) + ': số lượng phải > 0');
      if (!(gg.interval > 0)) errors.push('Đợt ' + (i + 1) + ' nhóm ' + (j + 1) + ': thời gian xuất hiện phải > 0');
    });
  });

  Object.values(cfg.towers || {}).forEach((t) => {
    const id = t.id || '?';
    if (!Array.isArray(t.levels) || !t.levels.length) { errors.push('Tháp ' + id + ': thiếu cấp độ (levels)'); return; }
    t.levels.forEach((lv, i) => {
      if (!(lv.damage >= 0)) errors.push('Tháp ' + id + ' cấp ' + (i + 1) + ': sát thương không hợp lệ');
      if (!(lv.range > 0)) errors.push('Tháp ' + id + ' cấp ' + (i + 1) + ': tầm bắn phải > 0');
      if (!(lv.rate > 0)) errors.push('Tháp ' + id + ' cấp ' + (i + 1) + ': tốc độ đánh phải > 0');
      if (i === 0 && !(lv.cost >= 0)) errors.push('Tháp ' + id + ': thiếu giá xây ở cấp 1');
      if (i < t.levels.length - 1 && !(lv.upgradeCost >= 0)) errors.push('Tháp ' + id + ' cấp ' + (i + 1) + ': thiếu giá nâng cấp');
    });
    if (t.kind !== 'beam' && !t.projectile) errors.push('Tháp ' + id + ': cần cấu hình đạn (projectile)');
  });

  Object.values(cfg.monsters || {}).forEach((m) => {
    const id = m.id || '?';
    if (!(m.hp > 0)) errors.push('Quái ' + id + ': hp phải > 0');
    if (!(m.speed > 0)) errors.push('Quái ' + id + ': tốc độ phải > 0');
  });

  (cfg.maps || []).forEach((mp) => errors.push(...validateMapDef(mp, (cfg.meta && cfg.meta.tile) || 64)));

  return { ok: errors.length === 0, errors };
}
