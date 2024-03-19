import { useStore } from "@nanostores/solid";
import { $cart, $updateCartItems } from "@src/lib/store";
import type { GoodpluckProduct } from "@src/lib/types";
import type { SwellCartItemsUpdate } from "@src/schemas/zod/swell";
import { Show, type Component } from "solid-js";

interface ProductProps {
  product: GoodpluckProduct;
}

const Product: Component<ProductProps> = ({ product }) => {
  return (
    <div>
      <a href={`/product/${product.slug}`}>
        <Show when={product.images !== undefined}>
          <img
            class="h-[200px] w-full object-cover"
            alt={`Image of ${product.name}`}
            src={
              product.images?.[0]?.file?.url ?? "via.placeholder.com/300x200"
            }
            width="300"
            height="200"
            loading="lazy"
            decoding="async"
          />
        </Show>
        <p>{product.name}</p>
        <p>{`${product.unit_quantity} ${product.unit}`}</p>
        <p>${product.price}</p>
      </a>
      <AddToCartButton product={product} />
    </div>
  );
};

export default Product;

// This function checks if an object with a matching `product_id` exists in the `items` array.
// If it does, it updates that object with `newItem`. If it doesn't, it adds `newItem` to the array.
const upsertItem = (
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

const AddToCartButton: Component<ProductProps> = ({ product }) => {
  const { mutate, loading } = useStore($updateCartItems)();
  const cart = useStore($cart);

  const editCartItem = async (id: string, quantity: number): Promise<void> => {
    // If cart does not contain this item, add it
    const cartId = cart()?.id;
    if (!cartId) {
      console.error("Cart ID not found");
      throw new Error("Cart ID not found");
    }
    const combinedItems = upsertItem(
      (cart()?.items as SwellCartItemsUpdate[]) ?? [],
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
    await mutate({ cartId, items });
  };

  const removeCartItem = async (id: string): Promise<void> => {
    const items = (cart()?.items as SwellCartItemsUpdate[]) ?? [];
    await mutate({
      cartId: cart()?.id as string,
      items: items
        .filter((item) => item.product_id !== id)
        .map((item) => {
          return {
            product_id: item.product_id,
            quantity: item.quantity,
          };
        }),
    });
  };

  return (
    <>
      <Show
        when={!cart()?.items?.find((item) => item.product_id === product.id)}
      >
        <button
          aria-label="Add to Cart"
          type="button"
          class="mt-2 bg-brand-red text-white p-2 rounded"
          onClick={() => {
            void editCartItem(product.id, 1);
          }}
        >
          {loading ? "..." : "Add"}
        </button>
      </Show>
      <Show
        when={cart()?.items?.find((item) => item.product_id === product.id)}
      >
        <div class="flex items-baseline">
          <button
            aria-label="Decrease Quantity"
            type="button"
            class="mt-2 bg-brand-red text-white p-2"
            onClick={() => {
              if (
                (cart()?.items?.find((item) => item.product_id === product.id)
                  ?.quantity ?? 1) === 1
              ) {
                void removeCartItem(product.id);
              } else {
                void editCartItem(
                  product.id,
                  (cart()?.items?.find((item) => item.product_id === product.id)
                    ?.quantity ?? 1) - 1,
                );
              }
            }}
          >
            {cart()?.items?.find((item) => item.product_id === product.id)
              ?.quantity === 1
              ? "Remove"
              : "-"}
          </button>
          <p class="mx-4">
            {
              cart()?.items?.find((item) => item.product_id === product.id)
                ?.quantity
            }
          </p>
          <button
            aria-label="Increase Quantity"
            type="button"
            class="mt-2 bg-brand-red text-white p-2  hover:bg-blue-700"
            onClick={() => {
              console.log(
                " cart()?.items?.find((item) => item.product_id === product.id)",
                cart()?.items?.find((item) => item.product_id === product.id),
              );
              void editCartItem(
                product.id,
                (cart()?.items?.find((item) => item.product_id === product.id)
                  ?.quantity ?? 1) + 1,
              );
            }}
          >
            +
          </button>
        </div>
      </Show>
    </>
  );
};
