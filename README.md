# Tiền của Điền v24

## Thêm đủ các đồng trong ảnh

- Thêm **DKK, PLN, HUF, RON, SEK, GBP, NOK, CHF, ISK**. CZK đã có, không tạo tab trùng.
- Mỗi đồng X dùng vòng **X → EUR → USDT → X**, đúng 3 cặp **EUR/X, USDT/EUR, USDT/X**. Lấy EUR/X từ nguồn pháp định; dùng EUR mua USDT (BUY), sau đó bán USDT nhận X (SELL) trên Binance.
- VND luôn ở đầu; tiếp theo là toàn bộ vòng qua EUR, rồi RUB và JPY. 15 tab xếp 5 cột × 3 hàng để dễ chọn trên điện thoại.
- Các đồng mới có quy đổi vốn USD, USD/EUR và USD/X dưới dòng Nhận, bộ lọc vốn/85%/97%, tự cập nhật và nhập tay như các tab cũ. Lãi/lỗ của vòng qua EUR bằng đồng X, hiển thị tối đa 2 số lẻ.
- Khi kiểm tra nguồn ngày 17/10/2026, bảng pháp định có đủ 9 đồng mới; API Binance trả danh sách rỗng cho DKK và ISK. Web vẫn có hai tab này và báo **nguồn chưa có quảng cáo cho cặp này**, để trống giá P2P/kết quả khi không có giá. Không suy ra giá USDT từ USD. Tình trạng quảng cáo có thể thay đổi ở lần cập nhật sau.

## Bộ lọc thương nhân Binance

- Chỉ dùng quảng cáo có tỷ lệ hoàn tất 30 ngày **từ 85% trở lên** và phản hồi tích cực **từ 97% trở lên**. Đúng 85% hoặc 97% vẫn được chấp nhận.
- Áp dụng đồng thời cho chiều BUY và SELL, mọi cặp USDT, khoảng giá và giá tự điền. Bộ lọc vốn và tồn kho tiếp tục áp dụng sau bộ lọc thương nhân.
- Thiếu hoặc sai định dạng một trong hai tỷ lệ: bỏ quảng cáo, không tự coi là đạt. Không có quảng cáo hợp lệ thì để trống giá và kết quả.
- Nếu nguồn báo quảng cáo/thương nhân bị hạn chế, bị chặn hoặc không thể giao dịch (`isRestricted`, `isBlocked`, `isTradable`), bỏ quảng cáo đó.
- **Giới hạn của nguồn hiện tại:** API Agent công khai đang trả hai tỷ lệ, nhưng không trả trạng thái hạn chế theo tài khoản. Web không đăng nhập tài khoản Binance nên không thể xác minh/loại hết quảng cáo hiện “Hạn chế” riêng với tài khoản của bạn. Giao diện ghi rõ cần kiểm tra trên Binance; không coi việc thiếu cờ hạn chế là đã xác minh giao dịch được.
- Dữ liệu giá lưu từ v22 trở về trước không được dùng lại vì thiếu trường phản hồi tích cực và bộ lọc mới. Vốn USD và dữ liệu nhập tay được giữ nguyên.

## Vốn USD và 7 lựa chọn nhanh

- Nhập số vốn cụ thể bằng USD, hỗ trợ tối đa 2 số lẻ. Ví dụ: `1250`, `1.250,50` hoặc `1,250.50`.
- Có đúng 7 nút: **$1000, $2000, $3000, $4000, $5000, $8000, $10000**.
- Mặc định $1000. Vốn USD dùng chung giữa các tab, được lưu trên thiết bị. Vốn VND/CAD/TRY từ các bản cũ được giữ riêng, không tự coi là USD.
- Dưới ô nhập hiện số tiền quy đổi sang đồng tiền đầu vòng. Tab VND/JPY/RUB bắt đầu bằng VND; các vòng X → EUR → USDT → X bắt đầu bằng X. Lãi/lỗ hiển thị theo đồng tiền đầu vòng.
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

- Thứ tự tab: **VND → TRY → CZK → DKK → PLN → HUF → RON → SEK → GBP → NOK → CHF → ISK → CAD → RUB → JPY**.
- VND: **VND → USDT → EUR → VND**.
- TRY: **TRY → EUR → USDT → TRY**.
- CZK: **CZK → EUR → USDT → CZK**; các cặp **EUR/CZK, USDT/EUR, USDT/CZK**. Tự lấy EUR/CZK từ nguồn pháp định; mua USDT bằng EUR (BUY), bán USDT nhận CZK (SELL) trên Binance. Dưới hai cặp USDT có USD/EUR và USD/CZK. Vốn USD được quy đổi sang CZK trước khi chạy vòng; kết quả lãi/lỗ bằng CZK, tối đa 2 số lẻ.
- DKK: **DKK → EUR → USDT → DKK**; các cặp **EUR/DKK, USDT/EUR, USDT/DKK**.
- PLN: **PLN → EUR → USDT → PLN**; các cặp **EUR/PLN, USDT/EUR, USDT/PLN**.
- HUF: **HUF → EUR → USDT → HUF**; các cặp **EUR/HUF, USDT/EUR, USDT/HUF**.
- RON: **RON → EUR → USDT → RON**; các cặp **EUR/RON, USDT/EUR, USDT/RON**.
- SEK: **SEK → EUR → USDT → SEK**; các cặp **EUR/SEK, USDT/EUR, USDT/SEK**.
- GBP: **GBP → EUR → USDT → GBP**; các cặp **EUR/GBP, USDT/EUR, USDT/GBP**.
- NOK: **NOK → EUR → USDT → NOK**; các cặp **EUR/NOK, USDT/EUR, USDT/NOK**.
- CHF: **CHF → EUR → USDT → CHF**; các cặp **EUR/CHF, USDT/EUR, USDT/CHF**.
- ISK: **ISK → EUR → USDT → ISK**; các cặp **EUR/ISK, USDT/EUR, USDT/ISK**.
- CAD: **CAD → EUR → USDT → CAD**; các cặp **EUR/CAD, USDT/EUR, USDT/CAD**.
- RUB: **VND → RUB → USDT → VND**; các cặp **RUB/VND, USD/RUB, USDT/VND**. Bước USD/RUB vẫn quy ước 1 USD = 1 USDT và có ghi rõ trên giao diện.
- JPY: **VND → JPY → USDT → VND**.

## Tỷ giá và dữ liệu lưu

- Nguồn pháp định: [ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free), cập nhật khoảng một lần/ngày, không cần API key. Hiện ngày giờ dữ liệu theo giờ Việt Nam.
- Dưới dòng Nhận của mỗi cặp USDT vẫn có USD/pháp định tương ứng để đối chiếu. Các dòng USD không thay thế giá P2P.
- Bật **Tự điền** để dùng giá pháp định và Binance. Tắt để nhập tay; giá nhập tay trước đây được giữ riêng.
- Vốn USD chỉ quy đổi được khi có bảng tỷ giá pháp định hoặc bảng đã lưu. Nếu chưa có bảng, hiện trạng thái chờ thay vì tính theo giá giả.
- Kết quả là ước tính, chưa trừ phí, chênh lệch mua/bán fiat và các chi phí thanh toán. Cần kiểm tra điều kiện quảng cáo khi giao dịch thực tế.

## Cập nhật web hiện có

1. Giải nén ZIP và thay các file web cũ bằng các file cùng tên. Giữ nguyên địa chỉ web để tiếp tục dùng dữ liệu trên thiết bị.
2. Hosting tĩnh/GitHub Pages: dùng `index.html` và tài nguyên đi kèm. Có thể mở `v24.html` để kiểm tra bản mới; các đường dẫn v15–v23 cũng đã được cập nhật.
3. Nếu dùng Cloudflare Worker, thay toàn bộ `worker.js`; tài nguyên đã được nhúng đồng nhất.
4. Dòng phiên bản phải hiện **v24 · 15 VÒNG TIỀN**.

Các bản HTML chứa đủ CSS/JS để mở trực tiếp. Muốn lấy giá mới cần mạng; một số trình duyệt có thể hạn chế truy cập API khi mở file cục bộ.
