// ============================================================
// ASSET REGISTRY - NOI DUY NHAT khai bao anh nam trong repository.
// ============================================================
// Quy tac:
//  - Khong viet duong dan anh rai rac trong cac file code khac.
//  - Khi them anh moi vao thu muc assets/, them mot dong o day.
//  - An se duoc gan vao qua GAME CREATOR (tab Quai vat / Thap / Ban do)
//    hoac bang cach dat truong assetId trong cau hinh.
//
// Vi du dang ky mot anh tinh:
//   { id: 'monsters/orc-lord', type: 'image', src: 'assets/monsters/orc-lord.png', meta: { cat: 'monsters' } }
//
// Vi du dang ky mot sprite sheet 4 frame ngang, moi frame 64x64, 8 fps:
//   { id: 'monsters/goblin', type: 'spritesheet', src: 'assets/monsters/goblin.png',
//     meta: { cat: 'monsters', sheet: { frameW: 64, frameH: 64, cols: 4, rows: 1, count: 4, fps: 8 } } }
//
// Anh khong ton tai (sai duong dan / chua upload) se bi bo qua an toan,
// game dung HINH VE CANVAS TAM (placeholder) thay the, khong bao crash.
// ============================================================

export const DEFAULT_ASSET_DEFS = [
  // --- Them dong dang ky cua ban o duoi day ---
];
