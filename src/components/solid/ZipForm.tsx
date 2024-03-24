import { useStore } from "@nanostores/solid";
import { $cart, $updateShipping } from "src/lib/store";
import { zipcodes } from "src/lib/zipcodes";
import { Show, createSignal, type Component, onMount } from "solid-js";

export const ZipForm: Component = () => {
  const [showWaitlist, setShowWaitlist] = createSignal(false);
  const [zipInput, setZipInput] = createSignal("");
  const [zipError, setError] = createSignal("");
  const { mutate, loading, error } = useStore($updateShipping)();
  const cart = useStore($cart);

  // This function returns a Promise<void>, which we'll call from our event handler
  const submitForm = async (): Promise<void> => {
    setError(""); // Clear any previous errors
    if (!/^\d{5}$/.test(zipInput())) {
      setError("Zip code must be 5 digits.");
    } else if (!zipcodes[zipInput()]?.deliverable) {
      console.log("show waitlist");
      setShowWaitlist(true);
    } else {
      const id = cart()?.id;
      if (!id) {
        setError("Could not update zip, could not load cart");
        return; // No cart ID, can't update shipping
      }
      const shipping = {
        zip: zipInput(),
      };
      console.log("submitting", id, shipping);
      await mutate({ id, shipping });
    }
  };

  const handleSubmit = (event: Event): void => {
    event.preventDefault(); // Prevent default form submission behavior
    submitForm().catch(console.error); // Handle the async operation and errors
  };

  return (
    <Show
      when={!showWaitlist()}
      fallback={
        <WaitlistForm
          zip={zipInput()}
          city={zipcodes[zipInput()]?.city}
          setShowWaitlist={setShowWaitlist}
        />
      }
    >
      <Show when={cart()?.id} fallback={<div>No cart found.</div>}>
        <form class="flex flex-col gap-2" onSubmit={handleSubmit}>
          <h1>Enter Zip</h1>
          <p>First, let's confirm we deliver to you.</p>
          <label for="zipInput">Zip</label>
          <ZipInput zipInput={zipInput} setZipInput={setZipInput} />
          <button type="submit" disabled={loading ?? false}>
            Submit
          </button>
          {zipError() && <p class="text-red-500">{zipError()}</p>}
          {error && (
            <p class="text-red-500">
              Couldn't update zip, please try again! {`${error}`}
            </p>
          )}
        </form>
      </Show>
    </Show>
  );
};

export default ZipForm;

const ZipInput: Component<any> = ({ zipInput, setZipInput }) => {
  let ref: HTMLInputElement;

  onMount(() => {
    ref.focus();
  });

  return (
    <input
      ref={ref}
      data-testid="zip-input"
      id="zipInput"
      type="text"
      placeholder="e.g. 48123"
      value={zipInput()}
      onInput={(e) => setZipInput(e.currentTarget.value)}
    />
  );
};

interface WaitlistFormProps {
  zip: string;
  city: string | undefined;
  setShowWaitlist: (value: any) => void;
}

const WaitlistForm: Component<WaitlistFormProps> = ({
  zip,
  city,
  setShowWaitlist,
}) => {
  return (
    <div class="flex flex-col gap-4 items-center">
      <h1 class="text-2xl font-bold">{`Sorry, we don't serve ${city ?? zip} yet!`}</h1>
      <p>We expanding to new areas after 30 people join the waitlist.</p>
      <p>
        Join{" "}
        <a
          class="underline hover:font-semibold hover:cursor-pointer text-brand-green"
          href="https://airtable.com/appJVu70KyaMMofIb/shrs9WED21nlCwrrc"
        >
          our waitlist{" "}
        </a>
        and we'll let you know when we are in your neighborhood!
      </p>
      <button
        onClick={() => {
          setShowWaitlist(false);
        }}
      >
        Try a different zip!
      </button>
    </div>
  );
};
