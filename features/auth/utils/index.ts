export const SIGN_IN_PATH = "/sign-in";
export const DEFAULT_AUTH_CALLBACK = "/dashboard";

export const getSafeCallbackPath = (
  callbackUrl: string | null | undefined,
): string => {
  if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  return DEFAULT_AUTH_CALLBACK;
};
