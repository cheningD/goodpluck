import type { GoodpluckCart } from "src/lib/types";
import type { SwellCartItemsUpdate } from "src/schemas/zod/swell";

// This function checks if an object with a matching `product_id` exists in the `items` array.
// If it does, it updates that object with `newItem`. If it doesn't, it adds `newItem` to the array.
export const upsertSwellItem = (
  items: SwellCartItemsUpdate[],
  newItem: SwellCartItemsUpdate,
): SwellCartItemsUpdate[] =>
  (items.some((item) => item.product_id === newItem.product_id)
    ? items.map((item) =>
        item.product_id === newItem.product_id ? newItem : item,
      )
    : [...items, newItem]
  ).map((item) => {
    return {
      quantity: item.quantity,
      product_id: item.product_id,
    };
  });

export const editItemQuantityCart = async (
  id: string,
  quantity: number,
  cart: GoodpluckCart,
  mutate: any,
): Promise<void> => {
  // If cart does not contain this item, add it
  if (!cart.id) {
    throw new Error("Cart ID not found");
  }
  const combinedItems = upsertSwellItem(
    (cart.items as SwellCartItemsUpdate[]) ?? [],
    {
      product_id: id,
      quantity,
    },
  );
  const items = combinedItems.map((item) => {
    return {
      product_id: item.product_id,
      quantity: item.quantity,
    };
  });
  await mutate({ cartId: cart.id, items });
};

export const removeCartFromCart = async (
  id: string,
  cart: GoodpluckCart,
  mutate: any,
): Promise<void> => {
  await mutate({
    cartId: cart.id as string,
    items: cart.items
      .filter((item) => item.product_id !== id)
      .map((item) => {
        return {
          product_id: item.product_id,
          quantity: item.quantity,
        };
      }),
  });
};
