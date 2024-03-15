import { z } from "zod";

const NameSchema = z
  .object({
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
  })
  .partial();

const AttributesSchema = z
  .object({
    ip_address: z.string(),
    user_agent: z.string(),
  })
  .partial();

export const stytchUserUpdateSchema = z
  .object({
    name: NameSchema,
    attributes: AttributesSchema,
    trusted_metadata: z.record(z.any()),
    untrusted_metadata: z.record(z.any()),
  })
  .partial()
  .strict();

export const SwellAccountSchema = z
  .object({
    email: z.string().email(), // already validated by Stytch when first creating the account (`/join/`)
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
      message: "Please enter a valid phone number, e.g., (555) 555-1234",
    }),
    address: z.string(),
    apartment: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, {
      message: "Invalid ZIP code, e.g., 12345 or 12345-6789",
    }),
    consent: z.boolean(),
  })
  .strict();

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
