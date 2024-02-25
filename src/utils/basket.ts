import type { Cart as CartType } from "swell-js";

const getDeliverySlots = (): Date[] => {
  const slots: Date[] = [];
  const currentDate = new Date();
  const twoWeeksLater = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 14,
  );

  for (
    let date = new Date(currentDate);
    // eslint-disable-next-line no-unmodified-loop-condition
    date <= twoWeeksLater;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 1) {
      slots.push(new Date(date));
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
