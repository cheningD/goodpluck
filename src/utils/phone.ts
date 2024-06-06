import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

/**
 * Validates a phone number using libphonenumber-js.
 *
 * @param phoneNumber - The phone number to validate.
 * @param country - The default country code used for parsing, default is 'US'.
 * @returns A boolean indicating if the phone number is valid.
 * @example
 * ```
 * const isValid = validatePhoneNumber("555-555-1234", "US");
 * console.log(isValid); // true
 * ```
 *
 * @see {@link https://github.com/catamphetamine/libphonenumber-js | libphonenumber-js}

 */
export const validatePhoneNumber = (
  phoneNumber: string,
  country: CountryCode = "US",
): boolean =>
  parsePhoneNumberFromString(phoneNumber, country)?.isValid() ?? false;

/**
 * Normalizes a phone number to E.164 format using libphonenumber-js.
 *
 * @param phoneNumber - The phone number to normalize.
 * @param country - The default country code used for parsing, default is 'US'.
 * @returns The phone number in E.164 format.
 * @throws Will throw an error if the phone number is invalid.
 * @example
 * ```
 * const normalized = normalizePhoneNumber("555-555-1234", "US");
 * console.log(normalized); // "+15555551234"
 * ```
 *
 * @see {@link https://www.twilio.com/docs/glossary/what-e164 | E.164 Format}
 * @see {@link https://github.com/catamphetamine/libphonenumber-js | libphonenumber-js}

 */
export const normalizePhoneNumber = (
  phoneNumber: string,
  country: CountryCode = "US",
): string => {
  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, country);
  if (!parsedPhoneNumber?.isValid()) {
    throw new Error(`Invalid phone number provided: ${phoneNumber}`);
  }
  return parsedPhoneNumber.format("E.164");
};
