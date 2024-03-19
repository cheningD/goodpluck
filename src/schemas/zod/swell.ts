import { z } from "zod";
import { getYear } from "date-fns";

const addressFields = {
  _account_address_id: z.string(),
  get account_address_id() {
    return this._account_address_id;
  },
  set account_address_id(value) {
    this._account_address_id = value;
  },
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  country: z.string().length(2),
  first_name: z.string(),
  last_name: z.string(),
  name: z.string(),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
    message: "Please enter a valid phone number, e.g., (555) 555-1234",
  }),
  state: z.string(),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, {
    message: "Invalid ZIP code, e.g., 12345 or 12345-6789",
  }),
};

const AddressSchema = z
  .object({
    ...addressFields,
    active: z.boolean(),
    company: z.string(),
    fingerprint: z.string(),
    parent_id: z.string(),
  })
  .partial()
  .strict(); // prevents additional properties from being added to the object

const CartShippingSchema = z
  .object({
    ...addressFields,
    service: z.string(),
    service_name: z.string(),
    price: z.number(),
    default: z.boolean(),
    account_address: z.any(),
    pickup: z.boolean(),
  })
  .partial()
  .strict();

const CardSchema = z
  .object({
    active: z.boolean(),
    address_check: z.enum(["unchecked", "pass", "fail"]),
    billing: z.any(), // Replace z.any() with the Billing schema
    brand: z.string(),
    cvc_check: z.enum(["unchecked", "pass", "fail"]),
    exp_month: z.number().min(1).max(12),
    exp_year: z.number().min(getYear(new Date())),
    fingerprint: z.string(),
    gateway: z.string(),
    last4: z.string().length(4),
    parent: z.any(), // Replace z.any() with the Account schema
    parent_id: z.string(),
    test: z.boolean(),
    token: z.string(),
    zip_check: z.enum(["unchecked", "pass", "fail"]),
  })
  .partial()
  .strict();

const BillingSchema = z
  .object({
    ...addressFields,
    method: z.enum(["card", "account"]).optional(), // or any one of the manual methods defined in payment settings
    card: CardSchema.omit({ billing: true }).optional(),
    default: z.boolean().optional(),
    account_card_id: z.string().optional(),
    account_card: z.any().optional(),
    amazon: z.any().optional(),
    paypal: z.any().optional(),
    intent: z.any().optional(),
  })
  .strict();

const CartItem = z
  .object({
    bundle_items: z.array(z.object({})),
    delivery: z.enum(["shipment", "giftcard", "subscription"]).nullable(),
    description: z.string(),
    discount_each: z.number(),
    discount_total: z.number(),
    discounts: z.array(z.object({})), // Replace {} with the Discount schema
    metadata: z.object({}),
    options: z.array(z.object({})), // Replace {} with the CartItemOption schema
    orig_price: z.number(),
    price: z.number(),
    price_total: z.number(),
    product_id: z.string(),
    product_name: z.string(),
    product: z.object({}), // Replace {} with the Product schema
    quantity: z.number(),
    shipment_location: z.string(),
    shipment_weight: z.number(),
    subscription_interval: z.string(),
    subscription_interval_count: z.number(),
    subscription_trial_days: z.number(),
    subscription_paid: z.boolean(),
    tax_each: z.number(),
    tax_total: z.number(),
    taxes: z.array(z.object({})), // Replace {} with the Tax schema
    trial_price_total: z.number(),
    variant_id: z.string(),
    variant: z.object({}), // Replace {} with the Variant schema
  })
  .partial()
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
    email_optin: z.boolean().optional(),
    first_name: z.string().optional(),
    group: z.string().optional(),
    last_name: z.string().optional(),
    metadata: z.object({}).optional(),
    name: z.string().optional(),
    orders: z.array(z.object({})).optional(), // Replace {} with the Order schema
    order_count: z.number().optional(),
    order_value: z.number().optional(),
    password: z.string().optional(),
    password_reset_url: z.string().optional(),
    phone: z
      .string()
      .regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
        message: "Please enter a valid phone number, e.g., (555) 555-1234",
      })
      .optional(),
    shipping: AddressSchema.optional(),
    subscriptions: z.array(z.object({})).optional(), // Replace {} with the Subscription schema
    type: z.enum(["individual", "business"]).optional(),
    vat_number: z.string().optional(),
  })
  .partial()
  .strict();

export const SwellCartSchema = z
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
    coupon_code: z.string().optional(),
    coupon_id: z.string().optional(),
    currency: z.string().optional(),
    currency_rate: z.number().optional(),
    date_abandoned: z.string().optional(),
    date_abandoned_next: z.string().optional(),
    date_webhook_first_failed: z.string().optional(),
    date_webhook_last_succeeded: z.string().optional(),
    discount_total: z.number().optional(),
    discounts: z.array(z.object({})).optional(), // Replace {} with the Discount schema
    display_currency: z.string().optional(),
    display_locale: z.string().optional(),
    gift: z.boolean().optional(),
    gift_message: z.string().optional(),
    giftcard_delivery: z.boolean().optional(),
    giftcard_total: z.number().optional(),
    giftcards: z.array(z.object({})).optional(), // Replace {} with the CartGiftCardItem schema
    capture_total: z.number().optional(),
    grand_total: z.number().optional(),
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
    order_id: z.string().optional(),
    orig_price: z.number().optional(),
    promotion_ids: z.array(z.any()).optional(),
    promotions: z.array(z.object({})).optional(), // Replace {} with the Promotion schema
    purchase_link_ids: z.array(z.string()).optional(),
    purchase_links: z.array(z.object({})).optional(), // Replace {} with the PurchaseLink schema
    purchase_links_errors: z.array(z.object({})).optional(),
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
    sub_total: z.number().optional(),
    subscription: z.object({}).optional(), // Replace {} with the Subscription schema
    subscription_delivery: z.boolean().optional(),
    subscription_id: z.string().optional(),
    target_order: z.object({}).optional(), // Replace {} with the Order schema
    target_order_id: z.string().optional(),
    tax_included_total: z.number().optional(),
    tax_total: z.number().optional(),
    taxes: z.array(z.object({})).optional(), // Replace {} with the Tax schema
    taxes_fixed: z.boolean().optional(),
    webhook_attempts_failed: z.number().optional(),
    webhook_response: z.string().optional(),
    webhook_status: z.number().optional(),
  })
  .strict();

export const SwellAccountCreateSchema = SwellAccountSchema.extend({
  email: z.string().email(), // makes the email required
});

export const SwellAccountUpdateSchema = SwellAccountSchema.extend({
  id: z.string(), // makes the id required
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
