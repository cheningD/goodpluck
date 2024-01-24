import { formatDate } from "./timeUtils";
import type { Cart as CartType } from "swell-js";

const getDeliverySlots = (): string[] => {
  const slots: string[] = [];
  const currentDate = new Date();
  const oneMonthLater = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate(),
  );

  for (
    let date = new Date(currentDate);
    // eslint-disable-next-line no-unmodified-loop-condition
    date <= oneMonthLater;
    date.setDate(date.getDate() + 1)
  ) {
    // Check if the day is Sunday(0) or Monday (1)
    if (date.getDay() === 0 || date.getDay() === 1) {
      const slot = formatDate(date.toISOString()); // Format the date as Day, Month Num
      slots.push(slot);
    }
  }

  return slots;
};

interface Basket extends CartType {
  orderingWindowStartDate: Date;
  orderingWindowEndDate: Date;
  orderChargeDate: Date;
  deliveryDate: Date;
}

export { getDeliverySlots, type Basket };
