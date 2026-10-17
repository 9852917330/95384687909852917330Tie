# Tiền của Điền v19

## Giá Binance P2P từ 1.000 USD

- API công khai: `https://www.binance.com/bapi/c2c/v1/public/c2c/agent/ad-list`, không cần tài khoản/API key. Chỉ đọc quảng cáo, không đặt lệnh.
- Bật **Tự điền** để dùng giá Binance; tắt để nhập tay. Các khoảng giá và USD tham khảo vẫn cập nhật độc lập.
- Chọn đúng chiều theo vòng: nhận USDT là **BUY (mua USDT)**; dùng USDT nhận tiền pháp định là **SELL (bán USDT)**.
- CAD: mua USDT bằng EUR, bán USDT nhận CAD. TRY: mua bằng EUR, bán nhận TRY. VND: mua bằng VND, bán nhận EUR. JPY: mua bằng JPY, bán nhận VND. RUB: chỉ cặp USDT/VND lấy giá bán; bước USD/RUB vẫn giữ quy ước cũ có ghi rõ trên giao diện.
- Mỗi cặp/chiều lấy mẫu tối đa **20 quảng cáo**. Đây là khoảng giá trong mẫu, không đại diện toàn bộ thị trường. Mặc định mọi phương thức thanh toán; điều kiện người dùng và khả năng thanh toán cần kiểm tra tại sàn.
- Hạn mức `minTransAmount`, `maxTransAmount`, `tradableAmount` của Agent API là **USDT**. Đã đối chiếu với `minSingleTransQuantity`/`maxSingleTransQuantity` và giá trị fiat của cùng quảng cáo từ API trang Binance.
- Loại quảng cáo không đủ số dư, hạn mức hoặc dữ liệu hợp lệ. Ngưỡng 1.000 USD tính từ **giá trị fiat của giao dịch / tỷ giá USD của đồng đó**, không mặc định 1.000 USDT bằng 1.000 USD.
- Tính số tiền có trước từng bước theo vốn và các bước trước. Chỉ tự điền quảng cáo khớp toàn bộ số tiền đó và đạt ngưỡng 1.000 USD; không chia lệnh hoặc ghép các quảng cáo khác nhau.
- Trong các quảng cáo khớp vốn, mua chọn giá thấp nhất và bán chọn giá cao nhất. Hiện thêm khoảng giá, số quảng cáo, thời điểm lấy và mô tả chiều mua/bán. Di chuột vào dòng giá để xem hạn mức và phương thức của quảng cáo được chọn.
- Nếu có quảng cáo từ 1.000 USD nhưng chưa khớp vốn hiện tại, vẫn hiện khoảng tham khảo kèm **chưa khớp vốn** và không tự điền. Vốn nhỏ hơn ngưỡng cũng cần chuyển sang nhập tay nếu muốn tính.
- Kiểm tra lại khi mở trang/đổi tab/có mạng trở lại và mỗi 60 giây khi trang đang mở. Giá quá 2 phút không dùng tự điền; cảnh báo giá cũ và để trống ô P2P, tránh tiếp tục tính lãi/lỗ theo báo giá đã hết mới.
- Nếu Binance bị chặn/CORS/lỗi mạng, không thay bằng giá USD; tắt Tự điền để dùng giá nhập tay đã lưu. Các nguồn dữ liệu phụ thuộc khả năng truy cập của thiết bị/hosting.

## USD tham khảo dưới từng cặp USDT

- Ngay dưới dòng **Nhận** của tất cả cặp USDT, có thêm tỷ giá pháp định tương ứng: **USD/VND, USD/EUR, USD/CAD, USD/TRY, USD/JPY**.
- Hiển thị dạng **USD / VND: [tỷ giá]**. Giá là số tiền của đồng đứng sau cho 1 USD.
- Tỷ giá tham khảo lấy từ cùng bảng ExchangeRate-API, tự cập nhật, vẫn hoạt động khi tắt **Tự điền**.
- Các dòng USD chỉ dùng đối chiếu; giá USDT tự điền lấy riêng từ quảng cáo Binance và mới tham gia công thức Nhận/lãi/lỗ.
- Khi mất mạng, giữ giá tham khảo đã lưu và đánh dấu **giá lưu/giá cũ**. Nếu chưa có dữ liệu, hiện **chưa tải được**, không suy giá USD từ USDT.

## Các vòng tiền

- Thứ tự tab: **CAD → TRY → VND → JPY → RUB**.
- Vòng CAD: **CAD → EUR → USDT → CAD**. Vốn ban đầu và lãi/lỗ đều tính bằng CAD.
- Ba cặp của CAD theo đúng thứ tự: **EUR/CAD, USDT/EUR, USDT/CAD**.
- Công thức CAD: `CAD cuối = Vốn CAD ÷ (EUR/CAD) ÷ (USDT/EUR) × (USDT/CAD)`.
- EUR/CAD tự cập nhật khi bật Tự điền. Hai cặp USDT/EUR và USDT/CAD lấy giá mua/bán Binance hoặc nhập tay khi tắt Tự điền.
- Đổi tên tab EUR thành VND, giữ vòng **VND → USDT → EUR → VND**.
- Thêm RUB: **VND → RUB → USDT → VND**.
- Ba cặp của RUB theo đúng thứ tự: **RUB/VND, USD/RUB, USDT/VND**.
- Công thức RUB: `VND cuối = Vốn VND ÷ (RUB/VND) ÷ (USD/RUB) × (USDT/VND)`.
- Do cặp thứ hai là USD/RUB, phép tính RUB quy ước **1 USDT = 1 USD**. Đây là ước tính, không phản ánh mức chênh USD/USDT thực tế. Muốn tính chính xác theo giao dịch USDT cần giá mua USDT/RUB.

## Tỷ giá tự động

- Mặc định bật. Chỉ tự điền **EUR/CAD, EUR/TRY, EUR/VND, JPY/VND, RUB/VND, USD/RUB**.
- Các cặp USDT lấy riêng từ Binance khi bật Tự điền. USD không được dùng thay giá P2P.
- Nguồn: [ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free), không cần tài khoản hoặc API key, cập nhật khoảng một lần/ngày.
- Cặp A/B luôn là số B cho 1 A. Quy đổi chéo từ cùng một bảng gốc USD: `A/B = USD/B ÷ USD/A`.
- Hiện thời điểm nhà cung cấp cập nhật, theo giờ Việt Nam. Đây là tỷ giá tham khảo, không phải giá mua/bán của ngân hàng hay giá P2P có thể khớp lệnh. Kết quả chưa trừ phí.
- Tự kiểm tra khi mở web, quay lại ứng dụng, có mạng trở lại và khi đến kỳ dữ liệu mới. Không tạo tác vụ chạy nền khi web đã đóng.
- Bấm **Cập nhật** để kiểm tra lại, có giới hạn chống gửi yêu cầu liên tục. Trong lúc nguồn lỗi, giữ bảng tỷ giá đã lưu và hiện cảnh báo giá cũ; không tự thay bằng dữ liệu giả.
- Tắt **Tự điền** để sửa các ô pháp định; các dòng USD tham khảo vẫn cập nhật độc lập. Giá nhập tay trước đó được giữ riêng với dữ liệu tự động. Giá USDT và vốn từng tab vẫn được lưu.

## Cập nhật web hiện có

1. Giải nén gói, thay các file trong thư mục web cũ bằng các file cùng tên của bản này. Giữ nguyên tên miền/địa chỉ để dùng tiếp dữ liệu đã lưu trên điện thoại.
2. GitHub Pages hoặc hosting tĩnh: dùng `index.html` và các tài nguyên đi kèm. Có thể mở `v19.html` để xác nhận bản v19; các đường dẫn `v18.html`, `v17.html`, `v16.html`, `v15.html` cũng đã được cập nhật.
3. Dùng Cloudflare Worker: dán toàn bộ `worker.js`; các tài nguyên đã được nhúng đồng nhất với bản HTML.
4. Mở lại web. Dòng phiên bản phải hiện **v19 · BINANCE P2P ≥1.000 USD**.

`index.html`, `v19.html`, `v18.html`, `v17.html`, `v16.html`, `v15.html`, `offline-calculator.html` đều chứa đủ CSS/JS để mở trực tiếp. Muốn tải tỷ giá mới cần có mạng; mở file trực tiếp có thể bị một số trình duyệt hạn chế truy cập mạng. Nếu bị chặn, dùng trang đã host hoặc tắt Tự điền để nhập tay.

Giá cũ của tab EUR được chuyển sang tab VND, không xóa các khóa lưu trữ cũ. Riêng CAD dùng vùng lưu mới, vốn mặc định 10.000 CAD; không chuyển vốn VND cũ thành CAD. Chỉ chuyển giá USDT/CAD cũ sang ô USDT/CAD mới, giữ nguyên các dữ liệu cũ để không mất dữ liệu. Mọi biến thể HTML và Worker dùng chung công thức và giao diện.
