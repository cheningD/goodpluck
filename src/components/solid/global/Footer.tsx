import { type Component } from "solid-js";
import wordmark from "src/assets/img/wordmark.svg";

const Footer: Component = () => {
  return (
    <footer class="bg-brand-off-white py-12 w-full">
      <div class="max-w-[85rem] px-8 mx-auto flex justify-around text-green-800 ">
        <img
          src={wordmark.src}
          alt="Goodpluck Logo"
          class="mx-auto lg:mx-0 h-6 shrink-0 text-red-500"
        />
        <div>
          <ul class="text-lg">
            <li class="mb-4">
              <a href="/privacy" class="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
            </li>
            <li class="mb-4">
              <a href="/terms" class="text-gray-600 hover:text-gray-900">
                Terms & Conditions
              </a>
            </li>
            <li class="mb-4">
              <a href="/returns" class="text-gray-600 hover:text-gray-900">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="/credits" class="text-gray-600 hover:text-gray-900">
                Website Credits
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="text-center text-sm text-gray-600 mt-4">
        © 2024 WhatsEatLike, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
