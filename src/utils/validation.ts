export const validatePhone = (phone: string): boolean => {
  // eslint-disable-next-line no-useless-escape
  return /^(?:\(\d{3}\)|\d{3})[\s.\-]?\d{3}[\s.\-]?\d{4}$|^\d{10}$/.test(phone);
};

export const validateZip = (zip: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zip);
};

export const phoneErrorMessage =
  "Please enter a valid phone number, e.g. (555) 555-1234.";
export const zipErrorMessage =
  "Please enter a valid ZIP code, e.g. 12345 or 12345-6789.";
