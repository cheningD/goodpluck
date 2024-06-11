import { zipcodes } from "src/lib/zipcodes";
import { useStore } from "@nanostores/solid";
import { $createSwellAccount, $stytchAuthResp } from "src/lib/store";
import { createSignal, type Component } from "solid-js";
import { TextInput } from "./TextInput";
import { AddressSection } from "./AddressSection";
import Spinner from "./Spinner";
import { validatePhoneNumber } from "src/utils/phone";

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
  const setFieldError = (field: string, message: string | null): void => {
    setErrors((prev: Record<string, string | null | undefined>) => {
      return { ...prev, [field]: message };
    });
  };
  const createSwellAccountMutation = useStore($createSwellAccount)();
  const { mutate: createSwellAccount } = createSwellAccountMutation;
  const getMutatorErrors = (): any => createSwellAccountMutation.error;

  const isZipDeliverable = (zip: string): boolean => {
    return zipcodes[zip]?.deliverable ?? false;
  };

  const validateForm = (): void => {
    setErrors({}); // Clear any previous errors
    const { apartment, emailOptin, ...requiredFields } = form(); // Extract the optional form fields

    // Check for empty required fields
    if (Object.values(requiredFields).some((value) => !value)) {
      setFieldError("general", "Please fill out all required fields.");
      throw new Error("Please fill out all required fields.");
    } else if (!validatePhoneNumber(form().phone, "US")) {
      // Check for valid phone number
      setFieldError("phone", "Please enter a valid phone number");
      throw new Error("Please enter a valid phone number");
    } else if (!isZipDeliverable(form().zip)) {
      // Check if the zip code is deliverable
      setFieldError("zip", "Sorry, we don't deliver to your area yet.");
      throw new Error("Sorry, we don't deliver to your area yet.");
    }
  };

  const submitForm = async (): Promise<void> => {
    setLoading(true);
    try {
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
    } catch (err) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        general:
          getMutatorErrors()?.message ??
          (err instanceof Error ? err.message : "An unknown error occurred"),
      }));
    }
  };

  const handleSubmit = (e: Event): void => {
    e.preventDefault();
    submitForm().catch((err) => {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        general: err.message,
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
                placeholder="Turnip"
                onChange={handleInputChange("firstName")}
                onBlur={() => {
                  if (!form().firstName) {
                    setFieldError("firstName", " "); // Forces only the border to turn red without showing an error message
                  }
                }}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, firstName: null }))
                }
                error={errors().firstName}
                required
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
                    setFieldError("lastName", " "); // Forces only the border to turn red without showing an error message
                  }
                }}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, lastName: null }))
                }
                error={errors().lastName}
                required
              />
            </div>

            <TextInput
              name="phone"
              type="tel"
              label="Phone Number (for order updates)"
              value={form().phone}
              autocomplete="tel-national"
              placeholder="(555) 555-1234"
              onChange={handleInputChange("phone")}
              onBlur={() => {
                if (!validatePhoneNumber(form().phone, "US")) {
                  setFieldError(
                    "phone",
                    "That phone number doesn't look right",
                  );
                }
              }}
              onFocus={() => setErrors((prev) => ({ ...prev, phone: null }))}
              error={errors().phone}
              required
            />
          </div>

          <AddressSection
            form={[form]}
            errors={[errors, setErrors]}
            setFieldError={setFieldError}
            handleInputChange={handleInputChange}
          />

          {/* <div id="email-optin-container" class="flex mb-9">
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
          </div> */}
        </fieldset>

        <div class="flex justify-end " id="continue-btn-container">
          <button
            type="submit"
            class="px-6 py-4 mt-6 w-full bg-brand-yellow border-2 border-black text-center rounded shadow-md hover:bg-yellow-400"
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
