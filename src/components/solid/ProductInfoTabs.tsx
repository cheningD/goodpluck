import type { GoodpluckProduct } from "src/lib/types";
import { createSignal, type Component } from "solid-js";
import type { Account } from "swell-js";

interface IProps {
  product: GoodpluckProduct;
  vendor: Account;
}

const ProductInfoTabs: Component<IProps> = ({ product, vendor }) => {
  const [tab, setTab] = createSignal("producer");
  const image =
    // @ts-expect-error - The Account type does not have a thumbnail property but it gets added when adding an image to the vendor in the Swell dashboard
    product.images?.[0]?.file?.url ?? vendor.thumbnail[0]?.file?.url;
  const vendorStory = `In 1988, Eric and Kim Christensen purchased an orange grove with a home on it. Once they moved on to the ranch, they started to get ideas about packing and selling their own fruit without going through a large commercial packing house. This gave them the flexibility to grow some of the unique varieties that weren't readily available in produce departments. From this idea, Ripe to You was born. Ripe to You was started by building a small packing facility on the ranch and by packing the Christensens' own fruit. Eric & Kim were excited to pack the different varieties and deliver them to their first customers. Being small allowed them to pick the fruit when it was at its best, and to pick and pack small amounts to meet their customer's needs.`;

  return (
    <section id="additional-info" class="w-full mb-12">
      <div class="flex justify-center">
        <nav class="flex space-x-4" aria-label="Tabs" role="tablist">
          <button
            type="button"
            class={`rounded-t-sm bg-brand-cream py-4 px-8 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-brand-black focus:outline-none ${
              tab() === "producer"
                ? "font-semibold bg-brand-green text-white"
                : ""
            }`}
            id="producer-item"
            aria-controls="producer"
            role="tab"
            onClick={() => setTab("producer")}
          >
            Producer
          </button>
          <button
            type="button"
            class={`rounded-t-sm bg-brand-cream py-4 px-8 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-brand-black focus:outline-none ${
              tab() === "storage-tips"
                ? "font-semibold bg-brand-green text-white"
                : ""
            }`}
            id="storage-tips-item"
            aria-controls="storage-tips"
            role="tab"
            onClick={() => setTab("storage-tips")}
          >
            Storage Tips
          </button>
        </nav>
      </div>

      <div class="border border-custom-silver rounded-md p-12">
        <div
          id="producer"
          role="tabpanel"
          aria-labelledby="producer-item"
          class={`flex lg:flex-row flex-col ${tab() === "producer" ? "block" : "hidden"}`}
        >
          <img
            alt={`Image of ${product.name}`}
            src={image}
            loading="lazy"
            decoding="async"
            class="object-cover rounded-sm mb-8 lg:mb-0 lg:mr-8"
          />
          <div class="ml-4 flex flex-col justify-between leading-normal">
            <h3 class="text-4xl font-bold mb-6 text-brand-green">
              {vendor.name}
            </h3>
            <p class="text-custom-gray">{vendorStory}</p>
          </div>
        </div>
        <div
          id="storage-tips"
          class={`${tab() === "storage-tips" ? "block" : "hidden"}`}
          role="tabpanel"
          aria-labelledby="storage-tips-item"
        >
          <p class="text-custom-gray">{vendorStory}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductInfoTabs;
