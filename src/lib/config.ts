import { ProxyAgent, setGlobalDispatcher } from "undici";

const {
  OIDC_AUTHORITY,
  OIDC_IDENTIFIER = "preferred_username",
  OPENAI_API_KEY,
  HTTPS_PROXY,
} = process.env;
export const authEnabled = !!OIDC_AUTHORITY;
export const oidcIdentifier = OIDC_IDENTIFIER;
export const aiEnabled = !!OPENAI_API_KEY;

if (HTTPS_PROXY) {
  // Corporate proxy uses CA not in undici's certificate store
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const dispatcher = new ProxyAgent({ uri: new URL(HTTPS_PROXY).toString() });
  setGlobalDispatcher(dispatcher);
}
