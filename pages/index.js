import React from "react";
import { Heading, Text, Stack, VisuallyHidden } from "@chakra-ui/react";
import dynamic from "next/dynamic";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import RecentlyCreatedEvents from "src/components/RecentlyCreatedEvents";
import RecentlyCreatedUsers from "src/components/RecentlyCreatedUsers";
import SliderLazyLoad from "src/components/SliderLazyLoad";
import ConditionalWrapper from "src/components/ConditionalWrapper";

// Providers
import { useAuth } from "src/providers/auth";

// Dynamic Components
const UserCreatedEvents = dynamic(
  () => import("src/components/UserCreatedEvents"),
  { ssr: false }
);
const AttendingEvents = dynamic(
  () => import("src/components/AttendingEvents"),
  { ssr: false }
);
const UpcomingSchoolEvents = dynamic(
  () => import("src/components/UpcomingSchoolEvents"),
  { ssr: false }
);
const NearbySchools = dynamic(() => import("src/components/NearbySchools"), {
  ssr: false,
});

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async () => {
  return { props: {} };
};

////////////////////////////////////////////////////////////////////////////////
// Home

const Home = () => {
  const { user, school, isAuthenticated } = useAuth();

  return (
    <SiteLayout>
      <Article fullWidthDesktop {...(isAuthenticated ? { py: 0 } : {})}>
        <ConditionalWrapper
          condition={isAuthenticated}
          wrapper={(children) => <VisuallyHidden>{children}</VisuallyHidden>}
        >
          <Heading size="2xl" mb={8}>
            Campus Gaming Network
          </Heading>
          <Text fontSize="3xl" color="gray.60">
            Connect with other collegiate gamers for casual or competitive
            gaming at your school or nearby.
          </Text>
        </ConditionalWrapper>
        <Stack pt={8} spacing={8}>
          {isAuthenticated ? (
            <SliderLazyLoad>
              <UserCreatedEvents user={user} />
            </SliderLazyLoad>
          ) : null}
          {isAuthenticated ? (
            <SliderLazyLoad>
              <AttendingEvents user={user} />
            </SliderLazyLoad>
          ) : null}
          {isAuthenticated && Boolean(school) ? (
            <SliderLazyLoad>
              <UpcomingSchoolEvents school={school} />
            </SliderLazyLoad>
          ) : null}
          <SliderLazyLoad>
            <RecentlyCreatedEvents />
          </SliderLazyLoad>
          <SliderLazyLoad>
            <NearbySchools useBrowserLocation />
          </SliderLazyLoad>
          <SliderLazyLoad>
            <RecentlyCreatedUsers />
          </SliderLazyLoad>
        </Stack>
      </Article>
    </SiteLayout>
  );
};

export default Home;
