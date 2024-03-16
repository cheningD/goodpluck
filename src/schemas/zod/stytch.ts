import { z } from "zod";

/* Learn more about Zod:
    Documentation: https://zod.dev/
    Video Tutorial: https://www.youtube.com/watch?v=L6BE-U3oy80
*/

const nameSchema = z
  .object({
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
  })
  .partial()
  .strict();

const attributesSchema = z
  .object({
    ip_address: z.string(),
    user_agent: z.string(),
  })
  .partial()
  .strict();

// https://stytch.com/docs/api/update-user
export const updateStytchUserSchema = z
  .object({
    name: nameSchema,
    attributes: attributesSchema,
    trusted_metadata: z.record(z.any()),
    untrusted_metadata: z.record(z.any()),
  })
  .partial()
  .strict();
