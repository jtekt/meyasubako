const { OIDC_AUTHORITY, OIDC_IDENTIFIER = "preferred_username" } = process.env;
export const authEnabled = !!OIDC_AUTHORITY;
export const oidcIdentifier = OIDC_IDENTIFIER;
