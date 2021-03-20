// Libraries
import React from "react";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from 'next/router'

// Components
import Nav from "src/components/Nav";
import Footer from "src/components/Footer";
import VerifyEmailReminderBanner from "src/components/banners/VerifyEmailReminderBanner";
import BetaWarningBanner from "./banners/BetaWarningBanner";

// Constants
import { PRODUCTION_URL } from "src/constants/other";

const DEFAULT_META = {
  title: "Campus Gaming Network",
  description: "Campus Gaming Network - Connect with other collegiate gamers for casual or competitive gaming at your school or nearby.",
  twitter: {
    card: "summary",
    site: "Campus Gaming Network",
    creator: "@CampusGamingNet",
  },
  og: {
    type: "article",
    url: typeof window !== "undefined" ? window.location.href : PRODUCTION_URL,
    site_name: "Campus Gaming Network",
  },
};

const SiteLayout = ({
  children,
  meta = {},
  hideNav = false,
  hideFooter = false,
  ...rest
}) => {
  const title = React.useMemo(() => {
    let _title = DEFAULT_META.title;

    if (Boolean(meta) && Boolean(meta.title)) {
      _title = meta.title;
    }

    _title = `${_title} | CGN`;

    if (process.env.NODE_ENV !== "production") {
      _title = `DEV | ${_title}`;
    }

    return _title;
  }, [meta]);
  const _meta = React.useMemo(() => {
    // Update our base meta with the updated title
    return {
      ...DEFAULT_META,
      ...meta,
      title,
      twitter: {
        description: DEFAULT_META.description,
        ...DEFAULT_META.twitter,
        ...(Boolean(meta.twitter) ? meta.twitter : {}),
        title,
      },
      og: {
        description: DEFAULT_META.description,
        ...DEFAULT_META.og,
        ...(Boolean(meta.og) ? meta.og : {}),
        title,
      },
    };
  }, [meta, title]);

  return (
    <React.Fragment>
      <Head>
        <title>{_meta.title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=yes"
          key="viewport"
        />
        <meta name="description" content={_meta.description} key="description" />
        {/* Schema.org markup for Google+ */}
        <SchemaMeta meta={_meta} />
        {/* Open Graph data */}
        <OpenGraphMeta meta={_meta.og} />
        {/* Twitter Card data */}
        <TwitterMeta meta={_meta.twitter} />
      </Head>
      <BetaWarningBanner />
      <VerifyEmailReminderBanner />
      {!hideNav ? <Nav /> : null}
      <Box as="main" pb={12} bg="#fdfdfd" minH="100vh" h="100%" {...rest}>
        {children}
      </Box>
      {!hideFooter ? <Footer /> : null}
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// SchemaMeta

const SchemaMeta = (props) => {
  return (
    <React.Fragment>
      <meta itemProp="name" content={props.meta.title} key="schema:title" />
      <meta itemProp="description" content={props.meta.description} key="schema:description" />
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// MetaObject

const MetaObject = (props) => {
  return (
    <React.Fragment>
      {Object.keys(props.meta).map(key => {
        const property = `${props.prefix}:${key}`;
        const value = props.meta[key];

        if (!Boolean(value)) {
          return null;
        }

        return <meta key={property} property={property} content={value} />
      })}
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// OpenGraphMeta

const OpenGraphMeta = (props) => <MetaObject prefix="og" meta={props.meta} />;

////////////////////////////////////////////////////////////////////////////////
// TwitterMeta

const TwitterMeta = (props) => <MetaObject prefix="twitter" meta={props.meta} />;

export default SiteLayout;
