import { swell } from "@src/lib/swell";
import type { APIRoute } from "astro";
import { getLoggedInSwellAccountID } from "../auth";
import calculateCartDates from "@src/lib/swell/cart/dates";

// Returns a list of valid carts
export const GET: APIRoute = async ({ request }) => {
  const swellAccountID = await getLoggedInSwellAccountID(request);

  try {
    // If you are not logged in create a guest cart
    const {
      orderingWindowStartDate,
      orderingWindowEndDate,
      orderChargeDate,
      deliveryDate,
    } = calculateCartDates();
    if (!swellAccountID) {
      const cartResponse = await swell.post("/carts", {
        guest: true,
        account_logged_in: false,
        orderingWindowStartDate,
        orderingWindowEndDate,
        orderChargeDate,
        deliveryDate,
      });

      if (cartResponse.errors) {
        return new Response(JSON.stringify({ errors: cartResponse.errors }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify([cartResponse]), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      // If you are logged in list valid carts
      const cartsResponse = await swell.get("/carts", {
        where: {
          guest: false,
          delivery_date: { $gte: new Date() },
        },
        sort: "delivery_date asc",
        limit: 25,
        page: 1,
      });

      // If there are no valid carts for logged in user, create one
      if (cartsResponse === null || cartsResponse.length === 0) {
        const cartResponse = await swell.post("/carts", {
          account_id: swellAccountID,
          guest: false,
          orderingWindowStartDate,
          orderingWindowEndDate,
          orderChargeDate,
          deliveryDate,
        });

        if (cartResponse.errors) {
          return new Response(JSON.stringify({ errors: cartResponse.errors }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        return new Response(JSON.stringify([cartResponse]), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (cartsResponse.errors) {
        return new Response(JSON.stringify({ errors: cartsResponse?.errors }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify(cartsResponse), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (err) {
    console.error("Error fetching carts:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch carts" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
