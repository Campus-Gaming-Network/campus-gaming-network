import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
          <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
          <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon.png" />
          <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon-57x57.png" size="57x57" />
          <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon-72x72.png" size="72x72" />
          <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon-114x114.png" size="114x114" />
          <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon-144x144.png" size="144x144" />
          <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon-152x152.png" size="152x152" />
          <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon-180x180.png" size="180x180" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Web site created using create-react-app" />
          {/* manifest.json provides metadata used when your web app is installed on a
          user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/ */}
          <link rel="manifest" href="/manifest.json" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;
