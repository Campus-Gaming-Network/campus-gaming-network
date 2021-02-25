import { Integrations } from "@sentry/tracing";
import { isDev } from "src/utilities/other";

export const SENTRY_CONFIG = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: isDev() ? "development" : "production"
};
