import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta
            name="apple-mobile-web-app-title"
            content="Campus Gaming Network"
          />
          <meta name="application-name" content="Campus Gaming Network" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
          <meta name="theme-color" content="#ffffff"></meta>
          <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta
            name="keywords"
            content="campus, gaming, social network, competitive gaming, social gaming, casual gaming, university, college, college gaming, university gaming, social network gaming, student gaming, student"
          />
          <meta name="author" content="Campus Gaming Network" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            strategy="lazyOnload"
            data-domain={process.env.NEXT_PUBLIC_BASE_URL}
            src="https://plausible.io/js/plausible.js"
          />
          <Script
            strategy="lazyOnload"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
