import { z } from "zod";
import { getYear } from "date-fns";

const addressFields = {
  accountAddressId: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().length(2).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
      message: "Please enter a valid phone number, e.g., (555) 555-1234",
    })
    .optional(),
  state: z.string().optional(),
  zip: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, {
      message: "Invalid ZIP code, e.g., 12345 or 12345-6789",
    })
    .optional(),
};

const AddressSchema = z
  .object({
    ...addressFields,
    active: z.boolean().optional(),
    company: z.string().optional(),
    fingerprint: z.string().optional(),
    parentId: z.string().optional(),
  })
  .strict(); // prevents additional properties from being added to the object

const CartShippingSchema = z
  .object({
    ...addressFields,
    service: z.string().optional(),
    serviceName: z.string().optional(),
    price: z.number().optional(),
    default: z.boolean().optional(),
    accountAddress: z.any().optional(),
    pickup: z.boolean().optional(),
  })
  .strict();

const CardSchema = z
  .object({
    active: z.boolean().optional(),
    addressCheck: z.enum(["unchecked", "pass", "fail"]).optional(),
    billing: z.any().optional(), // Replace z.any() with the Billing schema
    brand: z.string().optional(),
    cvcCheck: z.enum(["unchecked", "pass", "fail"]).optional(),
    expMonth: z.number().min(1).max(12).optional(),
    expYear: z.number().min(getYear(new Date())).optional(),
    fingerprint: z.string().optional(),
    gateway: z.string().optional(),
    last4: z.string().length(4).optional(),
    parent: z.any().optional(), // Replace z.any() with the Account schema
    parentId: z.string().optional(),
    test: z.boolean().optional(),
    token: z.string(),
    zipCheck: z.enum(["unchecked", "pass", "fail"]).optional(),
  })
  .strict();

const BillingSchema = z
  .object({
    ...addressFields,
    method: z.enum(["card", "account"]).optional(), // or any one of the manual methods defined in payment settings
    card: CardSchema.omit({ billing: true }).optional(),
    default: z.boolean().optional(),
    accountCardId: z.string().optional(),
    accountCard: z.any().optional(),
    amazon: z.any().optional(),
    paypal: z.any().optional(),
    intent: z.any().optional(),
  })
  .strict();

const CartItem = z
  .object({
    bundleItems: z.array(z.object({})).optional(),
    delivery: z
      .enum(["shipment", "giftcard", "subscription"])
      .nullable()
      .optional(),
    description: z.string().optional(),
    discountEach: z.number().optional(),
    discountTotal: z.number().optional(),
    discounts: z.array(z.object({})).optional(), // Replace {} with the Discount schema
    metadata: z.object({}).optional(),
    options: z.array(z.object({})).optional(), // Replace {} with the CartItemOption schema
    origPrice: z.number().optional(),
    price: z.number().optional(),
    priceTotal: z.number().optional(),
    productId: z.string().optional(),
    productName: z.string().optional(),
    product: z.object({}).optional(), // Replace {} with the Product schema
    quantity: z.number().optional(),
    shipmentLocation: z.string().optional(),
    shipmentWeight: z.number().optional(),
    subscriptionInterval: z.string().optional(),
    subscriptionIntervalCount: z.number().optional(),
    subscriptionTrialDays: z.number().optional(),
    subscriptionPaid: z.boolean().optional(),
    taxEach: z.number().optional(),
    taxTotal: z.number().optional(),
    taxes: z.array(z.object({})).optional(), // Replace {} with the Tax schema
    trialPriceTotal: z.number().optional(),
    variantId: z.string().optional(),
    variant: z.object({}).optional(), // Replace {} with the Variant schema
  })
  .strict();

const SwellAccountSchema = z
  .object({
    addresses: z.array(AddressSchema).optional(),
    balance: z.number().optional(),
    billing: BillingSchema.optional(),
    cards: z.array(CardSchema).optional(),
    dateFirstOrder: z.date().optional(),
    dateLastOrder: z.date().optional(),
    email: z.string().email().optional(),
    emailOptin: z.boolean().optional(),
    firstName: z.string().optional(),
    group: z.string().optional(),
    lastName: z.string().optional(),
    metadata: z.object({}).optional(),
    name: z.string().optional(),
    orders: z.array(z.object({})).optional(), // Replace {} with the Order schema
    orderCount: z.number().optional(),
    orderValue: z.number().optional(),
    password: z.string().optional(),
    passwordResetUrl: z.string().optional(),
    phone: z
      .string()
      .regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
        message: "Please enter a valid phone number, e.g., (555) 555-1234",
      })
      .optional(),
    shipping: AddressSchema.optional(),
    subscriptions: z.array(z.object({})).optional(), // Replace {} with the Subscription schema
    type: z.enum(["individual", "business"]).optional(),
    vatNumber: z.string().optional(),
  })
  .strict();

const SwellCartSchema = z
  .object({
    abandoned: z.boolean().optional(),
    adandonedNotifications: z.number().optional(),
    account: SwellAccountSchema.optional(),
    accountCreditAmount: z.number().optional(),
    accountCreditApplied: z.boolean().optional(),
    accountId: z.string().optional(),
    accountInfoSaved: z.boolean().optional(),
    accountLoggedIn: z.boolean().optional(),
    active: z.boolean().optional(),
    billing: BillingSchema.optional(),
    checkoutId: z.string().optional(),
    checkoutUrl: z.string().optional(),
    comments: z.string().optional(),
    coupon: z.object({}).optional(), // Replace {} with the Coupon schema
    couponCode: z.string().optional(),
    couponId: z.string().optional(),
    currency: z.string().optional(),
    currencyRate: z.number().optional(),
    dateAbandoned: z.string().optional(),
    dateAbandonedNext: z.string().optional(),
    dateWebhookFirstFailed: z.string().optional(),
    dateWebhookLastSucceeded: z.string().optional(),
    discountTotal: z.number().optional(),
    discounts: z.array(z.object({})).optional(), // Replace {} with the Discount schema
    displayCurrency: z.string().optional(),
    displayLocale: z.string().optional(),
    gift: z.boolean().optional(),
    giftMessage: z.string().optional(),
    giftcardDelivery: z.boolean().optional(),
    giftcardTotal: z.number().optional(),
    giftcards: z.array(z.object({})).optional(), // Replace {} with the CartGiftCardItem schema
    captureTotal: z.number().optional(),
    grandTotal: z.number().optional(),
    guest: z.boolean().optional(),
    itemDiscount: z.number().optional(),
    itemQuantity: z.number().optional(),
    itemShipmentWeight: z.number().optional(),
    itemTax: z.number().optional(),
    itemTaxIncluded: z.boolean().optional(),
    items: z.array(CartItem).optional(),
    metadata: z.object({}).optional(),
    notes: z.string().optional(),
    number: z.string().optional(),
    order: z.object({}).optional(), // Replace {} with the Order schema
    orderId: z.string().optional(),
    origPrice: z.number().optional(),
    promotionIds: z.array(z.any()).optional(),
    promotions: z.array(z.object({})).optional(), // Replace {} with the Promotion schema
    purchaseLinkIds: z.array(z.string()).optional(),
    purchaseLinks: z.array(z.object({})).optional(), // Replace {} with the PurchaseLink schema
    purchaseLinksErrors: z.array(z.object({})).optional(),
    recovered: z.boolean().optional(),
    schedule: z.object({}).optional(),
    shipmentDelivery: z.boolean().optional(),
    shipmentDiscount: z.number().optional(),
    shipmentPrice: z.number().optional(),
    shipmentRating: z.object({}).optional(), // Replace {} with the ShipmentRating schema
    shipmentTax: z.number().optional(),
    shipmentTaxIncluded: z.boolean().optional(),
    shipmentTotal: z.number().optional(),
    shipping: CartShippingSchema.optional(),
    status: z
      .enum(["active", "converted", "abandoned", "recovered"])
      .optional(),
    subTotal: z.number().optional(),
    subscription: z.object({}).optional(), // Replace {} with the Subscription schema
    subscriptionDelivery: z.boolean().optional(),
    subscriptionId: z.string().optional(),
    targetOrder: z.object({}).optional(), // Replace {} with the Order schema
    targetOrderId: z.string().optional(),
    taxIncludedTotal: z.number().optional(),
    taxTotal: z.number().optional(),
    taxes: z.array(z.object({})).optional(), // Replace {} with the Tax schema
    taxesFixed: z.boolean().optional(),
    webhookAttemptsFailed: z.number().optional(),
    webhookResponse: z.string().optional(),
    webhookStatus: z.number().optional(),
  })
  .strict();

export const SwellAccountCreateSchema = SwellAccountSchema.extend({
  email: z.string().email(), // makes the email required
});

export const SwellAccountUpdateSchema = SwellAccountSchema.extend({
  id: z.string(), // makes the id required
});

export const updateSwellCartSchema = SwellCartSchema.extend({
  id: z.string(),
});

export const SwellCartUpdateSchema = z
  .object({
    id: z.string(), // Swell cart ID
    shipping: z
      .object({
        address1: z.string().max(100),
        address2: z.string().max(100),
        city: z.string().max(50),
        country: z
          .string()
          .length(2)
          .regex(/^[A-Z]{2}$/),
        default: z.boolean(),
        first_name: z.string().max(50),
        last_name: z.string().max(50),
        name: z.string().max(100),
        phone: z.string().max(20),
        price: z.number(),
        service: z.string().max(50),
        service_name: z.string().max(50),
        state: z.string().max(50),
        zip: z.string().regex(/^\d{5}(-\d{4})?$/, {
          message: "Invalid ZIP code, e.g., 12345 or 12345-6789",
        }),
        pickup: z.boolean(),
      })
      .partial()
      .optional(),
  })
  .strict();

export const SwellEditCartItemsUpdateSchema = z.object({
  product_id: z.string(), // Swell product ID
  quantity: z
    .number()
    .int()
    .gte(1, { message: "Minimum quantity is 1" })
    .lte(15, { message: "Maximum quantity is 15" }),
});

export const SwellEditCartItemsSchema = z
  .object({
    cartId: z.string(), // Swell cart ID
    items: z.array(SwellEditCartItemsUpdateSchema),
  })
  .strict();

export type SwellCartUpdate = z.infer<typeof SwellCartUpdateSchema>;
export type SwellCartItemsPutArgs = z.infer<typeof SwellEditCartItemsSchema>;
export type SwellCartItemsUpdate = z.infer<
  typeof SwellEditCartItemsUpdateSchema
>;
