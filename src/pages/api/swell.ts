import {
  addProductToGuestCart,
  getProduct,
  updateGuestCartDeliveryDate,
  updateGuestCartZip,
} from "@src/lib/swell/cart";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  let responseMessage = "";

  try {
    switch (data.method) {
      case "ADDITEM":
        await addProductToGuestCart(data.cartId, data.itemId, 1);
        responseMessage = "Product added to cart successfully";
        break;
      case "DELIVERYDATE":
        await updateGuestCartDeliveryDate(data.cartId, data.deliveryDate);
        responseMessage = "Delivery date updated successfully";
        break;
      case "ZIP":
        await updateGuestCartZip(data.cartId, data.zip);
        responseMessage = "Zip code updated successfully";
        break;
      default:
        return new Response(
          JSON.stringify({
            message: "Invalid request method",
          }),
          { status: 400 },
        );
    }

    return new Response(
      JSON.stringify({
        message: responseMessage,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error processing the request",
        error,
      }),
      { status: 400 },
    );
  }
};

export const GET: APIRoute = async ({ request }) => {
  // process the URL into a more usable format
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  let responseMessage = "";
  console.log("Get", params);
  try {
    let model = null;
    switch (params.get("method")) {
      case "ITEM":
        // const itemId = params.itemId ?? "";
        model = await getProduct(params.get("itemId") ?? "");
        responseMessage = "Product added to cart successfully";
        break;
      default:
        return new Response(
          JSON.stringify({
            message: "Invalid request method",
          }),
          { status: 400 },
        );
    }

    return new Response(
      JSON.stringify({
        message: responseMessage,
        data: model,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error processing the request",
        error,
      }),
      { status: 400 },
    );
  }
};
