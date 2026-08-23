# HW04 - AI Automation Testing

## Thông Tin Sinh Viên

- MSSV: 23127364
- Họ tên: Lê Hữu Minh Quang
- Lớp: 23KTPM04

## Tính Năng Đã Chọn

| Mã tính năng | Tên tính năng | Nhóm |
|---|---|---|
| FR-01 | Đăng ký tài khoản | A |
| FR-07 | Thêm sản phẩm vào giỏ hàng | B |
| FR-13 | Dashboard admin | C |

## Tóm Tắt Automation

| Chỉ số | Giá trị |
|---|---:|
| Số tính năng automate | 3 |
| Số test case | 36 |
| Số lượt chạy browser | 108 |
| Số lượt pass | 39 |
| Số lượt fail | 69 |
| Số test case fail duy nhất | 23 |
| Số bug unique được automation xác nhận | 8 |
| Browser | Chromium, Firefox, WebKit |

## Kết Quả Theo Feature

| Feature | Test case | Browser executions | Pass | Fail | Test case fail duy nhất | Bug unique xác nhận |
|---|---:|---:|---:|---:|---:|---:|
| FR-01 | 12 | 36 | 0 | 36 | 12 | 1 |
| FR-07 | 13 | 36 | 12 | 24 | 8 | 5 |
| FR-13 | 12 | 36 | 27 | 9 | 3 | 1 |
| Tổng | 36 | 108 | 39 | 69 | 23 | 8 |

## Bảng Tự Đánh Giá

| STT | Tiêu chí | Điểm chuẩn | Điểm tự đánh giá |
|---|---|---:|---:|
| 1 | Task 1 - Feature A: FR-03 automation trên 3 browser | 25 | 25 |
| 2 | Task 1 - Feature B: FR-09 automation trên 3 browser | 25 | 25 |
| 3 | Task 1 - Feature C: FR-15 automation trên 3 browser | 25 | 25 |
| 4 | Task 2 - Demo video và minh chứng chạy automation | 15 | 15 |
| 5 | Agent Skills / AI usage documentation | 10 | 10 |
|  | Tổng | 100 | 100 |


## Cách Chạy

```bash
npm install
npx playwright install
npx playwright test
```

Chạy từng tính năng:

```bash
npx playwright test tests/fr01.spec.js
npx playwright test tests/fr07.spec.js
npx playwright test tests/fr13.js
```

Mở report gần nhất:

```bash
npm run report
```

## Minh chứng

- Demo video links: 
* [Demo test chức năng FR13](https://youtu.be/IaPGuSUj4xM)
* [Demo Agent Skill](https://youtu.be/6YfXPdpX1Vk)
- Github: [GitHub](https://github.com/fgounlimitedluckgame/HW04)