import { describe, it, expect } from "vitest";
import {
  validatePhoneNumber,
  normalizePhoneNumber,
} from "../../src/utils/phone";

describe("Phone Number Utilities", () => {
  describe("validatePhoneNumber Tests", () => {
    it("returns true for a valid US phone number", () => {
      expect(validatePhoneNumber("202-555-0178", "US")).toBe(true);
    });

    it("returns false for an invalid US phone number", () => {
      expect(validatePhoneNumber("12345", "US")).toBe(false);
    });

    it("returns false for an empty string", () => {
      expect(validatePhoneNumber("", "US")).toBe(false);
    });
  });

  describe("normalizePhoneNumber Tests", () => {
    it("throws an error for an invalid phone number", (): void => {
      const invalidNumber = (): string => normalizePhoneNumber("12345", "US");
      expect(invalidNumber).toThrow(Error);
    });

    it("throws an error for an empty string", (): void => {
      const emptyNumber = (): string => normalizePhoneNumber("", "US");
      expect(emptyNumber).toThrow(Error);
    });
  });
});
