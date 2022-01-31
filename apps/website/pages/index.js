import React from "react";
import dynamic from "next/dynamic";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import RecentlyCreatedEvents from "src/components/RecentlyCreatedEvents";
import RecentlyCreatedUsers from "src/components/RecentlyCreatedUsers";
import SliderLazyLoad from "src/components/SliderLazyLoad";
import ConditionalWrapper from "src/components/ConditionalWrapper";
import {
  Heading,
  Text,
  Stack,
  VisuallyHidden,
  Box,
} from "src/components/common";

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
const SchoolLogoSlider = dynamic(
  () => import("src/components/SchoolLogoSlider"),
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
      <Article
        maxW={{ base: "100%", sm: "100%", md: "100%" }}
        px={{ base: 0, md: 0 }}
      >
        <Box
          px={{ base: 4, md: 8 }}
          maxW={{ base: "100%", sm: "90%", md: "90%" }}
        >
          <Heading size="2xl" mb={8}>
            Campus Gaming Network
          </Heading>
          <Text fontSize="3xl" color="gray.60">
            Connect with other collegiate gamers for casual or competitive
            gaming at your school or nearby.
          </Text>
        </Box>
        <Stack pt={8} spacing={8}>
          {isAuthenticated ? (
            <SliderLazyLoad>
              <Box
                px={{ base: 4, md: 8 }}
                maxW={{ base: "100%", sm: "90%", md: "90%" }}
              >
                <UserCreatedEvents user={user} />
              </Box>
            </SliderLazyLoad>
          ) : null}
          {isAuthenticated ? (
            <SliderLazyLoad>
              <Box
                px={{ base: 4, md: 8 }}
                maxW={{ base: "100%", sm: "90%", md: "90%" }}
              >
                <AttendingEvents user={user} />
              </Box>
            </SliderLazyLoad>
          ) : null}
          {isAuthenticated && Boolean(school) ? (
            <SliderLazyLoad>
              <Box
                px={{ base: 4, md: 8 }}
                maxW={{ base: "100%", sm: "90%", md: "90%" }}
              >
                <UpcomingSchoolEvents school={school} />
              </Box>
            </SliderLazyLoad>
          ) : null}
          <SliderLazyLoad>
            <Box
              px={{ base: 4, md: 8 }}
              maxW={{ base: "100%", sm: "90%", md: "90%" }}
            >
              <RecentlyCreatedEvents />
            </Box>
          </SliderLazyLoad>
          <SchoolLogoSlider />
          <SliderLazyLoad>
            <Box
              px={{ base: 4, md: 8 }}
              maxW={{ base: "100%", sm: "90%", md: "90%" }}
            >
              <NearbySchools useBrowserLocation />
            </Box>
          </SliderLazyLoad>
          <SliderLazyLoad>
            <Box
              px={{ base: 4, md: 8 }}
              maxW={{ base: "100%", sm: "90%", md: "90%" }}
            >
              <RecentlyCreatedUsers />
            </Box>
          </SliderLazyLoad>
        </Stack>
      </Article>
    </SiteLayout>
  );
};

export default Home;
