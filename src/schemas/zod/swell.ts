import { z } from "zod";
import { getYear } from "date-fns";

const addressFields = {
  account_address_id: z.string(),
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
    method: z.enum(["card", "account"]), // or any one of the manual methods defined in payment settings
    card: CardSchema.omit({ billing: true }),
    default: z.boolean(),
    account_card_id: z.string(),
    account_card: z.any(),
    amazon: z.any(),
    paypal: z.any(),
    intent: z.any(),
  })
  .partial()
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
    addresses: z.array(AddressSchema),
    balance: z.number(),
    billing: BillingSchema,
    cards: z.array(CardSchema),
    date_first_order: z.date(),
    date_last_order: z.date(),
    email: z.string().email(),
    email_optin: z.boolean(),
    first_name: z.string(),
    group: z.string(),
    last_name: z.string(),
    metadata: z.object({}),
    name: z.string(),
    orders: z.array(z.object({})), // Replace {} with the Order schema
    order_count: z.number(),
    order_value: z.number(),
    password: z.string(),
    password_reset_url: z.string(),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
      message: "Please enter a valid phone number, e.g., (555) 555-1234",
    }),
    shipping: AddressSchema,
    subscriptions: z.array(z.object({})), // Replace {} with the Subscription schema
    type: z.enum(["individual", "business"]),
    vat_number: z.string(),
  })
  .partial()
  .strict();

export const SwellCartSchema = z
  .object({
    abandoned: z.boolean(),
    adandoned_notifications: z.number(),
    account: SwellAccountSchema,
    account_credit_amount: z.number(),
    account_credit_applied: z.boolean(),
    account_id: z.string(),
    account_info_saved: z.boolean(),
    account_logged_in: z.boolean(),
    active: z.boolean(),
    billing: BillingSchema,
    checkout_id: z.string(),
    checkout_url: z.string(),
    comments: z.string(),
    coupon: z.object({}), // Replace {} with the coupon schema
    coupon_code: z.string(),
    coupon_id: z.string(),
    currency: z.string(),
    currency_rate: z.number(),
    date_abandoned: z.string(),
    date_abandoned_next: z.string(),
    date_webhook_first_failed: z.string(),
    date_webhook_last_succeeded: z.string(),
    discount_total: z.number(),
    discounts: z.array(z.object({})), // Replace {} with the discount schema
    display_currency: z.string(),
    display_locale: z.string(),
    gift: z.boolean(),
    gift_message: z.string(),
    giftcard_delivery: z.boolean(),
    giftcard_total: z.number(),
    giftcards: z.array(z.object({})), // Replace {} with the cart_gift_card_item schema
    capture_total: z.number(),
    grand_total: z.number(),
    guest: z.boolean(),
    item_discount: z.number(),
    item_quantity: z.number(),
    item_shipment_weight: z.number(),
    item_tax: z.number(),
    item_tax_included: z.boolean(),
    items: z.array(CartItem),
    metadata: z.object({}),
    notes: z.string(),
    number: z.string(),
    order: z.object({}), // Replace {} with the order schema
    order_id: z.string(),
    orig_price: z.number(),
    promotion_ids: z.array(z.any()),
    promotions: z.array(z.object({})), // Replace {} with the promotion schema
    purchase_link_ids: z.array(z.string()),
    purchase_links: z.array(z.object({})), // Replace {} with the purchase_link schema
    purchase_links_errors: z.array(z.object({})),
    recovered: z.boolean(),
    schedule: z.object({}),
    shipment_delivery: z.boolean(),
    shipment_discount: z.number(),
    shipment_price: z.number(),
    shipment_rating: z.object({}), // Replace {} with the shipment_rating schema
    shipment_tax: z.number(),
    shipment_tax_included: z.boolean(),
    shipment_total: z.number(),
    shipping: CartShippingSchema,
    status: z.enum(["active", "converted", "abandoned", "recovered"]),
    sub_total: z.number(),
    subscription: z.object({}), // Replace {} with the subscription schema
    subscription_delivery: z.boolean(),
    subscription_id: z.string(),
    target_order: z.object({}), // Replace {} with the order schema
    target_order_id: z.string(),
    tax_included_total: z.number(),
    tax_total: z.number(),
    taxes: z.array(z.object({})), // Replace {} with the tax schema
    taxes_fixed: z.boolean(),
    webhook_attempts_failed: z.number(),
    webhook_response: z.string(),
    webhook_status: z.number(),
  })
  .partial()
  .strict();

export const SwellAccountCreateSchema = SwellAccountSchema.extend({
  email: z.string().email(), // makes the email required
});

export const SwellAccountUpdateSchema = SwellAccountSchema.extend({
  id: z.string(), // makes the id required
});

export const SwellAccountCardCreateSchema = CardSchema.extend({
  parent_id: z.string(),
  token: z.string(),
});

export const SwellAccountCardUpdateSchema = CardSchema.extend({
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
      .partial(),
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
export type SwellAccountCreate = z.infer<typeof SwellAccountCreateSchema>;
export type SwellAccountUpdate = z.infer<typeof SwellAccountUpdateSchema>;
export type SwellAccountCardCreate = z.infer<
  typeof SwellAccountCardCreateSchema
>;
export type SwellAccountCardUpdate = z.infer<
  typeof SwellAccountCardUpdateSchema
>;
