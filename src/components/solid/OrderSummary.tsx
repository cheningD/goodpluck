import basket from "src/assets/img/basket.svg";

import type { Component } from "solid-js";

const OrderSummary: Component = () => {
  return (
    <div class="flex flex-col gap-8 bg-brand-cream rounded-md shadow-md my-4 pb-12 w-[424px] items-center">
      <img
        class="w-full h-36 object-cover rounded-t-md"
        src="/src/assets/pics/curated_basket.jpg"
        alt="Seasonal Produce"
      />
      <h1 class="text-2xl text-center mx-6">Welcome to Goodpluck!</h1>

      <p class="text-center text-gray-600 mx-6">
        We’ll start your basket with the best local and seasonal produce
        available each week. Then you can customize your order with your
        favorites!
      </p>

      <div class="bg-yellow-50 shadow-lg rounded-3xl flex flex-row p-4 justify-start gap-8 items-center text-lg  px-8 w-fit">
        <div class="w-16 h-16 rounded-full bg-yellow-300 flex justify-center items-center">
          <img src={basket.src} alt="Goodpluck Logo" class="h-6" />
        </div>
        <div class="flex flex-col">
          <h2 class="font-semibold">Your First Basket</h2>
          <p class="text-base">Edit until 10pm Thursday</p>
          <p class="text-base">Delivered: 8am - 1pm Sun </p>
        </div>
      </div>
      <p class="text-center text-sm text-gray-600 mx-6">
        You can always change your delivery preferences, skip a week, or pause
        your subscription for free on the account page.
      </p>
    </div>
  );
};

export default OrderSummary;
