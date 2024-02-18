import { stytch } from "src/lib/stytch";
import { swell } from "..";
import calculateCartDates from "./dates";
import type { Account, Product } from "swell-js";
import type { GoodpluckCart, GoodpluckProduct } from "@src/lib/types";
import { swellCartId } from "@src/store";
import { useStore } from "@nanostores/solid";
import type { CartItemSnake } from "node_modules/swell-js/types/cart/snake";

const {
  orderingWindowStartDate,
  orderingWindowEndDate,
  orderChargeDate,
  deliveryDate,
} = calculateCartDates();

/**
 * Get the active cart for the account
 * @param account - the Swell account
 * @returns Cart or null if it fails to retrieve the cart
 * @throws Error when it fails to retrieve the cart
 */
const getCart = async (account: Account): Promise<GoodpluckCart | null> => {
  try {
    const cart = await swell.get("/carts/", {
      where: {
        account_id: account.id,
        ordering_window_start_date: orderingWindowStartDate,
        ordering_window_end_date: orderingWindowEndDate,
        order_charge_date: orderChargeDate,
        delivery_date: deliveryDate,
        active: true,
      },
    });

    if (cart.results && cart.results.length > 0) {
      return cart.results[0];
    } else {
      console.log("No active carts found or results is undefined");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Get the active cart for the account from the session token
 * @param sessionToken - the session token from Stytch
 * @returns CartType or null if it fails to retrieve the cart
 * @throws Error when it fails to retrieve the cart
 */
const getCartFromSession = async (
  sessionToken: string,
): Promise<GoodpluckCart | null> => {
  try {
    const session = await stytch.sessions.authenticate({
      session_token: sessionToken,
    });
    if (!session) {
      throw new Error("Failed to retrieve user session information.");
    }

    const userEmail = session.user.emails?.[0]?.email;
    if (!userEmail) {
      throw new Error("User email is not available in session.");
    }

    const account = await swell.get(`/accounts/${userEmail}`);
    if (!account) {
      throw new Error("Failed to retrieve user account information.");
    }

    const cart = await getCart(account);
    if (!cart) {
      throw new Error("Failed to fetch or create a cart.");
    }

    return cart;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred: ", error.message);
    } else {
      console.error("Error occurred: ", error);
    }
    return null;
  }
};

/**
 * Create a new cart for the account
 * @param account - the Swell account
 * @returns CartType or null if it fails to create the cart
 * @throws Error when it fails to create the cart
 */
const createCart = async (account: Account): Promise<GoodpluckCart | null> => {
  try {
    console.log("Creating a new cart for the account");
    const newCart = await swell.post("/carts", {
      account_id: account.id,
      shipping: account.shipping,
      currency: "USD",
      active: true,
      guest: false,
      ordering_window_start_date: orderingWindowStartDate,
      ordering_window_end_date: orderingWindowEndDate,
      order_charge_date: orderChargeDate,
      delivery_date: deliveryDate,
    });

    return newCart;
  } catch (error) {
    console.error("Error in createCart:", error);
    return null;
  }
};

/**
 * Get the active cart for the account or create a new one if it doesn't exist
 * @param account - the Swell account
 * @returns CartType or null if it fails to retrieve or create the cart
 * @throws Error when it fails to retrieve or create the cart
 */
const getOrCreateCart = async (
  account: Account,
): Promise<GoodpluckCart | null> => {
  try {
    const activeCart = await getCart(account);
    if (activeCart) {
      console.log("Active cart already exists");
      return activeCart;
    }

    return await createCart(account);
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Get the active cart for a guest user
 * @returns GoodpluckCart or null if it fails to retrieve or create the cart
 * @throws Error when it fails to retrieve or create the cart
 */
const getOrCreateGuestCart = async (): Promise<GoodpluckCart | null> => {
  try {
    const $swellCartId = useStore(swellCartId);
    console.log("swellCartId:backend", $swellCartId());
    if ($swellCartId() !== undefined) {
      const guestCart = await swell.get("/carts/{id}", {
        id: $swellCartId(),
        expand: ["items.product.vendor"],
        // include: {
        //   items: {
        //     url: "/carts/{id}",
        //     // url: "/products/{id}/vendor",
        //     data: {
        //       fields: "items.product",
        //     },
        //   },
        // },
      });
      swellCartId.set(guestCart.id);
      console.log("fetched cartId backend:", $swellCartId());
      console.log("fetched cart backend:", guestCart);
      return guestCart;
    } else {
      const guestCart: GoodpluckCart = await swell.post("/carts");
      console.log("created guest cartId backend:", guestCart.id);
      swellCartId.set(guestCart.id);
      return guestCart;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Update delivery date the active cart for a guest user
 * @param cartId - the current Swell guest Cart id
 * @param deliveryDate - the new delivery date
 * @throws Error when it fails to retrieve or create the cart
 */
const updateGuestCartDeliveryDate = async (
  cartId: string | undefined,
  newDeliveryDate: string,
): Promise<void> => {
  try {
    await swell.put(`/carts/${cartId}`, {
      id: cartId,
      delivery_date: newDeliveryDate,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Update the zip of the active cart for a guest user
 * @param cartId - the current Swell guest Cart id
 * @param zip - the new zip
 * @throws Error when it fails to retrieve or create the cart
 */
const updateGuestCartZip = async (
  cartId: string | undefined,
  newZip: string,
): Promise<void> => {
  try {
    await swell.put(`/carts/${cartId}`, {
      id: cartId,
      shipping: {
        zip: newZip,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Add product to the active cart for a guest user
 * @param cartId - the current Swell guest Cart id
 * @param productId - the product id
 * @throws Error when it fails to retrieve or create the cart
 */
const addProductToGuestCart = async (
  productId: string,
  quantity: number,
): Promise<void> => {
  try {
    const $swellCartId = useStore(swellCartId);

    const guestCart: GoodpluckCart = await swell.get("/carts/{id}", {
      id: $swellCartId(),
    });
    console.log("Guest Cart", guestCart);
    const products = [];
    const existingItemIndex = guestCart?.items?.findIndex(
      (item) => item.product_id === productId,
    );
    if (guestCart?.items) {
      if (existingItemIndex !== -1) {
        for (const item of guestCart?.items) {
          const oldQuantity = item.quantity ? item.quantity : 1;
          const newQuantity = (item.quantity ? item.quantity : 1) + 1;
          const newProduct: CartItemSnake = {
            product_id: item.product_id,
            quantity: item.product_id === productId ? newQuantity : oldQuantity,
          };
          products.push(newProduct);
        }
      } else {
        for (const item of guestCart?.items) {
          const oldQuantity = item.quantity ? item.quantity : 1;
          const newProduct: CartItemSnake = {
            product_id: item.product_id,
            quantity: oldQuantity,
          };
          products.push(newProduct);
        }
        const newProduct: CartItemSnake = {
          product_id: productId,
          quantity: 1,
        };
        products.push(newProduct);
      }
    } else {
      const newProduct: CartItemSnake = {
        product_id: productId,
        quantity: 1,
      };
      products.push(newProduct);
    }

    await swell.put("/carts/{id}", {
      id: $swellCartId(),
      items: {
        $set: products,
      },
    });
    console.log("Product added to Cart : backend", products);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Get the product model
 * @param id - the Swell product id
 * @throws Error when it fails to retrieve the product
 */
const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const product = await swell.get(`/products/${id}`, {
      id,
      include: {
        vendor: {
          url: "/products/{id}/vendor",
          data: {
            fields: "first_name",
          },
        },
      },
    });

    if (product) {
      console.log("getProduct:", product);
      return product;
    } else {
      console.log("No active product found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Remove product from the active cart for a guest user
 * @param productId - the product id
 * @throws Error when it fails to retrieve or create the cart
 */
const removeProductFromGuestCart = async (productId: string): Promise<void> => {
  try {
    const $swellCartId = useStore(swellCartId);

    const guestCart: GoodpluckCart = await swell.get("/carts/{id}", {
      id: $swellCartId(),
    });

    const products = [];
    for (const item of guestCart?.items ?? []) {
      console.log("product item", item.product_id?.toString());
      console.log("product id:", productId);
      if (item.product_id !== productId) {
        products.push({
          product_id: item.product_id,
          quantity: item.quantity ? item.quantity : 1,
        });
      }
    }

    await swell.put("/carts/{id}", {
      id: $swellCartId(),
      items: {
        $set: products,
      },
    });
    console.log(
      `Product removed from Cart id:  ${$swellCartId()}: backend`,
      products,
    );
  } catch (error) {
    console.error(error);
  }
};

/**
 * Get the product list
 * @param categoryId - the categoryId id
 * @param page - the page
 * @throws Error when it fails to retrieve the products
 */
const getProducts = async (
  categoryId: string,
  page: number,
): Promise<GoodpluckProduct[] | null> => {
  try {
    let products = [];
    if (categoryId === "") {
      products = await swell.get(`/products`, {
        limit: 10,
        page,
        include: {
          vendor: {
            url: "/products/{id}/vendor",
            data: {
              fields: "first_name",
            },
          },
        },
      });
    } else {
      products = await swell.get(`/products`, {
        category: `${categoryId}`, // Slug or ID
        limit: 10,
        page,
        include: {
          vendor: {
            url: "/products/{id}/vendor",
            data: {
              fields: "first_name",
            },
          },
        },
      });
    }

    if (products) {
      return products.results as GoodpluckProduct[];
    } else {
      console.log("No active product found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Update product quantity on the active cart for a guest user
 * @param productId - the product id
 * @param quantity - the product quantity
 * @throws Error when it fails to retrieve or create the cart
 */
const updateProductGuestCart = async (
  productId: string,
  quantity: number,
): Promise<void> => {
  try {
    const $swellCartId = useStore(swellCartId);

    const guestCart: GoodpluckCart = await swell.get("/carts/{id}", {
      id: $swellCartId(),
    });

    const products = guestCart?.items;
    const updatedItemIndex = guestCart?.items?.findIndex(
      (item) => item.product_id === productId,
    );
    if (updatedItemIndex === undefined || products === undefined) {
      return;
    }

    console.log(`updatedItemIndex:${updatedItemIndex}`);
    if (updatedItemIndex !== -1) {
      products[updatedItemIndex].quantity = quantity;
      await swell.put("/carts/{id}", {
        id: $swellCartId(),
        items: {
          $set: products,
        },
      });
      console.log(
        `Product updated on Cart id:  ${$swellCartId()}: backend`,
        products,
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export {
  getOrCreateCart,
  getCart,
  createCart,
  getCartFromSession,
  getOrCreateGuestCart,
  updateGuestCartDeliveryDate,
  updateGuestCartZip,
  addProductToGuestCart,
  getProduct,
  removeProductFromGuestCart,
  getProducts,
  updateProductGuestCart,
};
