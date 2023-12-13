import { test, expect } from '@playwright/test'

test.describe('Products Page Tests', () => {
  test('should load products successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('product-items')).toBeVisible()
  })

  test('should handle API failure in Market page', async ({ page }) => {
    // Intercept the API request and respond with an error
    await page.route(
      'https://goodpluck.swell.store/api/products?limit=10&page=1',
      async (route) => {
        const json = [
          {
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'Internal Server Error'
            })
          }
        ]
        await route.fulfill({ json })
      }
    )
    await page.goto('/')
    await expect(page.getByTestId('product-error')).toBeVisible()
  })

  test('should load more products on scroll', async ({ page }) => {
    await page.goto('/')

    // Capture the initial state of the child elements (products)
    // await page.getByTestId('product-items')
    // Wait for potential lazy loading of items
    await page.waitForTimeout(5000)

    const initialItems = await page
      .getByTestId('product-items')
      .locator('li')
      .count()

    // Scroll to the bottom of the page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })

    // Wait for potential lazy loading of items
    await page.waitForTimeout(5000)

    // Capture the final state of the child elements (products)
    // await page.getByTestId('product-items')
    const finalItems = await page
      .getByTestId('product-items')
      .locator('li')
      .count()

    console.log(`finalItems: ${finalItems} initialItems: ${initialItems}`)
    expect(finalItems).toBeGreaterThan(initialItems)
  })

  test('should handle retrying after a failed API call in Market page', async ({
    page
  }) => {
    // Intercept the API request and respond with an error
    await page.route(
      'https://goodpluck.swell.store/api/products?limit=10&page=1',
      async (route) => {
        const json = [
          {
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
              message: 'Internal Server Error'
            })
          }
        ]
        await route.fulfill({ json })
      }
    )

    await page.goto('/')
    await expect(page.getByTestId('product-error')).toBeVisible()

    await page.unroute(
      'https://goodpluck.swell.store/api/products?limit=10&page=1'
    )

    // Click the retry button
    await page.getByTestId('retry-fetch').click()

    // Verify that products are now loaded successfully
    await expect(page.getByTestId('product-items')).toBeVisible()
  })

  test('should handle no Products found in the Market page', async ({
    page
  }) => {
    // Intercept the API request and respond with an empty list
    await page.route(
      'https://goodpluck.swell.store/api/products?limit=10&page=1',
      async (route) => {
        const json = [
          {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              results: []
            })
          }
        ]
        await route.fulfill({ json })
      }
    )

    await page.goto('/')
    await expect(page.getByTestId('no-products')).toBeVisible()
  })
})
