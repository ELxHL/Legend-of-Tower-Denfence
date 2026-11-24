# Thư mục tài nguyên CAO SON TOWER DEFENSE

Đây là nơi bạn đặt hình ảnh PNG cho game. Mỗi thư mục con dành cho một nhóm tài nguyên:

| Thư mục | Dành cho |
|---|---|
| `heroes/` | Nhân vật chính / hero (dành cho bản mở rộng) |
| `monsters/` | Quái vật, Boss |
| `towers/` | Tháp phòng thủ |
| `projectiles/` | Đạn, mũi tên, cầu lửa... |
| `effects/` | Hiệu ứng nổ, sét, băng... |
| `backgrounds/` | Ảnh nền toàn cảnh của bản đồ |
| `maps/` | Gói tài nguyên bản đồ riêng |
| `ui/` | Nút, khung, biểu tượng giao diện |

## Cách 1 - Không cần sửa code (khuyên dùng)

Mở game, vào **GAME CREATOR > Tài nguyên > Nhập ảnh PNG**.
Ảnh được lưu vào IndexedDB của trình duyệt, có thể gán thẳng vào quái/tháp/bản đồ.

## Cách 2 - Đưa vào repo (chạy được trên mọi máy)

1. Đặt file PNG vào thư mục phù hợp, ví dụ `assets/monsters/orc-lord.png`.
2. Mở `js/data/asset-registry.js` và thêm một dòng đăng ký (đây là nơi DUY NHẤT khai báo đường dẫn ảnh trong toàn bộ mã nguồn).
3. Mở GAME CREATOR và gán ảnh cho quái/tháp, hoặc sửa trực tiếp cấu hình.

## Quy tắc sprite sheet

- Các frame nằm ngang trên MỘT hàng, mỗi frame cùng kích thước.
- Khai báo: `frameW`, `frameH`, `cols` (số cột), `rows` (số hàng), `count` (số frame thực dùng), `fps`.
- Game KHÔNG giả định mọi sheet cùng số frame - mỗi tài nguyên có cấu hình riêng.
- Ảnh chưa có sẽ được thay bằng hình vẽ Canvas tạm (có nhãn PLACEHOLDER khi bật trong Cài đặt).
