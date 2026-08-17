import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import sqlite3 from 'sqlite3';

// Define Student Identity and Timestamp
const STUDENT_ID = process.env.STUDENT_ID || '23127108';
const TIMESTAMP = process.env.TIMESTAMP || new Date().toISOString();

// Load dynamic test data
const testDataPath = path.join(__dirname, 'data', 'FR13.json');
const testCases = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

const dbPath = path.resolve(__dirname, '..', 'backend', 'database.sqlite');

// Database helper to reset and seed orders
function resetAndSeedOrders(ordersList: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      db.serialize(() => {
        db.run('DELETE FROM orders', (err) => {
          if (err) return reject(err);
        });

        if (!ordersList || ordersList.length === 0) {
          db.close((err) => {
            if (err) return reject(err);
            resolve();
          });
          return;
        }

        const stmt = db.prepare(
          'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)'
        );
        for (const o of ordersList) {
          stmt.run([o.user_id, o.total_amount, o.status, o.shipping_address]);
        }
        stmt.finalize((err) => {
          if (err) return reject(err);
          db.close((err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    });
  });
}

async function loginAsAdmin(page: any, email = 'admin@eshop.com', password = 'Admin123!') {
  await page.goto('http://localhost:5174');
  await page.locator('input[placeholder="Email"]').fill(email);
  await page.locator('input[placeholder="Password"]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe(`FR-13: Dashboard - Run by: ${STUDENT_ID} - [${TIMESTAMP}]`, () => {

  for (const tc of testCases) {
    test(`Test Case ${tc.testId}: ${tc.description} - Student ID: ${STUDENT_ID}`, async ({ page }) => {
      
      if (tc.type === 'login') {
        // Test Admin login functionality with dialog/alert listener
        let alertMessage = '';
        page.on('dialog', async dialog => {
          alertMessage = dialog.message();
          await dialog.dismiss();
        });

        await loginAsAdmin(page, tc.email, tc.password);

        if (tc.expectedSuccess) {
          // Assertion Pattern 1: URL / Navigation State (successfully logs in)
          await expect(page.locator('h1')).toHaveText('EShop Admin');
        } else {
          // Wait for dialog or check that login failed
          await page.waitForTimeout(1000); // Allow brief moment for dialog to trigger
          // Assertion Pattern 2: Content Verification (alert message check)
          expect(alertMessage).toContain(tc.expectedError);
        }
      }

      else if (tc.type === 'logout') {
        await loginAsAdmin(page);
        
        const logoutBtn = page.locator('li:has-text("Đăng xuất")');
        // Assertion Pattern 3: Element State/Visibility
        await expect(logoutBtn).toBeVisible();
        await logoutBtn.click();

        // Redirect back to Admin Login
        await expect(page.locator('h2')).toHaveText('Admin Login');
      }

      else if (tc.type === 'visibility') {
        await loginAsAdmin(page);
        
        const dashboardHeader = page.locator('h2', { hasText: 'Dashboard' });
        // Assertion Pattern 3: Element State/Visibility
        await expect(dashboardHeader).toBeVisible();
      }

      else if (tc.type === 'visibility_order_count') {
        await loginAsAdmin(page);
        
        const orderCountHeader = page.locator('h3', { hasText: 'Tổng số đơn hàng' });
        // Assertion Pattern 3: Element State/Visibility
        await expect(orderCountHeader).toBeVisible();
      }

      else if (tc.orders !== undefined) {
        // Seed order data
        await resetAndSeedOrders(tc.orders);

        // Login to view Dashboard
        await loginAsAdmin(page);

        // Locating total revenue container and order count container
        const revenueCard = page.locator('div.bg-white', { has: page.locator('h3', { hasText: 'Tổng doanh thu (Delivered)' }) });
        const orderCountCard = page.locator('div.bg-white', { has: page.locator('h3', { hasText: 'Tổng số đơn hàng' }) });

        // Verify total revenue calculation (Spec check)
        const formattedRevenue = `${tc.expectedRevenue.toLocaleString()} ₫`;
        // Assertion Pattern 2: Content Verification
        await expect(revenueCard.locator('p')).toHaveText(formattedRevenue);

        // Verify total order count
        // Assertion Pattern 2: Content Verification
        await expect(orderCountCard.locator('p')).toHaveText(tc.expectedOrderCount.toString());
      }
    });
  }
});
