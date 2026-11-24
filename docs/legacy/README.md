# Bản lưu trữ phiên bản cũ

Trước khi xây dựng **CAO SON TOWER DEFENSE**, nhánh `main` của repository này chứa
ứng dụng **Cao Sơn AI Studio V4** (một trang quản lý workspace, viết trong một file `index.html` duy nhất).

File gốc KHÔNG bị mất: nó vẫn được lưu vĩnh viễn trong lịch sử Git của repository.

## Cách xem lại bản cũ

- Xem trực tuyến (bản raw):
  https://github.com/ELxHL/Legend-of-Tower-Denfence/blob/b2518a37ce9cadbc51e34162f49bd1351ee422dc/index.html
- Lệnh khôi phục về máy (git):

```bash
git checkout b2518a37ce9cadbc51e34162f49bd1351ee422dc -- index.html
```

## Cách khôi phục thành trang chủ

```bash
git checkout b2518a37ce9cadbc51e34162f49bd1351ee422dc -- index.html
git commit -m "Restore Cao Son AI Studio V4"
git push
```
