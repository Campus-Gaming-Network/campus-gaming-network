import React from "react";
import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import nookies from "nookies";
import firebaseAdmin from "src/firebaseAdmin";
import dynamic from "next/dynamic";

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
  getUserCreatedEvents
} from "src/api/user";
import { getSchoolEvents } from "src/api/school";
import { getRecentlyCreatedEvents } from "src/api/events";
import { getRecentlyCreatedUsers } from "src/api/users";

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

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  const data = {
    user: null,
    userAttendingEvents: [],
    userCreatedEvents: [],
    schoolEvents: [],
    recentlyCreatedEvents: [],
    recentlyCreatedUsers: []
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
        schoolEventsResponse,
        userCreatedEventsResponse
      ] = await Promise.all([
        getUserAttendingEvents(user.id),
        getSchoolEvents(user.school.id),
        getUserCreatedEvents(user.id)
      ]);

      data.userAttendingEvents = userAttendingEventsResponse.events;
      data.schoolEvents = schoolEventsResponse.events;
      data.userCreatedEvents = userCreatedEventsResponse.events;
    }

    const [
      recentlyCreatedEventsResponse,
      recentlyCreatedUsersResponse
    ] = await Promise.all([
      getRecentlyCreatedEvents(),
      getRecentlyCreatedUsers()
    ]);

    data.recentlyCreatedEvents = recentlyCreatedEventsResponse.events;
    data.recentlyCreatedUsers = recentlyCreatedUsersResponse.users;
  } catch (error) {
    console.log(error);
    // Do nothing
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Home

const Home = props => {
  const { authUser } = useAuth();
  const isAuthenticated = React.useMemo(
    () => Boolean(authUser) && Boolean(authUser.uid),
    [authUser]
  );

  return (
    <SiteLayout>
      <Article>
        <Box>
          <Heading size="2xl" mb={8}>
            Campus Gaming Network
          </Heading>
          <Text fontSize="3xl" color="gray.60">
            Connect with other collegiate gamers for casual or competitive
            gaming at your school or nearby.
          </Text>
          <Stack pt={8} spacing={8}>
            {isAuthenticated ? (
              <UserCreatedEvents events={props.userCreatedEvents} />
            ) : null}
            {isAuthenticated ? (
              <AttendingEvents events={props.userAttendingEvents} />
            ) : null}
            {isAuthenticated ? (
              <UpcomingSchoolEvents events={props.schoolEvents} />
            ) : null}
            <RecentlyCreatedEvents events={props.recentlyCreatedEvents} />
            <RecentlyCreatedUsers users={props.recentlyCreatedUsers} />
          </Stack>
        </Box>
      </Article>
    </SiteLayout>
  );
};

export default Home;
