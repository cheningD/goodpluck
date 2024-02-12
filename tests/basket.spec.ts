import { test, expect } from "@playwright/test";

test.describe("Basket Sidebar Tests", () => {
  test(`When a user attempts to open the basket or edit it without a Zipcode
   on record, trigger the right sidebar to display the Zipcode entry form.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click({ force: true });
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await request.delete("/api/swell");
  });

  test(`If the Zipcode is not in the service area,
    redirect the user to a waitlist signup page.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await page.getByTestId("user-zip").fill("00000");
    await page.getByTestId("btn-verify-zip").click();
    await page.waitForURL("**/waitlist");
    await request.delete("/api/swell");
  });

  test(`Select a delivery allows creating an order.
 Show error in case user try adding an order without selecting a date.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await page.getByTestId("user-zip").fill("48210");
    await page.getByTestId("btn-verify-zip").click();
    await page.getByTestId("btn-create-order").click();
    await expect(page.getByTestId("delivery-date-error")).toBeVisible();
    await request.delete("/api/swell");
  });

  test(`First visit after setting a ZIP sidebar shows two tabs: Select Date & My Orders.
 Select date tab shows a list of delivery time slots with option to create order.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await page.getByTestId("user-zip").fill("48210");
    await page.getByTestId("btn-verify-zip").click();
    await expect(page.getByTestId("basket-tab-1")).toBeVisible();
    await expect(page.getByTestId("basket-tab-1")).toHaveText("Select Date");
    await request.delete("/api/swell");
  });

  test(`Cart sidebar tabs name change from Enter ZIP to Select Date after setting
     the ZIP and from Select Date to Delivery 
     Date format when an order has been created.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toHaveText("Enter Zip");
    await page.getByTestId("user-zip").fill("48210");
    await page.getByTestId("btn-verify-zip").click();
    await expect(page.getByTestId("basket-tab-1")).toBeVisible();
    await expect(page.getByTestId("basket-tab-1")).toHaveText("Select Date");
    await page.getByTestId("delivery-date-selector").first().click();
    await page.getByTestId("btn-create-order").click();
    await page.waitForResponse("/api/swell");
    await expect(page.getByTestId("basket-tab-1")).toBeVisible();
    await expect(page.getByTestId("basket-tab-1")).toHaveText(
      /Sunday, .*|Monday, .*/,
    );
    await request.delete("/api/swell");
  });

  test(` By creating an order makes it as the active basket and makes its
     delivery date on top bar.`, async ({ page, browserName, request }) => {
    await page.goto("/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toHaveText("Enter Zip");
    await page.getByTestId("user-zip").fill("48210");
    await page.getByTestId("btn-verify-zip").click();
    await expect(page.getByTestId("basket-tab-1")).toBeVisible();
    await expect(page.getByTestId("basket-tab-1")).toHaveText("Select Date");
    await page.getByTestId("delivery-date-selector").first().click();
    await page.getByTestId("btn-create-order").click();
    await expect(page.getByTestId("basket-tab-1")).toBeVisible();
    await request.delete("/api/swell");
  });
});
