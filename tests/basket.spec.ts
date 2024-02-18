import { test, expect } from "@playwright/test";

test.describe("Basket Sidebar Tests", () => {
  test(`When a user attempts to open the basket or edit it without a Zipcode
   on record, trigger the right sidebar to display the Zipcode entry form.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
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
    await page.waitForURL("**/");
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
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await request.delete("/api/swell");
  });

  test(`Select a delivery allows creating an order.
 Show error in case user try adding an order without selecting a date.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await page.waitForURL("**/");
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
    await page.waitForURL("**/");
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

  test(`By creating an order makes it as the active basket and makes its
     delivery date on top bar.`, async ({ page, browserName, request }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await request.delete("/api/swell");
  });

  test(`Display Reschedule link below the current basket delivery date to 
      reschedule the delivery time.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("reschedule-delivery-link")).toBeVisible();
    await request.delete("/api/swell");
  });

  test(`Provide a "Reschedule" link allowing users to skip their current week's
   order via a modal form.`, async ({ page, browserName, request }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("reschedule-delivery-link")).toBeVisible();
    await page.getByTestId("reschedule-delivery-link").click();
    await expect(page.getByTestId("reschedule-delivery-dialog")).toBeVisible();
    await request.delete("/api/swell");
  });

  test(`Clicking Add product to basket opens the zip form in basket
   sidebar when no zip has been set.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("product-items")).toBeVisible();
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toHaveText("Enter Zip");
    await request.delete("/api/swell");
  });

  test(`Add product makes it on the current basket.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("product-items")).toBeVisible();
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await expect(page.getByTestId("basket-items")).toBeVisible();
    await page.waitForTimeout(30000);
    const basketItems = await page
      .getByTestId("basket-items")
      .locator("li")
      .count();
    expect(basketItems).toBeGreaterThan(0);
    await request.delete("/api/swell");
  });

  test(`The shopping journey state should persist across user sessions.`, async ({
    page,
    browserName,
    request,
  }) => {
    test.skip(browserName === "firefox", "Skipping test in FF");
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("product-items")).toBeVisible();
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await expect(page.getByTestId("basket-items")).toBeVisible();
    await page.waitForTimeout(30000);
    let basketItems = await page
      .getByTestId("basket-items")
      .locator("li")
      .count();
    expect(basketItems).toEqual(1);
    await page.getByTestId("go-home-link").click();
    await page.waitForURL("**/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner-zip")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-items")).toBeVisible();
    await page.waitForTimeout(30000);
    basketItems = await page.getByTestId("basket-items").locator("li").count();
    expect(basketItems).toEqual(1);
    await request.delete("/api/swell");
  });

  test(`Click complete order redirect user to signup.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("product-items")).toBeVisible();
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await expect(page.getByTestId("basket-items")).toBeVisible();
    await page.waitForTimeout(30000);
    const basketItems = await page
      .getByTestId("basket-items")
      .locator("li")
      .count();
    expect(basketItems).toBeGreaterThan(0);
    await page.getByTestId("btn-create-order").click();
    await page.waitForURL("**/join");
    await request.delete("/api/swell");
  });

  test(`Adding product twice should show 2 in quantity on basket.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("product-items")).toBeVisible();
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await expect(page.getByTestId("basket-items")).toBeVisible();
    await page.waitForTimeout(30000);
    const basketItems = await page
      .getByTestId("basket-items")
      .locator("li")
      .count();
    expect(basketItems).toEqual(1);
    await expect(page.getByTestId("basket-item-quantity").first()).toHaveValue(
      "2",
    );
    await request.delete("/api/swell");
  });

  test(`Updating product quantity from basket item should modify the cart correctly.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("product-items")).toBeVisible();
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await page.waitForTimeout(30000);
    const basketItems = await page
      .getByTestId("basket-items")
      .locator("li")
      .count();
    expect(basketItems).toEqual(1);
    await page.getByTestId("basket-item-quantity").selectOption("10");
    await page.getByTestId("go-home-link").click(); // reload page to make sure quantity persist
    await page.waitForURL("**/");
    if (browserName === "chromium" || browserName === "webkit") {
      await page.waitForLoadState("networkidle");
    }
    await expect(page.getByTestId("top-banner-zip")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-items")).toBeVisible();
    await page.waitForTimeout(30000);
    await expect(page.getByTestId("basket-item-quantity").first()).toHaveValue(
      "10",
    );
    await request.delete("/api/swell");
  });

  test(`Removing product from basket should modify the cart correctly.`, async ({
    page,
    browserName,
    request,
  }) => {
    await page.goto("/");
    await page.waitForURL("**/");
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
    await expect(page.getByTestId("product-items")).toBeVisible();
    await page.getByTestId("add-to-cart-btn").first().click();
    await page.waitForResponse("/api/swell");
    await page.getByTestId("add-to-cart-btn").nth(1).click();
    await page.waitForResponse("/api/swell");
    await expect(page.getByTestId("basket-items")).toBeVisible();
    await page.waitForTimeout(30000);
    let basketItems = await page
      .getByTestId("basket-items")
      .locator("li")
      .count();
    expect(basketItems).toEqual(2);
    await page.getByTestId("remove-basket-item-link").first().click();
    await page.waitForTimeout(30000);
    basketItems = await page.getByTestId("basket-items").locator("li").count();
    expect(basketItems).toEqual(1);
    await request.delete("/api/swell");
  });
});
