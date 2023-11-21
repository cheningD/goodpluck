/// <reference types="astro/client" />

type ENV = {
  // Add your environment variables here
  STYTCH_PROJECT_ID: string;
  STYTCH_PROJECT_SECRET: string;
  SWELL_STORE_ID: string;
  SWELL_SECRET_KEY: string;
};

// Depending on your adapter mode
// use `AdvancedRuntime<ENV>` for advance runtime mode
// use `DirectoryRuntime<ENV>` for directory runtime mode
type Runtime = import("@astrojs/cloudflare").AdvancedRuntime<ENV>;
declare namespace App {
  interface Locals extends Runtime {}
}
