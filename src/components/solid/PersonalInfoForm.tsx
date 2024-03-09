import { useStore } from "@nanostores/solid";
import {
  $createSwellAccount,
  $currentCartID,
  $stytchAuthResp,
} from "@src/lib/store";
import { createSignal, type Component } from "solid-js";

export const PersonalInfoForm: Component = () => {
  const authResp = useStore($stytchAuthResp);
  const [form, setForm] = createSignal({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "", // optional
    city: "",
    state: "",
    zip: "",
    consent: false, // optional
  });
  const [error, setError] = createSignal<string | null>(null);
  const { mutate, loading } = useStore($createSwellAccount)();

  const validateForm = (): void => {
    const optionalFields = ["apartment", "consent"];
    const allReqFieldsProvided = Object.entries(form()).every(
      ([key, value]) => optionalFields.includes(key) || Boolean(value),
    );

    if (!allReqFieldsProvided)
      throw new Error("Please fill out all required fields.");
  };

  const submitForm = async (): Promise<void> => {
    validateForm();
    await mutate({
      ...form(),
      email: authResp().data?.user.emails[0]?.email ?? "",
    });
    $currentCartID.set(""); // hacky way to force a cart id refresh (in session storage)
    window.location.assign("/join/payment-info");
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    submitForm().catch((err) => setError(err.message ?? err));
  };

  const updateField = (fieldName: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <>
      {error() && (
        <div class="mb-8 p-4 font-medium text-rose-600 bg-rose-50 rounded border border-rose-500">
          {error()}
        </div>
      )}
      <h2 class="text-xl font-semibold mb-4">Personal Info</h2>
      <form id="personal-info-form" method="post" onSubmit={handleSubmit}>
        <fieldset>
          <legend class="sr-only">Personal Information</legend>
          <div id="personal-info-section" class="mb-4">
            <div id="name-container" class="flex md:gap-4 flex-col md:flex-row">
              <div id="first-name-container" class="flex-1 mb-6">
                <label
                  for="first-name"
                  class="block text-base font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  value={form().firstName}
                  autocomplete="given-name"
                  placeholder="Kale"
                  class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                  aria-describedby="first-name-error first-name-description"
                  onChange={updateField("firstName")}
                />
                <span
                  id="first-name-error"
                  class="error-message hidden text-sm text-rose-500"
                >
                  Please enter your first name.
                </span>
                <span id="first-name-description" class="sr-only">
                  Please enter your first name.
                </span>
              </div>

              <div id="last-name-container" class="flex-1 mb-6">
                <label
                  for="last-name"
                  class="block text-base font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  value={form().lastName}
                  autocomplete="family-name"
                  placeholder="Greens"
                  class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                  aria-describedby="last-name-error last-name-description"
                  onChange={updateField("lastName")}
                />
                <span
                  id="last-name-error"
                  class="error-message hidden text-sm text-rose-500"
                >
                  Please enter your last name.
                </span>
                <span id="last-name-description" class="sr-only">
                  Please enter your last name.
                </span>
              </div>
            </div>

            <div id="phone-container" class="mb-6">
              <label
                for="phone"
                class="block text-base font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={form().phone}
                autocomplete="tel-national"
                placeholder="555 555 1234"
                class="peer mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none invalid:[&:not(:placeholder-shown):not(:focus)]:border-rose-500"
                pattern="[0-9]{10}"
                maxlength="10"
                aria-describedby="phone-error phone-description"
                onChange={updateField("phone")}
              />
              <span
                id="phone-error"
                class="error-message hidden text-sm text-rose-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block"
              >
                Please enter a valid phone number, e.g., 555 555 1234.
              </span>
              <span id="phone-description" class="sr-only">
                Please enter your phone number.
              </span>
            </div>
          </div>
          <div id="address-section" class="mb-4">
            <div id="address-container" class="mb-6">
              <label
                for="address"
                class="block text-base font-medium text-gray-700 mb-1"
              >
                Street Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={form().address}
                // todo: see why mapbox isnt working
                // autocomplete="address-line1"
                class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                aria-describedby="address-description"
                onInput={updateField("address")}
              />
              <span id="address-description" class="sr-only">
                Please enter your full street address here.
              </span>
            </div>

            <div id="apartment-container" class="mb-6">
              <label
                for="apartment"
                class="block text-base font-medium text-gray-700 mb-1"
              >
                Apt. or Unit No.{" "}
                <em class="italic text-sm text-gray-500">Optional</em>
              </label>
              <input
                type="text"
                name="apartment"
                id="apartment"
                value={form().apartment}
                autocomplete="address-line2"
                class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                aria-describedby="apartment-description"
                onChange={updateField("apartment")}
              />
              <span id="apartment-description" class="sr-only">
                Optional: Please enter your apartment or unit number for precise
                address details.
              </span>
            </div>

            <div id="city-container" class="mb-6">
              <label
                for="city"
                class="block text-base font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={form().city}
                autocomplete="address-level2"
                class="peer mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                aria-describedby="city-description"
                onChange={updateField("city")}
              />
              <span id="city-description" class="sr-only">
                Please enter your city name.
              </span>
            </div>

            <div
              id="state-zip-container"
              class="flex md:gap-4 flex-col md:flex-row"
            >
              <div id="state-container" class="flex-1 mb-6">
                <label
                  for="state"
                  class="block text-base font-medium text-gray-700 mb-1"
                >
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={form().state}
                  autocomplete="address-level1"
                  class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                  aria-describedby="state-description"
                  onChange={updateField("state")}
                />
                <span id="state-description" class="sr-only">
                  Please enter your state name.
                </span>
              </div>

              <div id="zip-container" class="flex-1 mb-6">
                <label
                  for="zip"
                  class="block text-base font-medium text-gray-700 mb-1"
                >
                  ZIP code
                </label>
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  value={form().zip}
                  autocomplete="postal-code"
                  class="mb-1 text-base py-3 px-4 block w-full border border-zinc-400 rounded shadow-md focus:border-zinc-800 focus:ring-0 focus:outline-none"
                  aria-describedby="zip-description"
                  onChange={updateField("zip")}
                />
                <span id="zip-description" class="sr-only">
                  Please enter your ZIP code.
                </span>
              </div>
            </div>

            <div id="consent-container" class="flex mb-9">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                checked={form().consent}
                class="text-green-700 focus:ring-green-800 border border-zinc-400 rounded mt-0.5 cursor-pointer"
                aria-describedby="consent-description"
                onChange={updateField("consent")}
              />
              <label for="consent" class="ml-2 text-sm text-gray-500">
                Get text alerts on sales, orders and important account
                information.
              </label>
              <span id="consent-description" class="sr-only">
                Check this box if you agree to receive order updates and other
                communications to the provided phone number.
              </span>
            </div>
          </div>
        </fieldset>

        <div class="flex justify-end" id="continue-btn-container">
          <button
            type="submit"
            class="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:border-none focus:ring focus:outline-none focus:ring-green-800 focus:ring-offset-2"
            aria-label="Continue to next step"
            disabled={loading ?? false}
          >
            Continue{""}
            <span class="sr-only">
              Click to submit your details and proceed to the next step.
            </span>
          </button>
        </div>
      </form>
    </>
  );
};
