import { onCleanup, onMount } from "solid-js";

interface MapboxConfirmationProps {
  readonly mapboxToken: string;
}

const MapboxConfirmation = ({ mapboxToken }: MapboxConfirmationProps): null => {
  onMount(() => {
    const script = document.createElement("script");
    script.src = "https://api.mapbox.com/search-js/v1.0.0-beta.18/web.js";
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const form = document.querySelector("form");
      form?.addEventListener("submit", (e) => {
        e.preventDefault();

        // @ts-expect-error - mapboxsearch is not defined
        mapboxsearch
          .confirmAddress(form, {
            accessToken: mapboxToken,
            theme: {
              variables: {
                border: "3px solid rgba(0,0,0,0.35)",
                borderRadius: "18px",
              },
            },
            minimap: {
              defaultMapStyle: ["mapbox", "outdoors-v11"],
              satelliteToggle: true,
            },
          })
          .then((result: { type: string }) => {
            // Doesn't submit form if user closes modal
            if (result.type !== "cancel") {
              form.submit();
            }
          })
          .catch((error: Error) => {
            console.error("Error confirming address:", error);
          });
      });
    };

    onCleanup(() => {
      script.remove();
    });
  });

  return null;
};

export default MapboxConfirmation;
