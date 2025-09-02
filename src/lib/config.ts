import { ProxyAgent, setGlobalDispatcher } from "undici";

const {
  OIDC_AUTHORITY,
  OIDC_IDENTIFIER = "preferred_username",
  OPENAI_API_KEY,
  PROXY_URL,
} = process.env;
export const authEnabled = !!OIDC_AUTHORITY;
export const oidcIdentifier = OIDC_IDENTIFIER;
export const aiEnabled = !!OPENAI_API_KEY;

if (PROXY_URL) {
  // Corporate proxy uses CA not in undici's certificate store
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const dispatcher = new ProxyAgent({ uri: new URL(PROXY_URL).toString() });
  setGlobalDispatcher(dispatcher);
}
