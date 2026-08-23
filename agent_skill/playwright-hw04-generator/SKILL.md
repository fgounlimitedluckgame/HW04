---
name: playwright-hw04-generator
description: Production-grade E2E test generator for HW04. Creates data-driven JSON test suites (12+ cases), generates robust Playwright specs with 3+ assertion patterns, tags mandatory Student ID metadata, and configures multi-browser execution.
---

# HW04 Playwright Test Automation Skill

## 1. Skill Workflow Architecture

1. **Step 1: Analyze SUT & Design Data (JSON)**
   - Read the SUT frontend page files (JSX/TSX) and backend endpoints (routes/controllers).
   - Generate a separate file: `tests/data/<feature_name>.json`.
   - Include >= 12 test cases covering: Positive, Boundary Value Analysis (BVA), Negative, and Edge cases.
   - Do NOT inline test data inside `.spec.ts` files.

2. **Step 2: Generate Playwright Spec (`tests/<feature_name>.spec.ts`)**
   - Import test data dynamically from `tests/data/<feature_name>.json`.
   - **Student Identity Tagging (Mandatory):**
     ```typescript
     const STUDENT_ID = process.env.STUDENT_ID || 'YOUR_STUDENT_ID';

     test.describe(`${FEATURE_NAME} - Run by: ${STUDENT_ID}`, () => {
       // ...
     });
     ```
   - Every individual test case title MUST append the Student ID:
     ```typescript
     test(`Test Case ${tc.testId}: ${tc.description}`, async ({ page }) => {
       // ...
     });
     ```
   - **3 Distinct Assertion Patterns (Mandatory):**
     1. Element State/Visibility: `await expect(locator).toBeVisible()` or `toBeHidden()`
     2. Content Verification: `await expect(locator).toHaveText()` or `toContainText()`
     3. URL / Navigation State: `await expect(page).toHaveURL()` or `toHaveTitle()`
   - **Locator Resilience:** Use Playwright semantic locators (`getByRole`, `getByLabel`, `getByTestId`). Avoid brittle CSS selectors or indiscriminate `.first()` calls.

3. **Step 3: Multi-Browser Configuration (`playwright.config.ts`)**
   - Set single worker (`workers: 1`) for stateful database operations (CRUD/Auth lockout).
   - Include 3 distinct browser projects: `chromium`, `firefox`, and `webkit`.
   - Attach global metadata containing the student ID and ISO timestamp.

---

## 2. Antigravity Prompt Template

Paste this prompt into your Antigravity Agent chat when generating tests for a feature:

> @playwright-hw04-generator
> Target Feature: [FEATURE_NAME (e.g., FR-02 Login)]
> Student ID: [YOUR_STUDENT_ID]
> 
> Instructions:
> 1. Inspect the source code of the SUT for [FEATURE_NAME] to determine accurate form fields, button selectors, and API responses.
> 2. Create `tests/data/[feature_name].json` with at least 12 test cases (positive, BVA edge cases, and validation error cases).
> 3. Generate `tests/[feature_name].spec.ts` using dynamic data-driven loops, at least 3 distinct assertion patterns, and student ID annotations on every test run.
> 4. IMPORTANT NOTE: If there are any discrepancies between the specification documents and the actual implementation of the SUT, test data and expected outcomes must strictly conform to the specification documents, NOT the actual implementation. Any implementation deviations should be flagged as defects.
