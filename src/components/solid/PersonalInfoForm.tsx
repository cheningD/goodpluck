import { useStore } from "@nanostores/solid";
import { $createSwellAccount, $stytchAuthResp } from "src/lib/store";
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
    emailOptin: false,
  });
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal<
    Record<string, string | null | undefined>
  >({});
  const setError = (field: string, message: string | null): void => {
    setErrors((prev: Record<string, string | null | undefined>) => {
      return { ...prev, [field]: message };
    });
  };
  const createSwellAccountMutation = useStore($createSwellAccount)();
  const { mutate: createSwellAccount } = createSwellAccountMutation;
  const getMutatorErrors = (): any => createSwellAccountMutation.error;

  const validateForm = (): void => {
    const { apartment, emailOptin, ...requiredFields } = form();
    if (Object.values(requiredFields).some((value) => !value)) {
      throw new Error("Please fill out all required fields.");
    }
    setErrors({});
  };

  const submitForm = async (): Promise<void> => {
    setLoading(true);
    validateForm();
    await createSwellAccount({
      first_name: form().firstName,
      last_name: form().lastName,
      phone: form().phone,
      shipping: {
        address1: form().address,
        address2: form().apartment,
        city: form().city,
        state: form().state,
        zip: form().zip,
      },
      email: authResp().data?.user?.emails[0]?.email ?? "",
    });
    if (getMutatorErrors()) throw new Error(getMutatorErrors().message);
    window.location.assign("/join/payment-info");
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    submitForm().catch((err) => {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        general: getMutatorErrors()?.message ?? err.message,
      }));
    });
  };

  const handleInputChange = (fieldName: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <>
      {errors().general && (
        <div class="mb-8 p-4 font-medium text-rose-600 bg-rose-50 rounded border border-rose-500">
          {errors().general}
        </div>
      )}
      <h2 class="text-xl font-semibold mb-4">Delivery Address</h2>
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
                onChange={handleInputChange("firstName")}
                onBlur={() => {
                  if (!form().firstName) {
                    setError("firstName", " "); // Forces only the border to turn red without showing an error message
                  }
                }}
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
                onChange={handleInputChange("lastName")}
                onBlur={() => {
                  if (!form().lastName) {
                    setError("lastName", " "); // Forces only the border to turn red without showing an error message
                  }
                }}
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
              onChange={handleInputChange("phone")}
              onBlur={() => {
                if (!form().phone) {
                  setError(
                    "phone",
                    "Please enter a valid phone number, e.g. (555) 555-1234.",
                  );
                }
              }}
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
              onChange={handleInputChange("address")}
              onBlur={() => {
                if (!form().address) {
                  setError("address", " "); // Forces only the border to turn red without showing an error message
                }
              }}
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
              onChange={handleInputChange("city")}
              onBlur={() => {
                if (!form().city) {
                  setError("city", " "); // Forces only the border to turn red without showing an error message
                }
              }}
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
                onChange={handleInputChange("state")}
                onBlur={() => {
                  if (!form().state) {
                    setError("state", " "); // Forces only the border to turn red without showing an error message
                  }
                }}
                onFocus={() => setErrors((prev) => ({ ...prev, state: null }))}
                error={errors().state}
              />

              <TextInput
                name="zip"
                type="text"
                label="ZIP Code"
                value={form().zip}
                autocomplete="postal-code"
                onChange={handleInputChange("zip")}
                onBlur={() => {
                  if (!form().zip) {
                    setError(
                      "zip",
                      "Please enter a valid ZIP code, e.g. 12345 or 12345-6789.",
                    );
                  }
                }}
                onFocus={() => setErrors((prev) => ({ ...prev, zip: null }))}
                error={errors().zip}
              />
            </div>
          </div>

          <div id="email-optin-container" class="flex mb-9">
            <input
              type="checkbox"
              name="emailOptin"
              id="emailOptin"
              checked={form().emailOptin}
              class="text-green-700 focus:ring-green-800 border border-zinc-400 rounded mt-0.5 cursor-pointer"
              aria-describedby="email-optin-description"
              onChange={handleInputChange("emailOptin")}
            />
            <label for="emailOptin" class="ml-2 text-sm text-gray-500">
              Get text alerts on sales, orders and important account
              information.
            </label>
            <span id="email-optin-description" class="sr-only">
              Check this box if you agree to receive order updates and other
              communications to the provided email.
            </span>
          </div>
        </fieldset>

        <div class="flex justify-end " id="continue-btn-container">
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
