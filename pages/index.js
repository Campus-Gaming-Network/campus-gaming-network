import React from "react";
import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import nookies from "nookies";
import firebaseAdmin from "src/firebaseAdmin";
import dynamic from "next/dynamic";
import { usePosition } from "use-position";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import RecentlyCreatedEvents from "src/components/RecentlyCreatedEvents";
import RecentlyCreatedUsers from "src/components/RecentlyCreatedUsers";

// Constants
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES } from "src/constants/other";

// API
import {
  getUserDetails,
  getUserAttendingEvents,
  getUserCreatedEvents,
} from "src/api/user";

// Providers
import { useAuth } from "src/providers/auth";
import { getSchoolDetails } from "src/api/school";

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
    userAttendingEvents: [],
    userCreatedEvents: [],
  };

  try {
    const cookies = nookies.get(context);
    const token =
      Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
        ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
        : null;
    const authStatus =
      Boolean(token) && Boolean(token.uid)
        ? AUTH_STATUS.AUTHENTICATED
        : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      const { user } = await getUserDetails(token.uid);

      data.user = user;

      const [
        userAttendingEventsResponse,
        schoolDetailsResponse,
        userCreatedEventsResponse,
      ] = await Promise.all([
        getUserAttendingEvents(user.id),
        getSchoolDetails(user.school.id),
        getUserCreatedEvents(user.id),
      ]);

      data.userAttendingEvents = userAttendingEventsResponse.events;
      data.school = schoolDetailsResponse.school;
      data.userCreatedEvents = userCreatedEventsResponse.events;
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
  const isAuthenticated = React.useMemo(
    () => Boolean(authUser) && Boolean(authUser.uid),
    [authUser]
  );
  const { latitude, longitude } = usePosition();

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
          {/* {isAuthenticated ? (
            <UserCreatedEvents events={props.userCreatedEvents} />
          ) : null}
          {isAuthenticated ? (
            <AttendingEvents events={props.userAttendingEvents} />
          ) : null} */}
          {isAuthenticated && Boolean(props.school) ? (
            <UpcomingSchoolEvents school={props.school} />
          ) : null}
          <RecentlyCreatedEvents />
          <NearbySchools latitude={latitude} longitude={longitude} />
          <RecentlyCreatedUsers />
        </Stack>
      </Article>
    </SiteLayout>
  );
};

export default Home;
