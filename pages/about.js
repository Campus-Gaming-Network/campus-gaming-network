// Libraries
import React from "react";
import { Text } from "@chakra-ui/react";

// Components
import Article from "src/components/Article";
import Card from "src/components/Card";
import PageHeading from "src/components/PageHeading";
import SiteLayout from "src/components/SiteLayout";

// Constants
import { PRODUCTION_URL } from "src/constants/other";

////////////////////////////////////////////////////////////////////////////////
// About

const About = () => {
  return (
    <SiteLayout
      meta={{ title: "About", og: { url: `${PRODUCTION_URL}/about` } }}
    >
      <Article fullWidthMobile>
        <PageHeading>About Campus Gaming Network</PageHeading>
        <Card>
          <Text>
            Connecting collegiate gamers for casual or competitive gaming at
            your college or nearby schools. We want gaming to connect even more
            people so we hope this website will help students across the country
            find others with similar gaming interests and create connections.
          </Text>
        </Card>
      </Article>
    </SiteLayout>
  );
};

export default About;
