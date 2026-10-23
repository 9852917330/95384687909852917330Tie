# Tiền của Điền v25

Chỉ giữ 7 tab theo thứ tự: **VND → TRY → GBP → CAD → JPY → RUB → CZK**.

| Tab | Vòng tiền | Ba cặp theo thứ tự |
| --- | --- | --- |
| VND | VND → USDT → EUR → VND | USDT/VND, USDT/EUR, EUR/VND |
| TRY | TRY → EUR → USDT → TRY | EUR/TRY, USDT/EUR, USDT/TRY |
| GBP | GBP → EUR → USDT → GBP | EUR/GBP, USDT/EUR, USDT/GBP |
| CAD | CAD → EUR → USDT → CAD | EUR/CAD, USDT/EUR, USDT/CAD |
| JPY | VND → JPY → USDT → VND | JPY/VND, USDT/JPY, USDT/VND |
| RUB | VND → RUB → USDT → VND | RUB/VND, USD/RUB, USDT/VND |
| CZK | CZK → EUR → USDT → CZK | EUR/CZK, USDT/EUR, USDT/CZK |

Vốn nhập bằng USD, có 7 lựa chọn nhanh $1000, $2000, $3000, $4000, $5000, $8000 và $10000. Vốn được quy đổi sang đồng đầu vòng; giá P2P lọc theo vốn, hạn mức và lượng USDT còn lại. Thương nhân cần hoàn tất 30 ngày từ 85% và phản hồi tích cực từ 97%; thiếu tỷ lệ thì bỏ quảng cáo.

Nguồn pháp định là ExchangeRate-API; giá USDT lấy riêng từ Binance. Web loại các cờ hạn chế mà nguồn có báo, nhưng nguồn công khai chưa xác minh được hạn chế riêng theo tài khoản Binance. Bước USD/RUB quy ước 1 USD = 1 USDT và có ghi trên giao diện. Kết quả ước tính, chưa trừ phí.

Nếu thiết bị đang nhớ một tab đã bỏ, web tự mở VND và giữ vốn USD đã lưu.

Giải nén, thay các file web cũ bằng các file cùng tên. Hosting tĩnh dùng index.html; có thể mở v25.html để kiểm tra phiên bản mới. Các trang v15.html đến v24.html và offline-calculator.html cũng đã được cập nhật. Nếu dùng Cloudflare Worker, thay toàn bộ worker.js.

Mỗi bản HTML đã nhúng CSS/JS. Cần kết nối mạng để lấy giá mới; một số trình duyệt có thể hạn chế truy cập API khi mở file trực tiếp.
