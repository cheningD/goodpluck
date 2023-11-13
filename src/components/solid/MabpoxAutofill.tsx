import { onMount } from 'solid-js';

// TODO: this component sounds OK but it doesn't work
const MapboxAutofill = () => {
  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/search-js/v1.0.0-beta.17/web.js';
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log('mapbox loaded: ', mapboxsearch);
      // @ts-ignore
      mapboxsearch.autofill({
        accessToken:
          'pk.eyJ1IjoidG9vbHMtZ3AtdXNlciIsImEiOiJjbG9wdzcyZHYwZDZyMmpwcWdhZ3Y5eGFwIn0.gjla1E8tbBJNA5_ACCWNPQ',
      });
    };
  });

  return null;
};

export default MapboxAutofill;
