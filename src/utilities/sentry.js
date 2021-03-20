////////////////////////////////////////////////////////////////////////////////
// Sentry Utilities

// Constants
import { PRODUCTION_URL } from "src/constants/other";

export const isProdSentry = () => {
  if (
    typeof window !== "undefined" &&
    Boolean(window) &&
    Boolean(window.location) &&
    Boolean(window.location.href)
  ) {
    return window.location.href === `${PRODUCTION_URL}/`;
  }
  return false;
};
