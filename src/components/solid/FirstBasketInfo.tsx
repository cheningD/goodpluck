import CheckmarkListItem from "./CheckmarkListItem";
import type { Component } from "solid-js";

export const FirstBasketInfo: Component = () => {
  return (
    <>
      <div class="bg-white shadow-md rounded-lg overflow-hidden max-w-xl">
        <img
          class="w-full h-64 object-cover"
          src="/src/assets/pics/curated_basket.jpg"
          alt="Seasonal Produce"
        />
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-2">
            10-12 varieties of the best seasonal produce growing near you right
            now
          </h2>
          <p class="text-gray-600 mb-4">
            Most produce is grown within 2 hours of your doorstep using
            sustainable or organic practices
          </p>
          <ul class="list-disc list-inside text-brand-green">
            <CheckmarkListItem text="$35 - $40 per basket" />
            <CheckmarkListItem text="Free delivery" />
            <CheckmarkListItem text="From local farms in your community" />
            <CheckmarkListItem text="Something new each week" />
          </ul>
        </div>
      </div>
      <div class="bg-white shadow-md rounded-lg mt-6 max-w-xl p-6 text-center">
        <h3 class="text-xl font-semibold text-brand-green mb-2">
          Yours to customize
        </h3>
        <p class="text-gray-700 mb-4">
          Swap, add or remove any item in your basket. Choose from{" "}
          <span class="font-semibold">
            100 more items from small sustainable farms
          </span>{" "}
          in our seasonal market.
        </p>
        <a
          href="/"
          class="block bg-brand-green text-white py-2 px-4 mx-10 rounded hover:bg-green-600"
        >
          Set Your Delivery Preferences
        </a>
      </div>
    </>
  );
};
