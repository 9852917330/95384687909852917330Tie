# Tiền của Điền

PWA thủ công gồm 3 trang:
- EUR: VND → USDT → EUR → VND
  - USDT/VND → nhận USDT
  - USDT/EUR → nhận EUR
  - EUR/VND → nhận VND
- TRY: TRY → EUR → USDT → TRY
  - EUR/TRY → nhận EUR
  - USDT/EUR → nhận USDT
  - USDT/TRY → nhận TRY
- JPY: VND → JPY → USDT → VND
  - JPY/VND → nhận JPY
  - USDT/JPY → nhận USDT
  - USDT/VND → nhận VND

Không lấy giá live, không tính phí. Mỗi tab lưu riêng vốn và 3 tỷ giá trên thiết bị.

- `worker.js`: dán vào Cloudflare Worker để deploy.
- `offline-calculator.html`: mở trực tiếp để dùng offline.


## GitHub Pages
Upload/copy the extracted files so `index.html` is at the repository root. Then Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save. Open `https://USERNAME.github.io/REPOSITORY/`.
