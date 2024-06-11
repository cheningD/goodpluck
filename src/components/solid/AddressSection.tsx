import { Show } from "solid-js";
import MapboxAutofill from "./MapboxAutofill";
import { TextInput } from "./TextInput";
import {
  type Accessor,
  type Component,
  type Setter,
  createSignal,
} from "solid-js";

interface AddressSectionProps {
  form: [Accessor<Record<string, any>>];
  errors: [
    Accessor<Record<string, string | null | undefined>>,
    Setter<Record<string, string | null | undefined>>,
  ];
  setFieldError: (field: string, message: string | null) => void;
  handleInputChange: (fieldName: string) => (e: Event) => void;
}

export const AddressSection: Component<AddressSectionProps> = (props) => {
  const [showAddressFields, setShowAddressFields] = createSignal(false);
  const [form] = props.form;
  const [errors, setErrors] = props.errors;
  const setFieldError = props.setFieldError;
  const handleInputChange = props.handleInputChange;
  const mapboxToken = import.meta.env.PUBLIC_MAPBOX_DEFAULT_PUBLIC_TOKEN;

  return (
    <>
      <div id="address-section" class="mb-4">
        <TextInput
          name="address"
          type="text"
          label="Address"
          value={form().address}
          autocomplete="address-line1"
          onChange={handleInputChange("address")}
          onBlur={() => {
            if (!form().address) {
              setFieldError("address", " "); // Forces only the border to turn red without showing an error message
            }
            setShowAddressFields(true);
          }}
          onFocus={() => setErrors((prev) => ({ ...prev, address: null }))}
          error={errors().address}
          required
        />
        <Show when={!showAddressFields() && !form().city}>
          <button
            onClick={() => {
              setShowAddressFields(true);
            }}
            class="text-gray-700 underline underline-offset-1 hover:text-orange-500 mb-4"
          >
            + Enter address manually
          </button>
        </Show>

        <div class={showAddressFields() || form().city ? "block" : "hidden"}>
          <TextInput
            name="apartment"
            type="text"
            label="Apt. or Unit No."
            value={form().apartment}
            autocomplete="address-line2"
            onChange={handleInputChange("apartment")}
          />

          <div class="flex md:gap-4 flex-col md:flex-row">
            <TextInput
              name="city"
              type="text"
              label="City"
              value={form().city}
              autocomplete="address-level2"
              onChange={handleInputChange("city")}
              onBlur={() => {
                if (!form().city) {
                  setFieldError("city", " "); // Forces only the border to turn red without showing an error message
                }
              }}
              onFocus={() => setErrors((prev) => ({ ...prev, city: null }))}
              error={errors().city}
              required
            />
            <TextInput
              name="state"
              type="text"
              label="State"
              placeholder="MI"
              value={form().state}
              autocomplete="address-level1"
              onChange={handleInputChange("state")}
              onBlur={() => {
                if (!form().state) {
                  setFieldError("state", " "); // Forces only the border to turn red without showing an error message
                }
              }}
              onFocus={() => setErrors((prev) => ({ ...prev, state: null }))}
              error={errors().state}
              required
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
                  setFieldError("zip", "Please enter a valid 5 digit zip code");
                }
              }}
              onFocus={() => setErrors((prev) => ({ ...prev, zip: null }))}
              error={errors().zip}
              required
            />
          </div>
        </div>
      </div>
      <MapboxAutofill mapboxToken={mapboxToken} />
    </>
  );
};
