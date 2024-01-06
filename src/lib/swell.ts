import swell, { type Account } from "swell-js";

// Initialize Swell, Access the envirnoment variables from the runtime
// https://docs.astro.build/en/guides/integrations-guide/cloudflare/#cloudflare-runtime
let swellInstance: typeof swell | null = null; // Singleton

export interface AccountMetadata {
  onboarded?: boolean;
  [key: string]: any;
}

export const getSwellClient = (
  storeId: string,
  publicKey: string,
): typeof swell => {
  if (!swellInstance) {
    swell.init(storeId, publicKey);
    swellInstance = swell;
  }
  return swellInstance;
};

export const createAccount = async (
  email: string,
  password: string,
): Promise<void> => {
  try {
    if (!swellInstance) {
      swellInstance = getSwellClient(
        import.meta.env.PUBLIC_SWELL_STORE_ID,
        import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
      );
    }

    await swellInstance.account.create({
      email,
      password,
      type: "individual",
    });
  } catch (error) {
    throw new Error("An error occurred while creating an account.");
  }
};

export const updateAccount = async (account: Account): Promise<void> => {
  try {
    if (!swellInstance) {
      swellInstance = getSwellClient(
        import.meta.env.PUBLIC_SWELL_STORE_ID,
        import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
      );
    }
    await swellInstance.account.update(account);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<Account | null> => {
  try {
    if (!swellInstance) {
      swellInstance = getSwellClient(
        import.meta.env.PUBLIC_SWELL_STORE_ID,
        import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
      );
    }

    await swellInstance.account.login(email, password);
    return await swellInstance.account.get();
  } catch {
    return null;
  }
};

export const getAccount = async (): Promise<Account | null> => {
  try {
    if (!swellInstance) {
      swellInstance = getSwellClient(
        import.meta.env.PUBLIC_SWELL_STORE_ID,
        import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
      );
    }

    return await swellInstance.account.get();
  } catch {
    return null;
  }
};

export const setSessionCookie = (): void => {
  if (!swellInstance) {
    swellInstance = getSwellClient(
      import.meta.env.PUBLIC_SWELL_STORE_ID,
      import.meta.env.PUBLIC_SWELL_PUBLIC_KEY,
    );
  }

  const sessionCookie = swellInstance.session.getCookie();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `gp_session_token=${sessionCookie};expires=${expires.toUTCString()};path=/;Secure;SameSite=Lax`;
};
