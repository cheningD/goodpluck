import { isZipCodeDeliverable } from "@utils/validations";
import type { Product } from "swell-js";

const completeOrder = (e: Event): void => {
  e.preventDefault();
  window.location.href = "/join";
};

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault();
  if (zip() === "") {
    setZipRequired(true);
    return;
  }

  if (!isZipCodeDeliverable(zip())) {
    window.location.href = "/waitlist";
    return;
  }
  try {
    const response = await fetch("/api/swell", {
      method: "POST",
      body: JSON.stringify({
        method: "ZIP",
        cartId: basketId,
        zip: zip(),
      }),
    });

    if (response.ok) {
      setHasValidZip(true);
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("An error occurred during the fetch:", error);
  }
};

const createOrder = async (): Promise<void> => {
  if (deliveryDate() === null) {
    alert("No delivery date selected!");
  }

  try {
    const response = await fetch("/api/swell", {
      method: "POST",
      body: JSON.stringify({
        method: "DELIVERYDATE",
        cartId: basketId,
        deliveryDate: deliveryDate(),
      }),
    });

    if (response.ok) {
      const cartDeliveryDateUpdated: GoodpluckCart | null = activeBasket();
      if (cartDeliveryDateUpdated !== null) {
        cartDeliveryDateUpdated.delivery_date = deliveryDate();
        setActiveBasket(cartDeliveryDateUpdated);
      }
      swellCartDeliveryDate.set(deliveryDate()?.toISOString());
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("An error occurred during the fetch:", error);
  }
};

const fetchProducts = async (): Promise<void> => {
  if (activeBasket()?.items) {
    const promises = activeBasket().items.map(async (item) => {
      const params = {
        method: "ITEM",
        itemId: item.product_id ?? "",
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/swell?${queryString}`, {
        method: "GET",
      });

      if (response.ok) {
        const product: Product = await response.json();
        return product.data;
      } else {
        return null;
      }
    });

    const products = await Promise.all(promises);

    setActiveBasketProducts((previousItems: Product[]) => [
      ...previousItems,
      ...(products.filter((product) => product !== null) as Product[]),
    ]);
  }
};

const deleteFromCart = async (
  event: MouseEvent,
  product: Product,
): Promise<void> => {
  event.preventDefault();
  try {
    const response = await fetch("/api/swell", {
      method: "POST",
      body: JSON.stringify({
        method: "DELETEITEM",
        itemId: product.id,
      }),
    });

    if (response.ok) {
      setLastBasketItemRemoved(product);
      setIsBasketUpdated(true);
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("An error occurred during the fetch:", error);
  }
};

export {
  completeOrder,
  handleSubmit,
  createOrder,
  fetchProducts,
  deleteFromCart,
};
