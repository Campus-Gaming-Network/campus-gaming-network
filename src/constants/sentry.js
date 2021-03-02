// Libraries
import { Integrations } from "@sentry/tracing";

// Utilities
import { isProdSentry } from "src/utilities/sentry";

export const SENTRY_CONFIG = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: isProdSentry() ? "production" : "development"
};
