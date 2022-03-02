// Libraries
import React from "react";
import uniqBy from "lodash.uniqby";

// Hooks
import useFetchUserEvents from "src/hooks/useFetchUserEvents";

// Components
import { Heading, Stack } from "src/components/common";
import EventListItem from "src/components/EventListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";

////////////////////////////////////////////////////////////////////////////////
// AttendingEvents

const AttendingEvents = (props) => {
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const limit = React.useMemo(() => (page === 0 ? 6 : 1), [page]);
  const [{ events, pagination }, state] = useFetchUserEvents(
    props?.user?.id,
    page,
    limit
  );
  const [allEvents, setAllEvents] = React.useState([]);
  const hasEvents = React.useMemo(
    () => Boolean(allEvents) && allEvents.length > 0,
    [allEvents]
  );

  React.useEffect(() => {
    if (events) {
      setAllEvents((prev) => uniqBy([...prev, ...events], "id"));
    }
  }, [events]);

  const displaySilhouette = React.useMemo(
    () =>
      (state === "idle" || state === "loading") && page === 0 && !hasLoadedOnce,
    [state, page]
  );
  const displayEmptyText = React.useMemo(
    () => state === "done" && !hasEvents && page === 0,
    [state, hasEvents, page]
  );

  React.useEffect(() => {
    if (state === "done") {
      setHasLoadedOnce(true);
    }
  }, [state]);

  return (
    <React.Fragment>
      {displaySilhouette ? (
        <SliderSilhouette />
      ) : (
        <Stack as="section" spacing={4} bg="white">
          <Heading as="h3" fontSize="xl">
            {Boolean(props.title) ? props.title : "Events you're attending"}
          </Heading>
          {displayEmptyText ? (
            <EmptyText>
              {Boolean(props.emptyText)
                ? props.emptyText
                : "You are not attending any upcoming events"}
            </EmptyText>
          ) : (
            <Slider
              settings={{
                className: allEvents?.length < 5 ? "slick--less-slides" : "",
              }}
              onPageChange={(nextPage) => setPage(nextPage)}
            >
              {allEvents?.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  school={event.school}
                />
              ))}
            </Slider>
          )}
        </Stack>
      )}
    </React.Fragment>
  );
};

export default AttendingEvents;
