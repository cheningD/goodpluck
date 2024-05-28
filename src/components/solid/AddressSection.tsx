import MapboxAutofill from "./MapboxAutofill";
import { TextInput } from "./TextInput";
import { type Accessor, type Component, type Setter } from "solid-js";

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
          label="Street Address"
          value={form().address}
          autocomplete="address-line1"
          onChange={handleInputChange("address")}
          onBlur={() => {
            if (!form().address) {
              setFieldError("address", " "); // Forces only the border to turn red without showing an error message
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
              setFieldError("city", " "); // Forces only the border to turn red without showing an error message
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
                setFieldError("state", " "); // Forces only the border to turn red without showing an error message
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
                setFieldError(
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
      <MapboxAutofill mapboxToken={mapboxToken} />
    </>
  );
};
