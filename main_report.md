# BÁO CÁO BÀI TẬP HW04 – AUTOMATION TESTING 

## Thông tin sinh viên 
- MSSV: 23127108
- Họ tên: Lê Hữu Minh Quang
- Lớp: 23KTPM04

## Phạm Vi

Automation được thực hiện cho 3 tính năng đã chốt từ HW02: FR-01 Đăng ký, FR-07 Thêm sản phẩm, FR-13 Admin Dashboard. 

## Môi Trường Chạy

- Framework: Playwright
- Browsers: Chromium, Firefox, WebKit
- Worker: `1` để tránh race condition trên SQLite và dữ liệu dùng chung
- Backend: `http://localhost:3000`
- Frontend web: `http://localhost:5173`
- Frontend admin: `http://localhost:5174`

## Lệnh Đã Chạy

```bash
npx playwright test
```

## Tổng Hợp Kết Quả

| Feature | Test case | Browser executions | Pass | Fail | Test case fail duy nhất | Bug unique xác nhận |
|---|---:|---:|---:|---:|---:|---:|
| FR-01 | 12 | 36 | 0 | 36 | 12 | 1 |
| FR-07 | 13 | 36 | 12 | 24 | 8 | 5 |
| FR-13 | 12 | 36 | 27 | 9 | 3 | 1 |
| Tổng | 36 | 108 | 39 | 69 | 23 | 8 |

## Report HTML
`playwright-report-23127108/index.html` (tổng hợp cả 3 lần chạy)

Mỗi report có banner `Run by: 23127108` và ISO timestamp để minh chứng.

## Phân tích AI gap:
#### Feature A: FR-13 – Dashboard
* **Gap Analysis (Phân tích khoảng cách AI):**
  * *Những lỗi sai/thiếu sót của AI:* AI ban đầu viết test data của các testcase từ 09 đến 11 là kiểm tra đăng nhập admin, điều mà không cần test dựa theo đặc tả của FR13. Và TC12 ban đầu là kiểm tra hiển thị đúng, mặc dù các test case trước đã làm
  * *Cách con người chỉnh sửa, tối ưu lại:* Sửa các test case từ 09 đến 12 thành những test case riêng

#### Feature A,B,C: FR-01 – Sign up, FR-07 – Cart, FR-13 – Dashboard
* **Gap Analysis (Phân tích khoảng cách AI):**
  * *Những lỗi sai/thiếu sót của AI:* AI ban đầu có thêm ISO timestamp vào test script khiến cho test Playwright không chạy được ở những lần chạy sau do Agent Skill được viết khi người dùng hiểu nhầm yêu cầu đề về ISO timestamp
  * *Cách con người chỉnh sửa, tối ưu lại:* Loại bỏ dòng đó

## Bug Được Automation Xác Nhận

| Feature | Bug ID | Nhóm lỗi |
|---|---|---|
| FR-01 | BUG-FR01-001 | Thiếu trường Xác nhận mật khẩu |
| FR-07 | BUG-FR07-001 | Sản phẩm thêm trùng không được cộng vào quantity |
| FR-07 | BUG-FR07-002 | Cart hiển thị "Tổng tạm tính" thay vì "Tổng cộng" |
| FR-07 | BUG-FR07-003 | Cart hiển thị "Giá" thay vì "Đơn giá" |
| FR-07 | BUG-FR07-004 | Frontend không có nút thêm giảm số lượng sảm phẩm |
| FR-07 | BUG-FR07-005 | Frontend không có bảng xác nhận xoá sản phẩm |
| FR-13 | BUG-FR13-001 | Tổng doanh thu bị nhân đôi so với giá trị mong muốn |

## Demo video 
- Video link: [Demo test chức năng FR13](https://youtu.be/IaPGuSUj4xM)
