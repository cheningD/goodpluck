import { test, expect } from '@playwright/test'

test.describe('Basket Sidebar Tests', () => {
  test(`When a user attempts to open the basket or edit it without a Zipcode
   on record, trigger the right sidebar to display the Zipcode entry form.`, async ({
    page
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('top-banner')).toBeVisible()
    await page.getByTestId('top-banner-zip').click()
    await expect(page.getByTestId('basket-sidebar')).toBeVisible()
    await expect(page.getByTestId('basket-tab-zip')).toBeVisible()
  })
  test(`If the Zipcode is not in the service area,
    redirect the user to a waitlist signup page.`, async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('top-banner')).toBeVisible()
    await page.getByTestId('top-banner-zip').click()
    await expect(page.getByTestId('basket-sidebar')).toBeVisible()
    await expect(page.getByTestId('basket-tab-zip')).toBeVisible()
    await page.getByTestId('user-zip').fill('00000')
    await page.getByTestId('btn-verify-zip').click()
    await page.waitForURL('**/waitlist')
  })
  test(`Upon successful entry, store the Zipcode in the browser's
     local storage under the key gp_zip.`, async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('top-banner')).toBeVisible()
    await page.getByTestId('top-banner-zip').click()
    await expect(page.getByTestId('basket-sidebar')).toBeVisible()
    await expect(page.getByTestId('basket-tab-zip')).toBeVisible()
    await page.getByTestId('user-zip').fill('48080')
    await page.getByTestId('btn-verify-zip').click()
    await expect(page.getByTestId('basket-tab-orders')).toBeVisible()
    const localStorage = await page.evaluate(() => {
      const gpZip = localStorage.getItem('gp_zip')
      if (gpZip) {
        return gpZip
      }
      return null
    })
    expect(localStorage).toBeDefined()
    expect(localStorage).toBe('48080')
  })
  test(`Ensure the entered Zipcode persists across browser
   sessions by also saving it in a browser cookie.`, async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('top-banner')).toBeVisible()
    await page.getByTestId('top-banner-zip').click()
    await expect(page.getByTestId('basket-sidebar')).toBeVisible()
    await expect(page.getByTestId('basket-tab-zip')).toBeVisible()
    await page.getByTestId('user-zip').fill('48080')
    await page.getByTestId('btn-verify-zip').click()
    await expect(page.getByTestId('basket-tab-orders')).toBeVisible()
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find((cookie) => cookie.name === 'gp_zip')
    expect(sessionCookie).toBeDefined()
    expect(sessionCookie?.value).toBe('48080')
  })
  test(`Post Zipcode submission, the user should be able to add items to their
    basket without any further prompts for the Zipcode.`, async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('top-banner')).toBeVisible()
    await page.getByTestId('top-banner-zip').click()
    await expect(page.getByTestId('basket-sidebar')).toBeVisible()
    await expect(page.getByTestId('basket-tab-zip')).toBeVisible()
    await page.getByTestId('user-zip').fill('48080')
    await page.getByTestId('btn-verify-zip').click()
    await page.goto('/waitlist')
    await expect(page.getByTestId('top-banner')).toBeVisible()
    await page.getByTestId('top-banner-zip').click()
    await expect(page.getByTestId('basket-sidebar')).toBeVisible()
    await expect(page.getByTestId('basket-tab-orders')).toBeVisible()
  })
})
