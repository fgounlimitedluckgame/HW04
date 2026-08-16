import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Define Student Identity and Timestamp
const STUDENT_ID = process.env.STUDENT_ID || '23127108';
const TIMESTAMP = process.env.TIMESTAMP || new Date().toISOString();

// Load dynamic test data
const testDataPath = path.join(__dirname, 'data', 'FR07.json');
const testCases = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

// Helper function to add a product to the cart
async function addProductToCart(page: any, productName: string, quantity: number = 1) {
  await page.goto('/');
  const searchInput = page.locator('input[placeholder="Tìm kiếm..."]');
  await searchInput.fill(productName);
  await page.getByRole('button', { name: 'Tìm' }).click();

  const productCard = page.locator('.border.rounded.shadow-sm', { hasText: productName });
  
  if (quantity === 1) {
    const addToCartBtn = productCard.getByRole('button', { name: 'Thêm vào giỏ' });
    await addToCartBtn.click();
  } else {
    const detailLink = productCard.getByRole('link', { name: 'Xem chi tiết' });
    await detailLink.click();
    
    const qtyInput = page.locator('input[type="number"]');
    await qtyInput.fill(quantity.toString());
    
    const addToCartBtn = page.getByRole('button', { name: 'Thêm vào giỏ hàng' });
    // In spec-conforming behavior, a single click should add to cart
    await addToCartBtn.click();
  }
}

test.describe(`FR-07: Giỏ hàng (Shopping Cart) - Run by: ${STUDENT_ID} - [${TIMESTAMP}]`, () => {

  for (const tc of testCases) {
    test(`Test Case ${tc.testId}: ${tc.description} - Student ID: ${STUDENT_ID}`, async ({ page }) => {
      // 1. Initial State Setup
      if (tc.testId === 'TC01') {
        // Go straight to cart to verify empty state
        await page.goto('/cart');
        
        // Assertion Pattern 1: Content Verification
        const emptyMsg = page.locator('h2');
        await expect(emptyMsg).toContainText(tc.expectedEmptyMessage);

        // Assertion Pattern 2: Element State/Visibility
        const continueShoppingLink = page.getByRole('link', { name: 'Tiếp tục mua sắm', exact: true });
        await expect(continueShoppingLink).toBeVisible();
      }

      else if (tc.testId === 'TC02' || tc.testId === 'TC04' || tc.testId === 'TC05') {
        // Add product and verify single row entry with quantity
        await addProductToCart(page, tc.productName, tc.quantity);
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();

        const row = page.locator('table tbody tr');
        await expect(row).toHaveCount(1);
        await expect(row.locator('td').nth(0)).toHaveText(tc.productName);
        await expect(row.locator('td').nth(2)).toHaveText(tc.quantity.toString());
      }

      else if (tc.testId === 'TC03') {
        // Add same product multiple times
        for (let i = 0; i < tc.addTimes; i++) {
          await addProductToCart(page, tc.productName, 1);
        }
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();

        // Specification requirement: Adding same product merges rows and increments quantity
        const rows = page.locator('table tbody tr');
        // Assertion Pattern 1: Content Verification (row count must be 1)
        await expect(rows).toHaveCount(1);
        await expect(rows.locator('td').nth(2)).toHaveText(tc.expectedQuantity.toString());
      }

      else if (tc.testId === 'TC06' || tc.testId === 'TC07') {
        // Interactive quantity adjustments (+/- buttons)
        const initialQty = tc.initialQty || 1;
        await addProductToCart(page, tc.productName, initialQty);
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();

        const row = page.locator('table tbody tr').first();
        const plusBtn = row.getByRole('button', { name: '+' });
        const minusBtn = row.getByRole('button', { name: '-' });

        // Assertion Pattern 2: Element State/Visibility (Buttons must exist)
        await expect(plusBtn).toBeVisible();
        await expect(minusBtn).toBeVisible();

        if (tc.action === 'increase') {
          await plusBtn.click();
          await expect(row.locator('td').nth(2)).toHaveText(tc.expectedQuantity.toString());
        } else if (tc.action === 'decrease') {
          await minusBtn.click();
          await expect(row.locator('td').nth(2)).toHaveText(tc.expectedQuantity.toString());
        }
      }

      else if (tc.testId === 'TC08') {
        // Total price label check
        await addProductToCart(page, tc.productName, 1);
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();

        const totalContainer = page.locator('div', { hasText: tc.expectedTotalLabel });
        // Assertion Pattern 1: Content Verification
        await expect(totalContainer).toBeVisible();
        await expect(totalContainer).toContainText(tc.expectedTotalLabel);
      }

      else if (tc.testId === 'TC09' || tc.testId === 'TC10') {
        // Remove item with dialog confirmation
        await addProductToCart(page, tc.productName, 1);
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();

        let dialogTriggered = false;
        page.on('dialog', async dialog => {
          dialogTriggered = true;
          if (tc.confirmAction === 'accept') {
            await dialog.accept();
          } else {
            await dialog.dismiss();
          }
        });

        const deleteBtn = page.getByRole('button', { name: 'Xóa' });
        await deleteBtn.click();

        // Assertion Pattern 2: Element State/Visibility (Check if dialog popped up)
        expect(dialogTriggered).toBe(true);

        const rows = page.locator('table tbody tr');
        if (tc.confirmAction === 'accept') {
          await expect(rows).toHaveCount(0);
        } else {
          await expect(rows).toHaveCount(1);
        }
      }

      else if (tc.testId === 'TC11') {
        // Check exact column headers
        await addProductToCart(page, tc.productName, 1);
        await page.getByRole('link', { name: 'Giỏ hàng' }).click();

        const headers = page.locator('table thead tr th');
        // Column index 1 must be exactly "Đơn giá"
        await expect(headers.nth(1)).toHaveText(tc.expectedHeader);
      }

      else if (tc.testId === 'TC12') {
        // Continue shopping button redirects to homepage
        await page.goto('/cart');

        const continueShoppingBtn = page.getByRole('link', { name: 'Tiếp tục mua sắm' });
        await expect(continueShoppingBtn).toBeVisible();
        await continueShoppingBtn.click();

        // Assertion Pattern 3: URL / Navigation State
        await expect(page).toHaveURL(/.*\/$/);
      }
    });
  }
});
