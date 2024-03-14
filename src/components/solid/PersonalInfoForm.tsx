import { useStore } from "@nanostores/solid";
import { $currentCartID, $stytchAuthResp } from "@src/lib/store";
import { createSignal, type Component } from "solid-js";
import { TextInput } from "./TextInput";
import Spinner from "./Spinner";

export const PersonalInfoForm: Component = () => {
  const authResp = useStore($stytchAuthResp);
  const [form, setForm] = createSignal({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    consent: false,
  });
  const [errors, setErrors] = createSignal<
    Record<string, string | null | undefined>
  >({});
  const [loading, setLoading] = createSignal(false);

  const validatePhone = (phone: string): boolean => {
    // eslint-disable-next-line no-useless-escape
    return /^(?:\(\d{3}\)|\d{3})[\s.\-]?\d{3}[\s.\-]?\d{4}$|^\d{10}$/.test(
      phone,
    );
  };
  const validateZip = (zip: string): boolean => /^\d{5}(-\d{4})?$/.test(zip);
  const setError = (field: string, message: string | null): void => {
    setErrors((prev: Record<string, string | null | undefined>) => {
      return { ...prev, [field]: message };
    });
  };

  const validateForm = (): void => {
    const { apartment, consent, ...requiredFields } = form();
    if (Object.values(requiredFields).some((value) => !value)) {
      throw new Error("Please fill out all required fields.");
    }
  };

  const submitForm = async (): Promise<void> => {
    setErrors({});
    setLoading(true);
    validateForm();

    const email = authResp().data?.user.emails[0]?.email ?? "";
    const createAccountResp = await fetch("/api/account/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form(), email }),
    });

    if (!createAccountResp.ok) {
      const { message } = await createAccountResp.json();
      throw new Error(message);
    }

    const {
      account: { id: swellAccountId },
    } = await createAccountResp.json();
    const updateStytchResp = await fetch("/api/auth/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trusted_metadata: { swellAccountId },
      }),
    });

    if (!updateStytchResp.ok) {
      const { message } = await updateStytchResp.json();
      throw new Error(message);
    }

    $currentCartID.set("");
    window.location.assign("/join/payment-info");
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    submitForm().catch((err) => {
      setErrors({ general: err.message });
      setLoading(false);
    });
  };

  const handleInputChange = (fieldName: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;

    if (fieldName === "phone" && !validatePhone(value as string)) {
      setError(
        "phone",
        "Please enter a valid phone number, e.g. (555) 555-1234.",
      );
      return;
    }

    if (fieldName === "zip" && !validateZip(value as string)) {
      setError(
        "zip",
        "Please enter a valid ZIP code, e.g. 12345 or 12345-6789.",
      );
      return;
    }

    if (!value) {
      setError(fieldName, " "); // Forces only the border to turn red without showing an error message
      return;
    }

    setForm((prev) => ({ ...prev, [fieldName]: value }));
    setError(fieldName, null); // Clear any existing error
  };

  return (
    <>
      {errors().general && (
        <div class="mb-8 p-4 font-medium text-rose-600 bg-rose-50 rounded border border-rose-500">
          {errors().general}
        </div>
      )}
      <h2 class="text-xl font-semibold mb-4">Personal Info</h2>
      <form id="personal-info-form" method="post" onSubmit={handleSubmit}>
        <fieldset>
          <legend class="sr-only">Personal Information</legend>
          <div id="personal-info-section" class="mb-4">
            <div id="name-container" class="flex md:gap-4 flex-col md:flex-row">
              <TextInput
                name="firstName"
                type="text"
                label="First Name"
                value={form().firstName}
                autocomplete="given-name"
                placeholder="Kale"
                onBlur={handleInputChange("firstName")}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, firstName: null }))
                }
                error={errors().firstName}
              />
              <TextInput
                name="lastName"
                type="text"
                label="Last Name"
                value={form().lastName}
                autocomplete="family-name"
                placeholder="Greens"
                onBlur={handleInputChange("lastName")}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, lastName: null }))
                }
                error={errors().lastName}
              />
            </div>

            <TextInput
              name="phone"
              type="tel"
              label="Phone Number"
              value={form().phone}
              autocomplete="tel-national"
              placeholder="(555) 555-1234"
              pattern="^(?:\(\d{3}\)|\d{3})[\s.\-]?\d{3}[\s.\-]?\d{4}$|^\d{10}$"
              onBlur={handleInputChange("phone")}
              onFocus={() => setErrors((prev) => ({ ...prev, phone: null }))}
              error={errors().phone}
            />
          </div>

          <div id="address-section" class="mb-4">
            <TextInput
              name="address"
              type="text"
              label="Street Address"
              value={form().address}
              // autocomplete="address-line1"
              onBlur={handleInputChange("address")}
              onFocus={() => setErrors((prev) => ({ ...prev, address: null }))}
              error={errors().address}
            />

            <TextInput
              name="apartment"
              type="text"
              label="Apt. or Unit No."
              value={form().apartment}
              autocomplete="address-line2"
              onChange={handleInputChange("apartment")}
            />

            <TextInput
              name="city"
              type="text"
              label="City"
              value={form().city}
              autocomplete="address-level2"
              onBlur={handleInputChange("city")}
              onFocus={() => setErrors((prev) => ({ ...prev, city: null }))}
              error={errors().city}
            />

            <div class="flex md:gap-4 flex-col md:flex-row">
              <TextInput
                name="state"
                type="text"
                label="State"
                value={form().state}
                autocomplete="address-level1"
                onBlur={handleInputChange("state")}
                onFocus={() => setErrors((prev) => ({ ...prev, state: null }))}
                error={errors().state}
              />

              <TextInput
                name="zip"
                type="text"
                label="ZIP Code"
                value={form().zip}
                autocomplete="postal-code"
                pattern="^\d{5}(-\d{4})?$"
                onBlur={handleInputChange("zip")}
                onFocus={() => setErrors((prev) => ({ ...prev, zip: null }))}
                error={errors().zip}
              />
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
              onBlur={handleInputChange("consent")}
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
        </fieldset>

        <div class="flex justify-end" id="continue-btn-container">
          <button
            type="submit"
            class="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:border-none focus:ring focus:outline-none focus:ring-green-800 focus:ring-offset-2"
            aria-label="Continue to next step"
            disabled={loading() ?? false}
          >
            {loading() ? <Spinner /> : "Continue"}
            <span class="sr-only">
              Click to submit your details and proceed to the next step.
            </span>
          </button>
        </div>
      </form>
    </>
  );
};
