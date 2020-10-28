import { Integrations } from "@sentry/tracing";
import { isDev } from "../utilities";

export const SENTRY_CONFIG = {
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: isDev() ? "development" : "production"
};
