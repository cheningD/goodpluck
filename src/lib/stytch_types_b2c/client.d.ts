import { BaseClient, type ClientConfig } from "../shared/client";
import { type CryptoWallets } from "./crypto_wallets";
import { type JwtConfig } from "../shared/sessions";
import { type M2M } from "./m2m";
import { type MagicLinks } from "./magic_links";
import { type OAuth } from "./oauth";
import { type OTPs } from "./otps";
import { type Passwords } from "./passwords";
import { type Sessions } from "./sessions";
import { type TOTPs } from "./totps";
import { type Users } from "./users";
import { type WebAuthn } from "./webauthn";
export declare class Client extends BaseClient {
  protected jwtConfig: JwtConfig;
  cryptoWallets: CryptoWallets;
  m2m: M2M;
  magicLinks: MagicLinks;
  oauth: OAuth;
  otps: OTPs;
  passwords: Passwords;
  sessions: Sessions;
  totps: TOTPs;
  users: Users;
  webauthn: WebAuthn;
  constructor(config: ClientConfig);
}
