import React from "react";
import { Heading, Text, Stack } from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import nookies from "nookies";
import dynamic from "next/dynamic";

// Other
import firebaseAdmin from "src/firebaseAdmin";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import RecentlyCreatedEvents from "src/components/RecentlyCreatedEvents";
import RecentlyCreatedUsers from "src/components/RecentlyCreatedUsers";
import SliderLazyLoad from "src/components/SliderLazyLoad";

// Constants
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES } from "src/constants/other";

// API
import { getUserDetails } from "src/api/user";
import { getSchoolDetails } from "src/api/school";

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

export const getServerSideProps = async (context) => {
  const data = {
    user: null,
    school: null,
  };

  try {
    const cookies = nookies.get(context);
    const token = cookies?.[COOKIES.AUTH_TOKEN]
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;
    const authStatus = token?.uid
      ? AUTH_STATUS.AUTHENTICATED
      : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      const { user } = await getUserDetails(token.uid);

      data.user = user;

      const [schoolDetailsResponse] = await Promise.all([
        getSchoolDetails(user.school.id),
      ]);

      data.school = schoolDetailsResponse.school;
    }
  } catch (error) {
    console.log(error);
    // Do nothing
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Home

const Home = (props) => {
  const { authUser } = useAuth();
  const isAuthenticated = React.useMemo(() => Boolean(authUser?.uid), [
    authUser,
  ]);

  return (
    <SiteLayout>
      <Article fullWidthDesktop>
        <Heading size="2xl" mb={8}>
          Campus Gaming Network
        </Heading>
        <Text fontSize="3xl" color="gray.60">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </Text>
        <Stack pt={8} spacing={8}>
          {isAuthenticated ? (
            <SliderLazyLoad>
              <UserCreatedEvents user={props.user} />
            </SliderLazyLoad>
          ) : null}
          {isAuthenticated ? (
            <SliderLazyLoad>
              <AttendingEvents user={props.user} />
            </SliderLazyLoad>
          ) : null}
          {isAuthenticated && Boolean(props.school) ? (
            <SliderLazyLoad>
              <UpcomingSchoolEvents school={props.school} />
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
