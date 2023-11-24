import { onMount } from "solid-js";

interface MapboxAutofillProps {
  readonly mapboxToken: string;
}

// TODO: this component sounds OK but it doesn't work
const MapboxAutofill = ({ mapboxToken }: MapboxAutofillProps) => {
  onMount(() => {
    const script = document.createElement("script");
    script.src = "https://api.mapbox.com/search-js/v1.0.0-beta.17/web.js";
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // console.log("mapbox loaded: ", mapboxsearch);
      // @ts-ignore
      mapboxsearch.autofill({
        accessToken: mapboxToken,
      });
    };
  });

  return null;
};

export default MapboxAutofill;
