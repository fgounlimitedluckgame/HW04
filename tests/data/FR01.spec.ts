import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Define Student Identity and Timestamp
const STUDENT_ID = process.env.STUDENT_ID || '23127108';
const TIMESTAMP = process.env.TIMESTAMP || new Date().toISOString();

// Load dynamic test data
const testDataPath = path.join(__dirname, 'data', 'FR01.json');
const testCases = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

test.describe(`FR-01: Đăng ký tài khoản - Run by: ${STUDENT_ID} - [${TIMESTAMP}]`, () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the register page before each test
    await page.goto('/register');
  });

  for (const tc of testCases) {
    test(`Test Case ${tc.testId}: ${tc.description} - Student ID: ${STUDENT_ID}`, async ({ page }) => {
      // 1. Locate fields
      const nameInput = page.locator('//label[text()="Họ Tên"]/following-sibling::input');
      const emailInput = page.locator('//label[text()="Email"]/following-sibling::input');
      const passwordInput = page.locator('//label[text()="Mật khẩu"]/following-sibling::input');
      
      // Confirm password field is required by specifications
      const confirmPasswordInput = page.locator('//label[text()="Xác nhận mật khẩu"]/following-sibling::input');

      // 2. Perform field inputs if data is provided
      if (tc.name !== undefined) {
        await nameInput.fill(tc.name);
      }
      if (tc.email !== undefined) {
        await emailInput.fill(tc.email);
      }
      if (tc.password !== undefined) {
        await passwordInput.fill(tc.password);
      }

      // Assert that Confirm Password field is visible and fill it (Spec Compliance Check)
      // Note: This is expected to fail on SUT since the field is missing.
      await expect(confirmPasswordInput).toBeVisible();
      if (tc.confirmPassword !== undefined) {
        await confirmPasswordInput.fill(tc.confirmPassword);
      }

      // 3. Submit Form
      const submitBtn = page.getByRole('button', { name: 'Đăng Ký', exact: true });
      await expect(submitBtn).toBeVisible(); // Assertion Pattern 1: Visibility/Element State
      await submitBtn.click();

      // 4. Verification and Assertions
      if (tc.expectedSuccess) {
        // Assertion Pattern 2: URL / Navigation State
        // Expected to redirect to /login upon successful registration
        await expect(page).toHaveURL(/.*\/login.*/);
      } else {
        // Negative test validation
        if (tc.name === "" || tc.email === "" || tc.password === "") {
          // Check for HTML5 Validation or page error message
          const nameValid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
          const emailValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
          const passwordValid = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
          
          const formHasValidationError = !nameValid || !emailValid || !passwordValid;
          
          if (formHasValidationError) {
            expect(formHasValidationError).toBe(true); // Assertion Pattern 3: Validity State
          } else {
            // Check for frontend displayed error message box
            const errorBox = page.locator('.text-red-700');
            await expect(errorBox).toBeVisible();
            await expect(errorBox).toContainText(tc.expectedError); // Assertion Pattern 3: Content Verification
          }
        } else {
          // General validation error checking
          const errorBox = page.locator('.text-red-700');
          await expect(errorBox).toBeVisible();
          await expect(errorBox).toContainText(tc.expectedError); // Assertion Pattern 3: Content Verification
        }
      }
    });
  }
});
