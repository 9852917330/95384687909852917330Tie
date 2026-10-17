# Tiền của Điền v21

## Vốn USD và 7 lựa chọn nhanh

- Nhập số vốn cụ thể bằng USD, hỗ trợ tối đa 2 số lẻ. Ví dụ: `1250`, `1.250,50` hoặc `1,250.50`.
- Có đúng 7 nút: **$1000, $2000, $3000, $4000, $5000, $8000, $10000**.
- Mặc định $1000. Vốn USD dùng chung giữa các tab, được lưu trên thiết bị. Vốn VND/CAD/TRY từ các bản cũ được giữ riêng, không tự coi là USD.
- Dưới ô nhập hiện số tiền quy đổi sang đồng tiền đầu vòng. Ví dụ, tab VND/JPY/RUB bắt đầu bằng VND; tab CAD bằng CAD; tab TRY bằng TRY. Lãi/lỗ hiển thị theo đồng tiền đầu vòng.
- Khi thay vốn hoặc chọn nhanh, web lọc lại khoảng giá ngay và tự kiểm tra nguồn sau khi dừng nhập. Dữ liệu mới vẫn cập nhật định kỳ 60 giây; có giới hạn chống gửi yêu cầu liên tục.

## Lọc Binance theo đúng mức vốn

- Ngưỡng tìm giá thay đổi theo số USD nhập, không còn ngưỡng $1000 cố định của v19/v20.
- Mỗi quảng cáo được chọn phải chứa được giao dịch bằng mức vốn đã chọn: `số USDT mục tiêu = vốn USD × tỷ giá USD/fiat ÷ giá USDT/fiat`.
- Kiểm tra đồng thời giới hạn tối thiểu, tối đa và số USDT còn lại. Quảng cáo chỉ đủ $1000 không được dùng cho vốn $5000.
- Đúng chiều vòng tiền: nhận USDT là BUY, dùng USDT đổi ra pháp định là SELL. Mua chọn giá thấp nhất, bán chọn giá cao nhất trong các quảng cáo hợp lệ.
- Ưu tiên các quảng cáo đồng thời chứa được lượng tiền thực nhận từ bước trước. Nếu lượng tiền giữa vòng đã thay đổi vượt hạn mức, kết quả được đánh dấu ≈ và có ghi chú; mọi giá được dùng vẫn phải đáp ứng vốn USD gốc đã chọn.
- Nếu không có quảng cáo đáp ứng mức vốn, ô giá không tự điền bằng giá của mức vốn khác; hiển thị **chưa có quảng cáo khớp $...**.
- Tối đa 20 quảng cáo/cặp/chiều từ API công khai Binance Agent. Bộ lọc vốn chạy trên dữ liệu hạn mức của các quảng cáo đó; không coi mẫu này là toàn bộ thị trường. Mặc định mọi phương thức thanh toán.
- API chỉ đọc, không đặt lệnh. Thiết bị/hosting cần truy cập được Binance. Giá quá 2 phút không dùng tự điền; không thay giá P2P bằng tỷ giá USD.

## Các vòng tiền

- Thứ tự tab: **CAD → TRY → VND → JPY → RUB**.
- CAD: **CAD → EUR → USDT → CAD**; các cặp **EUR/CAD, USDT/EUR, USDT/CAD**.
- TRY: **TRY → EUR → USDT → TRY**.
- VND: **VND → USDT → EUR → VND**.
- JPY: **VND → JPY → USDT → VND**.
- RUB: **VND → RUB → USDT → VND**; các cặp **RUB/VND, USD/RUB, USDT/VND**. Bước USD/RUB vẫn quy ước 1 USD = 1 USDT và có ghi rõ trên giao diện.

## Tỷ giá và dữ liệu lưu

- Nguồn pháp định: [ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free), cập nhật khoảng một lần/ngày, không cần API key. Hiện ngày giờ dữ liệu theo giờ Việt Nam.
- Dưới dòng Nhận của mỗi cặp USDT vẫn có USD/pháp định tương ứng để đối chiếu. Các dòng USD không thay thế giá P2P.
- Bật **Tự điền** để dùng giá pháp định và Binance. Tắt để nhập tay; giá nhập tay trước đây được giữ riêng.
- Vốn USD chỉ quy đổi được khi có bảng tỷ giá pháp định hoặc bảng đã lưu. Nếu chưa có bảng, hiện trạng thái chờ thay vì tính theo giá giả.
- Kết quả là ước tính, chưa trừ phí, chênh lệch mua/bán fiat và các chi phí thanh toán. Cần kiểm tra điều kiện quảng cáo khi giao dịch thực tế.

## Cập nhật web hiện có

1. Giải nén ZIP và thay các file web cũ bằng các file cùng tên. Giữ nguyên địa chỉ web để tiếp tục dùng dữ liệu trên thiết bị.
2. Hosting tĩnh/GitHub Pages: dùng `index.html` và tài nguyên đi kèm. Có thể mở `v21.html` để kiểm tra bản mới; các đường dẫn v15–v20 cũng đã được cập nhật.
3. Nếu dùng Cloudflare Worker, thay toàn bộ `worker.js`; tài nguyên đã được nhúng đồng nhất.
4. Dòng phiên bản phải hiện **v21 · VỐN USD + GIÁ THEO VỐN**.

Các bản HTML chứa đủ CSS/JS để mở trực tiếp. Muốn lấy giá mới cần mạng; một số trình duyệt có thể hạn chế truy cập API khi mở file cục bộ.
