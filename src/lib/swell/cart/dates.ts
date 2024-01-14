import { addDays, startOfDay, endOfDay, startOfWeek } from "date-fns";

const calculateCartDates = (): {
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

export default calculateCartDates;
