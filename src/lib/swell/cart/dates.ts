import {
  addDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  format,
  parseISO,
  subDays,
} from "date-fns";

export const calculateCartDates = (): {
  orderingWindowStartDate: Date;
  orderingWindowEndDate: Date;
  orderChargeDate: Date;
  deliveryDate: Date;
} => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // If today is Friday, Saturday, or Sunday, the ordering window starts next Monday
  const orderingWindowStartDate = startOfDay(
    dayOfWeek >= 5 || dayOfWeek === 0
      ? addDays(startOfWeek(today, { weekStartsOn: 1 }), 7)
      : startOfWeek(today, { weekStartsOn: 1 }),
  );
  const orderingWindowEndDate = endOfDay(addDays(orderingWindowStartDate, 3));
  const orderChargeDate = startOfDay(addDays(orderingWindowEndDate, 1));
  const deliveryDate = startOfDay(addDays(orderChargeDate, 2));

  return {
    orderingWindowStartDate,
    orderingWindowEndDate,
    orderChargeDate,
    deliveryDate,
  };
};

/**
 * Returns the next available delivery date option based on the current delivery date.
 * The delivery dates are only Sunday and Monday.
 * If the current delivery date is Sunday, it switches to Monday.
 * If the current delivery date is Monday, it switches to Sunday.
 *
 * @param {string} date - The current delivery date as an ISO string.
 * @returns {string} The next available delivery date as an ISO string.
 * @throws {Error} If the input date is not a Sunday or Monday.
 *
 * @example - Current date is a Sunday:
 * const nextDate = getNextDeliveryDateOption("2024-04-07T00:00:00Z");
 * console.log(nextDate); // "2024-04-08T00:00:00Z" (Monday)
 *
 * @example - Current date is a Monday:
 * const nextDate = getNextDeliveryDateOption("2024-04-08T00:00:00Z");
 * console.log(nextDate); // "2024-04-07T00:00:00Z" (Sunday)
 */
export const getNextDeliveryDateOption = (date: string): string => {
  const parsedDate = parseISO(date);
  const dayOfWeek = parsedDate.getDay();

  if (dayOfWeek !== 0 && dayOfWeek !== 1) {
    throw new Error("Input date must be a Sunday or Monday");
  }

  // If the current delivery date is Sunday (0), the next delivery date is Monday (1), else it's Sunday
  const nextDeliveryDate =
    dayOfWeek === 0 ? addDays(parsedDate, 1) : subDays(parsedDate, 1);
  return nextDeliveryDate.toISOString();
};

/**
 * Returns the day of the week for a given date.
 * @param {string} date - The date as an ISO string to get the day of the week for.
 * @returns {string} The day of the week as a string.
 *
 * @example
 * const day = getDayOfWeek("2022-01-02T00:00:00.000Z");
 * console.log(day); // "Sunday"
 */
export const getDayOfWeek = (date: string): string => {
  const parsedDate = parseISO(date);
  return format(parsedDate, "EEEE");
};
