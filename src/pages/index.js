import React from "react";
import * as constants from "./constants";
import { sortedEvents } from "./utilities";
import PageWrapper from "../components/PageWrapper";
import PageSection from "../components/PageSection";

const Home = () => {
  return (
    <PageWrapper>
      <PageSection className="pt-0">
        <h1 className="text-logo text-6xl mb-8 leading-none">
          Campus Gaming Network
        </h1>
        <h2 className="text-3xl leading-tight text-gray-600">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </h2>
      </PageSection>
      <PageSection>
        <h3 className="text-3xl font-semibold">
          Upcoming events near Chicago, IL
        </h3>
        {!constants.RANDOM_SAMPLE_OF_EVENTS.length ? (
          <p className="text-gray-500 text-2xl">
            There are no upcoming events coming up.
          </p>
        ) : (
          <ul>
            {sortedEvents(constants.RANDOM_SAMPLE_OF_EVENTS).map((event, i) => (
              <EventListItem key={event.id} event={event} />
            ))}
            <li className="flex items-center py-4 text-lg">
              <Link to="events" className={constants.STYLES.LINK.DEFAULT}>
                See all upcoming events around Chicago, IL
              </Link>
            </li>
          </ul>
        )}
      </PageSection>
    </PageWrapper>
  );
};

export default Home;
