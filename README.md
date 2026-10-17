# Tiền của Điền v16

- Thứ tự tab: **CAD → TRY → VND → JPY → RUB**.
- Đổi tên tab EUR thành VND, giữ vòng **VND → USDT → EUR → VND**.
- Thêm RUB: **VND → RUB → USDT → VND**.
- Ba cặp của RUB theo đúng thứ tự: **RUB/VND, USD/RUB, USDT/VND**.
- Công thức RUB: `VND cuối = Vốn VND ÷ (RUB/VND) ÷ (USD/RUB) × (USDT/VND)`.
- Do cặp thứ hai là USD/RUB, phép tính RUB quy ước **1 USDT = 1 USD**. Đây là ước tính, không phản ánh mức chênh USD/USDT thực tế. Muốn tính chính xác theo giao dịch USDT cần giá mua USDT/RUB.

## Tỷ giá tự động

- Mặc định bật. Chỉ tự điền **CAD/VND, EUR/TRY, EUR/VND, JPY/VND, RUB/VND, USD/RUB**.
- Các cặp có USDT luôn nhập tay. USD không được dùng để điền các ô USDT.
- Nguồn: [ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free), không cần tài khoản hoặc API key, cập nhật khoảng một lần/ngày.
- Cặp A/B luôn là số B cho 1 A. Quy đổi chéo từ cùng một bảng gốc USD: `A/B = USD/B ÷ USD/A`.
- Hiện thời điểm nhà cung cấp cập nhật, theo giờ Việt Nam. Đây là tỷ giá tham khảo, không phải giá mua/bán của ngân hàng hay giá P2P có thể khớp lệnh. Kết quả chưa trừ phí.
- Tự kiểm tra khi mở web, quay lại ứng dụng, có mạng trở lại và khi đến kỳ dữ liệu mới. Không tạo tác vụ chạy nền khi web đã đóng.
- Bấm **Cập nhật** để kiểm tra lại, có giới hạn chống gửi yêu cầu liên tục. Trong lúc nguồn lỗi, giữ bảng tỷ giá đã lưu và hiện cảnh báo giá cũ; không tự thay bằng dữ liệu giả.
- Tắt **Tự động** để sửa các ô pháp định. Giá nhập tay trước đó được giữ riêng với dữ liệu tự động. Giá USDT và vốn từng tab vẫn được lưu.

## Cập nhật web hiện có

1. Giải nén gói, thay các file trong thư mục web cũ bằng các file cùng tên của bản này. Giữ nguyên tên miền/địa chỉ để dùng tiếp dữ liệu đã lưu trên điện thoại.
2. GitHub Pages hoặc hosting tĩnh: dùng `index.html` và các tài nguyên đi kèm. Có thể mở `v16.html` để xác nhận bản v16; đường dẫn `v15.html` cũng đã được cập nhật cho người dùng đang dùng bookmark cũ.
3. Dùng Cloudflare Worker: dán toàn bộ `worker.js`; các tài nguyên đã được nhúng đồng nhất với bản HTML.
4. Mở lại web. Dòng phiên bản phải hiện **v16 · RUB + TỶ GIÁ TỰ ĐỘNG**.

`index.html`, `v16.html`, `v15.html`, `offline-calculator.html` đều chứa đủ CSS/JS để mở trực tiếp. Muốn tải tỷ giá mới cần có mạng; mở file trực tiếp có thể bị một số trình duyệt hạn chế truy cập mạng. Nếu bị chặn, dùng trang đã host hoặc tắt tự động để nhập tay.

Giá cũ của tab EUR được chuyển sang tab VND, không xóa các khóa lưu trữ cũ. Giữ đúng chiều USDT/CAD của bản v15. Mọi biến thể HTML và Worker đã dùng chung công thức và giao diện.
