// Libraries
import React from "react";
import { Heading, Box } from "src/components/common";

// Hooks
import useFetchSchoolEvents from "src/hooks/useFetchSchoolEvents";

// Components
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";

////////////////////////////////////////////////////////////////////////////////
// UpcomingSchoolEvents

const UpcomingSchoolEvents = (props) => {
  const [{ events }, state] = useFetchSchoolEvents(props?.school?.handle);
  const hasEvents = React.useMemo(
    () => Boolean(events) && events.length > 0,
    [events]
  );

  return (
    <React.Fragment>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            {Boolean(props.title) ? (
              props.title
            ) : (
              <React.Fragment>
                Upcoming events at{" "}
                <Link
                  href={`/school/${props.school.handle}`}
                  color="brand.500"
                  fontWeight="bold"
                  isTruncated
                  lineHeight="short"
                  mt={-2}
                  title={props.school.formattedName}
                >
                  {props.school.formattedName}
                </Link>
              </React.Fragment>
            )}
          </Heading>
          {!(state === "done" && hasEvents) ? (
            <EmptyText>
              {Boolean(props.emptyText) ? (
                props.emptyText
              ) : (
                <React.Fragment>
                  There are no upcoming events at {props.school.formattedName}
                </React.Fragment>
              )}
            </EmptyText>
          ) : (
            <Slider
              settings={{
                className: events.length < 5 ? "slick--less-slides" : "",
              }}
            >
              {events.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  school={props.school}
                />
              ))}
            </Slider>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default UpcomingSchoolEvents;
