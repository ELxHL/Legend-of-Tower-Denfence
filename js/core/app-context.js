// Ngữ cảnh toàn cục: mọi module đọc/ghi qua App để tránh import vòng.
export const App = {
  version: 'V1',
  bus: null,       // EventBus — được gán trong main.js
  config: null,    // cấu hình hợp nhất (DEFAULT + user)
  assets: null,    // AssetManager
  save: null,      // SaveManager (IndexedDB)
  session: null,   // GameSession đang chạy (null khi ngoài trận)
  screens: null,   // ScreenManager
  progress: null,  // snapshot tiến trình cho TIẾP TỤC
  canvas: null,    // phần tử canvas trận đấu
  lastMapId: null, // bản đồ gần nhất để CHƠI LẠI
  settings: { showPlaceholders: true },
};

export function emit(ev, data) {
  if (App.bus) App.bus.emit(ev, data);
}

export function toast(msg) {
  emit('toast', typeof msg === 'string' ? { text: msg } : msg);
}
