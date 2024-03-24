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

export const formatDeliveryDate = (date: string): string => {
  const parsedDate = parseISO(date);
  const day = format(parsedDate, "EEE"); // Mon, Tue, Wed, etc.
  const month = format(parsedDate, "MMM"); // Jan, Feb, Mar, etc.
  const dayOfMonth = format(parsedDate, "d"); // 1, 2, 3, etc.
  const time = format(parsedDate, "h:mma"); // 1:00AM, 2:00PM, etc.
  return `${day}, ${month} ${dayOfMonth} at ${time}`;
};

// If the day is Sunday, add a day to get Monday; otherwise subtract a day to get Sunday.
export const calculateNewDeliveryDate = (date: string): string => {
  const parsedDate = parseISO(date);
  const dayOfWeek = parsedDate.getDay();
  const newDate =
    dayOfWeek === 0 ? addDays(parsedDate, 1) : subDays(parsedDate, 1); // 0 is Sunday, 1 is Monday, etc.
  return newDate.toISOString();
};

export const getDayOfWeek = (date: string): string => {
  const parsedDate = parseISO(date);
  return format(parsedDate, "EEEE"); // Monday, Tuesday, Wednesday, etc.
};
