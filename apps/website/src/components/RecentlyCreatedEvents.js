// Libraries
import React from "react";
import uniqBy from "lodash.uniqby";
import { Box, Heading } from "src/components/common";

// Hooks
import useFetchRecentlyCreatedEvents from "src/hooks/useFetchRecentlyCreatedEvents";

// Components
import EventListItem from "src/components/EventListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";

////////////////////////////////////////////////////////////////////////////////
// RecentlyCreatedEvents

const RecentlyCreatedEvents = () => {
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const limit = React.useMemo(() => (page === 0 ? 6 : 1), [page]);
  const [events, state] = useFetchRecentlyCreatedEvents(page, limit);
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
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Newest events
          </Heading>
          {displayEmptyText ? (
            <EmptyText>No events have been recently created</EmptyText>
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
        </Box>
      )}
    </React.Fragment>
  );
};

export default RecentlyCreatedEvents;
