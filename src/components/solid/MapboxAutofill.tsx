import { onCleanup, onMount, type Component } from "solid-js";

interface MapboxAutofillProps {
  readonly mapboxToken: string;
}

const MapboxAutofill: Component<MapboxAutofillProps> = ({
  mapboxToken,
}: MapboxAutofillProps) => {
  onMount(() => {
    const script = document.createElement("script");
    script.id = "search-js";
    script.src = "https://api.mapbox.com/search-js/v1.0.0-beta.21/web.js";
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-expect-error - mapboxsearch is a global variable
      mapboxsearch.autofill({
        accessToken: mapboxToken,
        options: { country: "us" },
      });
    };

    onCleanup(() => {
      script.remove();
    });
  });

  return null;
};

export default MapboxAutofill;
