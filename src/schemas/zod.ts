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
