# Interaction Log: Playwright SUT Automation Testing
I used AI for the following tasks:

---

### Interaction ID: 1
- **AI Tool**: Antigravity
- **Date & Time (Local)**: 2026-08-15T22:37:38+07:00
- **Target Feature**: FR-01: Đăng ký tài khoản

#### Prompt:
```text
@playwright-hw04-generator
Target Feature: FR-01: Đăng ký tài khoản 
Student ID: 23127108

Instructions:
1. Inspect SUT source code.
2. Create tests/data/FR01.json with 12 test cases in Vietnamese.
3. Generate tests/FR01.spec.ts using dynamic loops, at least 3 assertion patterns, and student ID annotations.
4. Check discrepancies against specs; flag deviations as SUT defects.
```

#### AI Output (Summarized):
- Completed static code analysis of `Register.jsx` and backend `server.js`.
- Created `tests/data/FR01.json` with 12 positive, boundary, and negative test cases.
- Generated `tests/FR01.spec.ts` featuring Playwright E2E tests, 3 distinct assertions (URL matching, Element visibility, and HTML5 Validity state evaluation), and student ID metadata annotations.
- Identified and reported discrepancies (missing confirm password input, flawed regex pattern requiring spaces and blocking special characters).
- Executed the test suite in Chromium, Firefox, and Webkit; successfully flagged all implementation defects.


---

### Interaction ID: 2
- **AI Tool**: Antigravity
- **Date & Time (Local)**: 2026-08-15T22:56:02+07:00
- **Target Feature**: FR-07: Giỏ hàng (Shopping Cart)

#### Prompt:
```text
@playwright-hw04-generator
Target Feature: FR-07: Giỏ hàng (Shopping Cart) 
Student ID: 23127108

Instructions:
1. Inspect SUT source code.
2. Create tests/data/FR07.json with 12 test cases in Vietnamese.
3. Generate tests/FR07.spec.ts (corrected filename matching the feature) using dynamic loops, at least 3 assertion patterns, and student ID annotations.
4. Check discrepancies against specs; flag deviations as SUT defects.
```

#### AI Output (Summarized):
- Completed static analysis of cart components (`Cart.jsx`, `CartContext.jsx`, `ProductDetail.jsx`).
- Created `tests/data/FR07.json` with 12 test cases covering empty states, quantities, row merging, "+/-" buttons, deletion dialogs, and navigation.
- Generated `tests/FR07.spec.ts` using client-side SPA navigation to preserve React state.
- Identified and logged 6 major SUT defects (missing "+/-" buttons, failure to merge duplicate rows, missing deletion confirmation dialog, incorrect "Tổng tạm tính" label, incorrect column header, and click-twice requirement on product detail).
- Executed tests (12 passed, 24 failed due to expected SUT deviations).


---

### Interaction ID: 3
- **AI Tool**: Antigravity
- **Date & Time (Local)**: 2026-08-15T23:29:27+07:00
- **Target Feature**: FR-13: Dashboard

#### Prompt:
```text
@playwright-hw04-generator
Target Feature: FR-13: Dashboard
Student ID: 23127108

Instructions:
1. Inspect SUT source code.
2. Create tests/data/FR13.json with 12 test cases in Vietnamese.
3. Generate tests/FR13.spec.ts using dynamic loops, at least 3 distinct assertion patterns, and student ID annotations.
4. Check discrepancies against specs; flag deviations as SUT defects.
```

#### AI Output (Summarized):
- Inspected admin dashboard implementation inside admin `App.jsx`.
- Created `tests/data/FR13.json` with 12 test cases for revenue, order counts, login authentication, and logout validation.
- Generated `tests/FR13.spec.ts` featuring dynamic tests, admin login handling, and automated SQLite database seeding before each test run.
- Pinpointed and flagged a major SUT bug where total delivered revenue is incorrectly multiplied by 2.
- Executed tests across Chromium, Firefox, and Webkit (27 passed, 9 failed due to SUT's revenue doubling defect).


---

#### Human Audit
* Đã sửa một số test case của FR13
* Bỏ phần ISO timestamp trên test.describe của mỗi file spec.ts

